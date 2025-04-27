// server/routes/itemhistory.js
const express = require('express');
const router = express.Router();
const ItemHistory = require('../models/ItemHistory');

// POST a new item into itemHistory collection
router.post('/', async (req, res) => {
  try {
    const { username, name, qty, addedAt } = req.body;

    if (!username || !name) {
      return res.status(400).json({ message: "Missing username or item name." });
    }

    const newItemHistory = new ItemHistory({
      username,
      name,
      qty,
      addedAt: addedAt || new Date()
    });

    await newItemHistory.save();
    res.status(201).json({ message: "Item history saved!" });
  } catch (err) {
    console.error('Error saving item history:', err);
    res.status(500).json({ message: "Server error saving item history." });
  }
});

// You could also later add a GET route to fetch user's history if needed!

module.exports = { router };