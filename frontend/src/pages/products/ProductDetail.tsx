/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  DollarSign,
  Tag,
  Calendar,
  User,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import Layout from '../../components/layout/Layout';
import {
  useGetProductQuery,
  useDeleteProductMutation,
} from '../../redux/api/productApi';
import type { RootState } from '../../redux/store';
import toast from 'react-hot-toast';

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const { data, isLoading, error } = useGetProductQuery(id!);
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${data?.data.name}"?`
      )
    ) {
      try {
        await deleteProduct(id!).unwrap();
        toast.success('Product deleted successfully');
        navigate('/products');
      } catch (error: any) {
        toast.error(error.data?.message || 'Failed to delete product');
      }
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </Layout>
    );
  }

  if (error || !data?.data) {
    return (
      <Layout>
        <div className="card bg-red-50 border border-red-200">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p>Product not found or failed to load.</p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 btn btn-secondary"
          >
            Back to Products
          </button>
        </div>
      </Layout>
    );
  }

  const product = data.data;

  const getStockBadge = (status: string) => {
    const styles = {
      'In Stock': 'bg-green-100 text-green-800',
      'Low Stock': 'bg-orange-100 text-orange-800',
      'Out of Stock': 'bg-red-100 text-red-800',
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Products</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                {getStockBadge(product.stockStatus)}
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </div>
            </div>

            {user?.role === 'admin' && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/products/${id}/edit`)}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-danger flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Product Details
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Tag className="w-4 h-4" />
                    <span className="text-sm">SKU</span>
                  </div>
                  <p className="font-semibold text-gray-900">{product.sku}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Package className="w-4 h-4" />
                    <span className="text-sm">Category</span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {product.category}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Price</span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ৳{product.price.toLocaleString()}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Package className="w-4 h-4" />
                    <span className="text-sm">Stock</span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {product.stock} units
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Low Stock Alert</span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {product.lowStockThreshold} units
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Created</span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {format(new Date(product.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
              <div className="text-center">
                <p className="text-primary-700 font-medium mb-2">Price</p>
                <p className="text-4xl font-bold text-primary-900">
                  ৳{product.price.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Stock Card */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">
                Stock Information
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Current Stock</span>
                    <span className="font-semibold text-gray-900">
                      {product.stock} units
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          (product.stock / (product.lowStockThreshold * 3)) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">
                    Low Stock Threshold
                  </p>
                  <p className="font-semibold text-gray-900">
                    {product.lowStockThreshold} units
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <div>{getStockBadge(product.stockStatus)}</div>
                </div>
              </div>
            </div>

            {/* Created By */}
            <div className="card">
              <div className="flex items-center gap-2 text-gray-500 mb-3">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Created By</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {product.createdBy.name}
                </p>
                <p className="text-sm text-gray-600">
                  {product.createdBy.email}
                </p>
              </div>
            </div>

            {/* Timestamps */}
            <div className="card text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Created:</span>
                <span className="font-medium text-gray-900">
                  {format(new Date(product.createdAt), 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Updated:</span>
                <span className="font-medium text-gray-900">
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