const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  username: String,               // Tie to user
  name: String,                   // Name of recipe
  ingredients: [String],          // List of ingredients
  instructions: String,           // Cooking steps
  image: String                   // Thumbnail image URL
});

module.exports = mongoose.model('Recipe', RecipeSchema);
