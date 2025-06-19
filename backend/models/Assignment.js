import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  quantity: { type: Number, required: true },
  assignedTo: { type: String, required: true }, // e.g., unit or individual
  date: { type: Date, default: Date.now },
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema); 