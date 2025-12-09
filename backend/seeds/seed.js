// backend/seeds/seed.js
require('dotenv').config();
const mongoose = require('mongoose');

const Court = require('../models/Court');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');
const PricingRule = require('../models/PricingRule');

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Clearing old data...");
    await Court.deleteMany({});
    await Coach.deleteMany({});
    await Equipment.deleteMany({});
    await PricingRule.deleteMany({});

    console.log("Inserting Courts...");
    await Court.insertMany([
      { name: "Court A", type: "indoor", basePrice: 10, isActive: true },
      { name: "Court B", type: "outdoor", basePrice: 8, isActive: true },
      { name: "Court C", type: "indoor", basePrice: 12, isActive: true }
    ]);

    console.log("Inserting Coaches...");
    await Coach.insertMany([
      { name: "John", isActive: true, hourlyRate: 20 },
      { name: "Michael", isActive: true, hourlyRate: 25 },
      { name: "David", isActive: false, hourlyRate: 22 } // inactive
    ]);

    console.log("Inserting Equipment...");
    await Equipment.insertMany([
      { name: "Racket", totalStock: 10, unitPrice: 5 },
      { name: "Shoes", totalStock: 20, unitPrice: 3 }
    ]);

    console.log("Inserting Pricing Rules...");
    // Use types that match your PricingRule schema enum
    await PricingRule.insertMany([
      {
        name: "Weekend Surcharge",
        isActive: true,
        type: "weekend",            // changed: valid enum value
        config: { surcharge: 5 }    // flexible config stored in `config`
      },
      {
        name: "Peak Hour Multiplier",
        isActive: true,
        type: "timeRange",          // changed: valid enum value
        config: { startHour: 18, endHour: 21, multiplier: 1.5 }
      }
    ]);

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
