import express from 'express';

import {
  registerUser,
  loginUser,
  getMe,
} from '../controllers/authController.js';

import { protect } from '../middleware/authMiddleware.js';

import {
  registerValidation,
  loginValidation,
} from '../middleware/validators.js';

const router = express.Router();

// 🔓 Public routes (with validation)
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

// 🔐 Private route
router.get('/me', protect, getMe);

export default router;