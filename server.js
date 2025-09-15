import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import rewardRoutes from "./routes/rewards.routes.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));
app.use(cors({ origin: process.env.CORS_ORIGIN.split(","), credentials: false }));

// test route
app.get("/", (req, res) => res.send("🤩 API is running ✅"));

// routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/rewards", rewardRoutes);

// connect + start
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`🚀 Server running on ${port}`));
  } catch (e) {
    console.error("❌ Failed to start", e);
    process.exit(1);
  }
})();
