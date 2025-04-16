const express = require('express');
const router = express.Router();

// Mock pricing database
const mockPrices = {
  Publix: { "milk": 3.99, "eggs": 2.49, "bread": 2.99 },
  Kroger: { "milk": 3.49, "eggs": 2.29, "bread": 2.59 },
  WholeFoods: { "milk": 4.29, "eggs": 3.19, "bread": 3.99 }
};

router.post('/', (req, res) => {
  const { items, stores } = req.body; // items: [{ name, qty }], stores: [String]

  if (!items || !stores || stores.length === 0) {
    return res.status(400).json({ error: 'Missing items or store preferences' });
  }

  const results = {};

  stores.forEach(store => {
    let total = 0;
    const breakdown = [];

    items.forEach(({ name, qty }) => {
      const price = mockPrices[store]?.[name.toLowerCase()] || 0;
      const itemTotal = price * qty;
      breakdown.push({ name, qty, price, total: itemTotal.toFixed(2) });
      total += itemTotal;
    });

    results[store] = {
      total: total.toFixed(2),
      breakdown
    };
  });

  res.json(results);
});

module.exports = router;