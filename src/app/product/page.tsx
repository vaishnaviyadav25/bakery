import { Suspense } from "react";
import Productpage from "@/components/Productpage"
import Footerpage from "@/components/Footerpage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bakery Products - Cakes, Cupcakes & Brownies",
  description: "Browse our delicious selection of fresh cakes, cupcakes, and brownies at Meet Bakery. Homemade treats made with premium ingredients.",
  keywords: ["bakery products", "fresh cakes", "homemade cupcakes", "brownies", "cake shop", "cupcake varieties", "bakery treats"],
  openGraph: {
    title: "Bakery Products - Cakes, Cupcakes & Brownies",
    description: "Explore Meet Bakery's range of fresh baked cakes, cupcakes, and brownies. Quality ingredients, delicious flavors.",
    images: ["/bakerylogo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet Bakery - Bakery Products",
    description: "Discover fresh cakes, cupcakes, and brownies at Meet Bakery. Homemade goodness for every occasion.",
    images: ["/bakerylogo.png"],
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
