// routes/adminStats.js or similar
import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', getDashboardStats);

export default router;
