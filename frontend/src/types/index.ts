// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Pagination Meta
export interface PaginationMeta {
  count: number;
  total: number;
  page: number;
  pages: number;
}

// Generic API Response
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Generic Paginated Response
export interface PaginatedResponse<T> extends PaginationMeta {
  success: boolean;
  data: T[];
}

export interface AuthResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  lowStockThreshold: number;
  sku: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  lowStockThreshold?: number;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Product[];
}

// Order Types
export interface OrderProduct {
  product: {
    _id: string;
    name: string;
    sku: string;
    category?: string;
  };
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  _id: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  products: OrderProduct[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderedBy: {
    _id: string;
    name: string;
    email: string;
  };
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  products: {
    product: string;
    quantity: number;
  }[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  notes?: string;
}

export interface OrdersResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Order[];
}

// Dashboard Types
export interface DashboardStats {
  success: boolean;
  data: {
    overview: {
      totalProducts: number;
      totalOrders: number;
      totalUsers: number;
      totalRevenue: number;
      monthlyRevenue: number;
    };
    inventory: {
      lowStockCount: number;
      outOfStockCount: number;
      categoryDistribution: {
        _id: string;
        count: number;
        totalValue: number;
      }[];
    };
    orders: {
      pending: number;
      processing: number;
      delivered: number;
      recent: Order[];
    };
    topProducts: {
      _id: string;
      name: string;
      sku: string;
      totalQuantity: number;
      totalRevenue: number;
    }[];
  };
}

// API Error Type
export interface ApiError {
  success: false;
  message: string;
  errors?: {
    field: string;
    message: string;
  }[];
}