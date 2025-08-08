const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Swipe = require('../models/Swipe');
const Match = require('../models/Match');

router.post('/', async (req, res) => {
  const { swiperId, swipedId, direction } = req.body;

  console.log("🟦 Swipe received:", { swiperId, swipedId, direction });

  try {
    // 🔐 Validate and convert to ObjectId
    if (!mongoose.Types.ObjectId.isValid(swiperId) || !mongoose.Types.ObjectId.isValid(swipedId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const swiperObjId = new mongoose.Types.ObjectId(swiperId);
    const swipedObjId = new mongoose.Types.ObjectId(swipedId);

    // 💾 Save swipe
    const newSwipe = new Swipe({ swiperId: swiperObjId, swipedId: swipedObjId, direction });
    await newSwipe.save();

    let isMatch = false;

    if (direction === 'right') {
      const reciprocal = await Swipe.findOne({
        swiperId: swipedObjId,
        swipedId: swiperObjId,
        direction: 'right'
      });

      if (reciprocal) {
        console.log("✅ MATCH FOUND between", swiperId, "and", swipedId);
        isMatch = true;

        // Save match
        await Match.create({ user1: swiperObjId, user2: swipedObjId });
      } else {
        console.log("❌ No match found between", swiperId, "and", swipedId);
      }
    }

    res.status(200).json({ success: true, isMatch });
  } catch (err) {
    console.error("🔥 Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
