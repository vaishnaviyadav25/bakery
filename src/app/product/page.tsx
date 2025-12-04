import { Suspense } from "react";
import Productpage from "@/components/Productpage"
import Footerpage from "@/components/Footerpage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Handcrafted Products – Vaishi",
  description: "Explore Vaishi's handmade macramé bags, gifts, and decor crafted with love and creativity.",
  keywords: ["Vaishi products", "handmade bags", "macrame", "craft shop", "handcrafted gifts", "Vaishi store"],
  openGraph: {
    title: "Handcrafted Products – Vaishi",
    description: "Shop beautifully crafted handmade products from Vaishi – where creativity meets care.",
    images: ["/Mylogo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaishi – Handcrafted Products",
    description: "Discover unique handmade creations by Vaishi. Shop macramé bags, gifts, and decor.",
    images: ["/Mylogo.png"],
  },
};

export default function Home() {
  return (
      <div className="bg-pink-50">
        <Suspense fallback={<div>Loading...</div>}>
          <Productpage />
        </Suspense>
        <Footerpage/>
        </div>
  );
}
