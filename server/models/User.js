const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  username: { type: String, unique: true },
  password: String,
  preferredStores: [String],
  location: String,
  dietaryPreferences: [String],
});

module.exports = mongoose.model('User', userSchema);