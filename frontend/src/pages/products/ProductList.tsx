/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Plus, Search, Filter, Package,
  AlertCircle, Edit, Trash2, Eye,
  ChevronUp, ChevronDown,
} from 'lucide-react';
import type { RootState } from '../../redux/store';
import { useGetProductsQuery, useDeleteProductMutation } from '../../redux/api/productApi';
import Layout from '../../components/layout/Layout';
import { useDebounce, useToast } from '../../hooks';

const CATEGORIES = ['Electronics','Clothing','Food','Books','Furniture','Toys','Sports','Others'];

// ── Category color map ────────────────────────────────────────────────────────
const getCategoryColor = (category: string) => {
  const map: Record<string, string> = {
    Electronics: 'bg-blue-400',
    Clothing:    'bg-pink-400',
    Food:        'bg-green-400',
    Books:       'bg-yellow-400',
    Furniture:   'bg-orange-400',
    Toys:        'bg-purple-400',
    Sports:      'bg-teal-400',
    Others:      'bg-gray-400',
  };
  return map[category] || 'bg-gray-400';
};

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="card dark:bg-slate-800 dark:border dark:border-slate-700
                 animate-pulse flex flex-col"
      style={{ minHeight: '380px' }}
    >
      {/* Image skeleton */}
      <div className="w-full h-36 bg-gray-200 dark:bg-slate-700 rounded-xl mb-4" />
      <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded mb-2 w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-1 w-full" />
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-4 w-2/3" />
      <div className="flex justify-between mb-4 pb-4 border-b border-gray-100 dark:border-slate-700 mt-auto">
        <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
        <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-9 bg-gray-200 dark:bg-slate-700 rounded-lg" />
        <div className="w-9 h-9 bg-gray-200 dark:bg-slate-700 rounded-lg" />
        <div className="w-9 h-9 bg-gray-200 dark:bg-slate-700 rounded-lg" />
      </div>
    </div>
  );
}

function ProductList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);

  // ── URL params ──────────────────────────────────────────────────────────────
  const page        = parseInt(searchParams.get('page')  || '1');
  const search      = searchParams.get('search')      || '';
  const category    = searchParams.get('category')    || '';
  const stockStatus = searchParams.get('stockStatus') || '';
  const sort        = searchParams.get('sort')        || '-createdAt';

  // ── Local state ─────────────────────────────────────────────────────────────
  const [searchInput,    setSearchInput]    = useState(search);
  const [categoryFilter, setCategoryFilter] = useState(category);
  const [stockFilter,    setStockFilter]    = useState(stockStatus);

  // ── Custom hooks ────────────────────────────────────────────────────────────
  const debouncedSearch = useDebounce(searchInput, 500);
  const { success: toastSuccess, error: toastError } = useToast();

  // Auto-search when debounced value changes
  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search      = debouncedSearch;
    if (categoryFilter)  params.category    = categoryFilter;
    if (stockFilter)     params.stockStatus = stockFilter;
    if (sort)            params.sort        = sort;
    setSearchParams(params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // ── API ─────────────────────────────────────────────────────────────────────
  const { data, isLoading, error } = useGetProductsQuery({
    page, limit: 12, search, category, stockStatus, sort,
  });
  const [deleteProduct] = useDeleteProductMutation();

  // ── Sort helpers ────────────────────────────────────────────────────────────
  const handleSort = (field: string) => {
    const newSort = sort === `-${field}` ? field : `-${field}`;
    setSearchParams({ ...Object.fromEntries(searchParams), sort: newSort, page: '1' });
  };

  const getSortDirection = (field: string): 'asc' | 'desc' | null => {
    if (sort === `-${field}`) return 'desc';
    if (sort ===   field    ) return 'asc';
    return null;
  };

  const SortIcon = ({ field }: { field: string }) => {
    const dir = getSortDirection(field);
    if (dir === 'desc') return <ChevronDown className="w-3.5 h-3.5 text-primary-500" />;
    if (dir === 'asc')  return <ChevronUp   className="w-3.5 h-3.5 text-primary-500" />;
    return <ChevronDown className="w-3.5 h-3.5 text-gray-300 dark:text-slate-600" />;
  };

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSearch = () => {
    const params: Record<string, string> = {};
    if (searchInput)    params.search      = searchInput;
    if (categoryFilter) params.category    = categoryFilter;
    if (stockFilter)    params.stockStatus = stockFilter;
    if (sort)           params.sort        = sort;
    setSearchParams(params);
  };

  const handleClear = () => {
    setSearchInput('');
    setCategoryFilter('');
    setStockFilter('');
    setSearchParams({ sort: '-createdAt' });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id).unwrap();
      toastSuccess('Product deleted successfully');
    } catch (err: any) {
      toastError(err.data?.message || 'Failed to delete product');
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const getStockBadge = (status: string) => {
    const map: Record<string, string> = {
      'In Stock':     'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400',
      'Low Stock':    'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400',
      'Out of Stock': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] || ''}`}>
        {status}
      </span>
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1">
              {data ? `${data.total} products found` : 'Manage your inventory products'}
            </p>
          </div>
          {user?.role === 'admin' && (
            <Link to="/products/create" className="btn btn-primary flex items-center gap-2 w-fit">
              <Plus className="w-5 h-5" /><span>Add Product</span>
            </Link>
          )}
        </div>

        {/* ── Filters ── */}
        <div className="card dark:bg-slate-800 dark:border dark:border-slate-700 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500 dark:text-slate-400" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Filters & Sorting</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search products... (auto-search)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="input dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="input dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            >
              <option value="">All Stock</option>
              <option value="lowStock">Low Stock</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
          </div>

          {/* Sort Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm text-gray-500 dark:text-slate-400 self-center">Sort by:</span>
            {[
              { label: 'Name',  field: 'name'      },
              { label: 'Price', field: 'price'     },
              { label: 'Stock', field: 'stock'     },
              { label: 'Date',  field: 'createdAt' },
            ].map((s) => (
              <button
                key={s.field}
                onClick={() => handleSort(s.field)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  sort === s.field || sort === `-${s.field}`
                    ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                {s.label}
                <SortIcon field={s.field} />
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={handleSearch} className="btn btn-primary flex items-center gap-2">
              <Search className="w-4 h-4" /><span>Search</span>
            </button>
            <button
              onClick={handleClear}
              className="btn btn-secondary dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-6">
            <div className="flex items-center gap-3 text-red-800 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <p>Failed to load products. Please try again.</p>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Products Grid ── */}
        {!isLoading && data && data.data.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.data.map((product) => (
                <div
                  key={product._id}
                  className="card dark:bg-slate-800 dark:border dark:border-slate-700
                             hover:shadow-lg transition-all flex flex-col"
                  style={{ minHeight: '380px' }}
                >
                  {/* ── Product Image ── */}
                  <div
                    className="relative w-full h-36 rounded-xl overflow-hidden mb-4
                                bg-gradient-to-br from-primary-50 to-blue-50
                                dark:from-slate-700 dark:to-slate-600
                                flex items-center justify-center flex-shrink-0"
                  >
                    {/* Category color accent */}
                    <div className={`absolute inset-0 opacity-20 ${getCategoryColor(product.category)}`} />
                    <Package className="w-14 h-14 text-primary-400 dark:text-primary-500 relative z-10" />
                    {/* Stock badge */}
                    <div className="absolute top-2 right-2 z-10">
                      {getStockBadge(product.stockStatus)}
                    </div>
                    {/* Category badge */}
                    <div className="absolute bottom-2 left-2 z-10">
                      <span className="px-2 py-0.5 bg-white/80 dark:bg-slate-900/80
                                       text-gray-700 dark:text-slate-200
                                       rounded-md text-xs font-medium backdrop-blur-sm">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Stock */}
                  <div className="flex items-center justify-between mb-3 pb-3
                                  border-b border-gray-100 dark:border-slate-700">
                    <div>
                      <p className="text-xs text-gray-400 dark:text-slate-500">Price</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ৳{product.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 dark:text-slate-500">Stock</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {product.stock}
                      </p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="space-y-1 mb-4 text-xs text-gray-500 dark:text-slate-400">
                    <p>SKU: <span className="font-medium text-gray-700 dark:text-slate-300">{product.sku}</span></p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="flex-1 btn btn-secondary flex items-center justify-center gap-1 text-sm py-2
                                 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                    >
                      <Eye className="w-4 h-4" /><span>View</span>
                    </button>
                    {user?.role === 'admin' && (
                      <>
                        <button
                          onClick={() => navigate(`/products/${product._id}/edit`)}
                          className="p-2 btn btn-secondary dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          className="p-2 btn btn-danger"
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
              <div className="flex justify-center gap-2 mt-8 flex-wrap">
                <button
                  onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(page - 1) })}
                  disabled={page === 1}
                  className="btn btn-secondary dark:bg-slate-700 dark:text-white disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(p) })}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      p === page
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(page + 1) })}
                  disabled={page === data.pages}
                  className="btn btn-secondary dark:bg-slate-700 dark:text-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && data && data.data.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-500 dark:text-slate-400 mb-6">
              {search || category || stockStatus
                ? 'Try adjusting your filters'
                : 'Get started by adding your first product'}
            </p>
            {user?.role === 'admin' && (
              <Link to="/products/create" className="btn btn-primary inline-flex items-center gap-2">
                <Plus className="w-5 h-5" /><span>Add Product</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ProductList;