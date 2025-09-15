const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  points: { type: Number, default: 0 },
  lastLogin: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
