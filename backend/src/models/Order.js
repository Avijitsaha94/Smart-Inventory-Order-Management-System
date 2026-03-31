import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String, // snapshot
        price: Number, // snapshot
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        subtotal: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerInfo: {
      name: String,
      email: String,
      phone: String,
      address: String,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// 🧾 Generate order number automatically
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const count = await mongoose.model('Order').countDocuments();

    this.orderNumber = `ORD-${year}${month}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// ✅ export
const Order = mongoose.model('Order', orderSchema);
export default Order;