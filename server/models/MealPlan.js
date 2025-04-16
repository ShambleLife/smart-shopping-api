const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  username: { type: String, required: true },
  week: {
    monday: [String],
    tuesday: [String],
    wednesday: [String],
    thursday: [String],
    friday: [String],
    saturday: [String],
    sunday: [String]
  }
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);