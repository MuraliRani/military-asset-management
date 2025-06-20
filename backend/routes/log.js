import express from 'express';
import Log from '../models/Log.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const action = req.query.action;
    const query = action ? { action } : {};
    const logs = await Log.find(query)
      .populate('user', 'username role')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Log.countDocuments(query);
    res.json({ logs, total, page, limit });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 