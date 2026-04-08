/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Search,
  Package,
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { useGetProductsQuery } from '../../redux/api/productApi';
import { useCreateOrderMutation } from '../../redux/api/orderApi';
import type { Product } from '../../types';
import toast from 'react-hot-toast';

interface CartItem {
  product: Product;
  quantity: number;
}

function CreateOrder() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [notes, setNotes] = useState('');

  // API calls
  const { data: productsData, isLoading } = useGetProductsQuery({
    search: searchTerm,
    limit: 50,
  });
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();

  // Add to cart
  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product._id === product._id);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error('Not enough stock available');
        return;
      }
      updateQuantity(product._id, existingItem.quantity + 1);
    } else {
      if (product.stock === 0) {
        toast.error('Product out of stock');
        return;
      }
      setCart([...cart, { product, quantity: 1 }]);
      toast.success('Added to cart');
    }
  };

  // Update quantity
  const updateQuantity = (productId: string, newQuantity: number) => {
    const item = cart.find((item) => item.product._id === productId);
    if (!item) return;

    if (newQuantity > item.product.stock) {
      toast.error('Not enough stock available');
      return;
    }

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(
      cart.map((item) =>
        item.product._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product._id !== productId));
    toast.success('Removed from cart');
  };

  // Calculate total
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      const orderData = {
        products: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        customerInfo,
        notes: notes || undefined,
      };

      await createOrder(orderData).unwrap();
      toast.success('Order created successfully! 🎉');
      navigate('/orders');
    } catch (error: any) {
      const errorMessage = error.data?.message || 'Failed to create order';
      toast.error(errorMessage);
    }
  };

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Orders</span>
          </button>

          <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
          <p className="text-gray-600 mt-1">
            Select products and fill customer information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Product Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-gray-500" />
                <h2 className="font-semibold text-gray-900">Search Products</h2>
              </div>
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
              />
            </div>

            {/* Products Grid */}
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">
                Available Products
              </h2>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block w-6 h-6 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-2 text-gray-600 text-sm">Loading products...</p>
                </div>
              ) : productsData && productsData.data.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {productsData.data.map((product) => (
                    <div
                      key={product._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm mb-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2">
                            {product.category} • {product.sku}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-gray-900">
                            ৳{product.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Stock: {product.stock}
                          </p>
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className="btn btn-primary btn-sm flex items-center gap-1 disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No products found</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Cart & Customer Info */}
          <div className="space-y-6">
            {/* Cart */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-gray-500" />
                <h2 className="font-semibold text-gray-900">
                  Cart ({cart.length})
                </h2>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.product._id}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            ৳{item.product.price.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="ml-auto font-semibold text-gray-900">
                          ৳{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total:</span>
                    <span>৳{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Info Form */}
            <form onSubmit={handleSubmit} className="card">
              <h2 className="font-semibold text-gray-900 mb-4">
                Customer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Name *</label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Email *</label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, email: e.target.value })
                    }
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Phone *</label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, phone: e.target.value })
                    }
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Address *</label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        address: e.target.value,
                      })
                    }
                    className="input min-h-[80px]"
                    required
                  />
                </div>

                <div>
                  <label className="label">Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="input min-h-[60px]"
                    placeholder="Special instructions..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreating || cart.length === 0}
                  className="w-full btn btn-primary disabled:opacity-50"
                >
                  {isCreating ? 'Creating Order...' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateOrder;