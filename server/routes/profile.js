const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get user profile
// routes/profile.js (updated version)

router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.userId,
      { $set: req.body },
      { new: true }
    );
    res.json({ message: 'Profile updated', profile: updated });
  } catch {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;