import { Schema, model } from 'mongoose';

const PayoutSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, required: true },
  amount: { type: Number, default: 100 },
  status: { type: String, enum: ['pending','paid'], default: 'pending' }
}, { timestamps: true });

export default model('Payout', PayoutSchema);
