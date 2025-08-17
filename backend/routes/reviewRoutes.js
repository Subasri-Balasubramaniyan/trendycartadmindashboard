import express from 'express';
import {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
  markReviewHelpful,
  getUserReviews
} from '../controllers/reviewController.js';

import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.post('/', authenticate, addReview);
router.get('/user/me', authenticate, getUserReviews);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);
router.post('/:id/helpful', authenticate, markReviewHelpful);

export default router;
