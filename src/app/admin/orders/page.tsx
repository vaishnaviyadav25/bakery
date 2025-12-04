"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { auth } from "@/context/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

import Image from "next/image";
import axios from "axios";
interface Order {
  _id: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  products: Array<{
    name: string;
    price: number;
    quantity: number;
    images?: string[];
  }>;
  payment: {
    method: string;
    status: 'pending' | 'completed' | 'failed';
    paymentId?: string;
    amount: number;
  };
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  review?: {
    rating: number;
    comment: string;
    date: string;
  };
  message?: string;
}

export default function AdminOrdersPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user || user.uid !== "cJ2MGVYgnZZVyI6Xy54XrIxj1YO2") {
        router.push("/");
        return;
      }
      fetchOrders();
    });

    return () => unsubscribe();
  }, [router]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders');
      setOrders((response.data as { orders: Order[] }).orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await axios.patch(`/api/admin/update-order-status?isAdmin=true&email=${encodeURIComponent(currentUser!.email || '')}`, {
        orderId,
        newStatus,
      });

      if ((response.data as { success: boolean }).success) {
        setOrders(orders.map(order =>
          order._id === orderId
            ? { ...order, orderStatus: newStatus as Order['orderStatus'] }
            : order
        ));
        alert(`Order status updated to ${newStatus}`);
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const updatePaymentStatus = async (orderId: string, newPaymentStatus: string) => {
    try {
      const response = await axios.patch(`/api/admin/update-order-status?isAdmin=true&email=${encodeURIComponent(currentUser!.email || '')}`, {
        orderId,
        newPaymentStatus,
      });

      if ((response.data as { success: boolean }).success) {
        setOrders(orders.map(order =>
          order._id === orderId
            ? { ...order, payment: { ...order.payment, status: newPaymentStatus as Order['payment']['status'] } }
            : order
        ));
        alert(`Payment status updated to ${newPaymentStatus}`);
      } else {
        alert('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status');
    }
  };

  const printOrder = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const orderDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order #${order.orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .section h3 { margin-bottom: 10px; color: #333; }
            .product { margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; }
            .total { font-weight: bold; font-size: 18px; text-align: right; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Order #${order.orderId}</h1>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Status:</strong> ${order.orderStatus}</p>
            <p><strong>Payment Status:</strong> ${order.payment.status}</p>
          </div>

          <div class="section">
            <h3>Customer Details</h3>
            <p><strong>Name:</strong> ${order.customer.name}</p>
            <p><strong>Email:</strong> ${order.customer.email}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            <p><strong>Address:</strong> ${order.customer.address}</p>
          </div>

          <div class="section">
            <h3>Order Details</h3>
            <p><strong>Payment Method:</strong> ${order.payment.method}</p>
            <p><strong>Payment Amount:</strong> ₹${order.payment.amount}</p>
            ${order.payment.paymentId ? `<p><strong>Payment ID:</strong> ${order.payment.paymentId}</p>` : ''}
            ${order.message ? `<p><strong>Message:</strong> ${order.message}</p>` : ''}
          </div>

          <div class="section">
            <h3>Products</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.products.map(product => `
                  <tr>
                    <td>${product.name}</td>
                    <td>₹${product.price}</td>
                    <td>${product.quantity}</td>
                    <td>₹${product.price * product.quantity}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">Total: ₹${order.payment.amount}</div>
          </div>

          ${order.review ? `
            <div class="section">
              <h3>Review</h3>
              <p><strong>Rating:</strong> ${order.review.rating}/5</p>
              ${order.review.comment ? `<p><strong>Comment:</strong> ${order.review.comment}</p>` : ''}
            </div>
          ` : ''}
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'text-gray-600 bg-gray-100';
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-purple-600 bg-purple-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!currentUser || currentUser.uid !== "cJ2MGVYgnZZVyI6Xy54XrIxj1YO2") {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-pink-700 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don&apos;t have permission to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🔄</div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-pink-700">
              📦 Admin Orders Dashboard
            </h1>
            <div className="text-sm text-gray-600">
              Total Orders: {orders.length}
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h2>
              <p className="text-gray-500">Orders will appear here when customers place them.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div
                  key={order._id}
                  className="border border-pink-200 rounded-xl p-6 bg-pink-50/50 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <h3 className="text-lg font-semibold text-pink-700">
                          Order #{order.orderId}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment.status)}`}>
                          Payment: {order.payment.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Customer Details</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Name:</strong> {order.customer.name}</p>
                            <p><strong>Email:</strong> {order.customer.email}</p>
                            <p><strong>Phone:</strong> {order.customer.phone}</p>
                            <p><strong>Address:</strong> {order.customer.address}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Order Details</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</p>
                            <p><strong>Payment:</strong> {order.payment.method} - ₹{order.payment.amount}</p>
                            {order.payment.paymentId && (
                              <p><strong>Payment ID:</strong> {order.payment.paymentId}</p>
                            )}
                            {order.message && (
                            <p><strong>Message:</strong> {order.message}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Products</h4>
                        <div className="space-y-2">
                          {order.products.map((product, index) => (
                            <div key={index} className="flex items-center justify-between bg-white/60 rounded-lg p-3">
                              <div className="flex items-center gap-3">
                                {product.images && product.images[0] && (
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                )}
                                <div>
                                  <p className="font-medium text-gray-800">{product.name}</p>
                                  <p className="text-sm text-gray-600">
                                    ₹{product.price} × {product.quantity} = ₹{product.price * product.quantity}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-pink-200">
                          <p className="font-semibold text-right text-pink-700">
                            Total: ₹{order.payment.amount}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[200px] w-full lg:w-auto">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Update Order Status
                        </label>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Update Payment Status
                        </label>
                        <select
                          value={order.payment.status}
                          onChange={(e) => updatePaymentStatus(order._id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                        </select>
                      </div>

                      <button
                        onClick={() => printOrder(order)}
                        className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        🖨️ Print Order
                      </button>

                      {order.orderStatus === 'delivered' && order.review && (
                        <div className="bg-green-100 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-yellow-500">
                              {"★".repeat(order.review.rating)}
                              {"☆".repeat(5 - order.review.rating)}
                            </span>
                            <span className="text-sm font-medium text-green-700">
                              {order.review.rating}/5
                            </span>
                          </div>
                          {order.review.comment && (
                            <p className="text-sm text-green-600 italic">
                              &ldquo;{order.review.comment}&rdquo;
                            </p>
                          )}
                        </div>
                      )}


                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
