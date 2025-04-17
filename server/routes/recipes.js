const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Save a recipe to the DB
router.post('/save', async (req, res) => {
  const { username, name, ingredients, instructions, image } = req.body;

  try {
    const existing = await Recipe.findOne({ username, name });
    if (existing) {
      return res.status(400).json({ message: 'Recipe already saved!' });
    }

    const recipe = new Recipe({ username, name, ingredients, instructions, image });
    await recipe.save();
    res.json({ message: 'Recipe saved successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save recipe' });
  }
});

// Get all saved recipes for a user
router.get('/user/:username', async (req, res) => {
  try {
    const recipes = await Recipe.find({ username: req.params.username });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch saved recipes' });
  }
});

module.exports = router;
