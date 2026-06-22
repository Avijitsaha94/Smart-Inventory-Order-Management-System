/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LogIn, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { setCredentials } from '../../redux/slices/authSlice';
import axiosInstance from '../../utils/axios';
import type { AuthResponse, LoginCredentials } from '../../types';
import ThemeToggle from '../../components/shared/ThemeToggle';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Demo login auto-fill
  const fillDemo = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      setFormData({ email: 'admin@test.com', password: '123456' });
    } else {
      setFormData({ email: 'user@test.com', password: '123456' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/login', formData);
      const { _id, name, email, role, token } = response.data.data;
      dispatch(setCredentials({
        user: { _id, name, email, role, createdAt: '', updatedAt: '' },
        token,
      }));
      toast.success('Login successful! 🎉');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-primary-50 to-primary-100
                    dark:from-slate-900 dark:to-slate-800
                    px-4 transition-colors">

      {/* Theme Toggle (top right) */}
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Smart<span className="text-primary-600">Inventory</span>
            </h1>
          </Link>
          <p className="text-gray-600 dark:text-slate-400 mt-2">
            Sign in to your account
          </p>
        </div>

        {/* Demo Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            type="button"
            onClick={() => fillDemo('admin')}
            className="flex-1 py-2 text-sm font-medium rounded-lg border-2 border-primary-300
                       text-primary-700 hover:bg-primary-50
                       dark:border-primary-700 dark:text-primary-400 dark:hover:bg-primary-900/20
                       transition-colors"
          >
            Demo Admin
          </button>
          <button
            type="button"
            onClick={() => fillDemo('user')}
            className="flex-1 py-2 text-sm font-medium rounded-lg border-2 border-gray-300
                       text-gray-700 hover:bg-gray-50
                       dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700
                       transition-colors"
          >
            Demo User
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl
                        border border-gray-100 dark:border-slate-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="label dark:text-slate-300">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label dark:text-slate-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary flex items-center justify-center gap-2
                         py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
              Create one
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-gray-500 dark:text-slate-500 hover:text-primary-600 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;