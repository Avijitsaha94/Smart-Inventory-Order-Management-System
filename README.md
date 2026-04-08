# 🏪 Smart Inventory & Order Management System

A complete full-stack web application for managing inventory, orders, and business analytics. Built with modern technologies and best practices.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)
![Node](https://img.shields.io/badge/Node.js-18-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Product Management
![Products](screenshots/products.png)

### Order Management
![Orders](screenshots/orders.png)

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (Admin/User)
- Persistent sessions
- Password encryption with bcrypt

### 📦 Product Management
- Complete CRUD operations
- Advanced search and filtering
- Stock level tracking
- Low stock alerts
- Category management
- SKU-based identification
- Pagination support

### 🛒 Order Management
- Shopping cart-style order creation
- Real-time stock validation
- Automatic stock deduction
- Order status tracking (Pending → Processing → Shipped → Delivered)
- Order cancellation with stock restoration
- Customer information management
- Order history and filtering

### 📊 Dashboard & Analytics
- Real-time business statistics
- Revenue tracking (total & monthly)
- Top selling products analysis
- Category distribution charts
- Recent orders overview
- Order status summary
- Interactive charts (Bar, Pie)

### 🎨 User Interface
- Modern, responsive design
- Mobile-first approach
- Beautiful animations
- Toast notifications
- Loading states
- Error handling
- Empty states
- Confirmation dialogs

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Redux Toolkit | State Management |
| RTK Query | API & Caching |
| React Router v6 | Routing |
| Tailwind CSS | Styling |
| Recharts | Data Visualization |
| Axios | HTTP Client |
| React Hot Toast | Notifications |
| Lucide React | Icons |
| date-fns | Date Formatting |
| Vite | Build Tool |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| express-validator | Input Validation |
| CORS | Cross-Origin Support |

---

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Git

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd smart-inventory
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-inventory
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. Access the application

Open browser and go to `http://localhost:5173`

**Demo Credentials:**
- Email: `admin@test.com`
- Password: `123456`
- Role: Admin

---

## 📁 Project Structure

```
smart-inventory/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Entry point
│   ├── .env                # Environment variables
│   ├── .env.example        # Example env file
│   └── package.json
│
├── frontend/                # React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── redux/          # Redux store & slices
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Main component
│   │   └── main.tsx        # Entry point
│   ├── .env                # Environment variables
│   └── package.json
│
├── screenshots/             # Application screenshots
├── README.md               # This file
└── .gitignore
```

---

## 🎯 Key Features Explained

### Real-time Stock Management
When an order is created, stock is automatically deducted. When cancelled, stock is restored.

### Role-Based Access
- **Admin**: Full access to all features
- **User**: Can view products, create orders, view own orders

### RTK Query Caching
Smart caching and automatic refetching for optimal performance.

### Responsive Design
Works perfectly on mobile, tablet, and desktop devices.

### Data Visualization
Interactive charts for business insights using Recharts.

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `PATCH /api/products/:id/stock` - Update stock (Admin)
- `GET /api/products/alerts/low-stock` - Get low stock products

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update status (Admin)
- `DELETE /api/orders/:id` - Cancel order
- `GET /api/orders/stats/summary` - Get order stats (Admin)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (Admin)

For detailed API documentation, see [Backend API Documentation](backend/API_DOCUMENTATION.md)

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

Use Postman collection: `backend/postman_collection.json`

### Frontend Testing
```bash
cd frontend
npm run test
```

Manual testing checklist in [Frontend README](frontend/README.md)

---

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. Create account on Render.com
2. Create new Web Service
3. Connect GitHub repository
4. Set environment variables
5. Deploy

**Environment Variables:**
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_production_secret
NODE_ENV=production
```

### Frontend Deployment (Vercel)

1. Push to GitHub
2. Import project on Vercel
3. Set environment variables
4. Deploy

**Environment Variables:**
```
VITE_API_BASE_URL=https://your-backend-api.com/api
```

---

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Protected routes
- CORS configuration
- Error handling middleware
- MongoDB injection prevention

---

## 📈 Performance Optimizations

- RTK Query caching
- Lazy loading routes
- Code splitting
- Optimized bundle size
- Efficient re-renders
- Debounced search
- Pagination

---

## 🐛 Known Issues & Solutions

### Issue: CORS Error
**Solution:** Update CORS settings in backend to allow frontend URL.

### Issue: MongoDB Connection Failed
**Solution:** Check MongoDB is running and MONGO_URI is correct.

### Issue: Token Expired
**Solution:** Login again to get new token.

---

## 🗺 Roadmap

### Phase 1 ✅ (Completed)
- [x] Authentication system
- [x] Product management
- [x] Order management
- [x] Dashboard with analytics

### Phase 2 🚧 (Planned)
- [ ] Product images upload
- [ ] Email notifications
- [ ] Export to Excel/PDF
- [ ] Advanced filtering
- [ ] Barcode scanning
- [ ] Multi-language support

### Phase 3 🔮 (Future)
- [ ] Payment gateway integration
- [ ] Invoice generation
- [ ] Supplier management
- [ ] Purchase orders
- [ ] Reports & insights
- [ ] Mobile app

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📝 Code of Conduct

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details on our code of conduct.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Your Name** - *Full Stack Developer* - [GitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- [React Documentation](https://react.dev)
- [Node.js](https://nodejs.org)
- [MongoDB](https://www.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Recharts](https://recharts.org)

---

## 📞 Support

For support, email your.email@example.com or open an issue on GitHub.

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐️!

---

## 📸 More Screenshots

### Mobile View
![Mobile](screenshots/mobile.png)

### Admin Panel
![Admin](screenshots/admin.png)

### Analytics
![Analytics](screenshots/analytics.png)

---

## 📊 Project Stats

- **Total Lines of Code:** ~10,000+
- **Components:** 15+
- **API Endpoints:** 20+
- **Time to Build:** 2-3 weeks
- **Dependencies:** 30+

---

Built with ❤️ by [Your Name]

Last Updated: February 2026