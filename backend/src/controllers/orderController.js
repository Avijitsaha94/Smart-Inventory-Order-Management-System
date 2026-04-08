import Order from '../models/Order.js';
import Product from '../models/Product.js';

// 🛒 Create Order
export const createOrder = async (req, res) => {
  try {
    
    const { products, customerInfo, notes } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No products in order',
      });
    }

    let orderProducts = [];
    let totalAmount = 0;
    let productDocs = [];

    for (let item of products) {    
      const product = await Product.findById(item.product);
     

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const subtotal = product.price * item.quantity;

      orderProducts.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal,
      });

      totalAmount += subtotal;
      productDocs.push({ doc: product, quantity: item.quantity });
    }

  

    const order = await Order.create({
      products: orderProducts,
      totalAmount,
      orderedBy: req.user.id,
      customerInfo,
      notes,
    });



    for (let { doc, quantity } of productDocs) {
      doc.stock -= quantity;
      await doc.save();
    }

   

    const populatedOrder = await Order.findById(order._id)
      .populate('orderedBy', 'name email')
      .populate('products.product', 'name sku');


    res.status(201).json({
      success: true,
      data: populatedOrder,
    });
  } catch (error) {
    console.log('=== ERROR ===', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📦 Get Orders
export const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, startDate, endDate } = req.query;

    let query = {};

    if (status) query.status = status;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (req.user.role !== 'admin') {
      query.orderedBy = req.user.id;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
      .populate('orderedBy', 'name email')
      .populate('products.product', 'name sku')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📄 Get Single Order
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('orderedBy', 'name email')
      .populate('products.product', 'name sku category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (
      req.user.role !== 'admin' &&
      order.orderedBy._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔄 Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('orderedBy', 'name email')
      .populate('products.product', 'name sku');

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ❌ Cancel Order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (
      req.user.role !== 'admin' &&
      order.orderedBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`,
      });
    }

    for (let item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📊 Order Stats (Admin)
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });

    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        totalRevenue,
        monthlyRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};