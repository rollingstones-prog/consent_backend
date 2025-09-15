import { Router } from "express";
import { hash as _hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import dayjs from "../utils/dayjs.js";   // 👈 bas helper import
import User, { findOne, findByIdAndUpdate } from "../models/User.js";
import { create } from "../models/Referral.js";
import generateReferralCode from "../utils/generateReferralcode.js";

const router = Router();

// check if it's a new day
function isNewDay(lastLogin) {
  if (!lastLogin) return true;
  const now = dayjs().tz("Asia/Karachi");
  const last = dayjs(lastLogin).tz("Asia/Karachi");
  return now.startOf("day").diff(last.startOf("day"), "day") >= 1;
}

// signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hash = await _hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hash,
      referralCode: generateReferralCode()
    });

    // referral link
    if (referralCode) {
      const referrer = await findOne({ referralCode });
      if (referrer) newUser.referredBy = referrer._id;
    }

    await newUser.save();

    // reward referrer
    if (newUser.referredBy) {
      await create({ referrer: newUser.referredBy, referred: newUser._id });
      await findByIdAndUpdate(newUser.referredBy, { $inc: { points: 20 } });
    }

    return res.json({ message: "User registered, please login" });
  } catch (e) {
    console.error("❌ Signup error:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

// login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const ok = await compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Wrong credentials" });

    // daily login points
    if (isNewDay(user.lastLogin)) user.points += 10;
    user.lastLogin = new Date();
    await user.save();

    const token = sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        referralCode: user.referralCode
      }
    });
  } catch (e) {
    console.error("❌ Login error:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
