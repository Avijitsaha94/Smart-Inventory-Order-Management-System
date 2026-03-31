import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

// 📊 Get Dashboard Stats (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    // 📦 Basic counts
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    // ⚠️ Inventory stats
    const lowStockCount = await Product.countDocuments({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    });

    const outOfStockCount = await Product.countDocuments({ stock: 0 });

    // 📦 Order stats
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

    // 💰 Total revenue
    const totalRevenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // 📅 This month revenue
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyRevenueResult = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: { $gte: startOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;

    // 🔥 Top products (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const topProducts = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.product',
          totalQuantity: { $sum: '$products.quantity' },
          totalRevenue: { $sum: '$products.subtotal' },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: '$productInfo' },
      {
        $project: {
          name: '$productInfo.name',
          sku: '$productInfo.sku',
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
    ]);

    // 🕒 Recent orders
    const recentOrders = await Order.find()
      .populate('orderedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber totalAmount status createdAt');

    // 📊 Category distribution
    const categoryDistribution = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: {
            $sum: { $multiply: ['$price', '$stock'] },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalProducts,
          totalOrders,
          totalUsers,
          totalRevenue,
          monthlyRevenue,
        },
        inventory: {
          lowStockCount,
          outOfStockCount,
          categoryDistribution,
        },
        orders: {
          pending: pendingOrders,
          processing: processingOrders,
          delivered: deliveredOrders,
          recent: recentOrders,
        },
        topProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};