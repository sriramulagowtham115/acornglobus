// backend/controllers/bookingController.js
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const Coach = require('../models/Coach');
const Court = require('../models/Court');
const PricingRule = require('../models/PricingRule');
const { calculateTotal } = require('../utils/priceCalculator');

// helper (you can keep or remove)
function isOverlap(aStart, aEnd, bStart, bEnd) {
  return (aStart < bEnd) && (bStart < aEnd);
}

exports.createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { userId, courtId, startTime, endTime, resources = {} } = req.body;
    if (!userId || !courtId || !startTime || !endTime) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const s = new Date(startTime);
    const e = new Date(endTime);
    if (isNaN(s) || isNaN(e) || s >= e) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Invalid startTime or endTime' });
    }

    // 1) Check court availability (overlap)
    const existingCourtBooking = await Booking.findOne({
      court: courtId,
      status: 'confirmed',
      $or: [
        { startTime: { $lt: e, $gte: s } },
        { endTime: { $gt: s, $lte: e } },
        { startTime: { $lte: s }, endTime: { $gte: e } }
      ]
    }).session(session);

    if (existingCourtBooking) {
      await session.abortTransaction();
      return res.status(409).json({ message: 'Court not available' });
    }

    // 2) Check coach availability (if requested)
    let coachDoc = null;
    if (resources.coach) {
      coachDoc = await Coach.findById(resources.coach).session(session);
      if (!coachDoc || !coachDoc.isActive) {
        await session.abortTransaction();
        return res.status(409).json({ message: 'Coach not available' });
      }

      const existingCoachBooking = await Booking.findOne({
        'resources.coach': resources.coach,
        status: 'confirmed',
        $or: [
          { startTime: { $lt: e, $gte: s } },
          { endTime: { $gt: s, $lte: e } },
          { startTime: { $lte: s }, endTime: { $gte: e } }
        ]
      }).session(session);

      if (existingCoachBooking) {
        await session.abortTransaction();
        return res.status(409).json({ message: 'Coach not available for that time' });
      }
    }

    // 3) Check equipment availability (rackets)
    if (resources.rackets && resources.rackets > 0) {
      const eq = await Equipment.findOne({ name: 'Racket' }).session(session);
      if (!eq) {
        await session.abortTransaction();
        return res.status(500).json({ message: 'Racket inventory not found' });
      }

      // Count how many rackets are booked in overlapping bookings
      const overlapAgg = await Booking.aggregate([
        { $match: { status: 'confirmed', startTime: { $lt: e }, endTime: { $gt: s } } },
        { $group: { _id: null, totalRackets: { $sum: '$resources.rackets' } } }
      ]).session(session);

      const totalBooked = (overlapAgg[0] && overlapAgg[0].totalRackets) || 0;
      if (totalBooked + resources.rackets > eq.totalStock) {
        await session.abortTransaction();
        return res.status(409).json({ message: 'Not enough rackets available' });
      }
    }

    // 4) Pricing calculation
    const court = await Court.findById(courtId).session(session);
    if (!court) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Court not found' });
    }

    const activeRules = await PricingRule.find({ isActive: true }).session(session);
    const resourceInfo = {
      ...resources,
      racketPrice: resources.racketPrice || (await Equipment.findOne({ name: 'Racket' }).session(session))?.unitPrice || 5,
      shoePrice: resources.shoePrice || 0,
      coachRate: coachDoc ? coachDoc.hourlyRate : 0
    };

    const pricingBreakdown = calculateTotal(court, activeRules, s, resourceInfo);

    // 5) Create booking and save within session
    const booking = new Booking({
      user: userId,
      court: courtId,
      startTime: s,
      endTime: e,
      resources,
      pricingBreakdown,
      status: 'confirmed'
    });

    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ booking });
  } catch (err) {
    // ensure transaction aborted and session ended on error
    try {
      await session.abortTransaction();
    } catch (e) { /* ignore */ }
    session.endSession();
    console.error('createBooking error:', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};
