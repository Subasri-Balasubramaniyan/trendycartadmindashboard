import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
  deleteOrder
} from '../controllers/orderController.js';

import authenticate from '../middleware/authenticate.js';
import { allowRoles } from '../middleware/allowRoles.js';

const router = express.Router();

// Customer routes (require authentication)
router.post('/', authenticate, createOrder);
router.get('/', authenticate, getUserOrders);

// Admin routes (put before /:id to avoid conflicts)
router.get('/admin/all', authenticate, allowRoles('admin'), getAllOrders);
router.get('/admin/stats', authenticate, allowRoles('admin'), getOrderStats);
router.patch('/:id/status', authenticate, allowRoles('admin'), updateOrderStatus);
router.delete('/:id', authenticate, allowRoles('admin'), deleteOrder);

// Customer routes that need to come after admin routes
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/cancel', authenticate, cancelOrder);

export default router;
