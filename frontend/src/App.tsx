import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import  type { RootState } from './redux/store';

// ── Lazy Loaded Pages ─────────────────────────────────────────────────────────
// Public Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const About       = lazy(() => import('./pages/About'));
const Contact     = lazy(() => import('./pages/Contact'));
const NotFound    = lazy(() => import('./pages/NotFound'));

// Auth Pages
const Login    = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));

// Protected Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile   = lazy(() => import('./pages/Profile'));

// Product Pages
const ProductList   = lazy(() => import('./pages/products/ProductList'));
const ProductForm   = lazy(() => import('./pages/products/ProductForm'));
const ProductDetail = lazy(() => import('./pages/products/ProductDetail'));

// Order Pages
const OrderList   = lazy(() => import('./pages/orders/OrderList'));
const CreateOrder = lazy(() => import('./pages/orders/CreateOrder'));
const OrderDetail = lazy(() => import('./pages/orders/OrderDetail'));

// Admin Pages
const UsersManagement = lazy(() => import('./pages/admin/UsersManagement'));

// ── Loading Spinner ───────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900
                    flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-10 h-10 border-4
                        border-primary-600 border-t-transparent
                        rounded-full animate-spin mb-4" />
        <p className="text-gray-500 dark:text-slate-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

// ── Route Guards ──────────────────────────────────────────────────────────────
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

// ── Main App ──────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            fontWeight: '500',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            duration: 4000,
          },
        }}
      />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public Pages ── */}
          <Route path="/"        element={<LandingPage />} />
          <Route path="/about"   element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* ── Auth Routes ── */}
          <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* ── Protected Routes ── */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Product Routes */}
          <Route path="/products"          element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
          <Route path="/products/create"   element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
          <Route path="/products/:id"      element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/products/:id/edit" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />

          {/* Order Routes */}
          <Route path="/orders"          element={<ProtectedRoute><OrderList /></ProtectedRoute>} />
          <Route path="/orders/create"   element={<ProtectedRoute><CreateOrder /></ProtectedRoute>} />
          <Route path="/orders/:id"      element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

          {/* ── Admin Only Routes ── */}
          <Route path="/admin/users" element={<AdminRoute><UsersManagement /></AdminRoute>} />

          {/* ── Redirects ── */}
          <Route path="/home" element={<Navigate to="/" replace />} />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;