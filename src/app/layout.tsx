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
  title:" Vaishi Handmade Creations Bags,Charms ,keychain – Vaishi",
  description:
"Vaishi offers handcrafted mobile phone charms and flower hair clips made with love & care. Explore our exclusive collection and  grab exciting discounts now!",
  keywords: [
    "Vaishi",
    "Vaishi handmade products",
    "mobile phone charm",
    "macrame keychain",
    "fridge magnet",
    "phone charms",
     "hair accessory",
     "flower hair clips for hair",
     "crochet bags",
     "phone keychain",
     "charms for iphones",
    "decorative handmade product",
  ],
  authors: [{ name: "Vaishi" }],
  creator: "Vaishi",
  publisher: "Vaishi",
  icons: {
    icon: "/Mylogo.png", // ✅ favicon in /public
  },
  openGraph: {
    title: "Vaishi – Handcrafted with Love",
    description:
      "Discover Vaishi, where creativity meets craftsmanship. Explore our unique handmade creations.",
    url: "https://vaishi.vercel.app", // ✅ absolute URL
    siteName: "Vaishi",
    images: [
      {
        url: "https://vaishi.vercel.app/logo.jpeg", // ✅ absolute URL for OG image
        width: 600,
        height: 600,
        alt: "Vaishi Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaishi – Handcrafted with Love",
    description:
      "Discover Vaishi’s beautiful handmade products crafted with creativity and passion.",
    images: ["https://vaishi.vercel.app/Mylogo.png"], // ✅ absolute URL
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


