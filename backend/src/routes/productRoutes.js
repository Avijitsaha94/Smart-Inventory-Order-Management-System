// routes/productRoutes.js

import express from 'express';
const router = express.Router();

import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getLowStockProducts,
} from '../controllers/productController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

import {
  createProductValidation,
  updateProductValidation,
  updateStockValidation,
  mongoIdValidation,
} from '../middleware/validators.js';

// All routes require authentication
router.use(protect);

// Low stock alert (before /:id routes)
router.get('/alerts/low-stock', getLowStockProducts);

// Product CRUD
router
  .route('/')
  .get(getProducts) // Get all products with filters
  .post(admin, createProductValidation, createProduct); // Admin only

router
  .route('/:id')
  .get(mongoIdValidation, getProduct) // Get single product
  .put(admin, mongoIdValidation, updateProductValidation, updateProduct) // Admin only
  .delete(admin, mongoIdValidation, deleteProduct); // Admin only

// Stock management
router.patch(
  '/:id/stock',
  admin,
  mongoIdValidation,
  updateStockValidation,
  updateStock
); // Admin only

export default router;