import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, 
  quantity: { type: Number, required: true, default: 0 },
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true }
}, { timestamps: true });

export default mongoose.model('Asset', assetSchema); 