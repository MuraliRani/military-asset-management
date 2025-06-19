import express from 'express';
import Asset from '../models/Asset.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

// Get all assets (admin: all, others: only their base)
router.get('/', authenticate, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.base = req.user.assignedBase;
    }
    const assets = await Asset.find(query).populate('base');
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create asset (admin, base_commander)
router.post('/', authenticate, authorize(['admin', 'base_commander']), async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ message: 'Invalid asset data' });
  }
});

// Update asset (admin, base_commander)
router.put('/:id', authenticate, authorize(['admin', 'base_commander']), async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.json(asset);
  } catch (err) {
    res.status(400).json({ message: 'Invalid asset data' });
  }
});

// Delete asset (admin, base_commander)
router.delete('/:id', authenticate, authorize(['admin', 'base_commander']), async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.json({ message: 'Asset deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 