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
  category: { id: string; name: string } | null;
  quantity: number;
  brandSegment?: string;
  categorySlug?: string;
}

export default function ManageProducts() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [brandFilter, setBrandFilter] = useState<string>("");
  const [sortByBrand, setSortByBrand] = useState<boolean>(false);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/dashboard");
      return;
    }
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const qs = new URLSearchParams();
        if (brandFilter) qs.append("brandSegment", brandFilter);
        const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/products${
          qs.toString() ? `?${qs.toString()}` : ""
        }`;
        const res = await fetch(url, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!res.ok) throw new Error("Failed to fetch products.");
        const data = await res.json();
        let list: Product[] = data.products || [];
        if (sortByBrand) {
          list = [
            ...list.sort(
              (a, b) =>
                (a.brandSegment || "").localeCompare(b.brandSegment || "") ||
                a.title.localeCompare(b.title)
            ),
          ];
        }
        setProducts(list);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user, router, brandFilter, sortByBrand]);

  if (loading)
    return <p className="text-center text-white">Loading products...</p>;

  async function handleDelete(id: string): Promise<void> {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete product.");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  }

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-center">Manage Products</h1>
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <button
          onClick={() => router.push("/admin/products/add")}
          className="bg-green-500 px-4 py-2 rounded-md text-white"
        >
          ➕ Add New Product
        </button>
        {/* Brand Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm opacity-80">Brand:</label>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="bg-gray-700 px-3 py-2 rounded text-sm"
          >
            <option value="">All</option>
            <option value="nails">Nails</option>
            <option value="toys">Toys</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
        <button
          onClick={() => setSortByBrand((s) => !s)}
          className="bg-blue-500 px-4 py-2 rounded-md text-white text-sm"
        >
          {sortByBrand ? "🔠 Clear Brand Sort" : "🔠 Sort by Brand"}
        </button>
      </div>
      <table className="w-full mt-6 bg-gray-800 text-white rounded-lg text-sm">
        <thead>
          <tr className="bg-blue-500 text-left">
            <th className="p-3">Title</th>
            <th className="p-3">Price</th>
            <th className="p-3">Brand</th>
            <th className="p-3">Category</th>
            <th className="p-3">Best Seller</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const categoryDisplay =
              product.category?.name || product.categorySlug || "No Category";
            const brandDisplay = product.brandSegment || "-";
            return (
              <tr key={product.id} className="border-b border-gray-600">
                <td className="p-3">{product.title}</td>
                <td className="p-3">${product.price.toFixed(2)}</td>
                <td className="p-3 capitalize">{brandDisplay}</td>
                <td className="p-3">{categoryDisplay}</td>
                <td className="p-3">
                  {product.bestSeller ? "✅ Yes" : "❌ No"}
                </td>
                <td
                  className="p-3"
                  style={{
                    color: product.quantity < 3 ? "#f87171" : "white",
                  }}
                >
                  {product.quantity}
                </td>
                <td className="p-3 flex gap-2">
                  <Link href={`/admin/products/edit/${product.id}`}>
                    <button className="bg-yellow-500 px-3 py-1 rounded">
                      ✏️ Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 px-3 py-1 rounded"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            );
          })}
          {products.length === 0 && (
            <tr>
              <td colSpan={7} className="p-6 text-center text-white/70">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}