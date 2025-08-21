"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";

export default function EditProduct() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string; slug?: string; brand_segment?: string }[]>([]);
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    image: null as File | null,
    bestSeller: false,
    brandSegment: "",
    categorySlug: "",
  });
  const brandOptions = ["nails", "toys", "accessories"];

  // Fetch product details
  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/dashboard");
      return;
    }
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch product.");
        const data = await res.json();
        setProductData({
          title: data.title,
          description: data.description || "",
            price: data.price?.toString() || "",
          quantity: data.quantity?.toString() || "",
          image: null,
          bestSeller: data.best_seller || data.bestSeller || false,
          brandSegment: (data.brand_segment || data.brandSegment || '').toLowerCase(),
          categorySlug: (data.category_slug || data.categorySlug || '').toLowerCase(),
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [user, id, router]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories.");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const availableCategorySlugs = categories
    .filter(c => !productData.brandSegment || (c.brand_segment || '').toLowerCase() === productData.brandSegment.toLowerCase())
    .map(c => c.slug || '')
    .filter(Boolean);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'brandSegment' ? { categorySlug: '' } : {})
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductData({ ...productData, image: e.target.files[0] });
    }
  };

  const handleCheckboxChange = () => {
    setProductData({ ...productData, bestSeller: !productData.bestSeller });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productData.title || !productData.price || !productData.quantity) {
      alert("Title, price, and quantity are required.");
      return;
    }
    if (!productData.brandSegment || !productData.categorySlug) {
      alert("Brand segment and category slug are required.");
      return;
    }
    if (!user) { alert("User is not authenticated."); return; }
    if (isNaN(parseFloat(productData.price)) || isNaN(parseInt(productData.quantity))) {
      alert("Price and Quantity must be numbers.");
      return;
    }
    const formData = new FormData();
    formData.append("title", productData.title);
    formData.append("description", productData.description || "");
    formData.append("price", productData.price.toString());
    formData.append("brandSegment", productData.brandSegment);
    formData.append("categorySlug", productData.categorySlug);
    formData.append("quantity", productData.quantity);
    if (productData.image) formData.append("image", productData.image);
    formData.append("bestSeller", String(productData.bestSeller));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ Server Error:", errorData);
        throw new Error("Failed to update product");
      }
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
        <input type="text" name="title" value={productData.title} onChange={handleChange} className="w-full p-2 text-black rounded-md mt-2" required />
        <label className="block text-white mt-4">Description:</label>
        <input type="text" name="description" value={productData.description} onChange={handleChange} className="w-full p-2 text-black rounded-md mt-2" />
        <label className="block text-white mt-4">Price ($):</label>
        <input type="number" name="price" value={productData.price} onChange={handleChange} className="w-full p-2 text-black rounded-md mt-2" required />
        <label className="block text-white mt-4">Quantity:</label>
        <input type="number" name="quantity" value={productData.quantity} onChange={handleChange} className="w-full p-2 text-black rounded-md mt-2" required />
        <label className="block text-white mt-4">Brand Segment:</label>
        <select name="brandSegment" value={productData.brandSegment} onChange={handleChange} className="w-full p-2 text-black rounded-md mt-2" required>
          <option value="">Select brand</option>
          {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <label className="block text-white mt-4">Category Slug:</label>
        <select name="categorySlug" value={productData.categorySlug} onChange={handleChange} className="w-full p-2 text-black rounded-md mt-2" required>
          <option value="">Select category</option>
          {availableCategorySlugs.map(slug => <option key={slug} value={slug}>{slug}</option>)}
        </select>
        <label className="block text-white mt-4">Image:</label>
        <input type="file" onChange={handleFileChange} className="w-full p-2 text-black rounded-md mt-2" />
        <label className="text-white mt-4 flex items-center">
          <input type="checkbox" checked={productData.bestSeller} onChange={handleCheckboxChange} className="mr-2" />
          Mark as Best Seller
        </label>
        <button type="submit" className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-md w-full">✅ Save Changes</button>
      </form>
    </div>
  );
}