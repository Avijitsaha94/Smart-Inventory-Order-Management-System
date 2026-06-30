import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Plus, Filter, ShoppingCart, Eye,
  AlertCircle, ChevronUp, ChevronDown,
} from 'lucide-react';
import { format } from 'date-fns';
import type { RootState } from '../../redux/store';
import { useGetOrdersQuery } from '../../redux/api/orderApi';
import Layout from '../../components/layout/Layout';
import { useSort } from '../../hooks';

// ── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[1,2,3,4,5,6].map((i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

function OrderList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);

  const page   = parseInt(searchParams.get('page') || '1');
  const status = searchParams.get('status') || '';
  const sort   = searchParams.get('sort') || '-createdAt';

  const [statusFilter, setStatusFilter] = useState(status);

  // ── Custom Hooks ─────────────────────────────────────────────────────────
  const { handleSort, getSortDirection } = useSort('-createdAt');

  const { data, isLoading, error } = useGetOrdersQuery({ page, limit: 10, status, sort });

  // Sort Icon helper
  const SortIcon = ({ field }: { field: string }) => {
    const dir = getSortDirection(field);
    if (dir === 'desc') return <ChevronDown className="w-3.5 h-3.5 text-primary-500" />;
    if (dir === 'asc')  return <ChevronUp   className="w-3.5 h-3.5 text-primary-500" />;
    return <ChevronDown className="w-3.5 h-3.5 text-gray-300 dark:text-slate-600" />;
  };

  const handleFilter = () => {
    const params: Record<string, string> = { page: '1' };
    if (statusFilter) params.status = statusFilter;
    if (sort) params.sort = sort;
    setSearchParams(params);
  };

  const handleClear = () => {
    setStatusFilter('');
    setSearchParams({ sort: '-createdAt' });
  };

  // ── Badge Helpers ──────────────────────────────────────────────────────────
  const getStatusBadge = (s: string) => {
    const map: Record<string, string> = {
      pending:    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400',
      processing: 'bg-blue-100   text-blue-800   dark:bg-blue-900/40   dark:text-blue-400',
      shipped:    'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400',
      delivered:  'bg-green-100  text-green-800  dark:bg-green-900/40  dark:text-green-400',
      cancelled:  'bg-red-100    text-red-800    dark:bg-red-900/40    dark:text-red-400',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[s] || ''}`}>
        {s.charAt(0).toUpperCase() + s.slice(1)}
      </span>
    );
  };

  const getPaymentBadge = (s: string) => {
    const map: Record<string, string> = {
      pending: 'bg-gray-100  text-gray-800  dark:bg-slate-700 dark:text-slate-300',
      paid:    'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400',
      failed:  'bg-red-100   text-red-800   dark:bg-red-900/40   dark:text-red-400',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[s] || ''}`}>
        {s.charAt(0).toUpperCase() + s.slice(1)}
      </span>
    );
  };

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1">
              {data ? `${data.total} orders total` : (
                user?.role === 'admin' ? 'Manage all orders' : 'View your order history'
              )}
            </p>
          </div>
          <Link to="/orders/create" className="btn btn-primary flex items-center gap-2 w-fit">
            <Plus className="w-5 h-5" /><span>Create Order</span>
          </Link>
        </div>

        {/* ── Filters ── */}
        <div className="card dark:bg-slate-800 dark:border dark:border-slate-700 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500 dark:text-slate-400" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Filters & Sorting</h2>
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Sort Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm text-gray-500 dark:text-slate-400 self-center">Sort by:</span>
            {[
              { label: 'Date',   field: 'createdAt'   },
              { label: 'Amount', field: 'totalAmount' },
              { label: 'Status', field: 'status'      },
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
            <button onClick={handleFilter} className="btn btn-primary">Apply</button>
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
              <p>Failed to load orders. Please try again.</p>
            </div>
          </div>
        )}

        {/* ── Desktop Table ── */}
        {(isLoading || (data && data.data.length > 0)) && (
          <div className="hidden lg:block card dark:bg-slate-800 dark:border dark:border-slate-700 overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700/50
                                  border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    {[
                      { label: 'Order',    field: null            },
                      { label: 'Customer', field: null            },
                      { label: 'Items',    field: null            },
                      { label: 'Amount',   field: 'totalAmount'  },
                      { label: 'Status',   field: 'status'       },
                      { label: 'Date',     field: 'createdAt'    },
                      { label: 'Action',   field: null            },
                    ].map((col) => (
                      <th
                        key={col.label}
                        className="px-6 py-4 text-left text-xs font-semibold
                                   text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                      >
                        {col.field ? (
                          <button
                            onClick={() => handleSort(col.field!)}
                            className="flex items-center gap-1 hover:text-gray-900
                                       dark:hover:text-white transition-colors"
                          >
                            {col.label}<SortIcon field={col.field} />
                          </button>
                        ) : col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                    : data?.data.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {order.orderNumber}
                          </p>
                          <div className="mt-1">{getPaymentBadge(order.paymentStatus)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {order.customerInfo.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">
                            {order.customerInfo.email}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700 dark:text-slate-300">
                            {order.products.length} item(s)
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-bold text-gray-900 dark:text-white">
                            ৳{order.totalAmount.toLocaleString()}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                          {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => navigate(`/orders/${order._id}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
                                       bg-gray-100 dark:bg-slate-700
                                       text-gray-700 dark:text-slate-300
                                       hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                          >
                            <Eye className="w-4 h-4" /><span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Mobile Cards ── */}
        {!isLoading && data && data.data.length > 0 && (
          <div className="lg:hidden space-y-4">
            {data.data.map((order) => (
              <div key={order._id}
                className="card dark:bg-slate-800 dark:border dark:border-slate-700">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                      {order.customerInfo.name}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div>
                    <p className="text-gray-500 dark:text-slate-400 text-xs">Items</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.products.length} item(s)
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-slate-400 text-xs">Amount</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      ৳{order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-slate-400 text-xs">Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-slate-400 text-xs">Payment</p>
                    {getPaymentBadge(order.paymentStatus)}
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="w-full btn btn-secondary dark:bg-slate-700 dark:text-slate-200
                             flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" /><span>View Details</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && data && data.data.length === 0 && (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 dark:text-slate-400 mb-6">
              {status ? 'Try adjusting your filters' : 'Get started by creating your first order'}
            </p>
            <Link to="/orders/create" className="btn btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" /><span>Create Order</span>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {data && data.pages > 1 && (
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
      </div>
    </Layout>
  );
}

export default OrderList;