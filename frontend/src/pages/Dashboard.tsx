import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  DollarSign,
  User,
  Plus,
  TrendingUp,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { RootState } from '../redux/store';
import { useGetDashboardStatsQuery } from '../redux/api/dashboardApi';
import Layout from '../components/layout/Layout';

function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data, isLoading, error } = useGetDashboardStatsQuery();

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="card bg-red-50 border border-red-200">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-semibold">Failed to load dashboard</p>
              <p className="text-sm mt-1">
                {user?.role === 'user'
                  ? 'Dashboard is only available for admin users.'
                  : 'Please try again later.'}
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!data?.data) return null;

  const stats = data.data;

  // Format revenue chart data
  const revenueChartData = stats.topProducts.map((product) => ({
    name:
      product.name.length > 15
        ? product.name.substring(0, 15) + '...'
        : product.name,
    revenue: product.totalRevenue,
    quantity: product.totalQuantity,
  }));

  // Category distribution for pie chart
  const categoryData = stats.inventory.categoryDistribution.map((cat) => ({
    name: cat._id,
    value: cat.count,
  }));

  return (
    <Layout>
      <div>
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your inventory today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/products"
            className="card hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats.overview.totalProducts}
            </h3>
            <p className="text-sm text-gray-600">Total Products</p>
            {stats.inventory.lowStockCount > 0 && (
              <p className="text-xs text-orange-600 mt-2 font-medium">
                ⚠️ {stats.inventory.lowStockCount} low stock
              </p>
            )}
          </Link>

          <Link
            to="/orders"
            className="card hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats.overview.totalOrders}
            </h3>
            <p className="text-sm text-gray-600">Total Orders</p>
            {stats.orders.pending > 0 && (
              <p className="text-xs text-blue-600 mt-2 font-medium">
                📋 {stats.orders.pending} pending
              </p>
            )}
          </Link>

          <div className="card hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              ৳{(stats.overview.totalRevenue / 1000000).toFixed(2)}M
            </h3>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-xs text-green-600 mt-2 font-medium">
              This month: ৳{(stats.overview.monthlyRevenue / 1000).toFixed(0)}K
            </p>
          </div>

          <div className="card hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-orange-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats.overview.totalUsers}
            </h3>
            <p className="text-sm text-gray-600">Total Users</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Products Chart */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Top Selling Products
            </h3>
            {stats.topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `৳${Number(value).toLocaleString()}`,
                      '',
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                  <Bar dataKey="quantity" fill="#10b981" name="Quantity Sold" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No sales data available
              </div>
            )}
          </div>

          {/* Category Distribution */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Category Distribution
            </h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No products available
              </div>
            )}
          </div>
        </div>

        {/* Order Status & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Order Status */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Order Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium text-gray-900">Pending</span>
                <span className="text-2xl font-bold text-yellow-600">
                  {stats.orders.pending}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-900">Processing</span>
                <span className="text-2xl font-bold text-blue-600">
                  {stats.orders.processing}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-gray-900">Delivered</span>
                <span className="text-2xl font-bold text-green-600">
                  {stats.orders.delivered}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
              <Link
                to="/orders"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View All →
              </Link>
            </div>
            {stats.orders.recent.length > 0 ? (
              <div className="space-y-3">
                {stats.orders.recent.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-gray-900">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.orderedBy.name} •{' '}
                        {format(new Date(order.createdAt), 'MMM dd, HH:mm')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        ৳{order.totalAmount.toLocaleString()}
                      </div>
                      <Link
                        to={`/orders/${order._id}`}
                        className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mt-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent orders
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-500">Frequently used actions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user?.role === 'admin' && (
              <Link
                to="/products/create"
                className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <Plus className="w-6 h-6 text-primary-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Add Product</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Add new items to your inventory
                </p>
              </Link>
            )}

            <Link
              to="/orders/create"
              className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Create Order</h4>
              </div>
              <p className="text-sm text-gray-600">
                Place a new order for customers
              </p>
            </Link>

            <Link
              to="/products"
              className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900">View Products</h4>
              </div>
              <p className="text-sm text-gray-600">
                Browse and manage your inventory
              </p>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;