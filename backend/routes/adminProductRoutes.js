const express = require('express');
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/adminProductController');

// ✅ Correct import from authMiddleware.js
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
router.post('/add', authenticate, isAdmin, createProduct);
router.put('/:id', authenticate, isAdmin, updateProduct);
router.delete('/:id', authenticate, isAdmin, deleteProduct);

module.exports = router;
