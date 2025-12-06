import {Contactpage} from "@/components/Contactpage";
import Footerpage from "@/components/Footerpage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Meet Bakery - Order Cakes & Inquiries",
  description: "Reach out to Meet Bakery for custom cake orders, cupcake inquiries, or any questions about our fresh baked goods. We're here to help!",
  keywords: ["Meet Bakery contact", "cake orders", "cupcake inquiries", "bakery support", "custom brownies", "bakery shop"],
  openGraph: {
    title: "Contact Meet Bakery - Order Cakes & Inquiries",
    description: "Get in touch with Meet Bakery for fresh cakes, cupcakes, and brownies. Custom orders and support available.",
    images: ["/bakerylogo.png"],
  },
  twitter: {
    card: "summary",
    title: "Contact Meet Bakery",
    description: "Message us for cake orders, custom cupcakes, or bakery inquiries at Meet Bakery.",
    images: ["/bakerylogo.png"],
  },
};


export default function Home() {
  return (
      <div className="bg-pink-50">
        <Contactpage/>
        <Footerpage/>
        </div>
  );
}