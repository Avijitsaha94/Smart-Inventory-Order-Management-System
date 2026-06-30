import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

/**
 * useAuth - centralized authentication hook
 *
 * Usage:
 * const { user, isAuthenticated, isAdmin, handleLogout } = useAuth();
 */
function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth
  );

  const isAdmin = user?.role === 'admin';
  const isUser  = user?.role === 'user';

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const requireAuth = (callback: () => void) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    callback();
  };

  const requireAdmin = (callback: () => void) => {
    if (!isAdmin) {
      toast.error('Admin access required');
      return;
    }
    callback();
  };

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isUser,
    handleLogout,
    requireAuth,
    requireAdmin,
  };
}

export default useAuth;