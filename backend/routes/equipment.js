// backend/routes/equipment.js
const express = require('express');
const router = express.Router();

let Equipment = null;
try { Equipment = require('../models/Equipment'); } catch (e) { Equipment = null; }

router.get('/', async (req, res) => {
  try {
    if (Equipment && typeof Equipment.find === 'function') {
      const items = await Equipment.find().lean().exec();
      return res.json(items);
    }
    return res.json([{ _id: 'eq1', name: 'Racket', totalStock: 10, unitPrice: 5 }]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
