const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerValidation, loginValidation } = require('../middleware/validators');

// Public routes
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

// Private routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;