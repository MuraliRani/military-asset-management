import express from 'express';
import Base from '../models/Base.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

// Get all bases (all roles)
router.get('/', authenticate, async (req, res) => {
  try {
    const bases = await Base.find();
    res.json(bases);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create base (admin only)
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const base = new Base(req.body);
    await base.save();
    res.status(201).json(base);
  } catch (err) {
    res.status(400).json({ message: 'Invalid base data' });
  }
});

// Update base (admin only)
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const base = await Base.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!base) return res.status(404).json({ message: 'Base not found' });
    res.json(base);
  } catch (err) {
    res.status(400).json({ message: 'Invalid base data' });
  }
});

// Delete base (admin only)
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const base = await Base.findByIdAndDelete(req.params.id);
    if (!base) return res.status(404).json({ message: 'Base not found' });
    res.json({ message: 'Base deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 