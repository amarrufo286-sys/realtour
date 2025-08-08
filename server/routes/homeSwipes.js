const express = require('express');
const router = express.Router();
const HomeSwipe = require('../models/HomeSwipe');

// POST /api/home-swipes
router.post('/', async (req, res) => {
  const { userId, homeId, direction } = req.body;

  console.log("🏠 Home swipe attempt:", { userId, homeId, direction });

  try {
    // 🔒 Check for existing swipe by same user on same home
    const existingSwipe = await HomeSwipe.findOne({ userId, homeId });

    if (existingSwipe) {
      console.log("🚫 Duplicate home swipe blocked:", userId, "->", homeId);
      return res.status(409).json({
        success: false,
        message: "User has already swiped on this home"
      });
    }

    // ✅ Save new swipe
    const newSwipe = new HomeSwipe({ userId, homeId, direction });
    await newSwipe.save();

    console.log("✅ Home swipe saved:", userId, "->", homeId, direction);
    res.status(200).json({ success: true });

  } catch (err) {
    console.error("🔥 Error saving home swipe:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
