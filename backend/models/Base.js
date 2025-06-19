import mongoose from 'mongoose';

const baseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('Base', baseSchema); 