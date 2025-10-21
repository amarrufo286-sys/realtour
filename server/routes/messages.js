const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// super simple auth stub — replace with real auth later
function requireUser(req, _res, next) {
  req.user = { id: req.headers['x-user-id'] }; // e.g., from JWT normally
  if (!req.user.id) return next(new Error('unauthorized'));
  next();
}

// GET /api/messages/thread/:userId
// fetch conversation between the logged-in user and :userId
router.get('/thread/:userId', requireUser, async (req, res) => {
  try {
    const me = req.user.id;
    const other = req.params.userId;
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
    const before = req.query.before ? new Date(req.query.before) : new Date();

    const items = await Message.find({
      createdAt: { $lt: before },
      $or: [
        { senderId: me, receiverId: other },
        { senderId: other, receiverId: me }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // return ascending so the UI can render top→down
    res.json({ ok: true, messages: items.reverse() });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
