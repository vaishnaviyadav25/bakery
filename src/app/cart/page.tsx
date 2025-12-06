import Mycartpage from "@/components/Mycartpage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart - Cakes & Cupcakes",
  description: "Review your selected cakes, cupcakes, and brownies before checkout at Meet Bakery. Secure online ordering for fresh baked goods.",
  keywords: ["bakery cart", "cake checkout", "cupcake order", "brownie purchase", "bakery online", "fresh baked goods"],
  openGraph: {
    title: "Shopping Cart - Meet Bakery",
    description: "Review and manage your cake, cupcake, and brownie selections before completing your order at Meet Bakery.",
    images: ["/bakerylogo.png"],
  },
  twitter: {
    card: "summary",
    title: "Cart - Meet Bakery",
    description: "Check your selected cakes and cupcakes, proceed to checkout at Meet Bakery.",
    images: ["/bakerylogo.png"],
  },
};

export default function CartPage() {
  return <Mycartpage />;
}
