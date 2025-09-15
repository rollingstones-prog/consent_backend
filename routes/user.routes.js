import { Router } from 'express';
import { findById } from '../models/User.js';
import auth from '../middleware/auth';

const router = Router();

router.get('/me', auth, async (req, res) => {
  const user = await findById(req.user.id).select('name email points referralCode');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

router.get('/my-referral-link', auth, async (req, res) => {
  const user = await findById(req.user.id).select('referralCode');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ code: user.referralCode });
});

export default router;

