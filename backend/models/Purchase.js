import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  purchasedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true }
}, { timestamps: true });

export default mongoose.model('Purchase', purchaseSchema); 