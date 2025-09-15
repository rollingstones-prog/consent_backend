import { Router } from "express";
import auth from "../middleware/auth.js";
import Payout from "../models/Payout.js";
import User from "../models/User.js";
import dayjs from "../utils/dayjs.js";

const router = Router();

router.post("/redeem", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.points < 200) {
      return res
        .status(400)
        .json({ message: "Not enough points to redeem reward" });
    }

    // Create payout request with timestamp
    const payout = await Payout.create({
      user: user._id,
      points: 200,
      amount: 100,
      status: "pending",
      requestedAt: dayjs().utc().toDate() // ✅ save timestamp
    });

    // Deduct points from user
    user.points -= 200;
    await user.save();

    res.json({
      message: "Reward request submitted (100 PKR). Status: pending",
      payoutId: payout._id,
      requestedAt: dayjs(payout.requestedAt).format("YYYY-MM-DD HH:mm:ss [UTC]")
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
