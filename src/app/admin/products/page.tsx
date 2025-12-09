"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { auth } from "@/context/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

interface Product {
  id: number;
  category: string;
  name: string;
  price: number;
  images: string[];
  desc: string;
  material: string;
  size: string;
  care: string;
}

interface UploadResponse {
  imageUrls: string[];
}

export default function AdminProductsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    category: "",
    name: "",
    price: "",
    images: [] as File[],
    desc: "",
    material: "",
    size: "",
    care: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user || (user.uid !== "cJ2MGVYgnZZVyI6Xy54XrIxj1YO2" && user.uid !== "H2oiDqPTiOcTrl4qIHVJ1523xNr2")) {
        router.push("/");
        return;
      }
      fetchProducts();
    });

    return () => unsubscribe();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      category: product.category,
      name: product.name,
      price: product.price.toString(),
      images: [],
      desc: product.desc,
      material: product.material,
      size: product.size,
      care: product.care,
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

  const handleSubmit = async (e: React.FormEvent) => {
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

  if (!currentUser || currentUser.uid !== "cJ2MGVYgnZZVyI6Xy54XrIxj1YO2") {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-pink-700 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don&apos;t have permission to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🔄</div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-pink-700">
              📦 Admin Products Dashboard
            </h1>
            <div className="text-sm text-gray-600">
              Total Products: {products.length}
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-xl font-semibold text-gray-600 mb-2">No products yet</h2>
              <p className="text-gray-500">Products will appear here when added.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  className="border border-pink-200 rounded-xl p-6 bg-pink-50/50 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col">
                    <div className="relative w-full h-48 mb-4">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg"
                        priority={false}
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                      <button
                        onClick={() => handleEdit(product)}
                        className="w-full sm:flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="w-full sm:flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        🗑️ Delete
                      </button>
                    </div>

                    <h3 className="text-lg font-semibold text-pink-700 mb-2">
                      {product.name}
                    </h3>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Category:</strong> {product.category}</p>
                      <p><strong>Price:</strong> ₹{product.price}</p>
                      <p className="line-clamp-2"><strong>Description:</strong> {product.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Product Modal */}
      {showEditForm && editingProduct && (
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images (Optional - Leave empty to keep current images)</label>
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
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="text-gray-500 mb-2">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">Click to upload new images (optional)</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                  </label>
                </div>
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">New images to upload: {formData.images.length}</p>
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
                  ✨ Update Product
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
    </div>
  );
}
