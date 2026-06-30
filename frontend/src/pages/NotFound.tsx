import { Link, useNavigate } from 'react-router-dom';
import { Package, Home, ArrowLeft, Search } from 'lucide-react';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900
                    flex items-center justify-center px-4 transition-colors">
      <div className="text-center max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl
                          flex items-center justify-center shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* 404 Number */}
        <div className="relative mb-6">
          <h1 className="text-[120px] sm:text-[160px] font-black
                         text-gray-100 dark:text-slate-800 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Search className="w-10 h-10 text-gray-400 dark:text-slate-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-600 dark:text-slate-400">
                Page not found
              </p>
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Oops! This page doesn't exist
        </h2>
        <p className="text-gray-500 dark:text-slate-400 mb-8 leading-relaxed">
          The page you're looking for might have been moved, deleted,
          or never existed. Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary dark:bg-slate-700 dark:text-white
                       flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
          <Link
            to="/"
            className="btn btn-primary flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span>Go to Home</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-slate-700">
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
            Or go to one of these pages:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Dashboard', to: '/dashboard' },
              { label: 'Products', to: '/products' },
              { label: 'Orders', to: '/orders' },
              { label: 'About', to: '/about' },
              { label: 'Contact', to: '/contact' },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="px-4 py-2 bg-white dark:bg-slate-800
                           border border-gray-200 dark:border-slate-700
                           text-gray-700 dark:text-slate-300
                           hover:border-primary-400 hover:text-primary-600
                           dark:hover:border-primary-500 dark:hover:text-primary-400
                           rounded-xl text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;