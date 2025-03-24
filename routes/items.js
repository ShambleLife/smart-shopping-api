const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// GET all items for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching items' });
  }
});

// POST a new item for the logged-in user
router.post('/', auth, async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const newItem = new Item({
      name,
      quantity,
      userId: req.userId
    });
    const saved = await newItem.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Error saving item' });
  }
});

// PUT (update quantity) of an item if it belongs to the user
router.put('/:id', auth, async (req, res) => {
  const { change } = req.body;

  try {
    const item = await Item.findOne({ _id: req.params.id, userId: req.userId });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.quantity = Math.max(1, item.quantity + change);
    const updated = await item.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Error updating item' });
  }
});

// DELETE an item if it belongs to the user
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Item.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Error deleting item' });
  }
});

module.exports = router;