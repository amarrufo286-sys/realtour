const express = require('express');
const router = express.Router();
const Swipe = require('../models/Swipe');
const Match = require('../models/Match');

router.post('/', async (req, res) => {
  const { swiperId, swipedId, direction } = req.body;

  console.log("🟦 Swipe received:", { swiperId, swipedId, direction });

  try {
    const newSwipe = new Swipe({ swiperId, swipedId, direction });
    await newSwipe.save();

    let isMatch = false;

    if (direction === 'right') {
      const reciprocal = await Swipe.findOne({
        swiperId: swipedId,
        swipedId: swiperId,
        direction: 'right'
      });

      if (reciprocal) {
        console.log("✅ MATCH FOUND between", swiperId, "and", swipedId);
        isMatch = true;

        // Check if the match is already saved to prevent duplicates
        const existingMatch = await Match.findOne({
          $or: [
            { user1: swiperId, user2: swipedId },
            { user1: swipedId, user2: swiperId }
          ]
        });

        if (!existingMatch) {
          const newMatch = new Match({
            user1: swiperId,
            user2: swipedId
          });

          await newMatch.save();
          console.log("💾 Match saved:", swiperId, swipedId);
        } else {
          console.log("⚠️ Match already exists between", swiperId, swipedId);
        }

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
