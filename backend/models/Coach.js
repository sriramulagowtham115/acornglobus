const mongoose = require('mongoose');
const CoachSchema = new mongoose.Schema({
name: String,
hourlyRate: Number,
isActive: { type: Boolean, default: true }
});
module.exports = mongoose.model('Coach', CoachSchema);