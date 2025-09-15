const express = require('express');
const auth = require('../middleware/auth');
const Payout = require('../models/Payout');
const User = require('../models/User');

const router = express.Router();

router.post('/redeem', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.points < 200) return res.status(400).json({ message: 'Not enough points' });

  await Payout.create({ user: user._id, points: 200, amount: 100, status: 'pending' });
  user.points -= 200;
  await user.save();

  res.json({ message: 'Reward request submitted (100 PKR). Status: pending' });
});

module.exports = router;
