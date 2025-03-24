const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching items' });
  }
});

// Add new item
router.post('/', async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const newItem = new Item({ name, quantity });
    const saved = await newItem.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Error saving item' });
  }
});

module.exports = router;
