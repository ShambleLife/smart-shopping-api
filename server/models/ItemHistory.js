// server/models/ItemHistory.js
const mongoose = require('mongoose');

const ItemHistorySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    default: 1
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ItemHistory', ItemHistorySchema);