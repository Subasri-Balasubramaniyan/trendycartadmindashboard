import express from 'express';
import {
  registerUser,
  loginUser,
} from '../controllers/authController.js';
import {
  getUserProfile,
  updateUserProfile,
  getAllCustomers,
  deleteCustomer,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/allowRoles.js';

const router = express.Router();

// 🔐 Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// 👤 Protected Routes
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);

// 🛡️ Admin Routes
router.get('/admin/customers', authenticate, allowRoles('admin'), getAllCustomers);
router.delete('/admin/customers/:id', authenticate, allowRoles('admin'), deleteCustomer);

export default router;
