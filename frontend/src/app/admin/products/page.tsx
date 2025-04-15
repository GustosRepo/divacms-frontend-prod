"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string | null;
  bestSeller: boolean;
  category: { id: string; name: string } | null; // ✅ Ensure category is an object
  quantity: number;
}

export default function ManageProducts() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/dashboard");
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/products", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch products.");
        const data = await res.json();
        setProducts(data.products); // ✅ Ensure we store `category` as an object
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user, router]);

  if (loading)
    return <p className="text-center text-white">Loading products...</p>;

  async function handleDelete(id: string): Promise<void> {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (!res.ok) throw new Error("Failed to delete product.");

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  }
  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-center">Manage Products</h1>
      <button
        onClick={() => router.push("/admin/products/add")}
        className="bg-green-500 px-4 py-2 rounded-md text-white mt-4"
      >
        ➕ Add New Product
      </button>
      <table className="w-full mt-6 bg-gray-800 text-white rounded-lg">
        <thead>
          <tr className="bg-blue-500">
            <th className="p-3">Title</th>
            <th className="p-3">Price</th>
            <th className="p-3">Category</th>
            <th className="p-3">Best Seller</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-gray-600">
              <td className="p-3">{product.title}</td>
              <td className="p-3">${product.price.toFixed(2)}</td>
              <td className="p-3">
                {typeof product.category === "object" &&
                product.category !== null
                  ? product.category.name // ✅ Extract name if it's an object
                  : product.category || "No Category"}
              </td>
              <td className="p-3">{product.bestSeller ? "✅ Yes" : "❌ No"}</td>
              <td style={{ color: product.quantity < 3 ? "red" : "white" }}>
                {product.quantity}
              </td>
              <td className="p-3">
                <Link href={`/admin/products/edit/${product.id}`}>
                  <button className="bg-yellow-500 px-3 py-1 rounded">
                    ✏️ Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 px-3 py-1 rounded ml-2"
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}