'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Home, Phone, ClipboardList, Menu as MenuIcon, X, FileText } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { auth } from '@/context/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Shared classes for all nav links
// Thicker border with outer outline
const navLinkClasses = "flex items-center gap-2 p-3 rounded-full border-4 border-[#EBBEC3] outline-2 outline-[#C49B9E] text-gray-800 hover:bg-[#EBBEC3]/50 transition-all";

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? 'bg-[#EBBEC3]/90 backdrop-blur-md shadow-md' : 'bg-[#EBBEC3]/90 backdrop-blur-sm'}
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3">
        {/* 🛍 Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/bakerylogo.png"
            alt="Shop Logo"
            width={100}
            height={50}
            style={{ height: "auto" }}
            className="object-contain"
          />
        </Link>

        {/* 🔗 Desktop Nav */}
        <div className="hidden md:flex gap-6 text-gray-700 font-medium">
          {/* Home */}
          <div className="flex flex-col items-center">
            <Link href="/" className={navLinkClasses}>
              <Home size={18} /> Home
            </Link>
            {pathname === '/' && <div className="h-[2px] w-10 bg-[#C49B9E] mt-1 rounded-full"></div>}
          </div>

          {/* Products */}
          <div className="flex flex-col items-center">
            <Link href="/product" className={navLinkClasses}>
              <ShoppingCart size={18} /> Products
            </Link>
            {pathname === '/product' && <div className="h-[2px] w-10 bg-[#C49B9E] mt-1 rounded-full"></div>}
          </div>

          {/* Menu */}
        

          {/* Contact */}
          <div className="flex flex-col items-center">
            <Link href="/contact" className={navLinkClasses}>
              <Phone size={18} /> Contact
            </Link>
            {pathname === '/contact' && <div className="h-[2px] w-10 bg-[#C49B9E] mt-1 rounded-full"></div>}
          </div>

          {/* Admin Orders - Only for admin user */}
          {currentUser?.uid === "cJ2MGVYgnZZVyI6Xy54XrIxj1YO2" && (
            <div className="flex flex-col items-center">
              <Link href="/admin/orders" className={navLinkClasses}>
                <ClipboardList size={18} /> Orders
              </Link>
              {pathname === '/admin/orders' && <div className="h-[2px] w-10 bg-[#C49B9E] mt-1 rounded-full"></div>}
            </div>
          )}

          {/* My Orders - Authenticated users */}
          {currentUser && (
            <div className="flex flex-col items-center">
              <Link href="/my-orders" className={navLinkClasses}>
                <ClipboardList size={18} /> My Orders
              </Link>
              {pathname === '/my-orders' && <div className="h-[2px] w-10 bg-[#C49B9E] mt-1 rounded-full"></div>}
            </div>
          )}

          {/* Cart */}
          <div className="flex flex-col items-center">
            <Link href="/cart" className={navLinkClasses}>
              <ShoppingCart size={18} /> Cart
            </Link>
            {pathname === '/cart' && <div className="h-[2px] w-10 bg-[#C49B9E] mt-1 rounded-full"></div>}
          </div>

          {/* Login */}
          <div className="flex flex-col items-center">
            <Link href="/login" className={navLinkClasses}>
              <ShoppingCart size={18} /> Login
            </Link>
            {pathname === '/login' && <div className="h-[2px] w-10 bg-[#C49B9E] mt-1 rounded-full"></div>}
          </div>
        </div>

        {/* 🍔 Mobile Menu Icon */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-[#EBBEC3]/50 transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* 📱 Mobile Nav Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#EBBEC3]/90 border-t border-[#EBBEC3] px-6 py-4 flex flex-col gap-4 text-gray-700 font-medium"
        >
          {/** Desktop nav duplicated for mobile with shared navLinkClasses **/}

          {/* Home */}
          <div className="flex flex-col items-start">
            <Link href="/" onClick={() => setMenuOpen(false)} className={navLinkClasses + " w-full"}>
              <Home size={18} /> Home
            </Link>
            {pathname === '/' && <div className="h-[2px] w-10 bg-[#C49B9E] mt-1 rounded-full"></div>}
          </div>

          {/* Products */}
          <div className="flex flex-col items-start">
            <Link href="/product" onClick={() => setMenuOpen(false)} className={navLinkClasses + " w-full"}>
              <ShoppingCart size={18} /> Products
            </Link>
            {pathname === '/product' && <div className="h-[2px] w-10 bg-[#C49B9E] mt-1 rounded-full"></div>}
          </div>

          {/* Contact */}
          <div className="flex flex-col items-start">
            <Link href="/contact" onClick={() => setMenuOpen(false)} className={navLinkClasses + " w-full"}>
              <Phone size={18} /> Contact
            </Link>
            {pathname === '/contact' && <div className="h-[2px] w-10 bg-[#C49B9E] mt-1 rounded-full"></div>}
          </div>

          {/* Admin Orders */}
          {currentUser?.uid === "cJ2MGVYgnZZVyI6Xy54XrIxj1YO2" && (
            <div className="flex flex-col items-start">
              <Link href="/admin/orders" onClick={() => setMenuOpen(false)} className={navLinkClasses + " w-full"}>
                <ClipboardList size={18} /> Orders
              </Link>
              {pathname === '/admin/orders' && <div className="h-[2px] w-10 bg-[#C49B9E] mt-1 rounded-full"></div>}
            </div>
          )}

          {/* My Orders */}
          {currentUser && (
            <div className="flex flex-col items-start">
              <Link href="/my-orders" onClick={() => setMenuOpen(false)} className={navLinkClasses + " w-full"}>
                <ClipboardList size={18} /> My Orders
              </Link>
              {pathname === '/my-orders' && <div className="h-[2px] w-10 bg-[#C49B9E] mt-1 rounded-full"></div>}
            </div>
          )}

          {/* Cart */}
          <div className="flex flex-col items-start">
            <Link href="/cart" onClick={() => setMenuOpen(false)} className={navLinkClasses + " w-full"}>
              <ShoppingCart size={18} /> Cart
            </Link>
            {pathname === '/cart' && <div className="h-[2px] w-10 bg-[#C49B9E] mt-1 rounded-full"></div>}
          </div>

          {/* Login */}
          <div className="flex flex-col items-start">
            <Link href="/login" onClick={() => setMenuOpen(false)} className={navLinkClasses + " w-full"}>
              <ShoppingCart size={18} /> Login
            </Link>
            {pathname === '/login' && <div className="h-[2px] w-10 bg-[#C49B9E] mt-1 rounded-full"></div>}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};
