import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlist,
  getWishlistCount
} from '../controllers/wishlistController.js';

import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// All wishlist routes require authentication
router.use(authenticate);

router.get('/', getWishlist);
router.get('/count', getWishlistCount);
router.get('/check/:productId', checkWishlist);
router.post('/add', addToWishlist);
router.delete('/remove/:productId', removeFromWishlist);
router.delete('/clear', clearWishlist);

export default router;
