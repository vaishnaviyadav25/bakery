"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type OrderData = {
  orderId: string;
  products: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  payment: {
    method: string;
    status: string;
    amount: number;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  message?: string;
};

export default function PaymentPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedOrder = localStorage.getItem("pendingOrder");
    if (storedOrder) {
      try {
        const parsedOrder: OrderData = JSON.parse(storedOrder);
        setOrderData(parsedOrder);
      } catch (err) {
        console.error("Error parsing pending order:", err);
        router.push("/order");
      }
    } else {
      router.push("/order");
    }
  }, [router]);



  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  // Calculate total quantity from products
  const totalQuantity = orderData.products.reduce((sum, product) => sum + product.quantity, 0);

  // Create WhatsApp message with payment details
  const whatsappMessage = encodeURIComponent(
    `Hello! I have placed an order and need to make payment.\n\nCustomer Name: ${orderData.customer.name}\nOrder ID: ${orderData.orderId}\nTotal Amount: ₹${orderData.payment.amount}\n\nPlease share your QR code for payment.`
  );

  const whatsappUrl = `https://wa.me/917722893524?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 py-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg border border-white/40 shadow-2xl rounded-3xl p-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-pink-700 mb-6 drop-shadow-md">
            Complete Your Payment 💳
          </h1>

          {/* Order Summary */}
          <div className="mb-8 p-4 bg-pink-50 rounded-xl border border-pink-200">
            <h2 className="text-lg font-semibold text-pink-700 mb-3">Order Summary</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Order ID:</strong> {orderData.orderId}</p>
              <p><strong>Customer:</strong> {orderData.customer.name}</p>
              <p><strong>Phone:</strong> {orderData.customer.phone}</p>
              <div className="mt-3">
                <p className="font-medium mb-2">Products:</p>
                <ul className="list-disc list-inside space-y-1">
                  {orderData.products.map((product, index) => (
                    <li key={index}>
                      {product.name} - ₹{product.price} × {product.quantity} = ₹{product.price * product.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <p><strong>Total Quantity:</strong> {totalQuantity}</p>
              <p className="text-pink-700 font-bold text-xl mt-3"><strong>Total Amount:</strong> ₹{orderData.payment.amount}</p>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="mb-8 p-6 bg-green-50 rounded-xl border border-green-200">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Payment Instructions 📱</h2>
            <div className="space-y-3 text-gray-700">
              <p>1. Click the WhatsApp button below to contact our payment team.</p>
              <p>2. Our team will share a QR code for payment.</p>
              <p>3. Complete your payment of <strong>₹{orderData.payment.amount}</strong> using any UPI app.</p>
              <p>4. Once payment is received, we&apos;ll update your order status to Completed.</p>
            </div>
          </div>

          {/* WhatsApp Payment Button */}
          <div className="mb-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 text-lg shadow-lg hover:shadow-xl"
            >
              <span>💬</span>
              <span>Contact on WhatsApp for Payment</span>
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
           ,
            <Link
              href="/order"
              className="flex-1 py-3 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300 text-center"
            >
              Back to Order
            </Link>
          </div>

          <p className="text-center text-gray-500 text-sm mt-4">
            Secure payment processing via WhatsApp QR 🔒
          </p>
        </div>
      </div>
    </div>
  );
}
