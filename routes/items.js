const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Get all items
router.get('/', async (req, res) => {
  try {
    console.log('GET /items called');
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err);  // <-- add this for clarity
    res.status(500).json({ error: 'Error fetching items' });
  }
});

// Add new item
router.post('/', async (req, res) => {
  try {
    console.log('POST /items with body:', req.body);
    const { name, quantity } = req.body;
    const newItem = new Item({ name, quantity });
    const saved = await newItem.save();
    res.json(saved);
  } catch (err) {
    console.error('Error saving item:', err);  // <-- helpful for debugging
    res.status(400).json({ error: 'Error saving item' });
  }
});

// Update quantity (increment or decrement)
router.put('/:id', async (req, res) => {
    try {
      const { change } = req.body; // change should be +1 or -1
      const item = await Item.findById(req.params.id);
  
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      item.quantity = Math.max(1, item.quantity + change); // never less than 1
      const updated = await item.save();
  
      res.json(updated);
    } catch (err) {
      console.error('Error updating quantity:', err);
      res.status(500).json({ error: 'Error updating quantity' });
    }
  });

module.exports = router;