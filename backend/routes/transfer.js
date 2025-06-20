import express from 'express';
import Transfer from '../models/Transfer.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { logAction } from '../utils/logAction.js';
import { validateTransfer } from '../middleware/validate.js';

const router = express.Router();

// Get all transfers
router.get('/', authenticate, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.$or = [
        { fromBase: req.user.assignedBase },
        { toBase: req.user.assignedBase }
      ];
    }
    const transfers = await Transfer.find(query).populate('asset fromBase toBase transferredBy');
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create transfer
router.post('/', authenticate, authorize(['admin', 'logistics_officer']), validateTransfer, async (req, res) => {
  try {
    const transfer = new Transfer({ ...req.body, transferredBy: req.user._id });
    await transfer.save();
    await logAction('transfer_create', req.user._id, { transfer });
    res.status(201).json(transfer);
  } catch (err) {
    res.status(400).json({ message: 'Invalid transfer data' });
  }
});

// Update transfer 
router.put('/:id', authenticate, authorize(['admin', 'logistics_officer']), async (req, res) => {
  try {
    const transfer = await Transfer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!transfer) return res.status(404).json({ message: 'Transfer not found' });
    res.json(transfer);
  } catch (err) {
    res.status(400).json({ message: 'Invalid transfer data' });
  }
});

// Delete transfer 
router.delete('/:id', authenticate, authorize(['admin', 'logistics_officer']), async (req, res) => {
  try {
    const transfer = await Transfer.findByIdAndDelete(req.params.id);
    if (!transfer) return res.status(404).json({ message: 'Transfer not found' });
    res.json({ message: 'Transfer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 