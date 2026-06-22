/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowLeft, Package, User, Phone, Mail,
  MapPin, Calendar, AlertCircle, X, FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import Layout from '../../components/layout/Layout';
import {
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} from '../../redux/api/orderApi';
import type { RootState } from '../../redux/store';
import toast from 'react-hot-toast';

const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400',
  shipped:    'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400',
  delivered:  'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400',
  cancelled:  'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400',
};

function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const { data, isLoading, error } = useGetOrderQuery(id!);
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [cancelOrder] = useCancelOrderMutation();

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateStatus({ id: id!, status: newStatus }).unwrap();
      toast.success('Order status updated successfully');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to update status');
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order? Stock will be restored.')) return;
    try {
      await cancelOrder(id!).unwrap();
      toast.success('Order cancelled successfully');
      navigate('/orders');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to cancel order');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="card dark:bg-slate-800 h-48" />
            </div>
            <div className="space-y-4">
              <div className="card dark:bg-slate-800 h-36" />
              <div className="card dark:bg-slate-800 h-48" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !data?.data) {
    return (
      <Layout>
        <div className="card dark:bg-slate-800 dark:border dark:border-slate-700
                        bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 text-red-800 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p>Order not found or failed to load.</p>
          </div>
          <button onClick={() => navigate('/orders')} className="mt-4 btn btn-secondary">
            Back to Orders
          </button>
        </div>
      </Layout>
    );
  }

  const order = data.data;
  const canCancel = ['pending', 'processing'].includes(order.status);
  const canUpdateStatus = user?.role === 'admin' && order.status !== 'cancelled';

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
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

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {order.orderNumber}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${STATUS_STYLES[order.status]}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className="text-sm text-gray-500 dark:text-slate-400">
                  {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
            </div>

            {canCancel && (
              <button
                onClick={handleCancel}
                className="btn btn-danger flex items-center gap-2 w-fit"
              >
                <X className="w-4 h-4" />
                <span>Cancel Order</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products */}
            <div className="card dark:bg-slate-800 dark:border dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                <span>Order Items</span>
              </h2>
              <div className="space-y-3">
                {order.products.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4
                               bg-gray-50 dark:bg-slate-700/50 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/40
                                    rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                        SKU: {item.product.sku}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm flex-wrap">
                        <span className="text-gray-600 dark:text-slate-400">
                          Qty: <span className="font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
                        </span>
                        <span className="text-gray-600 dark:text-slate-400">
                          Price: <span className="font-semibold text-gray-900 dark:text-white">
                            ৳{item.price.toLocaleString()}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900 dark:text-white">
                        ৳{item.subtotal.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total Amount:
                  </span>
                  <span className="text-2xl font-bold text-primary-600">
                    ৳{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="card dark:bg-slate-800 dark:border dark:border-slate-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span>Order Notes</span>
                </h2>
                <p className="text-gray-700 dark:text-slate-300 whitespace-pre-wrap">
                  {order.notes}
                </p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="card dark:bg-slate-800 dark:border dark:border-slate-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>Customer Information</span>
              </h3>
              <div className="space-y-3">
                {[
                  { icon: User, label: 'Name', value: order.customerInfo.name },
                  { icon: Mail, label: 'Email', value: order.customerInfo.email },
                  { icon: Phone, label: 'Phone', value: order.customerInfo.phone },
                  { icon: MapPin, label: 'Address', value: order.customerInfo.address },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-gray-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{label}</p>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Update (Admin) */}
            {canUpdateStatus && (
              <div className="card dark:bg-slate-800 dark:border dark:border-slate-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Update Status
                </h3>
                <div className="space-y-2">
                  {['pending', 'processing', 'shipped', 'delivered'].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusUpdate(s)}
                      disabled={order.status === s}
                      className={`w-full text-left px-4 py-2.5 rounded-xl font-medium transition-colors ${
                        order.status === s
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 cursor-default'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Order Meta */}
            <div className="card dark:bg-slate-800 dark:border dark:border-slate-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Details</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Order Number', value: order.orderNumber },
                  {
                    label: 'Payment Status',
                    value: order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1),
                    color: order.paymentStatus === 'paid' ? 'text-green-600' :
                           order.paymentStatus === 'failed' ? 'text-red-600' : '',
                  },
                  { label: 'Ordered By', value: order.orderedBy.name },
                  { label: 'Created', value: format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm') },
                  { label: 'Updated', value: format(new Date(order.updatedAt), 'MMM dd, yyyy HH:mm') },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between gap-2">
                    <span className="text-gray-500 dark:text-slate-400 flex-shrink-0">{label}:</span>
                    <span className={`font-medium text-gray-900 dark:text-white text-right ${color || ''}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar Icon Note */}
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>All times shown in local timezone</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OrderDetail;