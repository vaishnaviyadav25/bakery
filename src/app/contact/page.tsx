import {Contactpage} from "@/components/Contactpage";
import Footerpage from "@/components/Footerpage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us – Vaishi",
  description: "Get in touch with Vaishi for queries, orders, or collaborations. We're happy to help!",
  keywords: ["Vaishi contact", "customer support", "help", "inquiry", "Vaishi shop"],
  openGraph: {
    title: "Contact Us – Vaishi",
    description: "Reach out to the Vaishi team for support or order assistance.",
    images: ["/Smalllogo.png"],
  },
  twitter: {
    card: "summary",
    title: "Contact Vaishi",
    description: "Message us for product inquiries, custom orders, or feedback.",
    images: ["/Smalllogo.png"],
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