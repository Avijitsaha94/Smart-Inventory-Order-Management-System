import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Package, ShoppingCart, DollarSign, User,
  Plus, TrendingUp, AlertCircle, Eye,
} from 'lucide-react';
import { format } from 'date-fns';
import {
   BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import type { RootState } from '../redux/store';
import { useGetDashboardStatsQuery } from '../redux/api/dashboardApi';
import Layout from '../components/layout/Layout';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="inline-block w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 text-red-800 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-semibold">Failed to load dashboard</p>
              <p className="text-sm mt-1">
                {user?.role === 'user'
                  ? 'Dashboard analytics is only available for admin users.'
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

  // Top products chart data
  const revenueChartData = stats.topProducts.map((p) => ({
    name: p.name.length > 12 ? p.name.substring(0, 12) + '…' : p.name,
    revenue: p.totalRevenue,
    quantity: p.totalQuantity,
  }));

  // Category pie data
  const categoryData = stats.inventory.categoryDistribution.map((cat) => ({
    name: cat._id,
    value: cat.count,
  }));

  return (
    <Layout>
      <div>
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-500 dark:text-slate-400">
            Here's what's happening with your inventory today.
          </p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Total Products',
              value: stats.overview.totalProducts,
              icon: Package,
              iconBg: 'bg-blue-100 dark:bg-blue-900/40',
              iconColor: 'text-blue-600 dark:text-blue-400',
              sub: stats.inventory.lowStockCount > 0
                ? `⚠️ ${stats.inventory.lowStockCount} low stock`
                : 'All stocked up',
              subColor: stats.inventory.lowStockCount > 0
                ? 'text-orange-500' : 'text-green-500',
              href: '/products',
            },
            {
              label: 'Total Orders',
              value: stats.overview.totalOrders,
              icon: ShoppingCart,
              iconBg: 'bg-green-100 dark:bg-green-900/40',
              iconColor: 'text-green-600 dark:text-green-400',
              sub: stats.orders.pending > 0
                ? `📋 ${stats.orders.pending} pending`
                : 'No pending orders',
              subColor: stats.orders.pending > 0
                ? 'text-blue-500' : 'text-green-500',
              href: '/orders',
            },
            {
              label: 'Total Revenue',
              value: `৳${(stats.overview.totalRevenue / 1000).toFixed(0)}K`,
              icon: DollarSign,
              iconBg: 'bg-purple-100 dark:bg-purple-900/40',
              iconColor: 'text-purple-600 dark:text-purple-400',
              sub: `This month: ৳${(stats.overview.monthlyRevenue / 1000).toFixed(0)}K`,
              subColor: 'text-green-500',
              href: null,
            },
            {
              label: 'Total Users',
              value: stats.overview.totalUsers,
              icon: User,
              iconBg: 'bg-orange-100 dark:bg-orange-900/40',
              iconColor: 'text-orange-600 dark:text-orange-400',
              sub: 'Registered accounts',
              subColor: 'text-gray-400',
              href: null,
            },
          ].map((card) => {
            const Icon = card.icon;
            const cardContent = (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {card.value}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">{card.label}</p>
                <p className={`text-xs font-medium ${card.subColor}`}>{card.sub}</p>
              </>
            );

            const cardClassName =
              'card dark:bg-slate-800 dark:border dark:border-slate-700 hover:shadow-lg transition-all hover:-translate-y-0.5';

            return card.href ? (
              <Link key={card.label} to={card.href} className={cardClassName}>
                {cardContent}
              </Link>
            ) : (
              <div key={card.label} className={cardClassName}>
                {cardContent}
              </div>
            );
          })}
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Products Bar Chart */}
          <div className="card dark:bg-slate-800 dark:border dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Top Selling Products
            </h3>
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" fontSize={11} tick={{ fill: '#64748b' }} />
                  <YAxis fontSize={11} tick={{ fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                    }}
                    formatter={(value) => `৳${Number(value).toLocaleString()}`}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="quantity" fill="#10b981" name="Qty Sold" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400 dark:text-slate-500">
                No sales data available
              </div>
            )}
          </div>

          {/* Category Pie Chart */}
          <div className="card dark:bg-slate-800 dark:border dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Category Distribution
            </h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                    }
                    outerRadius={90}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400 dark:text-slate-500">
                No category data available
              </div>
            )}
          </div>
        </div>

        {/* ── Order Status + Recent Orders ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Order Status */}
          <div className="card dark:bg-slate-800 dark:border dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Order Status
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Pending', count: stats.orders.pending, bg: 'bg-yellow-50 dark:bg-yellow-900/20', color: 'text-yellow-600 dark:text-yellow-400' },
                { label: 'Processing', count: stats.orders.processing, bg: 'bg-blue-50 dark:bg-blue-900/20', color: 'text-blue-600 dark:text-blue-400' },
                { label: 'Delivered', count: stats.orders.delivered, bg: 'bg-green-50 dark:bg-green-900/20', color: 'text-green-600 dark:text-green-400' },
              ].map((s) => (
                <div key={s.label} className={`flex items-center justify-between p-4 ${s.bg} rounded-xl`}>
                  <span className="font-medium text-gray-900 dark:text-white">{s.label}</span>
                  <span className={`text-2xl font-bold ${s.color}`}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2 card dark:bg-slate-800 dark:border dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h3>
              <Link to="/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View All →
              </Link>
            </div>

            {stats.orders.recent.length > 0 ? (
              <div className="space-y-3">
                {stats.orders.recent.map((order) => (
                  <div key={order._id}
                    className="flex items-center justify-between p-4
                               bg-gray-50 dark:bg-slate-700/50
                               rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700
                               transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">
                          {order.orderNumber}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          order.status === 'pending'    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400' :
                          order.status === 'delivered'  ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                        {order.orderedBy.name} • {format(new Date(order.createdAt), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className="font-bold text-gray-900 dark:text-white text-sm">
                        ৳{order.totalAmount.toLocaleString()}
                      </p>
                      <Link
                        to={`/orders/${order._id}`}
                        className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 mt-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-400 dark:text-slate-500">
                No recent orders
              </div>
            )}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="card dark:bg-slate-800 dark:border dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              ...(user?.role === 'admin' ? [{
                to: '/products/create',
                icon: Plus,
                iconBg: 'bg-primary-100 dark:bg-primary-900/40',
                iconColor: 'text-primary-600 dark:text-primary-400',
                title: 'Add Product',
                desc: 'Add new items to your inventory',
              }] : []),
              {
                to: '/orders/create',
                icon: ShoppingCart,
                iconBg: 'bg-green-100 dark:bg-green-900/40',
                iconColor: 'text-green-600 dark:text-green-400',
                title: 'Create Order',
                desc: 'Place a new order for customers',
              },
              {
                to: '/products',
                icon: Package,
                iconBg: 'bg-purple-100 dark:bg-purple-900/40',
                iconColor: 'text-purple-600 dark:text-purple-400',
                title: 'View Products',
                desc: 'Browse and manage your inventory',
              },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.to}
                  className="p-5 border-2 border-dashed border-gray-200 dark:border-slate-600
                             rounded-xl hover:border-primary-400 dark:hover:border-primary-500
                             hover:bg-primary-50 dark:hover:bg-primary-900/20
                             transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 ${action.iconBg} rounded-lg flex items-center justify-center
                                    group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${action.iconColor}`} />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{action.title}</h4>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{action.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;