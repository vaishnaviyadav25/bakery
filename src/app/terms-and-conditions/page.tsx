
import React from "react";
import Footerpage from "@/components/Footerpage"
import type { Metadata } from "next";
  
export const metadata: Metadata = {
  title: "Terms and Conditions – Vaishi",
  description: "Review Vaishi’s Terms and Conditions to understand our policies on orders, payments, and product use.",
  keywords: ["Vaishi terms and conditions", "Vaishi policies", "online shopping rules", "Vaishi store", "terms of service"],
  openGraph: {
    title: "Terms and Conditions – Vaishi",
    description: "Learn about Vaishi’s terms regarding orders, returns, and product usage.",
    images: ["/Mylogo.png"],
  },
  twitter: {
    card: "summary",
    title: "Terms and Conditions – Vaishi",
    description: "Read Vaishi’s Terms of Service to understand our shopping and return policies.",
    images: ["/Mylogo.png"],
  },
};


export default function TermsAndConditions() {
  return (
    <>
    <div className="min-h-screen bg-pink-50 py-10 px-6 flex justify-center">
      <div className="max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-pink-700 mb-6 text-center">
          Terms & Conditions
        </h1>

        <p className="text-gray-700 mb-4">
          Welcome to <span className="font-semibold text-pink-600">Vaishi</span>!  
          By accessing or placing an order through our website, you agree to the following terms and conditions.  
          Please read them carefully before making a purchase.
        </p>

        <h2 className="text-xl font-semibold text-pink-600 mt-6 mb-2">
          1. General Information
        </h2>
        <p className="text-gray-700 mb-3">
          All our products are handmade with care. Slight variations in color, size, or design may occur —  
          these are natural characteristics of handcrafted items and not considered defects.
        </p>

        <h2 className="text-xl font-semibold text-pink-600 mt-6 mb-2">
          2. Order Placement
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Once an order is placed, you will receive confirmation via email or WhatsApp.</li>
          <li>Please double-check your delivery details before submitting the order.</li>
          <li>Orders cannot be cancelled once they have been processed or shipped.</li>
        </ul>

        <h2 className="text-xl font-semibold text-pink-600 mt-6 mb-2">
          3. Pricing & Payments
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>All prices listed are in Indian Rupees (₹) and inclusive of applicable taxes.</li>
          <li>Payments are accepted through secure and verified platforms only.</li>
        </ul>

        <h2 className="text-xl font-semibold text-pink-600 mt-6 mb-2">
          4. Shipping & Delivery
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>We aim to dispatch orders within 3–7 working days (depending on product type).</li>
          <li>Delivery times may vary based on your location and courier availability.</li>
          <li>Any delays caused by courier partners are beyond our control, but we’ll help track your order.</li>
        </ul>

        <h2 className="text-xl font-semibold text-pink-600 mt-6 mb-2">
          5. Returns & Replacements
        </h2>
        <p className="text-gray-700 mb-3">
          Returns are only accepted for defective or damaged items.  
          An <strong>unboxing video</strong> from the moment of opening the parcel is mandatory for verification.  
          Please refer to our{" "}
          <a href="/return" className="text-pink-500 font-medium hover:underline">
            Return Policy
          </a>{" "}
          for full details.
        </p>

        <h2 className="text-xl font-semibold text-pink-600 mt-6 mb-2">
          6. Intellectual Property
        </h2>
        <p className="text-gray-700 mb-3">
          All images, designs, and content on this website are the property of{" "}
          <span className="font-semibold text-pink-600">Vaishi</span>.  
          Copying, redistributing, or using any material without permission is strictly prohibited.
        </p>

        <h2 className="text-xl font-semibold text-pink-600 mt-6 mb-2">
          7. Contact Us
        </h2>
        <p className="text-gray-700 mb-3">
          For questions about these Terms & Conditions, please reach out to us:
        </p>

        <div className="bg-pink-100 rounded-lg p-4 text-gray-700 mb-6">
            📧 <strong>Email:</strong> vaishnaviyadav25march@gmail.com <br />
        </div>

      </div>
    </div>
    <Footerpage/>
    </>
  );
}
