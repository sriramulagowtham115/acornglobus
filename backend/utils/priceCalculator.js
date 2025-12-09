function calculateTotal(court, rules, bookingTime, resources) {
// court: Court doc, rules: array of active rules, bookingTime: Date, resources: {rackets, coach}
let base = court.basePrice;
let breakdown = { basePrice: base, adjustments: [] };
const hour = bookingTime.getHours();
const day = bookingTime.getDay(); // 0=Sun,6=Sat


for (const rule of rules) {
if (!rule.isActive) continue;
const t = rule.type;
const cfg = rule.config || {};
if (t === 'weekend' && (day === 0 || day === 6)) {
base += cfg.surcharge || 0;
breakdown.adjustments.push({ rule: rule.name, amount: cfg.surcharge || 0 });
}
if (t === 'timeRange') {
const start = cfg.startHour; const end = cfg.endHour;
if (hour >= start && hour < end) {
if (cfg.multiplier) base = base * cfg.multiplier;
if (cfg.surcharge) base += cfg.surcharge;
breakdown.adjustments.push({ rule: rule.name, multiplier: cfg.multiplier, surcharge: cfg.surcharge });
}
}
if (t === 'fixed' && cfg.target === 'indoor' && court.type === 'indoor') {
base += cfg.amount || 0;
breakdown.adjustments.push({ rule: rule.name, amount: cfg.amount || 0 });
}
}


// resources cost
let equipmentCost = 0;
if (resources.rackets) equipmentCost += resources.rackets * (resources.racketPrice || 5);
if (resources.shoes) equipmentCost += resources.shoes * (resources.shoePrice || 0);


let coachCost = 0;
if (resources.coach && resources.coachRate) coachCost = resources.coachRate; // example hourly


const total = Math.round((base + equipmentCost + coachCost) * 100) / 100;
breakdown.total = total;
breakdown.equipmentCost = equipmentCost;
breakdown.coachCost = coachCost;
return breakdown;
}
module.exports = { calculateTotal };