const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  user1: { type: String, required: true }, //you can switch string to ObjectID once done testing
  user2: { type: String, required: true },
  matchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', MatchSchema);
