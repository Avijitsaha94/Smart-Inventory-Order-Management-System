import Product from '../models/Product.js';

// 📦 Get all products (search + filter + pagination)
export const getProducts = async (req, res) => {
  try {
    const { search, category, stockStatus, page = 1, limit = 10 } = req.query;

    let query = {};

    // 🔍 Search
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // 🏷️ Category filter
    if (category) {
      query.category = category;
    }

    // 📊 Stock filter
    if (stockStatus === 'outOfStock') {
      query.stock = 0;
    } else if (stockStatus === 'lowStock') {
      query.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
    }

    // 📄 Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📦 Get single product
export const getProduct = async (req, res) => {

  try {
    const {
      search, category, stockStatus,
      page = 1, limit = 10,
      sort = '-createdAt'  
    } = req.query;

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ➕ Create product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, sku, lowStockThreshold } = req.body;

    const existingProduct = await Product.findOne({ sku });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists',
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      sku,
      lowStockThreshold,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✏️ Update product
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ❌ Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📊 Update stock
export const updateStock = async (req, res) => {
  try {
    const { quantity, action } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (action === 'add') {
      product.stock += quantity;
    } else if (action === 'subtract') {
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock',
        });
      }
      product.stock -= quantity;
    }

    await product.save();

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ⚠️ Low stock products
export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    }).sort({ stock: 1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};