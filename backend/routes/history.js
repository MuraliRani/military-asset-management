import express from 'express';
import Purchase from '../models/Purchase.js';
import Transfer from '../models/Transfer.js';
import Assignment from '../models/Assignment.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    let base = req.user.assignedBase;
    let isAdmin = req.user.role === 'admin';
    const [purchases, transfers, assignments] = await Promise.all([
      isAdmin ? Purchase.find().populate('asset base purchasedBy') : Purchase.find({ base }).populate('asset base purchasedBy'),
      isAdmin ? Transfer.find().populate('asset fromBase toBase transferredBy') : Transfer.find({ $or: [{ fromBase: base }, { toBase: base }] }).populate('asset fromBase toBase transferredBy'),
      isAdmin ? Assignment.find().populate('asset base assignedBy') : Assignment.find({ base }).populate('asset base assignedBy')
    ]);
    res.json({ purchases, transfers, assignments });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 