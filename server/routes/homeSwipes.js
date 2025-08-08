const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const HomeSwipe = require('../models/HomeSwipe');

router.post('/', async (req, res) => {
  const { userId, homeId, direction } = req.body;

  console.log("🏠 Home swipe:", { userId, homeId, direction });

  try {
    // 🔐 Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(homeId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const userObjId = new mongoose.Types.ObjectId(userId);
    const homeObjId = new mongoose.Types.ObjectId(homeId);

    // 🛡 Block duplicate swipes
    const existingSwipe = await HomeSwipe.findOne({ userId: userObjId, homeId: homeObjId });
    if (existingSwipe) {
      console.log("🚫 Duplicate home swipe blocked");
      return res.status(409).json({ success: false, message: "Already swiped" });
    }

    const newSwipe = new HomeSwipe({ userId: userObjId, homeId: homeObjId, direction });
    await newSwipe.save();

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("🔥 Error saving home swipe:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
node 
