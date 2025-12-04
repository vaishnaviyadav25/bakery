import React from "react";
import Footerpage from "@/components/Footerpage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – Vaishi",
  description:
    "Read Vaishi’s Privacy Policy to understand how we protect your personal information and ensure a safe shopping experience.",
  keywords: [
    "Vaishi privacy policy",
    "data protection",
    "user privacy",
    "secure shopping",
    "Vaishi store",
  ],
  openGraph: {
    title: "Privacy Policy – Vaishi",
    description: "Learn how Vaishi handles your data with transparency and care.",
    images: ["/Mylogo.png"],
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy – Vaishi",
    description:
      "Understand Vaishi’s commitment to protecting your privacy and data.",
    images: ["/Mylogo.png"],
  },
};

export default function PrivacyPolicy() {
  return (
    <>
      <div className="min-h-screen bg-pink-50 py-10 px-6 flex justify-center">
        <div className="max-w-3xl bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-pink-700 mb-6 text-center">
            Privacy Policy
          </h1>

          <p className="text-gray-700 mb-4">
            At <span className="font-semibold text-pink-600">Vaishi</span>, we
            value your privacy and are committed to protecting your personal
            data. This Privacy Policy explains how we collect, use, and
            safeguard your information when you visit our website or make a
            purchase.
          </p>

          <h2 className="text-xl font-semibold text-pink-600 mt-6 mb-2">
            1. Information We Collect
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>
              Name, email address, phone number, and delivery address (for order
              processing).
            </li>
            <li>Messages or special instructions you submit during checkout.</li>
            <li>
              Non-personal data like device type, browser, and general location
              (for analytics).
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-pink-600 mt-6 mb-2">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>To process and deliver your orders.</li>
            <li>To communicate with you regarding your purchases or inquiries.</li>
            <li>To improve our website and customer experience.</li>
          </ul>

          <h2 className="text-xl font-semibold text-pink-600 mt-6 mb-2">
            3. Data Protection
          </h2>
          <p className="text-gray-700 mb-4">
            We do not share, sell, or trade your personal information with third
            parties. All data is handled securely, and only authorized personnel
            can access it to fulfill your orders or provide customer support.
          </p>

          <h2 className="text-xl font-semibold text-pink-600 mt-6 mb-2">
            4. Payments
          </h2>
          <p className="text-gray-700 mb-4">
            We use secure payment platforms or form submissions. Your payment
            details are not stored on our servers.
          </p>

          <h2 className="text-xl font-semibold text-pink-600 mt-6 mb-2">
            5. Your Consent
          </h2>
          <p className="text-gray-700 mb-4">
            By using our website, you consent to the collection and use of your
            information in accordance with this Privacy Policy.
          </p>

          <h2 className="text-xl font-semibold text-pink-600 mt-6 mb-2">
            6. Updates to This Policy
          </h2>
          <p className="text-gray-700 mb-4">
            We may update this Privacy Policy from time to time. Any changes
            will be reflected on this page with an updated date.
          </p>

          <h2 className="text-xl font-semibold text-pink-600 mt-6 mb-2">
            7. Contact Us
          </h2>
          <p className="text-gray-700 mb-4">
            If you have any questions or concerns about our Privacy Policy,
            please contact us at:
          </p>

          <div className="bg-pink-100 rounded-lg p-4 text-gray-700">
            📧 <strong>Email:</strong> vaishnaviyadav25march@gmail.com
          </div>
        </div>
      </div>

      <Footerpage />
    </>
  );
}
