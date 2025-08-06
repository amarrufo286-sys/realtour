const mongoose = require('mongoose');

const HomeSwipeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  homeId: { type: String, required: true },
  direction: { type: String, enum: ['left', 'right'], required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HomeSwipe', HomeSwipeSchema);

