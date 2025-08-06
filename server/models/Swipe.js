const mongoose = require('mongoose');

const SwipeSchema = new mongoose.Schema({
    swiperId: { type: String, required: true },
    swipedId: { type: String, required: true },
    direction: {type: String, enum: ['left', 'right'], required: true},
    timestamp: {type: Date, default: Date.now }

});

module.exports = mongoose.model('Swipe', SwipeSchema);

/*
USE THIS FOR TESTING FOR REAL USERS. THE ONE USED IS ONLY FOR TESTING PURPOSES

swiperId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    swipedId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
*/