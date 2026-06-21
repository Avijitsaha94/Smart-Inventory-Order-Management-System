/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Plus,
  Filter,
  ShoppingCart,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import  type { RootState } from '../../redux/store';
import { useGetOrdersQuery } from '../../redux/api/orderApi';
import Layout from '../../components/layout/Layout';

function OrderList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);

  // Get query params
  const page = parseInt(searchParams.get('page') || '1');
  const status = searchParams.get('status') || '';

  // Local state
  const [statusFilter, setStatusFilter] = useState(status);

  // API call
  const { data, isLoading, error } = useGetOrdersQuery({
    page,
    limit: 10,
    status,
  });

  // Handle filter
  const handleFilter = () => {
    const params: any = {};
    if (statusFilter) params.status = statusFilter;
    setSearchParams(params);
  };

  // Clear filters
  const handleClearFilters = () => {
    setStatusFilter('');
    setSearchParams({});
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Payment status badge
  const getPaymentBadge = (status: string) => {
    const styles = {
      pending: 'bg-gray-100 text-gray-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1">
              {user?.role === 'admin'
                ? 'Manage all orders'
                : 'View your order history'}
            </p>
          </div>

          <Link
            to="/orders/create"
            className="btn btn-primary flex items-center gap-2 w-fit"
          >
            <Plus className="w-5 h-5" />
            <span>Create Order</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="card dark:bg-slate-800 dark:border dark:border-slate-700 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button onClick={handleFilter} className="btn btn-primary">
              Apply
            </button>
            <button onClick={handleClearFilters} className="btn btn-secondary">
              Clear
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="card bg-red-50 border border-red-200">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <p>Failed to load orders. Please try again.</p>
            </div>
          </div>
        )}

        {/* Orders List */}
        {data && data.data.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block card dark:bg-slate-800 dark:border dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Products
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.data.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">
                              {order.orderNumber}
                            </div>
                            <div className="text-xs text-gray-500">
                              {getPaymentBadge(order.paymentStatus)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {order.customerInfo.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customerInfo.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.products.length} item(s)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">
                            ৳{order.totalAmount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => navigate(`/orders/${order._id}`)}
                            className="btn btn-secondary btn-sm flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {data.data.map((order) => (
                <div key={order._id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.customerInfo.name}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Products:</span>
                      <span className="font-medium">
                        {order.products.length} item(s)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-gray-900">
                        ৳{order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="text-gray-900">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="w-full btn btn-secondary flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() =>
                    setSearchParams({
                      ...Object.fromEntries(searchParams),
                      page: String(page - 1),
                    })
                  }
                  disabled={page === 1}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: data.pages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() =>
                          setSearchParams({
                            ...Object.fromEntries(searchParams),
                            page: String(p),
                          })
                        }
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          p === page
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() =>
                    setSearchParams({
                      ...Object.fromEntries(searchParams),
                      page: String(page + 1),
                    })
                  }
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
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 mb-6">
                {status
                  ? 'Try adjusting your filters'
                  : 'Get started by creating your first order'}
              </p>
              <Link
                to="/orders/create"
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Order</span>
              </Link>
            </div>
          )
        )}
      </div>
    </Layout>
  );
}

export default OrderList;