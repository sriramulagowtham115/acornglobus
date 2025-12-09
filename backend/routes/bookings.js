// backend/routes/bookings.js
const express = require('express');
const router = express.Router();

let Booking = null;
try { Booking = require('../models/Booking'); } catch (e) { Booking = null; }

// create simple POST /api/bookings that echoes input or saves to DB if model present
router.post('/', async (req, res) => {
  try {
    if (Booking && typeof Booking.create === 'function') {
      const b = await Booking.create(req.body);
      return res.status(201).json({ booking: b });
    }
    // echo back for now
    return res.status(201).json({ booking: req.body, note: 'Saved to DB not available in dev mode' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
