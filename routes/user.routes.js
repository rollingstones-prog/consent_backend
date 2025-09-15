const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('name email points referralCode');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

router.get('/my-referral-link', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('referralCode');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ code: user.referralCode });
});

module.exports = router;
