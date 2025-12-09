"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Instagram, Mail } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative bg-[#FFF3F2] text-gray-800 py-16 md:py-20 overflow-hidden">

      {/* 🌸 Decorative Top Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#FADCD9] via-[#F9C9C5] to-[#FADCD9] animate-pulse"></div>

      {/* 🌈 Floating pastel blobs */}
      <motion.div
        className="absolute top-10 left-10 w-24 h-24 bg-[#FADCD9]/40 rounded-full blur-3xl"
        animate={{ y: [0, -25, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-32 h-32 bg-[#F9C9C5]/30 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 🌷 Footer Content */}
      <div className="relative container mx-auto px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">

          {/* 🌼 Left - Logo & About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col items-center md:items-start text-center md:text-left mb-4">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/bakerylogo.png"
                    alt="Shop Logo"
                    width={100}
                    height={50}
                    className="object-contain"
                  />
                </Link>
                <div>
                  <h3 className="text-xl font-bold text-[#F7AFAE]">Meet Bakery</h3>
                  <p className="text-sm text-gray-700 font-medium">by Teju</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-sm mx-auto md:mx-0">
                Sweet creations made with love — cupcakes, muffins & cakes that warm your heart 💗
              </p>
            </div>
          </motion.div>

          {/* 🌷 Middle Left - Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-3 md:ml-10 sm:ml-0"
          >
            <h3 className="text-lg font-semibold text-[#F7AFAE] mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li><Link href="/" className="hover:text-[#F9C9C5] transition">Home</Link></li>
              <li><Link href="/product" className="hover:text-[#F9C9C5] transition">Product</Link></li>
              <li><Link href="/order" className="hover:text-[#F9C9C5] transition">Order</Link></li>
              <li><Link href="/contact" className="hover:text-[#F9C9C5] transition">Contact</Link></li>
            </ul>
          </motion.div>

          {/* 🌷 Middle Right - Policies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-[#F7AFAE] mb-3">Policies</h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li><Link href="/privacy-policy" className="hover:text-[#F9C9C5] transition">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-[#F9C9C5] transition">Terms & Conditions</Link></li>
              <li><Link href="/return-policy" className="hover:text-[#F9C9C5] transition">Return Policy</Link></li>
            </ul>
          </motion.div>

          {/* 🌸 Right - Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-[#F7AFAE] mb-3">Contact Us</h3>
            <p className="text-gray-600 text-sm md:text-base">
              📧 tehzuqureshi019@gmail.com
            </p>
            <div className="flex justify-center md:justify-start gap-6 text-[#F9C9C5] text-2xl mt-4">
              <motion.a
                href="https://www.instagram.com/meet_bake_house?igsh=eHluYXczaDh1ZHd5"
                target="_blank"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Instagram />
              </motion.a>
              <motion.a
                href="mailto:tehzuqureshi019@gmail.com"
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Mail />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* 🌺 Divider Line */}
        <div className="w-full h-[1px] bg-[#F9C9C5]/50 my-10"></div>

        {/* Copyright */}
        <motion.p
          className="text-gray-500 text-center text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          © {new Date().getFullYear()} <span className="text-[#F7AFAE] font-semibold">Meet Bakery</span> | All Rights Reserved 🌷
        </motion.p>
      </div>
    </footer>
  );
}
  