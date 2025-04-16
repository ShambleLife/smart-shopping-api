const express = require('express');
const router = express.Router();
const MealPlan = require('../models/MealPlan');

// Get meal plan by username
router.get('/:username', async (req, res) => {
  try {
    const plan = await MealPlan.findOne({ username: req.params.username });
    if (!plan) return res.json({ week: {} }); // Return empty week if not found
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch meal plan' });
  }
});

// Update meal plan
router.post('/:username', async (req, res) => {
  const { week } = req.body;
  try {
    let plan = await MealPlan.findOne({ username: req.params.username });
    if (!plan) {
      plan = new MealPlan({ username: req.params.username, week });
    } else {
      plan.week = week;
    }
    await plan.save();
    res.json({ message: 'Meal plan saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save meal plan' });
  }
});

module.exports = router;