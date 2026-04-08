// routes/orderRoutes.js

import express from 'express';
const router = express.Router();

import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
} from '../controllers/orderController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

import {
  createOrderValidation,
  updateOrderStatusValidation,
  mongoIdValidation,
} from '../middleware/validators.js';

// All routes require authentication
router.use(protect);

// Stats route (admin only) - must be before /:id
router.get('/stats/summary', admin, getOrderStats);

// Order CRUD
router
  .route('/')
  .get(getOrders) // Get all orders (filtered by role)
  .post(createOrderValidation, createOrder); // Create new order

router
  .route('/:id')
  .get(mongoIdValidation, getOrder) // Get single order
  .delete(mongoIdValidation, cancelOrder); // Cancel order

// Update order status (admin only)
router.patch(
  '/:id/status',
  admin,
  mongoIdValidation,
  updateOrderStatusValidation,
  updateOrderStatus
);

export default router;