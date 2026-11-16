import { Router } from 'express';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import parentRoutes from './parentRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import publicRoutes from './publicRoutes.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Futuristic Thinkers LMS API v1 is operational',
    timestamp: new Date().toISOString()
  });
});

// Mount modular sub-routers
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/parent', parentRoutes);
router.use('/payments', paymentRoutes);
router.use('/', publicRoutes);

export default router;
