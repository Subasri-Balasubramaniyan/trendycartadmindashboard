import express from 'express';
import { getDashboardStats, getAllUsers, getAllOrders } from '../controllers/adminController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/allowRoles.js';

const router = express.Router();

// Admin dashboard stats - use allowRoles properly
router.get('/dashboard/stats', authenticate, allowRoles('admin', 'seller'), getDashboardStats);

// Admin users management
router.get('/users', authenticate, allowRoles('admin'), getAllUsers);

// Admin orders management
router.get('/orders', authenticate, allowRoles('admin', 'seller'), getAllOrders);

export default router;
