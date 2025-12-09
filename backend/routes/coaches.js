// backend/routes/coaches.js
const express = require('express');
const router = express.Router();

let Coach = null;
try { Coach = require('../models/Coach'); } catch (e) { Coach = null; }

router.get('/', async (req, res) => {
  try {
    if (Coach && typeof Coach.find === 'function') {
      const list = await Coach.find().lean().exec();
      return res.json(list);
    }
    return res.json([{ _id: 'c1', name: 'John Doe', hourlyRate: 20 }]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
