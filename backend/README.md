# 🏪 Smart Inventory & Order Management System - Backend

A complete REST API for managing inventory, orders, and users with role-based authentication.

## 🚀 Features

### 👤 Authentication & Authorization
- User registration and login with JWT
- Password hashing with bcrypt
- Role-based access control (Admin/User)
- Protected routes with middleware

### 📦 Inventory Management
- Full CRUD operations for products
- Stock management (add/subtract)
- Low stock alerts
- Product categorization
- Search and filter functionality
- Pagination support

### 🛒 Order Management
- Create orders with multiple products
- Automatic stock deduction
- Order status tracking (pending, processing, shipped, delivered, cancelled)
- Order cancellation with stock restoration
- Order history for users
- Order statistics and analytics

### 📊 Dashboard & Analytics
- Total products, orders, and revenue
- Monthly revenue tracking
- Top selling products
- Low stock alerts
- Category-wise distribution
- Recent orders overview

### 🔒 Security & Validation
- Input validation with express-validator
- Centralized error handling
- MongoDB injection protection
- CORS enabled for frontend integration

---

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator
- **Security:** bcryptjs, CORS

---

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd smart-inventory/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create .env file
Create a `.env` file in the backend directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-inventory
JWT_SECRET=your_super_secret_key_change_this_in_production
NODE_ENV=development
```

### 4. Start MongoDB
**Local MongoDB:**
```bash
mongod
```

**OR use MongoDB Atlas** (cloud) - update MONGO_URI in .env

### 5. Run the server
**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:5000`

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                 # Database connection
│   │   └── generateToken.js      # JWT token generator
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── productController.js  # Product CRUD logic
│   │   ├── orderController.js    # Order management logic
│   │   └── dashboardController.js # Analytics logic
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & role check
│   │   ├── errorMiddleware.js    # Centralized error handling
│   │   ├── asyncHandler.js       # Async error wrapper
│   │   └── validators.js         # Input validation rules
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Product.js            # Product schema
│   │   └── Order.js              # Order schema
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   ├── productRoutes.js      # Product endpoints
│   │   ├── orderRoutes.js        # Order endpoints
│   │   └── dashboardRoutes.js    # Dashboard endpoints
│   └── server.js                 # Entry point
├── .env                          # Environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/smart-inventory` |
| `JWT_SECRET` | Secret key for JWT | `your_secret_key` |
| `NODE_ENV` | Environment mode | `development` or `production` |

---

## 🎯 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/me` | Get current user | Private |

### Product Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/products` | Get all products (with filters) | Private |
| GET | `/products/:id` | Get single product | Private |
| POST | `/products` | Create product | Admin |
| PUT | `/products/:id` | Update product | Admin |
| DELETE | `/products/:id` | Delete product | Admin |
| PATCH | `/products/:id/stock` | Update stock | Admin |
| GET | `/products/alerts/low-stock` | Get low stock products | Private |

### Order Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/orders` | Get all orders | Private |
| GET | `/orders/:id` | Get single order | Private |
| POST | `/orders` | Create order | Private |
| PATCH | `/orders/:id/status` | Update order status | Admin |
| DELETE | `/orders/:id` | Cancel order | Private |
| GET | `/orders/stats/summary` | Get order statistics | Admin |

### Dashboard Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/dashboard/stats` | Get dashboard analytics | Admin |

---

## 📖 API Usage Examples

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed examples with request/response formats.

---

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Get the token from login/register response and include it in subsequent requests.

---

## 👥 User Roles

- **User**: Can view products, create orders, view own orders
- **Admin**: Full access to all endpoints including product/order management

---

## 🐛 Error Handling

The API uses centralized error handling with consistent response format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here"
}
```

**Validation Error:**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

---

## 🧪 Testing

Use Postman, Thunder Client, or any API testing tool.

**Test Account:**
- Email: `admin@test.com`
- Password: `123456`
- Role: `admin`

---

## 🚀 Deployment

### Deploy to Render/Railway

1. Create account on Render.com or Railway.app
2. Create new Web Service
3. Connect your GitHub repository
4. Set environment variables
5. Deploy!

### Environment Variables for Production

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_strong_secret_key
NODE_ENV=production
```

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

Your Name - [GitHub Profile](https://github.com/yourusername)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## ⭐ Show your support

Give a ⭐️ if this project helped you!