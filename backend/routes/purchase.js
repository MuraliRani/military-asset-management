import express from 'express';
import Purchase from '../models/Purchase.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { validatePurchase } from '../middleware/validate.js';

const router = express.Router();

// Get all purchases
router.get('/', authenticate, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.base = req.user.assignedBase;
    }
    const purchases = await Purchase.find(query).populate('asset base purchasedBy');
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create purchase 
router.post('/', authenticate, authorize(['admin', 'logistics_officer']), validatePurchase, async (req, res) => {
  try {
    const purchase = new Purchase({ ...req.body, purchasedBy: req.user._id });
    await purchase.save();
    // Log the purchase (for now, just console.log)
    console.log('Purchase logged:', purchase);
    res.status(201).json(purchase);
  } catch (err) {
    res.status(400).json({ message: 'Invalid purchase data' });
  }
});

// Update purchase 
router.put('/:id', authenticate, authorize(['admin', 'logistics_officer']), async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    res.json(purchase);
  } catch (err) {
    res.status(400).json({ message: 'Invalid purchase data' });
  }
});

// Delete purchase
router.delete('/:id', authenticate, authorize(['admin', 'logistics_officer']), async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    res.json({ message: 'Purchase deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 