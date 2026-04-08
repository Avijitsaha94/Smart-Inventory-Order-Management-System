import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// 🔑 Load environment variables
dotenv.config();

const app = express();

// 🔌 Connect Database
connectDB();

// 🧱 Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://smart-inventory-order-management-sy-two.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🧪 Test Route
app.get('/', (req, res) => {
  res.json({ message: '🚀 Smart Inventory API is running!' });
});

// 🚀 Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ❌ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route not found' });
});

// ⚠️ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '⚠️ Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Vercel এর জন্য export
export default app;