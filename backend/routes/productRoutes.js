import express from 'express';
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands,
  updateStock,
  getAllProductsAdmin
} from '../controllers/productController.js';
import uploadProductImages from '../controllers/imageUploadController.js';

import authenticate from '../middleware/authenticate.js';
import { allowRoles } from '../middleware/allowRoles.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);

// Protected admin routes (put before /:id to avoid conflicts)
router.get('/admin/all', authenticate, allowRoles('admin'), getAllProductsAdmin);
router.post('/', authenticate, allowRoles('admin'), upload.array('images', 5), addProduct);
router.post('/upload-images', authenticate, allowRoles('admin'), upload.array('images', 5), uploadProductImages);
router.put('/:id', authenticate, allowRoles('admin'), upload.array('images', 5), updateProduct);
router.delete('/:id', authenticate, allowRoles('admin'), deleteProduct);
router.patch('/:id/stock', authenticate, allowRoles('admin'), updateStock);

// Public route for single product (put after admin routes)
router.get('/:id', getProductById);

export default router;
