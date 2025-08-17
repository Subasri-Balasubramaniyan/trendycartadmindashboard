import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  forgotPassword, // ✅ Only once
  adminLogin, // ✅ Add admin login
} from '../controllers/authController.js';

import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/login', adminLogin); // ✅ Admin login route
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/forgot-password', forgotPassword); // ✅ Add forgot-password route

export default router;
