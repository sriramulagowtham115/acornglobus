const mongoose = require('mongoose');
const CourtSchema = new mongoose.Schema({
name: String,
type: { type: String, enum: ['indoor','outdoor'], default: 'indoor' },
basePrice: { type: Number, default: 10 },
isActive: { type: Boolean, default: true }
});
module.exports = mongoose.model('Court', CourtSchema);