import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/layout/Navigation";
import { Analytics } from "@vercel/analytics/react";

// ✅ Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ SEO Metadata
export const metadata: Metadata = {
  title: "Meet Bakery - Fresh Cakes, Cupcakes & Brownies",
  description: "Indulge in delicious homemade cakes, cupcakes, and brownies at Meet Bakery. Freshly baked treats made with love, perfect for every occasion.",
  keywords: [
    "Meet Bakery",
    "fresh cakes",
    "homemade cupcakes",
    "brownies",
    "bakery treats",
    "cake shop",
    "cupcake delivery",
    "brownie recipes",
    "custom cakes",
    "bakery online",
  ],
  authors: [{ name: "Meet Bakery" }],
  creator: "Meet Bakery",
  publisher: "Meet Bakery",
  icons: {
    icon: "/bakerylogo.png", // ✅ favicon in /public
  },
  openGraph: {
    title: "Meet Bakery - Fresh Cakes, Cupcakes & Brownies",
    description: "Discover Meet Bakery for the finest homemade cakes, cupcakes, and brownies. Fresh, delicious, and made with love.",
    url: "https://meetbakery.vercel.app", // ✅ absolute URL
    siteName: "Meet Bakery",
    images: [
      {
        url: "https://meetbakery.vercel.app/bakerylogo.png", // ✅ absolute URL for OG image
        width: 600,
        height: 600,
        alt: "Meet Bakery Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet Bakery - Fresh Cakes, Cupcakes & Brownies",
    description: "Indulge in fresh homemade cakes, cupcakes, and brownies from Meet Bakery. Delicious treats for every craving.",
    images: ["https://meetbakery.vercel.app/bakerylogo.png"], // ✅ absolute URL
  },
};

// ✅ Root Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* 🔹 Domain verifications */}
        <meta
          name="google-site-verification"
          content="DH-TpGgm-OrhsRnnst8fBWHcDsdEr8tp4Rf_C0Bqz9E"
        />
        <meta
          name="p:domain_verify"
          content="48a48a0bc656c4618998b020e156f197"
        />

        {/* 🔹 Canonical & robots tags */}
        <link rel="canonical" href="https://vaishi.vercel.app" />
        <meta name="robots" content="index, follow" />

        {/* 🔹 Browser theme color */}
        <meta name="theme-color" content="#fdd835" />

        {/* 🔹 JSON-LD Structured Data for Brand */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Vaishi",
              url: "https://vaishi.vercel.app",
              logo: "https://vaishi.vercel.app/logo.jpeg", // ✅ absolute path
              sameAs: [
                "https://www.instagram.com/vaishi_handmade",
                "https://www.pinterest.com/vaishiart",
              ],
            }),
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Navigation />
        <main className="pt-20">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}


