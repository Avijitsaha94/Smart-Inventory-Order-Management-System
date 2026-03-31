# 📚 API Documentation

Complete API reference for Smart Inventory & Order Management System.

**Base URL:** `http://localhost:5000/api`

---

## 🔐 Authentication

### Register User

**Endpoint:** `POST /auth/register`

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "user"  // Optional: "user" or "admin", default is "user"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Errors (400):**
- Name must be at least 2 characters
- Invalid email format
- Password must be at least 6 characters
- Role must be either "user" or "admin"

**Error Response (400):**
```json
{
  "success": false,
  "message": "email already exists"
}
```

---

### Login User

**Endpoint:** `POST /auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Get Current User

**Endpoint:** `GET /auth/me`

**Access:** Private (Requires JWT Token)

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 📦 Products

### Get All Products

**Endpoint:** `GET /products`

**Access:** Private

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search by product name | `?search=iphone` |
| `category` | string | Filter by category | `?category=Electronics` |
| `stockStatus` | string | Filter by stock status | `?stockStatus=lowStock` |
| `page` | number | Page number | `?page=1` |
| `limit` | number | Items per page | `?limit=10` |

**Categories:**
- Electronics
- Clothing
- Food
- Books
- Furniture
- Toys
- Sports
- Others

**Stock Status Values:**
- `outOfStock` - Products with 0 stock
- `lowStock` - Products at or below low stock threshold

**Example Request:**
```
GET /products?search=phone&category=Electronics&page=1&limit=10
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "total": 25,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "_id": "64abc123...",
      "name": "iPhone 15 Pro",
      "description": "Latest Apple smartphone",
      "price": 120000,
      "category": "Electronics",
      "stock": 50,
      "lowStockThreshold": 10,
      "sku": "IPHONE-15-PRO-001",
      "stockStatus": "In Stock",
      "createdBy": {
        "_id": "64def456...",
        "name": "Admin User",
        "email": "admin@test.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get Single Product

**Endpoint:** `GET /products/:id`

**Access:** Private

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "name": "iPhone 15 Pro",
    "description": "Latest Apple smartphone with A17 chip",
    "price": 120000,
    "category": "Electronics",
    "stock": 50,
    "lowStockThreshold": 10,
    "sku": "IPHONE-15-PRO-001",
    "stockStatus": "In Stock",
    "createdBy": {
      "_id": "64def456...",
      "name": "Admin User",
      "email": "admin@test.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### Create Product

**Endpoint:** `POST /products`

**Access:** Private (Admin Only)

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
```

**Request Body:**
```json
{
  "name": "iPhone 15 Pro",
  "description": "Latest Apple smartphone with A17 chip",
  "price": 120000,
  "category": "Electronics",
  "stock": 50,
  "sku": "IPHONE-15-PRO-001",
  "lowStockThreshold": 10
}
```

**Field Validations:**
- `name`: Required, min 2 characters
- `description`: Required, min 10 characters
- `price`: Required, must be >= 0
- `category`: Required, must be valid category
- `stock`: Required, must be >= 0
- `sku`: Required, must be unique
- `lowStockThreshold`: Optional, must be >= 0

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "name": "iPhone 15 Pro",
    "description": "Latest Apple smartphone with A17 chip",
    "price": 120000,
    "category": "Electronics",
    "stock": 50,
    "sku": "IPHONE-15-PRO-001",
    "lowStockThreshold": 10,
    "stockStatus": "In Stock",
    "createdBy": "64def456...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Product with this SKU already exists"
}
```

---

### Update Product

**Endpoint:** `PUT /products/:id`

**Access:** Private (Admin Only)

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
```

**Request Body:** (All fields optional)
```json
{
  "name": "iPhone 15 Pro Max",
  "price": 135000,
  "stock": 45
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "name": "iPhone 15 Pro Max",
    "description": "Latest Apple smartphone with A17 chip",
    "price": 135000,
    "category": "Electronics",
    "stock": 45,
    "sku": "IPHONE-15-PRO-001",
    "lowStockThreshold": 10,
    "stockStatus": "In Stock",
    "createdBy": "64def456...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### Delete Product

**Endpoint:** `DELETE /products/:id`

**Access:** Private (Admin Only)

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### Update Product Stock

**Endpoint:** `PATCH /products/:id/stock`

**Access:** Private (Admin Only)

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
```

**Request Body:**
```json
{
  "quantity": 10,
  "action": "add"  // or "subtract"
}
```

**Actions:**
- `add` - Increase stock
- `subtract` - Decrease stock

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "name": "iPhone 15 Pro",
    "stock": 60,  // Updated stock
    "stockStatus": "In Stock",
    ...
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Insufficient stock"
}
```

---

### Get Low Stock Products

**Endpoint:** `GET /products/alerts/low-stock`

**Access:** Private

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64abc123...",
      "name": "Product A",
      "stock": 5,
      "lowStockThreshold": 10,
      "stockStatus": "Low Stock",
      ...
    }
  ]
}
```

---

## 🛒 Orders

### Create Order

**Endpoint:** `POST /orders`

**Access:** Private

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "products": [
    {
      "product": "64abc123...",  // Product ID
      "quantity": 2
    },
    {
      "product": "64def456...",
      "quantity": 1
    }
  ],
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01712345678",
    "address": "123 Main St, Dhaka, Bangladesh"
  },
  "notes": "Please deliver before 5 PM"  // Optional
}
```

**Field Validations:**
- `products`: Required, must be non-empty array
- `products.*.product`: Required, must be valid MongoDB ID
- `products.*.quantity`: Required, must be >= 1
- `customerInfo.name`: Required
- `customerInfo.email`: Required, valid email
- `customerInfo.phone`: Required
- `customerInfo.address`: Required

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64ghi789...",
    "orderNumber": "ORD-202401-00001",
    "products": [
      {
        "product": {
          "_id": "64abc123...",
          "name": "iPhone 15 Pro",
          "sku": "IPHONE-15-PRO-001"
        },
        "name": "iPhone 15 Pro",
        "price": 120000,
        "quantity": 2,
        "subtotal": 240000,
        "_id": "64xyz..."
      }
    ],
    "totalAmount": 240000,
    "status": "pending",
    "paymentStatus": "pending",
    "orderedBy": {
      "_id": "64def456...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "customerInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "01712345678",
      "address": "123 Main St, Dhaka, Bangladesh"
    },
    "notes": "Please deliver before 5 PM",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

**Insufficient Stock (400):**
```json
{
  "success": false,
  "message": "Insufficient stock for iPhone 15 Pro. Available: 5"
}
```

**Product Not Found (404):**
```json
{
  "success": false,
  "message": "Product not found: 64abc123..."
}
```

---

### Get All Orders

**Endpoint:** `GET /orders`

**Access:** Private

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `status` | string | Filter by status | `?status=pending` |
| `page` | number | Page number | `?page=1` |
| `limit` | number | Items per page | `?limit=10` |
| `startDate` | date | Filter from date | `?startDate=2024-01-01` |
| `endDate` | date | Filter to date | `?endDate=2024-01-31` |

**Order Status Values:**
- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

**Note:** Regular users see only their orders. Admins see all orders.

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "64ghi789...",
      "orderNumber": "ORD-202401-00001",
      "products": [...],
      "totalAmount": 240000,
      "status": "pending",
      "orderedBy": {
        "_id": "64def456...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get Single Order

**Endpoint:** `GET /orders/:id`

**Access:** Private

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64ghi789...",
    "orderNumber": "ORD-202401-00001",
    "products": [
      {
        "product": {
          "_id": "64abc123...",
          "name": "iPhone 15 Pro",
          "sku": "IPHONE-15-PRO-001",
          "category": "Electronics"
        },
        "name": "iPhone 15 Pro",
        "price": 120000,
        "quantity": 2,
        "subtotal": 240000
      }
    ],
    "totalAmount": 240000,
    "status": "pending",
    "paymentStatus": "pending",
    "orderedBy": {
      "_id": "64def456...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "customerInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "01712345678",
      "address": "123 Main St, Dhaka"
    },
    "notes": "Please deliver before 5 PM",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Not authorized to access this order"
}
```

---

### Update Order Status

**Endpoint:** `PATCH /orders/:id/status`

**Access:** Private (Admin Only)

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
```

**Request Body:**
```json
{
  "status": "processing"
}
```

**Valid Status Values:**
- `pending` → `processing`
- `processing` → `shipped`
- `shipped` → `delivered`
- Any status → `cancelled`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64ghi789...",
    "orderNumber": "ORD-202401-00001",
    "status": "processing",
    ...
  }
}
```

---

### Cancel Order

**Endpoint:** `DELETE /orders/:id`

**Access:** Private (User can cancel own orders, Admin can cancel any)

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Note:** Can only cancel orders with status `pending` or `processing`. Stock will be automatically restored.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "_id": "64ghi789...",
    "orderNumber": "ORD-202401-00001",
    "status": "cancelled",
    ...
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Cannot cancel order with status: delivered"
}
```

---

### Get Order Statistics

**Endpoint:** `GET /orders/stats/summary`

**Access:** Private (Admin Only)

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalOrders": 150,
    "pendingOrders": 25,
    "processingOrders": 30,
    "completedOrders": 80,
    "totalRevenue": 5000000,
    "monthlyRevenue": [
      {
        "_id": {
          "year": 2024,
          "month": 1
        },
        "revenue": 800000,
        "count": 30
      }
    ]
  }
}
```

---

## 📊 Dashboard

### Get Dashboard Statistics

**Endpoint:** `GET /dashboard/stats`

**Access:** Private (Admin Only)

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalProducts": 250,
      "totalOrders": 150,
      "totalUsers": 45,
      "totalRevenue": 5000000,
      "monthlyRevenue": 800000
    },
    "inventory": {
      "lowStockCount": 15,
      "outOfStockCount": 5,
      "categoryDistribution": [
        {
          "_id": "Electronics",
          "count": 80,
          "totalValue": 3500000
        },
        {
          "_id": "Clothing",
          "count": 120,
          "totalValue": 1200000
        }
      ]
    },
    "orders": {
      "pending": 25,
      "processing": 30,
      "delivered": 80,
      "recent": [
        {
          "_id": "64ghi789...",
          "orderNumber": "ORD-202401-00001",
          "totalAmount": 240000,
          "status": "pending",
          "orderedBy": {
            "_id": "64def456...",
            "name": "John Doe",
            "email": "john@example.com"
          },
          "createdAt": "2024-01-15T10:30:00.000Z"
        }
      ]
    },
    "topProducts": [
      {
        "_id": "64abc123...",
        "name": "iPhone 15 Pro",
        "sku": "IPHONE-15-PRO-001",
        "totalQuantity": 45,
        "totalRevenue": 5400000
      }
    ]
  }
}
```

---

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized / Invalid Token |
| 403 | Forbidden / Not Admin |
| 404 | Not Found |
| 500 | Server Error |

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Pagination default: `page=1`, `limit=10`
- All monetary values are in smallest currency unit (e.g., paisa for BDT)
- Product stock is automatically updated on order creation/cancellation
- Order numbers are auto-generated in format: `ORD-YYYYMM-XXXXX`