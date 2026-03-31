import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 🔐 Protect routes - check login
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 👉 Get token
      token = req.headers.authorization.split(' ')[1];

      // 👉 Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 👉 Get user (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  }

  // 👉 No token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
  }
};

// 👑 Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Not authorized as admin',
    });
  }
};