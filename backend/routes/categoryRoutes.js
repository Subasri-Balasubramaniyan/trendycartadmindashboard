import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory
} from '../controllers/categoryController.js';

import authenticate from '../middleware/authenticate.js';
import { allowRoles } from '../middleware/allowRoles.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin routes
router.post('/', authenticate, allowRoles('admin'), createCategory);
router.put('/:id', authenticate, allowRoles('admin'), updateCategory);
router.delete('/:id', authenticate, allowRoles('admin'), deleteCategory);

// Subcategory routes (Admin only)
router.post('/:id/subcategory', authenticate, allowRoles('admin'), addSubcategory);
router.put('/:categoryId/subcategory/:subcategoryId', authenticate, allowRoles('admin'), updateSubcategory);
router.delete('/:categoryId/subcategory/:subcategoryId', authenticate, allowRoles('admin'), deleteSubcategory);

export default router;
