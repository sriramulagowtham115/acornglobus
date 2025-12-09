// backend/routes/admin.js
const express = require('express');
const router = express.Router();
let PricingRule = null;
try { PricingRule = require('../models/PricingRule'); } catch (e) { PricingRule = null; }

// GET pricing rules
router.get('/pricingRules', async (req, res) => {
  try {
    if (PricingRule && typeof PricingRule.find === 'function') {
      const rules = await PricingRule.find().lean().exec();
      return res.json(rules);
    }
    return res.json([]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Optional: price calc endpoint (used by frontend hooks)
router.post('/calcPrice', (req, res) => {
  // For now just echo back request (frontend can call this)
  return res.json({ pricing: 'calc endpoint not implemented', body: req.body });
});

module.exports = router;
