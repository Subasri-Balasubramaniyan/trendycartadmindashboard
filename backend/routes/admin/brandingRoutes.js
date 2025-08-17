import express from 'express';
import { getBranding, updateBranding } from '../../controllers/admin/brandingController.js';
import { authenticate, verifyAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, verifyAdmin, getBranding);
router.put('/', authenticate, verifyAdmin, updateBranding);

export default router;
