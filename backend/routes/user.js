import express from 'express';
import User from '../models/User.js';
import Base from '../models/Base.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import bcrypt from 'bcryptjs';
import { validateUser } from '../middleware/validate.js';

const router = express.Router();

// List all users 
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('assignedBase');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create user 
router.post('/', authenticate, authorize(['admin']), validateUser, async (req, res) => {
  try {
    const { username, password, role, assignedBase } = req.body;
    if (!username || !password || !role) return res.status(400).json({ message: 'Missing fields' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash, role, assignedBase });
    await user.save();
    res.status(201).json({ id: user._id, username: user.username, role: user.role, assignedBase: user.assignedBase });
  } catch (err) {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

// Update user 
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { username, password, role, assignedBase } = req.body;
    const update = { username, role, assignedBase };
    if (password) {
      update.password = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user._id, username: user.username, role: user.role, assignedBase: user.assignedBase });
  } catch (err) {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

// Delete user 
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 