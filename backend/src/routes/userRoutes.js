import express from 'express';
import {
  getUsers,
  getUser,
  updateUserRole,
  deleteUser,
  getUserStats,
} from '../controllers/userController.js';

import {
  protect,
  admin,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes: Private + Admin only
router.use(protect, admin);

router.get('/stats', getUserStats);

router
  .route('/')
  .get(getUsers);

router
  .route('/:id')
  .get(getUser)
  .delete(deleteUser);

router.patch('/:id/role', updateUserRole);

export default router;