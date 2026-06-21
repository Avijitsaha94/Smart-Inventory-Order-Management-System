import {  useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Package,
  ShoppingCart,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  AlertCircle,
} from 'lucide-react';
import  type { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { useGetLowStockProductsQuery } from '../../redux/api/productApi';
import ThemeToggle from '../shared/ThemeToggle';
import toast from 'react-hot-toast';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: lowStockData } = useGetLowStockProductsQuery();
  const lowStockCount = lowStockData?.count || 0;

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/orders', label: 'Orders', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      {/* ── Header ── */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40 transition-colors">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo + Hamburger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                {sidebarOpen
                  ? <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                  : <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                }
              </button>

              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-none">
                    Smart<span className="text-primary-600">Inventory</span>
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Management System</p>
                </div>
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Low Stock Alert */}
              {lowStockCount > 0 && (
                <Link
                  to="/products?stockStatus=lowStock"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5
                             bg-orange-50 dark:bg-orange-900/30
                             text-orange-700 dark:text-orange-400
                             rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/50
                             transition-colors text-sm font-medium"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{lowStockCount} Low Stock</span>
                </Link>
              )}

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Info */}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 capitalize mt-0.5">
                  {user?.role}
                </p>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg
                           bg-gray-100 hover:bg-gray-200
                           dark:bg-slate-700 dark:hover:bg-slate-600
                           text-gray-700 dark:text-gray-200
                           transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* ── Sidebar ── */}
        <aside
          className={`
            fixed lg:sticky top-[61px] left-0 h-[calc(100vh-61px)] w-64
            bg-white dark:bg-slate-800
            border-r border-gray-200 dark:border-slate-700
            z-30 transition-all duration-300
            lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}
          `}
        >
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path ||
                location.pathname.startsWith(item.path + '/');

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    font-medium transition-all
                    ${isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info (Mobile) */}
          <div className="sm:hidden absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-xl">
              <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-700 dark:text-primary-400 font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay (Mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Main Content ── */}
        <main className="flex-1 p-4 lg:p-8 min-h-[calc(100vh-61px)] bg-gray-50 dark:bg-slate-900 transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;