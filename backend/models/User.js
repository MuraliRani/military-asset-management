import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'base_commander', 'logistics_officer'],
    required: true
  },
  assignedBase: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' }
}, { timestamps: true });

export default mongoose.model('User', userSchema); 