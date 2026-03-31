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
app.use(cors());
app.use(express.json());

// 🧪 Test Route
app.get('/', (req, res) => {
  res.json({ message: '🚀 Smart Inventory API is running!' });
});

// 🚀 Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});