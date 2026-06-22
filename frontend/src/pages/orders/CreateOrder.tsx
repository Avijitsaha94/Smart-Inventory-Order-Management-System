/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ShoppingCart, Plus, Minus, Trash2, Search, Package,
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { useGetProductsQuery } from '../../redux/api/productApi';
import { useCreateOrderMutation } from '../../redux/api/orderApi';
import type { Product } from '../../types';
import toast from 'react-hot-toast';

interface CartItem { product: Product; quantity: number; }

const inputClass = 'input dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400';
const labelClass = 'label dark:text-slate-300';

function CreateOrder() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '', email: '', phone: '', address: '',
  });
  const [notes, setNotes] = useState('');

  const { data: productsData, isLoading } = useGetProductsQuery({ search: searchTerm, limit: 50 });
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();

  const addToCart = (product: Product) => {
    const existing = cart.find((i) => i.product._id === product._id);
    if (existing) {
      if (existing.quantity >= product.stock) { toast.error('Not enough stock available'); return; }
      setCart(cart.map((i) => i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      if (product.stock === 0) { toast.error('Product out of stock'); return; }
      setCart([...cart, { product, quantity: 1 }]);
      toast.success('Added to cart');
    }
  };

  const updateQuantity = (productId: string, qty: number) => {
    const item = cart.find((i) => i.product._id === productId);
    if (!item) return;
    if (qty > item.product.stock) { toast.error('Not enough stock'); return; }
    if (qty <= 0) { removeFromCart(productId); return; }
    setCart(cart.map((i) => i.product._id === productId ? { ...i, quantity: qty } : i));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((i) => i.product._id !== productId));
    toast.success('Removed from cart');
  };

  const totalAmount = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) { toast.error('Cart is empty'); return; }
    try {
      await createOrder({
        products: cart.map((i) => ({ product: i.product._id, quantity: i.quantity })),
        customerInfo,
        notes: notes || undefined,
      }).unwrap();
      toast.success('Order created successfully! 🎉');
      navigate('/orders');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to create order');
    }
  };

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-gray-600 dark:text-slate-400
                       hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Orders</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Order</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Select products and fill customer information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Product Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <div className="card dark:bg-slate-800 dark:border dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                <h2 className="font-semibold text-gray-900 dark:text-white">Search Products</h2>
              </div>
              <input
                type="text" placeholder="Search by product name..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Products Grid */}
            <div className="card dark:bg-slate-800 dark:border dark:border-slate-700">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Available Products</h2>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block w-6 h-6 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  <p className="mt-2 text-gray-500 dark:text-slate-400 text-sm">Loading products...</p>
                </div>
              ) : productsData && productsData.data.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                  {productsData.data.map((product) => (
                    <div
                      key={product._id}
                      className="border border-gray-200 dark:border-slate-600
                                 bg-gray-50 dark:bg-slate-700/50
                                 rounded-xl p-4 hover:border-primary-400 transition-colors"
                    >
                      <div className="mb-3">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-0.5">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-slate-400">
                          {product.category} • {product.sku}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-base font-bold text-gray-900 dark:text-white">
                            ৳{product.price.toLocaleString()}
                          </p>
                          <p className={`text-xs font-medium ${
                            product.stock === 0 ? 'text-red-500' :
                            product.stock <= 10 ? 'text-orange-500' : 'text-green-500'
                          }`}>
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
                  <Package className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-slate-400 text-sm">No products found</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Cart + Customer Info */}
          <div className="space-y-6">
            {/* Cart */}
            <div className="card dark:bg-slate-800 dark:border dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Cart ({cart.length})
                </h2>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-slate-400 text-sm">Cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.product._id}
                      className="border border-gray-200 dark:border-slate-600
                                 bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            ৳{item.product.price.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center
                                     bg-gray-200 dark:bg-slate-600
                                     hover:bg-gray-300 dark:hover:bg-slate-500
                                     rounded-lg transition-colors"
                        >
                          <Minus className="w-3 h-3 text-gray-700 dark:text-slate-200" />
                        </button>
                        <span className="w-10 text-center font-semibold text-gray-900 dark:text-white text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center
                                     bg-gray-200 dark:bg-slate-600
                                     hover:bg-gray-300 dark:hover:bg-slate-500
                                     rounded-lg transition-colors"
                        >
                          <Plus className="w-3 h-3 text-gray-700 dark:text-slate-200" />
                        </button>
                        <span className="ml-auto font-bold text-gray-900 dark:text-white text-sm">
                          ৳{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900 dark:text-white">Total:</span>
                    <span className="text-xl font-bold text-primary-600">
                      ৳{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Info */}
            <form onSubmit={handleSubmit}
              className="card dark:bg-slate-800 dark:border dark:border-slate-700">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                Customer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Name *</label>
                  <input type="text" value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Phone *</label>
                  <input type="tel" value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Address *</label>
                  <textarea value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className={`${inputClass} min-h-[80px]`} required />
                </div>
                <div>
                  <label className={labelClass}>Notes (Optional)</label>
                  <textarea value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={`${inputClass} min-h-[60px]`}
                    placeholder="Special instructions..." />
                </div>
                <button
                  type="submit"
                  disabled={isCreating || cart.length === 0}
                  className="w-full btn btn-primary flex items-center justify-center gap-2
                             disabled:opacity-50 disabled:cursor-not-allowed py-3"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Order...</span>
                    </>
                  ) : (
                    <span>Create Order</span>
                  )}
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