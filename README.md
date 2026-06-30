# 🏪 Smart Inventory & Order Management System

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)
![Node](https://img.shields.io/badge/Node.js-18+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)

**A production-ready full-stack web application for managing inventory, orders, and business analytics.**

[Live Demo](https://smart-inventory.vercel.app) • [API Documentation](./backend/API_DOCUMENTATION.md) • [User Guide](./USER_GUIDE.md)

</div>

---

## 📸 Screenshots

| Landing Page | Dashboard | Products |
|:---:|:---:|:---:|
| ![Landing](screenshots/landing.png) | ![Dashboard](screenshots/dashboard.png) | ![Products](screenshots/products.png) |

| Orders | Users Management | Dark Mode |
|:---:|:---:|:---:|
| ![Orders](screenshots/orders.png) | ![Users](screenshots/users.png) | ![Dark](screenshots/dark.png) |

---

## ✨ Features

### 🏠 Landing Page
- Professional landing page with 8+ sections
- Hero section with dashboard preview
- Features, pricing, FAQ, CTA sections
- Responsive navbar with mobile menu
- Dark mode toggle
- Contact & About pages

### 🔐 Authentication & Authorization
- Secure JWT-based authentication (30-day expiry)
- Role-based access control (Admin / User)
- Demo login buttons (auto-fill credentials)
- Password hashing with bcrypt (10 salt rounds)
- Persistent sessions via localStorage
- Auto logout on token expiration

### 📦 Product Management
- Full CRUD operations with validation
- Real-time stock tracking
- Advanced search with 500ms debounce
- Multi-field filtering (category, stock status)
- Sorting (name, price, stock, date)
- Low stock alerts & notifications
- Skeleton loaders for better UX
- Responsive card grid (4 columns desktop)

### 🛒 Order Management
- Shopping cart-style order creation
- Real-time stock validation
- Automatic stock deduction/restoration
- Order status pipeline tracking
- Multi-field sorting (date, amount, status)
- Role-based order visibility
- Order cancellation with stock restore

### 📊 Dashboard & Analytics
- Real-time business statistics
- Revenue tracking (total & monthly)
- Interactive Bar & Pie charts (Recharts)
- Top selling products analysis
- Order status summary cards
- Recent orders with quick navigation

### 👥 Users Management (Admin)
- View all registered users
- Search by name or email
- Filter by role (Admin/User)
- Column-based sorting
- Role change (promote/demote)
- User deletion with confirmation
- User statistics overview

### 👤 Profile Management
- Editable profile information
- Password change with strength indicator
- Password visibility toggle
- Real-time save confirmation
- Avatar with initials

### 🎨 UI/UX
- Full Light & Dark mode with system preference
- Smooth transitions (200ms)
- Mobile-first responsive design
- Skeleton loaders throughout
- Toast notifications (success/error)
- Professional 404 page
- Loading states on all async actions

### 🏗️ Code Quality
- 7 custom React hooks
- TypeScript throughout frontend
- Lazy loading with React.Suspense
- Centralized error handling
- No console logs in production
- Code splitting (vendor, redux, charts)

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18 | UI Framework |
| TypeScript | 5 | Type Safety |
| Redux Toolkit | 2.x | State Management |
| RTK Query | 2.x | API & Caching |
| React Router | v6 | Client Routing |
| Tailwind CSS | v4 | Styling |
| Recharts | 2.x | Data Visualization |
| Axios | 1.x | HTTP Client |
| React Hot Toast | 2.x | Notifications |
| Lucide React | 0.x | Icons |
| date-fns | 3.x | Date Formatting |
| Vite | 6.x | Build Tool |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Runtime |
| Express.js | 4.x | Web Framework |
| MongoDB | 7.x | Database |
| Mongoose | 8.x | ODM |
| JWT | 9.x | Authentication |
| bcryptjs | 2.x | Password Hashing |
| express-validator | 7.x | Input Validation |
| CORS | 2.x | Cross-Origin |
| dotenv | 16.x | Environment |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend Hosting |
| Render | Backend Hosting |
| MongoDB Atlas | Database Hosting |
| GitHub | Version Control |

---

## 📁 Project Structure

```
smart-inventory/
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 config/
│   │   │   ├── db.js               # MongoDB connection
│   │   │   └── generateToken.js    # JWT generator
│   │   ├── 📁 controllers/
│   │   │   ├── authController.js   # Register, Login, Profile
│   │   │   ├── productController.js # Product CRUD
│   │   │   ├── orderController.js  # Order management
│   │   │   ├── dashboardController.js # Analytics
│   │   │   └── userController.js   # User management
│   │   ├── 📁 middleware/
│   │   │   ├── authMiddleware.js   # JWT + Role check
│   │   │   ├── errorMiddleware.js  # Global error handler
│   │   │   ├── asyncHandler.js     # Async wrapper
│   │   │   └── validators.js       # Input validation rules
│   │   ├── 📁 models/
│   │   │   ├── User.js             # User schema + bcrypt
│   │   │   ├── Product.js          # Product schema
│   │   │   └── Order.js            # Order schema
│   │   ├── 📁 routes/
│   │   │   ├── authRoutes.js       # /api/auth/*
│   │   │   ├── productRoutes.js    # /api/products/*
│   │   │   ├── orderRoutes.js      # /api/orders/*
│   │   │   ├── dashboardRoutes.js  # /api/dashboard/*
│   │   │   └── userRoutes.js       # /api/users/*
│   │   ├── 📁 utils/
│   │   │   └── logger.js           # Dev-only logger
│   │   └── server.js               # App entry point
│   ├── .env                        # Local env vars
│   ├── .env.example                # Env template
│   ├── .gitignore
│   ├── package.json
│   ├── vercel.json                 # Vercel config
│   └── README.md
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 layout/
│   │   │   │   └── Layout.tsx      # Sidebar + Header + Dropdown
│   │   │   └── 📁 shared/
│   │   │       └── ThemeToggle.tsx # Dark/Light toggle button
│   │   ├── 📁 context/
│   │   │   └── ThemeContext.tsx    # Theme provider
│   │   ├── 📁 hooks/
│   │   │   ├── index.ts            # Central export
│   │   │   ├── useDebounce.ts      # Search debouncing
│   │   │   ├── useAuth.ts          # Auth state + actions
│   │   │   ├── useLocalStorage.ts  # LocalStorage sync
│   │   │   ├── usePagination.ts    # URL pagination
│   │   │   ├── useSort.ts          # URL sorting
│   │   │   ├── useToast.ts         # Consistent toasts
│   │   │   └── useWindowSize.ts    # Responsive breakpoints
│   │   ├── 📁 pages/
│   │   │   ├── 📁 auth/
│   │   │   │   ├── Login.tsx       # Demo login + dark mode
│   │   │   │   └── Register.tsx    # Role selection
│   │   │   ├── 📁 products/
│   │   │   │   ├── ProductList.tsx # Grid + search + sort
│   │   │   │   ├── ProductForm.tsx # Create/Edit form
│   │   │   │   └── ProductDetail.tsx # Full detail view
│   │   │   ├── 📁 orders/
│   │   │   │   ├── OrderList.tsx   # Table + sort + filter
│   │   │   │   ├── CreateOrder.tsx # Cart-style order
│   │   │   │   └── OrderDetail.tsx # Status management
│   │   │   ├── 📁 admin/
│   │   │   │   └── UsersManagement.tsx # Full user CRUD
│   │   │   ├── LandingPage.tsx     # 8+ sections
│   │   │   ├── Dashboard.tsx       # Charts + real data
│   │   │   ├── Profile.tsx         # Edit + change password
│   │   │   ├── About.tsx           # Developer info
│   │   │   ├── Contact.tsx         # Contact form
│   │   │   └── NotFound.tsx        # Custom 404
│   │   ├── 📁 redux/
│   │   │   ├── store.ts            # Store config
│   │   │   ├── 📁 slices/
│   │   │   │   └── authSlice.ts    # Auth state
│   │   │   └── 📁 api/
│   │   │       ├── productApi.ts   # RTK Query products
│   │   │       ├── orderApi.ts     # RTK Query orders
│   │   │       ├── dashboardApi.ts # RTK Query dashboard
│   │   │       ├── profileApi.ts   # RTK Query profile
│   │   │       └── userApi.ts      # RTK Query users
│   │   ├── 📁 types/
│   │   │   └── index.ts            # All TS interfaces
│   │   ├── 📁 utils/
│   │   │   └── axios.ts            # Axios + interceptors
│   │   ├── App.tsx                 # Routes + lazy loading
│   │   ├── main.tsx                # Providers entry
│   │   └── index.css               # Tailwind v4 + themes
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts              # Terser + code splitting
│   └── README.md
│
├── 📁 screenshots/
├── .gitignore
├── package.json                    # Root (concurrently)
├── README.md                       # This file
├── USER_GUIDE.md
└── LICENSE
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install
```bash
git clone https://github.com/Avijitsaha94/smart-inventory.git
cd smart-inventory
npm run install:all
```

### 2. Configure Environment

**Backend** — create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-inventory
JWT_SECRET=your_super_secret_key_min_32_chars
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend** — create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Start Development
```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| API Health | http://localhost:5000/health |

### 4. Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@test.com | 123456 |
| **User** | user@test.com | 123456 |

---

## 🔑 Environment Variables

### Backend
| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 5000) |
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | JWT signing secret (min 32 chars) |
| `NODE_ENV` | No | `development` or `production` |
| `FRONTEND_URL` | No | Frontend URL for CORS |

### Frontend
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | ✅ | Backend API base URL |

---

## 📊 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update profile | Private |
| PUT | `/api/auth/change-password` | Change password | Private |

### 📦 Products
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all (search, filter, sort, page) | Private |
| GET | `/api/products/:id` | Get single product | Private |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |
| PATCH | `/api/products/:id/stock` | Update stock | Admin |
| GET | `/api/products/alerts/low-stock` | Low stock list | Private |

### 🛒 Orders
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/orders` | Get orders (filter, sort, page) | Private |
| GET | `/api/orders/:id` | Get single order | Private |
| POST | `/api/orders` | Create order | Private |
| PATCH | `/api/orders/:id/status` | Update status | Admin |
| DELETE | `/api/orders/:id` | Cancel order | Private |
| GET | `/api/orders/stats/summary` | Order statistics | Admin |

### 👥 Users (Admin)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/stats` | User statistics | Admin |
| GET | `/api/users/:id` | Get single user | Admin |
| PATCH | `/api/users/:id/role` | Change user role | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |

### 📊 Dashboard
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard/stats` | Full analytics | Admin |

---

## 🎯 Custom Hooks

| Hook | Purpose | Usage |
|------|---------|-------|
| `useDebounce` | Delay value update | Search inputs |
| `useAuth` | Auth state + actions | Any component |
| `useLocalStorage` | Persist state | Theme, settings |
| `usePagination` | URL-based pagination | List pages |
| `useSort` | URL-based sorting | Tables, grids |
| `useToast` | Consistent notifications | Form submissions |
| `useWindowSize` | Responsive breakpoints | Layout decisions |

---

## 🚀 Deployment

### Backend → Render

1. Push to GitHub
2. Create Web Service on [Render](https://render.com)
3. Configure:
   ```
   Build Command: npm install
   Start Command: npm start
   Root Directory: backend
   ```
4. Add environment variables
5. Deploy ✅

### Frontend → Vercel

1. Import repo on [Vercel](https://vercel.com)
2. Configure:
   ```
   Framework: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```
3. Add `VITE_API_BASE_URL` environment variable
4. Deploy ✅

### Update Backend CORS
After deploying frontend, add `FRONTEND_URL` in Render:
```
FRONTEND_URL=https://your-app.vercel.app
```

---

## 🧪 Testing

### Run Manual Tests
Use the included Postman collection:
```
backend/postman_collection.json
```

### Test Checklist
- [ ] Register + Login (both roles)
- [ ] Create/Edit/Delete products
- [ ] Create order → verify stock deduction
- [ ] Cancel order → verify stock restoration
- [ ] Dashboard analytics loading
- [ ] Dark mode toggle persistence
- [ ] Profile update + password change
- [ ] Admin user management
- [ ] Responsive on mobile/tablet/desktop
- [ ] 404 page for invalid routes

---

## 📈 Performance

| Metric | Value |
|--------|-------|
| Lighthouse Score | 90+ |
| First Load JS | ~800KB |
| Vendor Bundle | ~400KB |
| API Caching | RTK Query (60s) |
| Search Debounce | 500ms |
| Image Optimization | Lazy loading |

---

## 🔒 Security

- ✅ JWT tokens with expiry
- ✅ bcrypt password hashing (10 rounds)
- ✅ Input validation (express-validator)
- ✅ Role-based access control
- ✅ MongoDB injection prevention (Mongoose)
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ No sensitive data in responses
- ✅ No console logs in production

---

## 🗺 Roadmap

### v1.1 (Planned)
- [ ] Product image upload (Cloudinary)
- [ ] Email notifications (Nodemailer)
- [ ] Export to Excel/PDF
- [ ] Barcode scanner support

### v1.2 (Future)
- [ ] Payment gateway (SSLCommerz)
- [ ] Invoice PDF generation
- [ ] Multi-warehouse support
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Commit Convention
```
feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code restructure
test: adding tests
chore: maintenance
```

---

## 👨‍💻 Developer

<div align="center">

**Avijit Saha**
*Full Stack Developer*

[![GitHub](https://img.shields.io/badge/GitHub-Avijitsaha94-black?logo=github)](https://github.com/Avijitsaha94)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-avijitsh94-blue?logo=linkedin)](https://linkedin.com/in/avijitsh94)

*Narayanganj, Dhaka, Bangladesh*

</div>

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

## ⭐ Support

If this project helped you, please consider giving it a ⭐ on GitHub!

---

<div align="center">
Built with ❤️ using React + TypeScript + Node.js + MongoDB
</div>