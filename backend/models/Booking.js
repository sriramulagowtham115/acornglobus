const mongoose = require('mongoose');
const BookingSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court' },
startTime: Date,
endTime: Date,
resources: {
rackets: { type: Number, default: 0 },
shoes: { type: Number, default: 0 },
coach: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach' }
},
status: { type: String, enum: ['confirmed','cancelled','waitlist'], default: 'confirmed' },
pricingBreakdown: mongoose.Schema.Types.Mixed,
createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Booking', BookingSchema);