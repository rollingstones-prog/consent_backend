import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  referralCode: { type: String, unique: true },
  referredBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  points: { type: Number, default: 0 },
  lastLogin: { type: Date, default: null }
}, { timestamps: true });

export default model('User', UserSchema);
