"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import ReviewModal from "./ReviewModal";

export default function HomePage() {

  const [reviews, setReviews] = useState<Array<{ text: string; name: string; rating: number; date: string }>>([]);
  const [promotionalPosters, setPromotionalPosters] = useState<Array<{ title: string; subtitle: string; description: string; image: string; gradient: string; link: string; badge: string; }>>([]);
  const [bestSellers, setBestSellers] = useState<Array<{ title: string; subtitle: string; description: string; image: string; gradient: string; link: string; badge: string; }>>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [menuProducts, setMenuProducts] = useState<Array<{ id: number; category: string; name: string; price: number; images: string[]; desc: string; material: string; size: string; care: string }>>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/reviews');
        setReviews((response.data as any).reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([
          { text: "The chocolate cake was absolutely divine — moist and rich!", name: "Varsha", rating: 5, date: "" },
          { text: "The vanilla cupcakes were perfectly baked and so delicious!", name: "Gaytri", rating: 5, date: "" },
          { text: "Loved the blueberry muffins — fresh and fluffy!", name: "Riya", rating: 5, date: "" },
          { text: "Amazing packaging and fast delivery! Definitely ordering again 💕", name: "Sneha", rating: 5, date: "" },
          { text: "The red velvet cake made my birthday unforgettable ✨", name: "Prachi", rating: 5, date: "" },
          { text: "Beautiful presentation — every treat is perfect ❤️", name: "Ananya", rating: 5, date: "" },
        ]);
      }
    };

    const fetchPromotionalProducts = async () => {
      try {
        const response = await axios.get('/api/promotional');
        setPromotionalPosters(response.data as Array<{ title: string; subtitle: string; description: string; image: string; gradient: string; link: string; badge: string; }>);
      } catch (error) {
        console.error('Error fetching promotional products:', error);
        setPromotionalPosters([
          {
            title: "Chocolate Cake",
            subtitle: "₹650",
            description: "Rich & Decadent",
            image: "/Bag.jpeg",
            gradient: "from-[#FFDEE9] via-[#B5FFFC] to-[#FFDEE9]",
            link: "/product",
            badge: "Best Seller",
          },
          {
            title: "Vanilla Cupcakes",
            subtitle: "₹250/dozen",
            description: "Classic & Creamy",
            image: "/Keychain.jpeg",
            gradient: "from-[#FFDEE9] via-[#B5FFFC] to-[#FFDEE9]",
            link: "/product",
            badge: "New",
          },
          {
            title: "Blueberry Muffins",
            subtitle: "₹180/half-dozen",
            description: "Fresh & Fluffy",
            image: "https://5.imimg.com/data5/SELLER/Default/2023/10/356882773/RM/JT/RC/394432/whatsapp-image-2023-10-29-at-9-30-33-am-1000x1000.jpeg",
            gradient: "from-[#FFDEE9] via-[#B5FFFC] to-[#FFDEE9]",
            link: "/product",
            badge: "Trending",
          },
          {
            title: "Red Velvet Cake",
            subtitle: "₹750",
            description: "Velvety & Delicious",
            image: "https://imagedelivery.net/0ObHXyjKhN5YJrtuYFSvjQ/i-b45fda22-f060-4271-a636-f09a53dfae66-Macrame-Heart-Wall-Hanging-Heart-Wall-Art-Valentine-Gift-Eco-Friendly-Natural-Craft-Studio/display",
            gradient: "from-[#FFDEE9] via-[#B5FFFC] to-[#FFDEE9]",
            link: "/product",
            badge: "Popular",
          },
        ]);
      }
    };

    const fetchBestSellers = async () => {
      try {
        const response = await axios.get('/api/best-sellers');
        setBestSellers(response.data as Array<{ title: string; subtitle: string; description: string; image: string; gradient: string; link: string; badge: string; }>);
      } catch (error) {
        console.error('Error fetching best sellers:', error);
        setBestSellers([
          {
            title: "Chocolate Cake",
            subtitle: "₹650",
            description: "Rich & Decadent",
            image: "/Bag.jpeg",
            gradient: "from-[#FFDEE9] via-[#B5FFFC] to-[#FFDEE9]",
            link: "/product",
            badge: "Best Seller",
          },
          {
            title: "Vanilla Cupcakes",
            subtitle: "₹250/dozen",
            description: "Classic & Creamy",
            image: "/Keychain.jpeg",
            gradient: "from-[#FFDEE9] via-[#B5FFFC] to-[#FFDEE9]",
            link: "/product",
            badge: "New",
          },
          {
            title: "Blueberry Muffins",
            subtitle: "₹180/half-dozen",
            description: "Fresh & Fluffy",
            image: "https://5.imimg.com/data5/SELLER/Default/2023/10/356882773/RM/JT/RC/394432/whatsapp-image-2023-10-29-at-9-30-33-am-1000x1000.jpeg",
            gradient: "from-[#FFDEE9] via-[#B5FFFC] to-[#FFDEE9]",
            link: "/product",
            badge: "Trending",
          },
          {
            title: "Red Velvet Cake",
            subtitle: "₹750",
            description: "Velvety & Delicious",
            image: "https://imagedelivery.net/0ObHXyjKhN5YJrtuYFSvjQ/i-b45fda22-f060-4271-a636-f09a53dfae66-Macrame-Heart-Wall-Hanging-Heart-Wall-Art-Valentine-Gift-Eco-Friendly-Natural-Craft-Studio/display",
            gradient: "from-[#FFDEE9] via-[#B5FFFC] to-[#FFDEE9]",
            link: "/product",
            badge: "Popular",
          },
        ]);
      }
    };

    const fetchMenuProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setMenuProducts(response.data as Array<{ id: number; category: string; name: string; price: number; images: string[]; desc: string; material: string; size: string; care: string }>);
      } catch (error) {
        console.error('Error fetching menu products:', error);
        setMenuProducts([
          // Keep your fallback products here (same as original)
        ]);
      }
    };

    fetchReviews();
    fetchPromotionalProducts();
    fetchBestSellers();
    fetchMenuProducts();
  }, []);

  const handleSubmitReview = async (rating: number, comment: string) => {
    try {
      await axios.post('/api/review', {
        rating,
        comment,
        type: 'general'
      });
      const response = await axios.get('/api/reviews');
      setReviews((response.data as any).reviews);
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  const groupedMenuProducts = useMemo(() => {
    const grouped = menuProducts.reduce((acc, product) => {
      if (!acc[product.category]) acc[product.category] = [];
      acc[product.category].push({ name: product.name, price: `₹${product.price}` });
      return acc;
    }, {} as Record<string, Array<{ name: string; price: string }>>);
    return Object.entries(grouped).map(([category, items]) => ({ category, items }));
  }, [menuProducts]);

  const whyChooseUsItems = [
    { title: "Freshly Baked Daily", desc: "Every treat is baked fresh each morning using premium ingredients — made with love to bring you something truly special 🎁", icon: "🍰" },
    { title: "Quality & Taste", desc: "Our recipes blend traditional techniques with modern flavors, creating desserts that are both delicious and memorable ✨", icon: "🧁" },
    { title: "Delivered with Care", desc: "Each order is packaged with attention to detail — because your satisfaction is as important as the taste itself 🎀", icon: "🎂" },
  ];

  return (
    <main className="bg-gradient-to-b from-[#FFDEE9] to-[#B5FFFC] text-gray-800">
      {/* 🎨 Scrolling Promotional Banner */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 600,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={1000}
          loop={false}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          className="h-full w-full mt-10"
        >
          {promotionalPosters.map((poster, index) => (
            <SwiperSlide key={index} className="pointer-events-auto">
              <div
                className="relative h-full w-full flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: "#CCA6A2" }}
              >
                {/* Ambient glow layers */}
                <motion.div
                  className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/20 blur-[90px]"
                  animate={{ opacity: [0.25, 0.4, 0.25], scale: [1, 1.1, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#A77D82]/30 blur-[110px]"
                  animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.12, 1] }}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />

                {/* Main Square Container */}
                <Link
                  href="/product"
                  className="pointer-events-auto block relative w-[90%] h-[80%] max-w-4xl max-h-[450px] flex flex-col md:flex-row items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 cursor-pointer"
                >
                  {/* Left Side - Product Image with Motion */}
                  <div className="relative w-full md:w-1/2 h-full flex items-center justify-center p-6 md:p-8">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0, rotate: -6 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 120 }}
                      whileHover={{ scale: 1.04, rotate: 2 }}
                      className="relative z-10 w-full h-full flex items-center justify-center"
                    >
                      <div className="relative w-full h-full max-w-xs max-h-80 p-2 rounded-xl bg-gradient-to-br from-white/70 via-white/30 to-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                        <div className="relative w-full h-full bg-white/20 backdrop-blur-md rounded-lg border border-white/30 overflow-hidden">
                          <motion.div
                            className="absolute -top-10 -left-10 w-40 h-40 rotate-45 bg-white/20"
                            animate={{ x: [0, 220, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                          />
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.35, duration: 0.6 }}
                            whileHover={{ y: -8 }}
                            className="w-full h-full flex items-center justify-center"
                          >
                            <div className="relative w-full h-full flex items-center justify-center p-4">
                              <Image
                                src={poster.image}
                                alt={poster.title}
                                width={400}
                                height={300}
                                className="w-full h-full max-h-64 object-contain drop-shadow-2xl"
                              />
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Floating Badge */}
                    <motion.div
                      className="absolute top-4 left-4 bg-[#8B5E61] text-white font-bold px-3 py-1 rounded-lg text-sm shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-white/30"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.6, type: "spring" }}
                    >
                      {poster.badge}
                    </motion.div>
                  </div>

                  {/* Right Side - Content (Hidden on mobile) */}
                  <div className="absolute md:relative w-full md:w-1/2 h-full flex items-center justify-center p-6 md:p-8 bg-gradient-to-l md:bg-gradient-to-r from-black/30 md:from-transparent to-transparent">
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="text-center md:text-left z-20 w-full max-w-md"
                    >
                      <div className="hidden md:block">
                        <motion.h2
                          className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#5D3A3F] mb-3 drop-shadow-2xl leading-tight"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          {poster.title}
                        </motion.h2>
                        <motion.p
                          className="text-xl md:text-2xl text-[#5D3A3F]/90 mb-2 font-extrabold drop-shadow-lg tracking-tight"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          {poster.subtitle}
                        </motion.p>
                        {/* Rating */}
                        <motion.div
                          className="flex items-center justify-center md:justify-start gap-2 text-[#5D3A3F]/80 mb-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.65 }}
                        >
                          <span className="text-yellow-300">★★★★★</span>
                          <span className="text-xs">4.9/5 • 120+ reviews</span>
                        </motion.div>
                        <motion.p
                          className="text-sm md:text-base text-[#5D3A3F]/80 mb-6 drop-shadow-md leading-relaxed"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          {poster.description}
                        </motion.p>
                        <motion.div
                          className="flex items-center justify-center md:justify-start gap-2"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 }}
                        >
                          <span
                            className="inline-block bg-white text-[#8B5E61] font-bold py-2 px-5 rounded-lg shadow-2xl hover:bg-[#F0D6D8] hover:shadow-[#8B5E61]/50 transition-all duration-300 transform hover:scale-105 text-sm cursor-pointer"
                          >
                            Shop Now →
                          </span>
                          <span
                            className="inline-block bg-white/15 text-[#5D3A3F] font-semibold py-2 px-5 rounded-lg border border-white/40 hover:bg-white/25 transition-all duration-300 text-sm cursor-pointer"
                          >
                            View Details
                          </span>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-12 text-center">
          <p className="text-[#5D3A3F]/80 mb-6 text-lg">Loved our cakes? Share your experience!</p>
          <button
            onClick={() => setShowReviewModal(true)}
            className="inline-block bg-gradient-to-r from-rose-300 to-rose-400 hover:from-rose-400 hover:to-rose-300 text-white font-semibold py-3 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Write a Review ⭐
          </button>
        </div>
      </section>

      {/* 🎁 Offer Banner */}
      <div className="bg-[#F5E3D3] text-[#6B4C3B] py-3 overflow-hidden relative">
        <motion.div
          className="whitespace-nowrap text-center text-lg font-medium tracking-wide flex"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <span className="mr-[400px]">
            🎁 Special Offer: Get a FREE GIFT on your FIRST order above ₹250 💖
          </span>
          <span className="w-[400px] inline-block"></span>
          <span className="mr-[400px]">
            For <span className="font-semibold text-[#5A3B2C]">customized hampers 🎀</span>,
            <span className="font-medium text-[#8C5E44]">DM me on WhatsApp 💬</span>!
          </span>
        </motion.div>
      </div>

      {/* 🌸 Hero Section */}
  <section className="relative text-center py-16 md:py-24 bg-gradient-to-br from-[#FFD9D6] via-white to-[#FFD9D6]">
  <div className="max-w-5xl mx-auto px-6 md:px-12">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#B78B89] to-[#B78B89] bg-clip-text text-transparent">
        Every Piece Tells a Story — Crafted with Love 💖
      </h1>
      <p className="text-lg md:text-xl mb-10 text-[#A47573] max-w-2xl mx-auto leading-relaxed">
        Freshly Baked Cakes &amp; Cupcakes • Delicious Muffins • Custom Cake Orders • Bakery Specialties
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          href="/product"
          className="inline-block bg-gradient-to-r from-[#B78B89] to-[#B78B89] hover:from-[#A47573] hover:to-[#A47573] text-white font-semibold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          Shop Now
        </Link>
        <button
          onClick={() => setShowReviewModal(true)}
          className="inline-block bg-white text-[#B28A87] border-2 border-[#B28A87] hover:bg-[#FFEAEA] font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm"
        >
          Write a Review ⭐
        </button>
      </div>
    </motion.div>
  </div>
</section>


      {/* 🌿 About Section */}
    <section className="text-center py-20 px-6 md:px-20 bg-gradient-to-b from-white to-[#FFE8E6]">
  <div className="max-w-4xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#B78B89] to-[#B78B89] bg-clip-text text-transparent">
        About Me
      </h2>
      <div className="w-24 h-1.5 bg-gradient-to-r from-[#C49B9E] to-[#C49B9E] mx-auto mb-8 rounded-full"></div>
      <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed text-[#A47573]">
        Hi, I&apos;m <span className="font-semibold text-[#CCA6A2]">Teju</span> — a passionate
        baker who finds joy in creating delicious treats. From rich{" "}
        <span className="font-medium text-[#C49B9E]">chocolate cakes</span>, creamy{" "}
        <span className="font-medium text-[#C49B9E]">vanilla cupcakes</span>, fluffy{" "}
        <span className="font-medium text-[#C49B9E]">blueberry muffins</span>, to velvety{" "}
        <span className="font-medium text-[#C49B9E]">red velvet cakes</span>, every baked good I create
        carries a touch of warmth, quality ingredients, and love. My goal is to turn simple ingredients
        into memorable experiences that bring joy and sweetness to your special moments ✨
      </p>
    </motion.div>
  </div>
</section>


      {/* 🍰 Menu Section */}
   <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-[#FFF0F0] to-white">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-center mb-16"
  >
    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#CCA6A2] to-[#C49B9E] bg-clip-text text-transparent">
      Our Menu 🍰
    </h2>
    <div className="w-24 h-1.5 bg-gradient-to-r from-[#C49B9E] to-[#B78B89] mx-auto rounded-full"></div>
    <p className="text-[#7D5A5F] mt-4 max-w-2xl mx-auto">
      Discover our delicious range of freshly baked goods, from classic cakes to premium chocolates
    </p>
  </motion.div>

  {/* Sliding Menu with PDF */}
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="bg-white rounded-3xl shadow-2xl p-6 border border-[#E8CFCF] max-w-4xl mx-auto"
  >
    <div className="text-center mb-6">
      <h3 className="text-2xl md:text-3xl font-bold text-[#CCA6A2] mb-2">
        🍰 Our Complete Menu
      </h3>
      <p className="text-[#7D5A5F]">Swipe through our menu categories and full PDF</p>
    </div>

    <Swiper
      modules={[Pagination, Navigation]}
      spaceBetween={20}
      slidesPerView={1}
      pagination={{ clickable: true }}
      navigation
      className="h-[500px] md:h-[600px]"
    >
      {/* Image Slides */}
      {["menu.png", "menu1.png", "menu3.png"].map((imgSrc, index) => (
        <SwiperSlide key={index}>
          <div className="h-full flex flex-col items-center justify-center">
            <div className="flex-1 flex items-center justify-center overflow-hidden rounded-2xl border-2 border-[#E8CFCF]">
              <Image
                src={`/${imgSrc}`}
                alt={`Menu ${index + 1}`}
                width={800}
                height={600}
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </motion.div>

  <div className="text-center mt-12">
    <p className="text-[#7D5A5F] mb-4">For orders: 9893375626</p>
    <Link
      href="/contact"
      className="inline-block bg-gradient-to-r from-[#CCA6A2] to-[#C49B9E] hover:from-[#C49B9E] hover:to-[#B78B89] text-white font-semibold py-3 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
    >
      Order Now 📞
    </Link>
  </div>
</section>


      {/* 🛍️ Featured Products — Auto Slide */}
   <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-white to-[#FFF0F0] relative overflow-hidden">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-center mb-16"
  >
    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#CCA6A2] to-[#C49B9E] bg-clip-text text-transparent">
      Best Sellers ✨
    </h2>
    <div className="w-24 h-1.5 bg-gradient-to-r from-[#C49B9E] to-[#B78B89] mx-auto rounded-full"></div>
  </motion.div>

  <Swiper
    modules={[Autoplay]}
    autoplay={{ delay: 2500, disableOnInteraction: false }}
    loop={true}
    spaceBetween={30}
    slidesPerView={1}
    breakpoints={{
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    }}
  >
    {bestSellers.map((item, index) => (
      <SwiperSlide key={index}>
        <motion.div
          whileHover={{
            rotateY: index % 2 === 0 ? 10 : -10,
            scale: 1.05,
            boxShadow: "0 20px 60px rgba(204, 166, 162, 0.4)",
          }}
          className="relative bg-white rounded-3xl shadow-2xl p-6 border border-[#E8CFCF] flex flex-col items-center justify-center overflow-hidden group"
        >
          <div className="absolute top-5 right-6 text-3xl text-[#CCA6A2] animate-bounce">✨</div>

          <div className="w-full h-64 bg-gradient-to-br from-[#FFECEC] to-white rounded-2xl overflow-hidden flex items-center justify-center mb-5 shadow-inner">
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.4 }} className="max-h-[240px] w-auto">
              <div className="relative max-h-[240px] w-auto">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={400}
                  className="max-h-[240px] w-auto object-contain drop-shadow-md"
                />
              </div>
            </motion.div>
          </div>

          <h3 className="text-2xl font-bold text-[#7D5A5F] mb-2">{item.title}</h3>
          <p className="text-[#CCA6A2] font-semibold text-lg">{item.subtitle}</p>

          <Link
            href="/product"
            className="mt-4 bg-[#CCA6A2] hover:bg-[#C49B9E] text-white font-semibold py-2 px-6 rounded-full shadow-lg transition"
          >
            View
          </Link>
        </motion.div>
      </SwiperSlide>
    ))}
  </Swiper>

  <div className="text-center mt-20">
    <Link
      href="/product"
      className="bg-[#CCA6A2] hover:bg-[#C49B9E] text-white font-semibold py-3 px-8 rounded-full shadow-lg transition"
    >
      Explore More →
    </Link>
  </div>
</section>

{/* Customer Love */}
<section className="py-20 text-center px-6 md:px-20 bg-gradient-to-b from-[#FFF0F0] to-white">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="mb-12"
  >
    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#5D3A3F]">
      Customer Love ❤️
    </h2>
    <div className="w-24 h-1.5 bg-gradient-to-r from-[#C49B9E] to-[#B78B89] mx-auto rounded-full"></div>
  </motion.div>

  <Swiper
    modules={[Autoplay, Pagination]}
    autoplay={{ delay: 2500, disableOnInteraction: false }}
    loop={true}
    spaceBetween={30}
    slidesPerView={1}
    pagination={{ clickable: true }}
    breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
    className="max-w-6xl mx-auto"
  >
    {reviews.map((review, index) => (
      <SwiperSlide key={index}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-[#E8CFCF] hover:shadow-2xl hover:scale-105 transition-all duration-300 mx-4"
        >
          <div className="text-4xl mb-4">💕</div>
          <p className="italic text-gray-700 mb-6 text-lg leading-relaxed">
            &quot;{review.text}&quot;
          </p>
          <h4 className="font-semibold text-[#CCA6A2] text-lg">– {review.name}</h4>
        </motion.div>
      </SwiperSlide>
    ))}
  </Swiper>
</section>

{/* Contact / WhatsApp */}
<section className="text-center py-20 px-6 md:px-20 bg-gradient-to-br from-[#E8F8F0] via-[#FFF0F0] to-white">
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="max-w-2xl mx-auto"
  >
    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5D3A3F]">
      Stay Connected 💌
    </h2>
    <div className="w-24 h-1.5 bg-gradient-to-r from-[#C49B9E] to-[#B78B89] mx-auto mb-8 rounded-full"></div>
    <p className="text-gray-700 mb-10 text-lg md:text-xl leading-relaxed">
      Be the first to know about new arrivals, discounts, and exclusive designs!
    </p>
    <Link
      href="/contact"
      className="inline-block bg-gradient-to-r from-[#CCA6A2] to-[#C49B9E] hover:from-[#C49B9E] hover:to-[#B78B89] text-white font-semibold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
    >
      Contact Us on WhatsApp
    </Link>
  </motion.div>
</section>

{/* Why Choose Us */}
<section className="py-20 bg-gradient-to-b from-white to-[#FFF0F0] text-center relative overflow-hidden">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="mb-16"
  >
    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#5D3A3F]">
      Why Choose Us 💕
    </h2>
    <div className="w-24 h-1.5 bg-gradient-to-r from-[#C49B9E] to-[#B78B89] mx-auto rounded-full"></div>
  </motion.div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6 md:px-20">
    {whyChooseUsItems.map((item, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        viewport={{ once: true }}
        className="bg-white rounded-3xl shadow-lg p-8 relative border border-[#E8CFCF] hover:shadow-2xl hover:scale-105 transition-transform duration-300"
      >
        <div className="text-5xl mb-4">{item.icon}</div>
        <h3 className="text-2xl font-semibold text-[#CCA6A2] mb-3">{item.title}</h3>
        <p className="text-gray-600">{item.desc}</p>
      </motion.div>
    ))}
  </div>
</section>


      {/* 💬 Floating WhatsApp Button - Small Round */}
      <motion.a
        href="https://wa.me/917722893524?text=Hi!%20I%27m%20interested%20in%20your%20handmade%20products%20%E2%9C%A8"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-green-500/50 transition-all duration-300"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.15, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.a>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmitReview={handleSubmitReview}
      />
    </main>
  );
}
