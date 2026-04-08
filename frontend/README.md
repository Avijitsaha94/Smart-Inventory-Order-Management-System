# 🏪 Smart Inventory & Order Management System - Frontend

A modern, responsive frontend application for managing inventory, orders, and analytics built with React, TypeScript, and Redux Toolkit.

## 🌟 Features

### 🔐 Authentication
- User registration and login
- JWT token-based authentication
- Role-based access control (Admin/User)
- Persistent sessions with localStorage
- Auto logout on token expiration

### 📦 Product Management
- View products in beautiful grid layout
- Advanced search and filtering
  - Search by name
  - Filter by category
  - Filter by stock status
- Create, edit, and delete products (Admin only)
- Detailed product view
- Stock status indicators (In Stock, Low Stock, Out of Stock)
- Real-time low stock alerts
- Pagination for large product lists

### 🛒 Order Management
- Shopping cart-style order creation
- Product search in order creation
- Real-time stock validation
- Customer information management
- Order list with status filters
- Detailed order view
- Order status tracking
- Cancel orders (restores stock)
- Admin order status updates

### 📊 Dashboard & Analytics
- Real-time statistics overview
- Interactive charts (Recharts)
  - Top selling products (Bar chart)
  - Category distribution (Pie chart)
- Order status summary
- Recent orders list
- Revenue tracking
- Quick action shortcuts

### 🎨 UI/UX Features
- Responsive design (Mobile, Tablet, Desktop)
- Beautiful Tailwind CSS styling
- Smooth animations and transitions
- Toast notifications
- Loading states
- Error handling
- Empty states
- Confirmation dialogs

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18 |
| **Language** | TypeScript |
| **State Management** | Redux Toolkit + RTK Query |
| **Routing** | React Router v6 |
| **Styling** | Tailwind CSS |
| **Charts** | Recharts |
| **HTTP Client** | Axios |
| **Notifications** | React Hot Toast |
| **Icons** | Lucide React |
| **Date Handling** | date-fns |
| **Build Tool** | Vite |

---

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running (see backend README)

---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd smart-inventory/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment configuration
Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Start development server
```bash
npm run dev
```

The app will run on `http://localhost:5173`

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── layout/          # Layout components
│   │   │   └── Layout.tsx   # Main layout with sidebar
│   │   ├── shared/          # Shared components
│   │   └── ui/              # UI components
│   │
│   ├── pages/               # Page components
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── products/
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   └── ProductDetail.tsx
│   │   ├── orders/
│   │   │   ├── OrderList.tsx
│   │   │   ├── CreateOrder.tsx
│   │   │   └── OrderDetail.tsx
│   │   └── Dashboard.tsx
│   │
│   ├── redux/               # Redux configuration
│   │   ├── store.ts         # Store configuration
│   │   ├── slices/          # Redux slices
│   │   │   └── authSlice.ts
│   │   └── api/             # RTK Query APIs
│   │       ├── productApi.ts
│   │       ├── orderApi.ts
│   │       └── dashboardApi.ts
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   │
│   ├── utils/               # Utility functions
│   │   └── axios.ts         # Axios configuration
│   │
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
│
├── public/                  # Static assets
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 🎯 Key Features Explained

### State Management with Redux Toolkit

The app uses Redux Toolkit for state management with the following structure:

**Auth Slice** (`authSlice.ts`)
- Manages authentication state
- Stores user info and JWT token
- Syncs with localStorage

**RTK Query APIs**
- `productApi`: Product CRUD operations
- `orderApi`: Order management
- `dashboardApi`: Analytics data
- Auto-caching and refetching
- Optimistic updates

### Routing with React Router

**Public Routes:**
- `/login` - Login page
- `/register` - Registration page

**Protected Routes** (require authentication):
- `/dashboard` - Dashboard with analytics
- `/products` - Product list
- `/products/create` - Add new product (Admin)
- `/products/:id` - Product details
- `/products/:id/edit` - Edit product (Admin)
- `/orders` - Order list
- `/orders/create` - Create new order
- `/orders/:id` - Order details

### Authentication Flow

1. User logs in → JWT token received
2. Token stored in localStorage
3. Token added to all API requests via Axios interceptor
4. On 401 error → Auto logout and redirect to login
5. Protected routes check authentication state

### API Integration

All API calls use RTK Query with these benefits:
- Automatic loading states
- Error handling
- Cache management
- Optimistic updates
- Auto refetching

Example:
```typescript
// Using RTK Query hook
const { data, isLoading, error } = useGetProductsQuery({
  page: 1,
  limit: 10,
  search: 'laptop'
});
```

---

## 🔑 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 📱 Responsive Design

The application is fully responsive across all devices:

### Mobile (< 768px)
- Hamburger menu for navigation
- Card-based layouts
- Touch-friendly buttons
- Optimized forms

### Tablet (768px - 1024px)
- Collapsible sidebar
- Grid layouts
- Hybrid views

### Desktop (> 1024px)
- Full sidebar navigation
- Table layouts for lists
- Multi-column grids
- Expanded charts

---

## 🎨 Styling Guidelines

The app uses Tailwind CSS with custom configuration:

### Color Palette
```javascript
primary: {
  50: '#eff6ff',
  100: '#dbeafe',
  500: '#3b82f6',  // Main primary color
  600: '#2563eb',
  700: '#1d4ed8',
}
```

### Custom CSS Classes
```css
.btn - Base button styles
.btn-primary - Primary button (blue)
.btn-secondary - Secondary button (gray)
.btn-danger - Danger button (red)
.card - Card container
.input - Form input
.label - Form label
```

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Register new user
- [ ] Logout functionality
- [ ] Token persistence on refresh

**Products:**
- [ ] View product list
- [ ] Search products
- [ ] Filter by category/stock
- [ ] Create product (Admin)
- [ ] Edit product (Admin)
- [ ] Delete product (Admin)
- [ ] View product details

**Orders:**
- [ ] Create order with cart
- [ ] View order list
- [ ] Filter orders by status
- [ ] View order details
- [ ] Cancel order
- [ ] Update order status (Admin)

**Dashboard:**
- [ ] View stats
- [ ] View charts
- [ ] View recent orders
- [ ] Quick actions work

**Responsive:**
- [ ] Mobile view works
- [ ] Tablet view works
- [ ] Desktop view works

---

## 🚀 Build for Production

### Build the app
```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview production build
```bash
npm run preview
```

### Build output
- Optimized JavaScript bundles
- Minified CSS
- Tree-shaken code
- Source maps (optional)

---

## 📦 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Set environment variables
5. Deploy!

**Environment Variables on Vercel:**
```
VITE_API_BASE_URL=https://your-backend-api.com/api
```

### Netlify

1. Build the project: `npm run build`
2. Drag `dist/` folder to Netlify
3. Configure environment variables
4. Done!

### Other Platforms

The build output in `dist/` can be deployed to:
- AWS S3 + CloudFront
- Firebase Hosting
- GitHub Pages
- Any static hosting service

---

## 🔧 Development Tips

### VS Code Extensions (Recommended)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets

### Hot Module Replacement (HMR)
Vite provides instant HMR. Changes reflect immediately without full page reload.

### Redux DevTools
Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools) to debug state changes.

### Type Checking
```bash
npm run type-check
```

---

## 🐛 Troubleshooting

### Issue: API calls fail with CORS error
**Solution:** Make sure backend has CORS enabled for your frontend URL.

### Issue: Token expires too quickly
**Solution:** Check JWT expiration time in backend (currently 30 days).

### Issue: Charts not rendering
**Solution:** Make sure Recharts is installed: `npm install recharts`

### Issue: Styles not applying
**Solution:** Make sure Tailwind is configured properly and `index.css` is imported.

### Issue: Images not loading
**Solution:** Place images in `public/` folder and reference as `/image.png`

---

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)

### API Documentation
See `backend/API_DOCUMENTATION.md` for complete API reference.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

---

## 📝 Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable names
- Comment complex logic
- Use Prettier for formatting

---

## 🔐 Security Best Practices

- Never commit `.env` files
- Store sensitive data in environment variables
- Validate all user inputs
- Use HTTPS in production
- Keep dependencies updated
- Implement proper error handling

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

Your Name - [GitHub Profile](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Backend API built with Node.js + Express
- UI inspired by modern SaaS applications
- Icons from Lucide React
- Charts powered by Recharts

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Email: your.email@example.com

---

## 🎉 Happy Coding!

Built with ❤️ using React + TypeScript + Redux Toolkit