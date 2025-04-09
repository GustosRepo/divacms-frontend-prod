"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const { user } = useAuth();
  const router = useRouter();

  // 🔹 Product Form State (Added quantity)
  const [productData, setProductData] = useState<{
    title: string;
    description: string;
    price: string;
    categoryId: string;
    quantity: string; // ✅ Added quantity field
    image: File | null;
    bestSeller: boolean;
  }>({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    quantity: "", // ✅ Initialized quantity
    image: null,
    bestSeller: false,
  });

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [message, setMessage] = useState<string>("");

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
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
  
    console.log("📩 Submitting Product:", {
      title: productData.title,
      description: productData.description,
      price: productData.price,
      categoryId: categoryName,
      quantity: productData.quantity, // ✅ Logging quantity
      image: productData.image,
    });
  
    if (!productData.title || !productData.price || !categoryName || !productData.quantity) {
      alert("Title, price, category, and quantity are required.");
      return;
    }
  
    if (!user) {
      alert("User is not authenticated.");
      return;
    }
    if (isNaN(parseFloat(productData.price)) || isNaN(parseInt(productData.quantity))) {
      alert("Price and Quantity must be numbers.");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", productData.title);
    formData.append("description", productData.description || "");
    formData.append("price", productData.price.toString());
    formData.append("categoryId", categoryName);
    formData.append("quantity", productData.quantity); // ✅ Send quantity
  
    // ✅ Ensure Image is Sent for DigitalOcean Spaces Upload
    if (productData.image) {
      formData.append("image", productData.image);
    }
  
    formData.append("bestSeller", String(productData.bestSeller));
  
    console.log("📝 FormData before sending:", [...formData.entries()]);
  
    try {
      const res = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` }, // ✅ Pass token for authentication
        body: formData, // ✅ Send as FormData for proper file upload
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

      {message && <p className="text-center text-green-500">{message}</p>}

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

        {/* ✅ Added Quantity Input */}
        <label className="block text-white mt-4">Quantity:</label>
        <input
          type="number"
          name="quantity"
          value={productData.quantity}
          onChange={handleChange}
          className="w-full p-2 text-black rounded-md mt-2"
          required
        />

        <label className="block text-white mt-4">Category:</label>
        <select
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="p-2 w-full rounded-md bg-gray-700 text-white mt-2"
        >
          <option value="">Select Nail Shape</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <label className="block text-white mt-4">Image:</label>
        <input type="file" onChange={handleFileChange} className="w-full p-2 text-black rounded-md mt-2" required />

        <label className="text-white mt-4 flex items-center">
          <input type="checkbox" checked={productData.bestSeller} onChange={handleCheckboxChange} className="mr-2" />
          Mark as Best Seller
        </label>

        <button type="submit" className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-md w-full">
          ➕ Add Product
        </button>
      </form>
    </div>
  );
}