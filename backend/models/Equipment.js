const mongoose = require('mongoose');
const EquipmentSchema = new mongoose.Schema({
name: String,
totalStock: Number,
unitPrice: Number
});
module.exports = mongoose.model('Equipment', EquipmentSchema);