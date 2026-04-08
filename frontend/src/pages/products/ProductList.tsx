/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Plus,
  Search,
  Filter,
  Package,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import type { RootState } from '../../redux/store';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from '../../redux/api/productApi';
import Layout from '../../components/layout/Layout';
import toast from 'react-hot-toast';

function ProductList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);

  // Get query params
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const stockStatus = searchParams.get('stockStatus') || '';

  // Local state
  const [searchInput, setSearchInput] = useState(search);
  const [categoryFilter, setCategoryFilter] = useState(category);
  const [stockFilter, setStockFilter] = useState(stockStatus);

  // API calls
  const { data, isLoading, error } = useGetProductsQuery({
    page,
    limit: 12,
    search,
    category,
    stockStatus,
  });

  const [deleteProduct] = useDeleteProductMutation();

  // Categories
  const categories = [
    'Electronics',
    'Clothing',
    'Food',
    'Books',
    'Furniture',
    'Toys',
    'Sports',
    'Others',
  ];

  // Handle search
  const handleSearch = () => {
    const params: any = {};
    if (searchInput) params.search = searchInput;
    if (categoryFilter) params.category = categoryFilter;
    if (stockFilter) params.stockStatus = stockFilter;
    setSearchParams(params);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchInput('');
    setCategoryFilter('');
    setStockFilter('');
    setSearchParams({});
  };

  // Handle delete
  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted successfully');
      } catch (error: any) {
        toast.error(error.data?.message || 'Failed to delete product');
      }
    }
  };

  // Stock status badge
  const getStockBadge = (status: string) => {
    const styles = {
      'In Stock': 'bg-green-100 text-green-800',
      'Low Stock': 'bg-orange-100 text-orange-800',
      'Out of Stock': 'bg-red-100 text-red-800',
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">
              Manage your inventory products
            </p>
          </div>

          {user?.role === 'admin' && (
            <Link to="/products/create" className="btn btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="input"
              />
            </div>

            {/* Category */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Status */}
            <div>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="input"
              >
                <option value="">All Stock</option>
                <option value="lowStock">Low Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={handleSearch} className="btn btn-primary flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            <button onClick={handleClearFilters} className="btn btn-secondary">
              Clear Filters
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="card bg-red-50 border border-red-200">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <p>Failed to load products. Please try again.</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {data && data.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.data.map((product) => (
                <div key={product._id} className="card hover:shadow-lg transition-shadow">
                  {/* Product Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary-600" />
                    </div>
                    {getStockBadge(product.stockStatus)}
                  </div>

                  {/* Product Info */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price & Stock */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="text-lg font-bold text-gray-900">
                        ৳{product.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Stock</p>
                      <p className="text-lg font-bold text-gray-900">
                        {product.stock}
                      </p>
                    </div>
                  </div>

                  {/* Category & SKU */}
                  <div className="space-y-1 mb-4">
                    <p className="text-xs text-gray-500">
                      Category: <span className="font-medium text-gray-700">{product.category}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      SKU: <span className="font-medium text-gray-700">{product.sku}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="flex-1 btn btn-secondary flex items-center justify-center gap-2 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>

                    {user?.role === 'admin' && (
                      <>
                        <button
                          onClick={() => navigate(`/products/${product._id}/edit`)}
                          className="btn btn-secondary p-2"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          className="btn btn-danger p-2"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(page - 1) })}
                  disabled={page === 1}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(p) })}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        p === page
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(page + 1) })}
                  disabled={page === data.pages}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          !isLoading && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-6">
                {search || category || stockStatus
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first product'}
              </p>
              {user?.role === 'admin' && (
                <Link to="/products/create" className="btn btn-primary inline-flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  <span>Add Product</span>
                </Link>
              )}
            </div>
          )
        )}
      </div>
    </Layout>
  );
}

export default ProductList;