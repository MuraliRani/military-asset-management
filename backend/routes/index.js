import express from 'express';
import authRoutes from './auth.js';
import assetRoutes from './asset.js';
import purchaseRoutes from './purchase.js';
import transferRoutes from './transfer.js';
import assignmentRoutes from './assignment.js';
import historyRoutes from './history.js';
import baseRoutes from './base.js';
import userRoutes from './user.js';
import logRoutes from './log.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/assets', assetRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/transfers', transferRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/history', historyRoutes);
router.use('/bases', baseRoutes);
router.use('/users', userRoutes);
router.use('/logs', logRoutes);

export default router; 