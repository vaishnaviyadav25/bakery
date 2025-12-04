"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function CardPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams?.get("amount") || "0";
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Get order data from localStorage
      const storedOrder = localStorage.getItem("pendingOrder");
      if (!storedOrder) {
        alert("No order data found. Please try again.");
        setProcessing(false);
        return;
      }

      const orderData = JSON.parse(storedOrder);

      // Create order in database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const result = await response.json();

      // Simulate payment processing
      setTimeout(() => {
        alert(`Payment of ₹${amount} successful!`);

        // Clear pending order and cart
        localStorage.removeItem("pendingOrder");
        localStorage.removeItem("cart");

        // Redirect to success page with orderId
        router.push(`/order-success?orderId=${result.orderId}`);
      }, 2000);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 py-20 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-lg border border-white/40 shadow-2xl rounded-3xl p-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-pink-700 mb-6 drop-shadow-md">
            Card Payment 💳
          </h1>

          <div className="mb-6 p-4 bg-pink-50 rounded-xl border border-pink-200">
            <p className="text-center text-pink-700 font-bold text-lg">
              Amount to Pay: ₹{amount}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="MMYY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={processing}
              className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                processing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 hover:shadow-lg"
              }`}
            >
              {processing ? "Processing Payment..." : `Pay ₹${amount}`}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/payment"
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              ← Back to Payment Options
            </Link>
          </div>

          <p className="text-center text-gray-500 text-sm mt-4">
            Your payment is secure and encrypted 🔒
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CardPaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CardPaymentContent />
    </Suspense>
  );
}
