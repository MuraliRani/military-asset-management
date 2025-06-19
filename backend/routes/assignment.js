import express from 'express';
import Assignment from '../models/Assignment.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { logAction } from '../utils/logAction.js';
import { validateAssignment } from '../middleware/validate.js';

const router = express.Router();

// Get all assignments (admin: all, others: only their base)
router.get('/', authenticate, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.base = req.user.assignedBase;
    }
    const assignments = await Assignment.find(query).populate('asset base assignedBy');
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create assignment (admin, base_commander)
router.post('/', authenticate, authorize(['admin', 'base_commander']), validateAssignment, async (req, res) => {
  try {
    const assignment = new Assignment({ ...req.body, assignedBy: req.user._id });
    await assignment.save();
    await logAction('assignment_create', req.user._id, { assignment });
    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ message: 'Invalid assignment data' });
  }
});

// Update assignment (admin, base_commander)
router.put('/:id', authenticate, authorize(['admin', 'base_commander']), async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment);
  } catch (err) {
    res.status(400).json({ message: 'Invalid assignment data' });
  }
});

// Delete assignment (admin, base_commander)
router.delete('/:id', authenticate, authorize(['admin', 'base_commander']), async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 