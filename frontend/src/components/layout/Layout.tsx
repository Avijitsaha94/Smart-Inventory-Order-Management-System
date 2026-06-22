import {  useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { ReactNode } from 'react';
import {
  Package, ShoppingCart, LayoutDashboard,
  LogOut, Menu, X, AlertCircle,
  User, ChevronDown, Settings,
} from 'lucide-react';
import type { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { useGetLowStockProductsQuery } from '../../redux/api/productApi';
import ThemeToggle from '../shared/ThemeToggle';
import toast from 'react-hot-toast';

interface LayoutProps {
  children: ReactNode;
}

// ── Profile Dropdown ─────────────────────────────────────────────────────────
function ProfileDropdown() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl
                   hover:bg-gray-100 dark:hover:bg-slate-700
                   transition-colors group"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700
                        rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-sm font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Name & Role */}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
            {user?.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-slate-400 capitalize mt-0.5">
            {user?.role}
          </p>
        </div>

        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 z-50
                        bg-white dark:bg-slate-800
                        border border-gray-200 dark:border-slate-700
                        rounded-xl shadow-xl overflow-hidden">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700
                          bg-gray-50 dark:bg-slate-700/50">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 truncate mt-0.5">
              {user?.email}
            </p>
            <span className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${
              user?.role === 'admin'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
            }`}>
              <span className="capitalize">{user?.role}</span>
            </span>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5
                         text-sm text-gray-700 dark:text-slate-300
                         hover:bg-gray-50 dark:hover:bg-slate-700
                         transition-colors"
            >
              <User className="w-4 h-4 text-gray-400 dark:text-slate-500" />
              <span>My Profile</span>
            </Link>

            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5
                         text-sm text-gray-700 dark:text-slate-300
                         hover:bg-gray-50 dark:hover:bg-slate-700
                         transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-400 dark:text-slate-500" />
              <span>Settings</span>
            </Link>
          </div>

          {/* Divider + Logout */}
          <div className="border-t border-gray-100 dark:border-slate-700 py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5
                         text-sm text-red-600 dark:text-red-400
                         hover:bg-red-50 dark:hover:bg-red-900/20
                         transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Layout ──────────────────────────────────────────────────────────────
function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: lowStockData } = useGetLowStockProductsQuery();
  const lowStockCount = lowStockData?.count || 0;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      {/* ── Header ── */}
      <header className="bg-white dark:bg-slate-800 shadow-sm
                         border-b border-gray-200 dark:border-slate-700
                         sticky top-0 z-40 transition-colors">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo + Hamburger */}
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

            {/* Right: Alerts + Theme + Profile */}
            <div className="flex items-center gap-2">
              {/* Low Stock Alert */}
              {lowStockCount > 0 && (
                <Link
                  to="/products?stockStatus=lowStock"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5
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

              {/* Profile Dropdown */}
              <ProfileDropdown />
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
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path + '/'));

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

          {/* Bottom: User Role Badge */}
          <div className="absolute bottom-0 left-0 right-0 p-4
                          border-t border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-3 p-3
                            bg-gray-50 dark:bg-slate-700 rounded-xl">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700
                              rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
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

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Main Content ── */}
        <main className="flex-1 p-4 lg:p-8
                         min-h-[calc(100vh-61px)]
                         bg-gray-50 dark:bg-slate-900
                         transition-colors overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;