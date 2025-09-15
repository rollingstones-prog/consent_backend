import { Router } from 'express';
import auth from '../middleware/auth';
import { create } from '../models/Payout';
import { findById } from '../models/User';

const router = Router();

router.post('/redeem', auth, async (req, res) => {
  const user = await findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.points < 200) return res.status(400).json({ message: 'Not enough points' });

  await create({ user: user._id, points: 200, amount: 100, status: 'pending' });
  user.points -= 200;
  await user.save();

  res.json({ message: 'Reward request submitted (100 PKR). Status: pending' });
});

export default router;
