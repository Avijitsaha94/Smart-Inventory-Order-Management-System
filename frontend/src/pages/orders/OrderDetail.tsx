/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  X,
  FileText,
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
    if (
      window.confirm(
        'Are you sure you want to cancel this order? Stock will be restored.'
      )
    ) {
      try {
        await cancelOrder(id!).unwrap();
        toast.success('Order cancelled successfully');
        navigate('/orders');
      } catch (error: any) {
        toast.error(error.data?.message || 'Failed to cancel order');
      }
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading order...</p>
        </div>
      </Layout>
    );
  }

  if (error || !data?.data) {
    return (
      <Layout>
        <div className="card bg-red-50 border border-red-200">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p>Order not found or failed to load.</p>
          </div>
          <button
            onClick={() => navigate('/orders')}
            className="mt-4 btn btn-secondary"
          >
            Back to Orders
          </button>
        </div>
      </Layout>
    );
  }

  const order = data.data;

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span
        className={`px-4 py-2 rounded-full text-sm font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const canCancel = ['pending', 'processing'].includes(order.status);
  const canUpdateStatus =
    user?.role === 'admin' && order.status !== 'cancelled';

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Orders</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {order.orderNumber}
              </h1>
              <div className="flex items-center gap-3">
                {getStatusBadge(order.status)}
                <span className="text-sm text-gray-500">
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
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                <span>Order Items</span>
              </h2>
              <div className="space-y-4">
                {order.products.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        SKU: {item.product.sku}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-gray-600">
                          Qty: <span className="font-medium">{item.quantity}</span>
                        </span>
                        <span className="text-gray-600">
                          Price:{' '}
                          <span className="font-medium">
                            ৳{item.price.toLocaleString()}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ৳{item.subtotal.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
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
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span>Order Notes</span>
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {order.notes}
                </p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>Customer Information</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">
                      {order.customerInfo.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">
                      {order.customerInfo.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">
                      {order.customerInfo.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium text-gray-900">
                      {order.customerInfo.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Update (Admin only) */}
            {canUpdateStatus && (
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Update Status
                </h3>
                <div className="space-y-2">
                  {['pending', 'processing', 'shipped', 'delivered'].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(status)}
                        disabled={order.status === status}
                        className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                          order.status === status
                            ? 'bg-primary-100 text-primary-700 cursor-default'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Order Info */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">
                Order Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium text-gray-900">
                    {order.orderNumber}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span
                    className={`font-medium ${
                      order.paymentStatus === 'paid'
                        ? 'text-green-600'
                        : order.paymentStatus === 'failed'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() +
                      order.paymentStatus.slice(1)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium text-gray-900">
                    {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Updated:</span>
                  <span className="font-medium text-gray-900">
                    {format(new Date(order.updatedAt), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Ordered By:</span>
                  <span className="font-medium text-gray-900">
                    {order.orderedBy.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OrderDetail;