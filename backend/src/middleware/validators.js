// validations/index.js

import { body, param, query, validationResult } from 'express-validator';

// Validation Result Checker
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Auth Validations
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),

  validate,
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  validate,
];

// Product Validations
export const createProductValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2 })
    .withMessage('Product name must be at least 2 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Price must be a number')
    .custom((value) => value >= 0)
    .withMessage('Price cannot be negative'),

  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'Electronics',
      'Clothing',
      'Food',
      'Books',
      'Furniture',
      'Toys',
      'Sports',
      'Others',
    ])
    .withMessage('Invalid category'),

  body('stock')
    .notEmpty()
    .withMessage('Stock is required')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),

  body('sku').trim().notEmpty().withMessage('SKU is required'),

  body('lowStockThreshold')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Low stock threshold must be a non-negative integer'),

  validate,
];

export const updateProductValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Product name must be at least 2 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),

  body('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number')
    .custom((value) => value >= 0)
    .withMessage('Price cannot be negative'),

  body('category')
    .optional()
    .isIn([
      'Electronics',
      'Clothing',
      'Food',
      'Books',
      'Furniture',
      'Toys',
      'Sports',
      'Others',
    ])
    .withMessage('Invalid category'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),

  validate,
];

export const updateStockValidation = [
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),

  body('action')
    .notEmpty()
    .withMessage('Action is required')
    .isIn(['add', 'subtract'])
    .withMessage('Action must be either add or subtract'),

  validate,
];

// Order Validations
export const createOrderValidation = [
  body('products')
    .isArray({ min: 1 })
    .withMessage('Products must be a non-empty array'),

  body('products.*.product')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID'),

  body('products.*.quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),

  body('customerInfo.name')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required'),

  body('customerInfo.email')
    .trim()
    .notEmpty()
    .withMessage('Customer email is required')
    .isEmail()
    .withMessage('Invalid email format'),

  body('customerInfo.phone')
    .trim()
    .notEmpty()
    .withMessage('Customer phone is required'),

  body('customerInfo.address')
    .trim()
    .notEmpty()
    .withMessage('Customer address is required'),

  validate,
];

export const updateOrderStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status'),

  validate,
];

// Mongo ID Validation
export const mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  validate,
];