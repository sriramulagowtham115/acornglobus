// backend/routes/courts.js
const express = require('express');
const router = express.Router();

let Court = null;
try { Court = require('../models/Court'); } catch (e) { Court = null; }

// GET /api/courts
router.get('/', async (req, res) => {
  try {
    if (Court && typeof Court.find === 'function') {
      const courts = await Court.find().lean().exec();
      return res.json(courts);
    }
    return res.json([
      { _id: 'example1', name: 'Court A', type: 'indoor', basePrice: 10 },
      { _id: 'example2', name: 'Court B', type: 'outdoor', basePrice: 8 }
    ]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
