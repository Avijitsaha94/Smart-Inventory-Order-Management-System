import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: [
        'Electronics',
        'Clothing',
        'Food',
        'Books',
        'Furniture',
        'Toys',
        'Sports',
        'Others',
      ],
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: 0,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    sku: {
      type: String,
      unique: true,
      required: [true, 'Please provide SKU'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 📊 Virtual field: stock status
productSchema.virtual('stockStatus').get(function () {
  if (this.stock === 0) return 'Out of Stock';
  if (this.stock <= this.lowStockThreshold) return 'Low Stock';
  return 'In Stock';
});

// 🔁 Include virtuals in response
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// ✅ export
const Product = mongoose.model('Product', productSchema);
export default Product;