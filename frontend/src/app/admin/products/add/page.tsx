"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const { user } = useAuth();
  const router = useRouter();

  // 🔹 Product Form State (Removed categoryId, direct slug selection)
  const [productData, setProductData] = useState<{
    title: string;
    description: string;
    price: string;
    quantity: string;
    image: File | null;
    bestSeller: boolean;
    brandSegment: string;
    categorySlug: string;
    weightOz: string;
    lengthIn: string;
    widthIn: string;
    heightIn: string;
  }>({
    title: "",
    description: "",
    price: "",
    quantity: "",
    image: null,
    bestSeller: false,
    brandSegment: "",
    categorySlug: "",
    weightOz: "",
    lengthIn: "",
    widthIn: "",
    heightIn: "",
  });

  const [categories, setCategories] = useState<{ id: string; name: string; slug?: string; brand_segment?: string }[]>([]);
  const brandOptions = ["nails", "toys", "accessories"];

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
      ...(name === 'brandSegment' ? { categorySlug: '' } : {}) // reset slug when brand changes
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
    formData.append("quantity", productData.quantity);
    if (productData.image) formData.append("image", productData.image);
    formData.append("bestSeller", String(productData.bestSeller));
    formData.append("brandSegment", productData.brandSegment);
    formData.append("categorySlug", productData.categorySlug);
    formData.append("weightOz", productData.weightOz ?? "");
    formData.append("lengthIn", productData.lengthIn ?? "");
    formData.append("widthIn",  productData.widthIn  ?? "");
    formData.append("heightIn", productData.heightIn ?? "");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ Server Error:", errorData);
        throw new Error("Failed to add product");
      }
      alert("🎉 Product added successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("❌ Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-center">Add New Product</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md max-w-lg mx-auto mt-6">
        <label className="block text-white">Title:</label>
        <input type="text" name="title" value={productData.title} onChange={handleChange} className="w-full p-2 text-black rounded-md mt-2" required />

        <label className="block text-white mt-4">Description:</label>
        <input type="text" name="description" value={productData.description} onChange={handleChange} className="w-full p-2 text-black rounded-md mt-2" />

        <label className="block text-white mt-4">Price ($):</label>
        <input type="number" name="price" value={productData.price} onChange={handleChange} className="w-full p-2 text-black rounded-md mt-2" required />

        <label className="block text-white mt-4">Quantity:</label>
        <input type="number" name="quantity" value={productData.quantity} onChange={handleChange} className="w-full p-2 text-black rounded-md mt-2" required />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-white">Brand Segment</label>
            <select name="brandSegment" value={productData.brandSegment} onChange={handleChange} className="w-full p-2 text-black rounded-md mt-2" required>
              <option value="">Select brand</option>
              {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-white">Category Slug</label>
            <select name="categorySlug" value={productData.categorySlug} onChange={handleChange} className="w-full p-2 text-black rounded-md mt-2" required>
              <option value="">Select category</option>
              {availableCategorySlugs.map(slug => <option key={slug} value={slug}>{slug}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-4">
          <div>
            <label className="block text-white">Weight (oz)</label>
            <input type="number" name="weightOz" min={0} step={1} value={productData.weightOz} onChange={handleChange} className="w-full p-2 text-black rounded-md mt-2" placeholder="e.g. 24" />
          </div>
          <div>
            <label className="block text-white">Length (in)</label>
            <input type="number" name="lengthIn" min={0} step={0.1} value={productData.lengthIn} onChange={handleChange} className="w-full p-2 text-black rounded-md mt-2" placeholder="e.g. 10" />
          </div>
          <div>
            <label className="block text-white">Width (in)</label>
            <input type="number" name="widthIn" min={0} step={0.1} value={productData.widthIn} onChange={handleChange} className="w-full p-2 text-black rounded-md mt-2" placeholder="e.g. 6" />
          </div>
          <div>
            <label className="block text-white">Height (in)</label>
            <input type="number" name="heightIn" min={0} step={0.1} value={productData.heightIn} onChange={handleChange} className="w-full p-2 text-black rounded-md mt-2" placeholder="e.g. 2" />
          </div>
        </div>

        <label className="block text-white mt-4">Image:</label>
        <input type="file" onChange={handleFileChange} className="w-full p-2 text-black rounded-md mt-2" required />

        <label className="text-white mt-4 flex items-center">
          <input type="checkbox" checked={productData.bestSeller} onChange={handleCheckboxChange} className="mr-2" />
          Mark as Best Seller
        </label>

        <button type="submit" className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-md w-full">➕ Add Product</button>
      </form>
    </div>
  );
}