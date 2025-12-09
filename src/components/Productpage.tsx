"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { auth } from "@/context/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import axios from "axios";

interface Product {
  id: number;
  category: string;
  name: string;
  price: number;
  images: string[];
  desc: string;
  material: string;
}

interface UploadResponse {
  imageUrls: string[];
}

interface PromotionalProduct {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  gradient: string;
  link: string;
  badge: string;
  visible: boolean;
}

interface BestSellerProduct {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  gradient: string;
  link: string;
  badge: string;
  visible: boolean;
}



export default function Productpage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [promotionalProducts, setPromotionalProducts] = useState<PromotionalProduct[]>([]);
  const [bestSellerProducts, setBestSellerProducts] = useState<BestSellerProduct[]>([]);
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    price: "",
    images: [] as File[],
    desc: "",
    material: "",
  });

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      });
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all data in parallel to reduce loading time
        const [productsResponse, promotionalResponse, bestSellersResponse] = await Promise.all([
          axios.get<Product[]>('/api/products'),
          axios.get<PromotionalProduct[]>('/api/promotional'),
          axios.get<BestSellerProduct[]>('/api/best-sellers')
        ]);

        setProducts(productsResponse.data);
        setPromotionalProducts(promotionalResponse.data);
        setBestSellerProducts(bestSellersResponse.data);

        // Check for product query parameter and select the product
        if (searchParams) {
          const productName = searchParams.get('product');
          if (productName) {
            const product = productsResponse.data.find(p => p.name === decodeURIComponent(productName));
            if (product) {
              setSelectedProduct(product);
              setActiveImage(0);
              setQuantity(1);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to default products if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [searchParams]);

  useEffect(() => {
    // Load liked products from localStorage
    const liked = JSON.parse(localStorage.getItem("likedProducts") || "[]");
    setLikedProducts(liked);
  }, []);

  const toggleLike = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the product modal
    const updatedLiked = likedProducts.includes(productId)
      ? likedProducts.filter((id) => id !== productId)
      : [...likedProducts, productId];
    setLikedProducts(updatedLiked);
    localStorage.setItem("likedProducts", JSON.stringify(updatedLiked));
  };

  const addToPromotional = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the product modal
    try {
      const promotionalData = {
        title: product.name,
        subtitle: `₹${product.price}`,
        description: product.desc,
        image: product.images[0],
        gradient: "from-pink-300 via-rose-300 to-pink-300",
        link: "/product",
        badge: product.category,
        visible: true,
      };
      await axios.post('/api/promotional', promotionalData);
      alert('Product added to promotional banner successfully!');
      // Refresh promotional products
      const response = await axios.get<PromotionalProduct[]>('/api/promotional');
      setPromotionalProducts(response.data);
    } catch (error) {
      console.error('Error adding to promotional:', error);
      alert('Failed to add product to promotional banner. Please try again.');
    }
  };

  const removeFromPromotional = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the product modal
    if (!confirm('Are you sure you want to remove this product from promotional banner?')) return;

    try {
      const promotionalItem = promotionalProducts.find(p => p.title === product.name);
      if (promotionalItem && promotionalItem._id) {
        const config = {
          data: { id: promotionalItem._id }
        };
        await axios.request({
          method: "DELETE",
          url: "/api/promotional",
          data: { id: promotionalItem._id }
        });

        alert("Product removed from promotional banner successfully!");

        // Refresh promotional products
        const response = await axios.get<PromotionalProduct[]>('/api/promotional');
        setPromotionalProducts(response.data);

      }
    } catch (error) {
      console.error('Error removing from promotional:', error);
      alert('Failed to remove product from promotional banner. Please try again.');
    }
  };

  const addToBestSellers = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the product modal
    try {
      const bestSellerData = {
        title: product.name,
        subtitle: `₹${product.price}`,
        description: product.desc,
        image: product.images[0],
        gradient: "from-yellow-300 via-orange-300 to-red-300",
        link: "/product",
        badge: product.category,
        visible: true,
      };
      await axios.post('/api/best-sellers', bestSellerData);
      alert('Product added to best sellers successfully!');
      // Refresh best seller products
      const response = await axios.get<BestSellerProduct[]>('/api/best-sellers');
      setBestSellerProducts(response.data);
    } catch (error) {
      console.error('Error adding to best sellers:', error);
      alert('Failed to add product to best sellers. Please try again.');
    }
  };

  const removeFromBestSellers = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the product modal
    if (!confirm('Are you sure you want to remove this product from best sellers?')) return;

    try {
      const bestSellerItem = bestSellerProducts.find(p => p.title === product.name);
      if (bestSellerItem && bestSellerItem._id) {
        const config = {
          data: { id: bestSellerItem._id }
        };
        await axios.request({
          method: "DELETE",
          url: "/api/best-sellers",
          data: { id: bestSellerItem._id }
        });

        alert("Product removed from best sellers successfully!");

        // Refresh best seller products
        const response = await axios.get<BestSellerProduct[]>('/api/best-sellers');
        setBestSellerProducts(response.data);

      }
    } catch (error) {
      console.error('Error removing from best sellers:', error);
      alert('Failed to remove product from best sellers. Please try again.');
    }
  };

  const addToCart = (product: Product) => {
    const cart: (Product & { quantity: number })[] = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setSelectedProduct(null);
    router.push("/cart");
  };

  const categories = Array.from(new Set(products && Array.isArray(products) ? products.map((p) => p.category) : []));

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      category: product.category,
      name: product.name,
      price: product.price.toString(),
      images: [],
      desc: product.desc,
      material: product.material,
    });
    setShowEditForm(true);
  };

  const handleDelete = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`/api/products/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      let imageUrls = editingProduct.images;

      // Upload new images if any
      if (formData.images.length > 0) {
        const formDataUpload = new FormData();
        formData.images.forEach((file) => {
          formDataUpload.append('files', file);
        });

        const uploadResponse = await axios.post<UploadResponse>('/api/upload', formDataUpload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        imageUrls = uploadResponse.data.imageUrls;
      }

      // Update product
      const productData = {
        category: formData.category,
        name: formData.name,
        price: parseFloat(formData.price),
        images: imageUrls,
        desc: formData.desc,
        material: formData.material,
      };

      await axios.put(`/api/products/${editingProduct.id}`, productData);

      // Update local state
      setProducts(products.map(p =>
        p.id === editingProduct.id
          ? { ...p, ...productData, id: editingProduct.id }
          : p
      ));

      setShowEditForm(false);
      setEditingProduct(null);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Upload images to server
      const formDataUpload = new FormData();
      formData.images.forEach((file) => {
        formDataUpload.append('files', file);
      });

      const uploadResponse = await axios.post<UploadResponse>('/api/upload', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrls = uploadResponse.data.imageUrls;

      // Save product to database
      const productData = {
        category: formData.category,
        name: formData.name,
        price: parseFloat(formData.price),
        images: imageUrls,
        desc: formData.desc,
        material: formData.material,
      };

      await axios.post('/api/products', productData);

      // Reset form and close modal
      setFormData({
        category: "",
        name: "",
        price: "",
        images: [],
        desc: "",
        material: "",
      });
      setShowAddForm(false);

      // Optionally refresh the page or update the products list
      window.location.reload();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 py-10 px-4 sm:px-6">
      <div className="relative min-h-screen py-10 overflow-hidden">
        <div className="relative z-10">
          <motion.h1
            className="text-3xl sm:text-4xl font-extrabold text-center text-pink-700 mb-12 drop-shadow-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Discover Beautiful Creations That Inspire 🌸
          </motion.h1>
{(currentUser?.uid === "cJ2MGVYgnZZVyI6Xy54XrIxj1YO2" || currentUser?.uid === "H2oiDqPTiOcTrl4qIHVJ1523xNr2") &&(
            <div className="text-center mb-8">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-[#CCA6A2] to-[#B78B89] text-white px-6 py-3 rounded-full hover:from-[#B78B89] hover:to-[#5D3A3F] hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium"
              >
                ➕ Add New Product
              </button>
            </div>

          )}

          {categories.map((cat, i) => (
            <motion.div
              key={cat}
              className="max-w-6xl mx-auto mb-16 bg-white/60 backdrop-blur-lg border border-white/40 shadow-2xl rounded-3xl p-6 sm:p-8 transition-all duration-500"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-semibold text-pink-700 mb-6 text-center">
                {cat} Collection
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products
                  .filter((p) => p.category === cat)
                  .map((product) => (
                    <motion.div
                      key={product.id}
                      onClick={() => {
                        setSelectedProduct(product);
                        setActiveImage(0);
                        setQuantity(1);
                      }}
                      className="group relative rounded-3xl bg-gradient-to-br from-white via-pink-50 to-rose-50 border border-pink-100 shadow-md hover:shadow-lg transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center p-3 sm:p-5"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 1.01 }}
                    >
                      <div className="relative w-full h-28 sm:h-52 flex items-center justify-center">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="w-full h-full object-contain"
                          priority={false}
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                          quality={75}
                        />

                        {/* Like Button - Top Right Corner */}
                        <button
                          onClick={(e) => toggleLike(product.id, e)}
                          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${likedProducts.includes(product.id)
                              ? 'bg-red-500 text-white shadow-lg'
                              : 'bg-white/80 text-gray-600 hover:bg-white shadow-md'
                            }`}
                        >
                          {likedProducts.includes(product.id) ? '❤️' : '🤍'}
                        </button>
                      </div>

                      {/* Admin Buttons - Below Image */}
                    {(currentUser?.uid === "cJ2MGVYgnZZVyI6Xy54XrIxj1YO2" || currentUser?.uid === "H2oiDqPTiOcTrl4qIHVJ1523xNr2") && (
                        <div className="flex justify-center gap-1 mt-2">
                          {/* Add/Remove from Promotional Button */}
                          <button
                            onClick={(e) => promotionalProducts.some(p => p.title === product.name) ? removeFromPromotional(product, e) : addToPromotional(product, e)}
                            className={`w-8 h-8 rounded-full text-white flex items-center justify-center transition-all duration-300 shadow-md ${promotionalProducts.some(p => p.title === product.name)
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-blue-500 hover:bg-blue-600'
                              }`}
                            title={promotionalProducts.some(p => p.title === product.name) ? "Remove from Promotional Banner" : "Add to Promotional Banner"}
                          >
                            📢
                          </button>

                          {/* Add/Remove from Best Sellers Button */}
                          <button
                            onClick={(e) => bestSellerProducts.some(p => p.title === product.name) ? removeFromBestSellers(product, e) : addToBestSellers(product, e)}
                            className={`w-8 h-8 rounded-full text-white flex items-center justify-center transition-all duration-300 shadow-md ${bestSellerProducts.some(p => p.title === product.name)
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-green-500 hover:bg-green-600'
                              }`}
                            title={bestSellerProducts.some(p => p.title === product.name) ? "Remove from Best Sellers" : "Add to Best Sellers"}
                          >
                            ⭐
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(product);
                            }}
                            className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center transition-all duration-300 shadow-md hover:bg-blue-600"
                            title="Edit Product"
                          >
                            ✏️
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(product.id);
                            }}
                            className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center transition-all duration-300 shadow-md hover:bg-red-600"
                            title="Delete Product"
                          >
                            🗑️
                          </button>
                        </div>
                      )}

                      <h3 className="mt-2 text-sm sm:text-lg font-semibold text-gray-800 text-center break-words">
                        {product.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 text-center">
                        {product.desc}
                      </p>
                      <p className="mt-1 text-pink-600 font-bold text-center">
                        ₹{product.price}
                      </p>

                      <button
                        className="mt-2 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md text-xs sm:text-sm text-pink-700 shadow-sm hover:shadow-md transition-all duration-300"
                        onClick={() => {
                          setSelectedProduct(product);
                          setActiveImage(0);
                          setQuantity(1);
                        }}
                      >
                        👀 View Details
                      </button>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}

        </div>

        {/* Modal remains same as your desktop layout */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative bg-white/80 backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl max-w-5xl w-full p-6 sm:p-8 mx-4 overflow-y-auto max-h-[90vh]"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 120 }}
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-3 right-4 z-50 text-gray-500 hover:text-pink-600 text-3xl sm:text-4xl font-bold bg-white/70 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                >
                  ×
                </button>

                {/* Modal content remains the same */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-10">
                  <div className="flex-1">
                    <motion.div
                      key={selectedProduct!.images[activeImage]}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className="relative rounded-3xl overflow-hidden w-full h-80 flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-100 to-amber-50 shadow-[0_12px_40px_rgba(0,0,0,0.18)] border border-pink-200/60 hover:shadow-[0_20px_55px_rgba(0,0,0,0.28)] hover:scale-[1.02] transition-all duration-500"
                    >
                      <Image
                        src={selectedProduct!.images[activeImage]}
                        alt={selectedProduct!.name}
                        width={500}
                        height={500}
                        className="object-contain max-h-full max-w-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
                      />
                    </motion.div>

                    <div className="flex justify-center mt-4 gap-3 flex-wrap">
                      {selectedProduct!.images.map((img, i) => (
                        <Image
                          key={i}
                          src={img}
                          alt="thumb"
                          width={100}
                          height={100}
                          onClick={() => setActiveImage(i)}
                          className={`w-16 h-16 object-cover rounded-xl cursor-pointer transition-all duration-300 border-2 ${activeImage === i
                            ? "border-pink-500 scale-110 shadow-md"
                            : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-3">
                        {selectedProduct!.name}
                      </h2>
                      <p className="text-gray-600 mb-4 text-base sm:text-lg">
                        {selectedProduct!.desc}
                      </p>

                      <div className="bg-white/60 rounded-2xl p-4 border border-pink-100 mb-4">
                        <ul className="text-sm text-gray-700 space-y-2">
                          <li>
                            <strong>Material:</strong> {selectedProduct!.material}
                          </li>

                        </ul>
                      </div>

                      <div className="flex items-center gap-3 mb-5">
                        <span className="font-medium text-gray-700">
                          Quantity:
                        </span>
                        <div className="flex items-center border rounded-xl bg-white/80 backdrop-blur-sm">
                          <button
                            onClick={() =>
                              setQuantity((q) => (q > 1 ? q - 1 : 1))
                            }
                            className="px-3 py-1 text-lg font-bold text-pink-600"
                          >
                            −
                          </button>
                          <span className="px-4 font-medium">{quantity}</span>
                          <button
                            onClick={() => setQuantity((q) => q + 1)}
                            className="px-3 py-1 text-lg font-bold text-pink-600"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <p className="text-xl font-bold text-pink-700">
                        ₹{selectedProduct!.price * quantity}
                      </p>
                    </div>

                    <div className="flex gap-4 mt-6 flex-col sm:flex-row">
                      <Link
                        href={`/order?product=${encodeURIComponent(
                          selectedProduct!.name
                        )}&price=${selectedProduct!.price}&qty=${quantity}&image=${encodeURIComponent(
                          selectedProduct!.images[0]
                        )}`}
                        className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300 text-center flex-1"
                      >
                        Buy Now
                      </Link>

                      <button
                        onClick={() => addToCart(selectedProduct!)}
                        className="border-2 border-pink-400 text-pink-600 px-6 py-3 rounded-full hover:bg-pink-50 hover:scale-105 transition-all duration-300 flex-1 font-medium"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Product Form Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative bg-white/80 backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl max-w-2xl w-full p-6 sm:p-8 mx-4 overflow-y-auto max-h-[90vh]"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 120 }}
              >
                {/* Close button */}
                <button
                  onClick={() => setShowAddForm(false)}
                  className="absolute top-3 right-4 z-50 text-gray-500 hover:text-pink-600 text-3xl sm:text-4xl font-bold bg-white/70 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                >
                  ×
                </button>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 text-center">
                  Add New Product
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="Chocolate Cakes">Chocolate Cakes</option>
                        <option value="Vanilla Cakes">Vanilla Cakes</option>
                        <option value="Fruit Cakes">Fruit Cakes</option>
                        <option value="Cupcakes">Cupcakes</option>
                        <option value="Cookies">Cookies</option>
                        <option value="Pastries">Pastries</option>
                        <option value="Bread">Bread</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Custom Orders">Custom Orders</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        placeholder="Product name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      placeholder="299"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-pink-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const newFiles = Array.from(e.target.files || []);
                          setFormData({ ...formData, images: [...formData.images, ...newFiles] });
                        }}
                        className="hidden"
                        id="image-upload"
                        name="images"
                        required
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="text-gray-500 mb-2">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600">Click to upload multiple images</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                      </label>
                    </div>
                    {formData.images.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Selected images: {formData.images.length}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {formData.images.map((file, index) => (
                            <div key={index} className="relative">
                              <Image
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                width={100}
                                height={80}
                                className="w-full h-20 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newImages = formData.images.filter((_, i) => i !== index);
                                  setFormData({ ...formData, images: newImages });
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.desc}
                      onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      rows={4}
                      placeholder="Describe your beautiful creation..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                      <input
                        type="text"
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        placeholder="e.g., Cotton thread"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300 flex-1 font-medium text-lg"
                    >
                      ✨ Add Product
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="border-2 border-pink-400 text-pink-600 px-8 py-4 rounded-full hover:bg-pink-50 hover:scale-105 transition-all duration-300 flex-1 font-medium text-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Product Form Modal */}
        <AnimatePresence>
          {showEditForm && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative bg-white/80 backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl max-w-2xl w-full p-6 sm:p-8 mx-4 overflow-y-auto max-h-[90vh]"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 120 }}
              >
                {/* Close button */}
                <button
                  onClick={() => setShowEditForm(false)}
                  className="absolute top-3 right-4 z-50 text-gray-500 hover:text-pink-600 text-3xl sm:text-4xl font-bold bg-white/70 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                >
                  ×
                </button>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 text-center">
                  Edit Product
                </h2>

                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="Chocolate Cakes">Chocolate Cakes</option>
                        <option value="Vanilla Cakes">Vanilla Cakes</option>
                        <option value="Fruit Cakes">Fruit Cakes</option>
                        <option value="Cupcakes">Cupcakes</option>
                        <option value="Cookies">Cookies</option>
                        <option value="Pastries">Pastries</option>
                        <option value="Bread">Bread</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Custom Orders">Custom Orders</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        placeholder="Product name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      placeholder="299"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-pink-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const newFiles = Array.from(e.target.files || []);
                          setFormData({ ...formData, images: [...formData.images, ...newFiles] });
                        }}
                        className="hidden"
                        id="edit-image-upload"
                        name="images"
                      />
                      <label htmlFor="edit-image-upload" className="cursor-pointer">
                        <div className="text-gray-500 mb-2">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600">Click to upload additional images (optional)</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                      </label>
                    </div>
                    {formData.images.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Selected images: {formData.images.length}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {formData.images.map((file, index) => (
                            <div key={index} className="relative">
                              <Image
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                width={100}
                                height={80}
                                className="w-full h-20 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newImages = formData.images.filter((_, i) => i !== index);
                                  setFormData({ ...formData, images: newImages });
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {editingProduct && editingProduct.images.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Current images:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {editingProduct.images.map((img, index) => (
                            <div key={index} className="relative">
                              <Image
                                src={img}
                                alt={`Current ${index + 1}`}
                                width={100}
                                height={80}
                                className="w-full h-20 object-cover rounded-lg border"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.desc}
                      onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      rows={4}
                      placeholder="Describe your beautiful creation..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                      <input
                        type="text"
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        placeholder="e.g., Cotton thread"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300 flex-1 font-medium text-lg"
                    >
                      ✏️ Update Product
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEditForm(false)}
                      className="border-2 border-pink-400 text-pink-600 px-8 py-4 rounded-full hover:bg-pink-50 hover:scale-105 transition-all duration-300 flex-1 font-medium text-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
