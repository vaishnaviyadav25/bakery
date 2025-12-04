import Mycartpage from "@/components/Mycartpage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: " Cart – Vaishi",
  description: "Review your selected handmade products before checkout at Vaishi.",
  keywords: ["Vaishi cart", "checkout", "handmade products", "macrame bags", "buy online"],
  openGraph: {
    title: "Your Cart – Vaishi",
    description: "Securely review and manage your handmade products before completing your purchase.",
    images: ["/Smalllogo.png"],
  },
  twitter: {
    card: "summary",
    title: "Your Cart – Vaishi",
    description: "Check your selected Vaishi items and proceed to checkout.",
    images: ["/Smalllogo.png"],
  },
};

export default function CartPage() {
  return <Mycartpage />;
}
