const mongoose = require('mongoose');

const PayoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, required: true },
  amount: { type: Number, default: 100 },
  status: { type: String, enum: ['pending','paid'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Payout', PayoutSchema);
