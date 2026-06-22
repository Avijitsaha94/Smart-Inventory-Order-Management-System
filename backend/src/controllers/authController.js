const User = require('../models/User');
const generateToken = require('../config/generateToken');
const asyncHandler = require('../middleware/asyncHandler');
const { ErrorResponse } = require('../middleware/errorMiddleware');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse('User already exists with this email', 400));
  }

  const user = await User.create({ name, email, password, role: role || 'user' });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new ErrorResponse('Invalid credentials', 401));

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return next(new ErrorResponse('Invalid credentials', 401));

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    },
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});

// @desc    Update profile (name, email)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;

  // Check if email already taken by another user
  if (email) {
    const emailExists = await User.findOne({
      email,
      _id: { $ne: req.user.id },
    });
    if (emailExists) {
      return next(new ErrorResponse('Email already in use', 400));
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, data: user });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ErrorResponse('Please provide current and new password', 400));
  }

  if (newPassword.length < 6) {
    return next(new ErrorResponse('New password must be at least 6 characters', 400));
  }

  const user = await User.findById(req.user.id).select('+password');

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
};