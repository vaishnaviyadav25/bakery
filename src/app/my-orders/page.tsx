"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "@/context/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import axios from "axios";
import ReviewModal from "@/components/ReviewModal";

type Order = {
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
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchOrders(user);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchOrders = async (user: User) => {
    try {
      const response = await axios.get(`/api/orders?email=${encodeURIComponent(user.email!)}`);
      setOrders((response.data as { orders: Order[] }).orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleAddReview = (orderId: string) => {
    setSelectedOrderId(orderId);
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    try {
      await axios.post('/api/reviews', {
        orderId: selectedOrderId,
        rating,
        comment
      });
      // Refresh orders to show the new review
      if (currentUser) {
        await fetchOrders(currentUser);
      }
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
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

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 py-20 px-4 sm:px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-pink-700 mb-2">Please Login</h1>
          <p className="text-gray-600">You need to be logged in to view your orders.</p>
          <Link
            href="/login"
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium mt-4 inline-block"
          >
            Login 🌸
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 py-20 px-4 sm:px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🔄</div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#7D5A5F] mb-4">My Orders</h1>
          <p className="text-gray-700">Track and manage your orders</p>
        </div>


        {orders.length === 0 ? (
          <div className="text-center py-20 bg-[#F6E6E6] rounded-2xl mx-6 md:mx-20 shadow-lg">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-[#7D5A5F] mb-2">No Orders Yet</h2>
            <p className="text-gray-700 mb-6">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/product"
              className="bg-gradient-to-r from-[#CCA6A2] to-[#B78B89] text-white px-6 py-3 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium"
            >
              Start Shopping 🌸
            </Link>
          </div>

        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-pink-100"
              >
                <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-pink-700">Order #{order.orderId}</h3>
                    <p className="text-sm text-gray-500">
                      {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Date not available'}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus || 'Unknown'}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(order.payment.status)}`}>
                      {order.payment.status}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-pink-700">₹{order.payment.amount}</span>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Products:</h4>
                    <div className="space-y-2">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{product.name} (x{product.quantity})</span>
                          <span className="font-medium">₹{product.price * product.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.deliveryDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery:</span>
                      <span className="font-medium text-green-600">{new Date(order.deliveryDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  {/* Review Section */}
                  {order.orderStatus === 'delivered' && (
                    <div className="pt-3 border-t border-gray-100">
                      {order.review ? (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Your Review:</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${i < order.review!.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(order.review!.date).toLocaleDateString()}
                            </span>
                          </div>
                          {order.review!.comment && (
                            <p className="text-sm text-gray-600 italic">{order.review!.comment}</p>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddReview(order._id)}
                          className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium"
                        >
                          ⭐ Add Review
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          orderId={selectedOrderId}
          onSubmitReview={handleSubmitReview}
        />
      </div>
    </div>
  );
}
