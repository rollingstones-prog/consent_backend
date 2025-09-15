require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const rewardRoutes = require('./routes/rewards.routes');

const app = express();

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors({ origin: process.env.CORS_ORIGIN.split(','), credentials: false }));

// test route
app.get('/', (req, res) => res.send('🤩 API is running ✅'));

// routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/rewards', rewardRoutes);

// connect + start
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`🚀 Server running on ${port}`));
  } catch (e) {
    console.error('❌ Failed to start', e);
    process.exit(1);
  }
})();
