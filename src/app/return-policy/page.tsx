

import React from "react";
import Footerpage from "@/components/Footerpage"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return Policy – Vaishi",
  description: "Read Vaishi’s Return Policy. We accept returns only for defective pieces with proof of unboxing video for a smooth resolution.",
  keywords: ["Vaishi return policy", "refund", "defective product", "exchange policy", "Vaishi store"],
  openGraph: {
    title: "Return Policy – Vaishi",
    description: "Understand Vaishi’s return process for defective items with unboxing proof.",
    images: ["/Mylogo.png"],
  },
  twitter: {
    card: "summary",
    title: "Return Policy – Vaishi",
    description: "Learn how to request a return for defective items with proof of unboxing.",
    images: ["/Mylogo.png"],
  },
};


export default function ReturnPolicy() {
  return (
    <>
    <div className="min-h-screen bg-pink-50 py-10 px-6 flex justify-center">
      <div className="max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-pink-700 mb-6 text-center">
          Return & Replacement Policy
        </h1>

        <p className="text-gray-700 mb-4">
          At <span className="font-semibold text-pink-600">Vaishi</span>, 
          every product is handcrafted and carefully checked before dispatch.  
          However, in rare cases where you receive a defective or damaged item, 
          we offer a replacement as per the policy below.
        </p>

        <h2 className="text-xl font-semibold text-pink-600 mt-6 mb-2">
          1. Eligibility for Return or Replacement
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Returns are accepted only for defective or damaged products.</li>
          <li>
            To qualify, you must share a clear <strong>unboxing video</strong> taken 
            from the moment you open the parcel — showing the package condition and the product inside.
          </li>
          <li>
            The video must clearly show the issue (broken part, missing item, or damage).
          </li>
          <li>
            Without an unboxing video, <strong>no return or replacement</strong> will be approved.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-pink-600 mt-6 mb-2">
          2. Process for Requesting a Return
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Contact us within <strong>24 hours</strong> of receiving your order.</li>
          <li>Send the unboxing video and order details on WhatsApp or email.</li>
          <li>Our team will verify the video and respond within 1–2 business days.</li>
          <li>
            Once approved, we’ll arrange for a replacement of the defective item 
            or issue store credit (as applicable).
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-pink-600 mt-6 mb-2">
          3. Items Not Eligible for Return
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Products damaged due to mishandling after delivery.</li>
          <li>Customized, handmade, or personalized items (unless damaged on arrival).</li>
          <li>Orders without a valid unboxing video.</li>
        </ul>

        <h2 className="text-xl font-semibold text-pink-600 mt-6 mb-2">
          4. Contact for Return Assistance
        </h2>
        <p className="text-gray-700 mb-4">
          To raise a return request, please contact us:
        </p>
        <div className="bg-pink-100 rounded-lg p-4 text-gray-700">
         📧 <strong>Email:</strong> vaishnaviyadav25march@gmail.com <br />
        </div>

      </div>
    </div>
    <Footerpage/>
    </>
  );
}
