const mongoose = require('mongoose');
const PricingRuleSchema = new mongoose.Schema({
name: String,
type: { type: String, enum: ['fixed','multiplier','surcharge','holiday','timeRange','weekend'] },
// store flexible config as object
config: mongoose.Schema.Types.Mixed,
isActive: { type: Boolean, default: true }
});
module.exports = mongoose.model('PricingRule', PricingRuleSchema);