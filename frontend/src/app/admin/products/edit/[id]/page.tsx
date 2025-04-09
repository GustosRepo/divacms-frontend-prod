"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";

export default function EditProduct() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams(); // ✅ Get product ID from URL
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  // ✅ Define Product State
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    image: null as File | null,
    bestSeller: false,
  });

  // ✅ Fetch Product Details
  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/dashboard");
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3001/products/${id}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch product.");

        const data = await res.json();
        console.log("📩 Fetched Product:", data);

        setProductData({
          title: data.title,
          description: data.description || "",
          price: data.price.toString(),
          categoryId: data.category?.id || "",
          image: null, // Image upload is separate
          bestSeller: data.bestSeller || false,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [user, id, router]);

  // ✅ Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3001/categories");
        if (!res.ok) throw new Error("Failed to fetch categories.");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  // ✅ Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductData({ ...productData, image: e.target.files[0] });
    }
  };

  // ✅ Handle Checkbox
  const handleCheckboxChange = () => {
    setProductData({ ...productData, bestSeller: !productData.bestSeller });
  };

  // ✅ Handle Form Submission (Updating Product)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", productData.title);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("categoryId", productData.categoryId);
    formData.append("bestSeller", String(productData.bestSeller));
    if (productData.image) formData.append("image", productData.image);

    console.log("📝 FormData before sending:", [...formData.entries()]);

    try {
      const res = await fetch(`http://localhost:3001/products/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user?.token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update product");

      alert("✅ Product updated successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("❌ Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  if (loading) return <p className="text-center text-white">Loading product...</p>;

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-center">✏️ Edit Product</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md max-w-lg mx-auto mt-6">
        <label className="block text-white">Title:</label>
        <input
          type="text"
          name="title"
          value={productData.title}
          onChange={handleChange}
          className="w-full p-2 text-black rounded-md mt-2"
          required
        />

        <label className="block text-white mt-4">Description:</label>
        <input
          type="text"
          name="description"
          value={productData.description}
          onChange={handleChange}
          className="w-full p-2 text-black rounded-md mt-2"
        />

        <label className="block text-white mt-4">Price ($):</label>
        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleChange}
          className="w-full p-2 text-black rounded-md mt-2"
          required
        />

        {/* Category Selection */}
        <label className="block text-white mt-4">Category:</label>
        <select
          name="categoryId"
          value={productData.categoryId}
          onChange={handleChange}
          className="p-2 w-full rounded-md bg-gray-700 text-white mt-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Image Upload */}
        <label className="block text-white mt-4">New Image:</label>
        <input type="file" onChange={handleFileChange} className="w-full p-2 text-black rounded-md mt-2" />

        {/* Best Seller Checkbox */}
        <label className="text-white mt-4 flex items-center">
          <input type="checkbox" checked={productData.bestSeller} onChange={handleCheckboxChange} className="mr-2" />
          Mark as Best Seller
        </label>

        <button type="submit" className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-md w-full">
          ✅ Save Changes
        </button>
      </form>
    </div>
  );
}