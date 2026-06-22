/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowLeft, Edit, Trash2, Package,
  DollarSign, Tag, Calendar, User, AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import Layout from '../../components/layout/Layout';
import { useGetProductQuery, useDeleteProductMutation } from '../../redux/api/productApi';
import type { RootState } from '../../redux/store';
import toast from 'react-hot-toast';

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const { data, isLoading, error } = useGetProductQuery(id!);
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${data?.data.name}"?`)) return;
    try {
      await deleteProduct(id!).unwrap();
      toast.success('Product deleted successfully');
      navigate('/products');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to delete product');
    }
  };

  const getStockBadge = (status: string) => {
    const map: Record<string, string> = {
      'In Stock':     'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400',
      'Low Stock':    'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400',
      'Out of Stock': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${map[status] || ''}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card dark:bg-slate-800 h-48" />
              <div className="card dark:bg-slate-800 h-64" />
            </div>
            <div className="space-y-6">
              <div className="card dark:bg-slate-800 h-36" />
              <div className="card dark:bg-slate-800 h-48" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !data?.data) {
    return (
      <Layout>
        <div className="card dark:bg-slate-800 dark:border dark:border-slate-700
                        bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 text-red-800 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p>Product not found or failed to load.</p>
          </div>
          <button onClick={() => navigate('/products')} className="mt-4 btn btn-secondary">
            Back to Products
          </button>
        </div>
      </Layout>
    );
  }

  const product = data.data;
  const stockPercent = Math.min(
    (product.stock / (product.lowStockThreshold * 3)) * 100, 100
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-gray-600 dark:text-slate-400
                       hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Products</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                {getStockBadge(product.stockStatus)}
                <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700
                                 text-gray-700 dark:text-slate-300
                                 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </div>
            </div>

            {user?.role === 'admin' && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/products/${id}/edit`)}
                  className="btn btn-secondary dark:bg-slate-700 dark:text-slate-200
                             dark:hover:bg-slate-600 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" /><span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-danger flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /><span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="card dark:bg-slate-800 dark:border dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Description
              </h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="card dark:bg-slate-800 dark:border dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Product Details
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Tag, bg: 'bg-blue-100 dark:bg-blue-900/40', color: 'text-blue-600 dark:text-blue-400', label: 'SKU', value: product.sku },
                  { icon: Package, bg: 'bg-green-100 dark:bg-green-900/40', color: 'text-green-600 dark:text-green-400', label: 'Category', value: product.category },
                  { icon: DollarSign, bg: 'bg-purple-100 dark:bg-purple-900/40', color: 'text-purple-600 dark:text-purple-400', label: 'Price', value: `৳${product.price.toLocaleString()}` },
                  { icon: Package, bg: 'bg-orange-100 dark:bg-orange-900/40', color: 'text-orange-600 dark:text-orange-400', label: 'Stock', value: `${product.stock} units` },
                  { icon: AlertCircle, bg: 'bg-red-100 dark:bg-red-900/40', color: 'text-red-600 dark:text-red-400', label: 'Low Stock Alert', value: `${product.lowStockThreshold} units` },
                  { icon: Calendar, bg: 'bg-gray-100 dark:bg-slate-700', color: 'text-gray-600 dark:text-slate-400', label: 'Created', value: format(new Date(product.createdAt), 'MMM dd, yyyy') },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-7 h-7 ${item.bg} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-slate-400">{item.label}</span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white pl-9">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="card dark:bg-slate-800 dark:border dark:border-slate-700
                            bg-gradient-to-br from-primary-50 to-primary-100
                            dark:from-primary-900/20 dark:to-primary-900/10
                            border border-primary-200 dark:border-primary-800">
              <div className="text-center">
                <p className="text-primary-700 dark:text-primary-400 font-medium mb-2">Price</p>
                <p className="text-4xl font-bold text-primary-900 dark:text-primary-300">
                  ৳{product.price.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Stock Card */}
            <div className="card dark:bg-slate-800 dark:border dark:border-slate-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Stock Information
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-slate-400">Current Stock</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {product.stock} units
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        product.stock === 0 ? 'bg-red-500' :
                        product.stock <= product.lowStockThreshold ? 'bg-orange-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${stockPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Low Stock Threshold</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {product.lowStockThreshold} units
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">Status</p>
                  {getStockBadge(product.stockStatus)}
                </div>
              </div>
            </div>

            {/* Created By */}
            <div className="card dark:bg-slate-800 dark:border dark:border-slate-700">
              <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 mb-3">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Created By</span>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {product.createdBy.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                {product.createdBy.email}
              </p>
            </div>

            {/* Timestamps */}
            <div className="card dark:bg-slate-800 dark:border dark:border-slate-700 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-slate-400">Created:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {format(new Date(product.createdAt), 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-slate-400">Updated:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {format(new Date(product.updatedAt), 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductDetail;