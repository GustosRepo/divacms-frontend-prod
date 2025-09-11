"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { safeFetch } from "@/utils/api";
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
        const url = `/admin/products${qs.toString() ? `?${qs.toString()}` : ""}`;
        // safeFetch is expected to return JSON or throw on non-2xx
        const data = await safeFetch(url, { method: 'GET' });
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
      await safeFetch(`/admin/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  }

  return (
    <div className="w-full max-w-full px-2 lg:px-6 py-4 lg:py-6 text-white">
      <h1 className="text-2xl lg:text-3xl font-bold text-center mb-4 lg:mb-6">Manage Products</h1>
      
      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 mb-4">
        <button
          onClick={() => router.push("/admin/products/add")}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-white font-medium w-full sm:w-auto transition-colors"
        >
          ➕ Add New Product
        </button>
        
        {/* Brand Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-sm opacity-80 whitespace-nowrap">Brand:</label>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="bg-gray-700 px-3 py-2 rounded text-sm w-full sm:w-auto"
          >
            <option value="">All</option>
            <option value="nails">Nails</option>
            <option value="toys">Toys</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
        
        <button
          onClick={() => setSortByBrand((s) => !s)}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-white text-sm font-medium w-full sm:w-auto transition-colors"
        >
          {sortByBrand ? "🔠 Clear Brand Sort" : "🔠 Sort by Brand"}
        </button>
      </div>

      {/* Mobile: Show scroll hint */}
      <div className="lg:hidden text-xs text-gray-400 mb-2 text-center">
        ← Scroll horizontally to see all columns →
      </div>

      {/* Table Container - Horizontally scrollable on mobile */}
      <div className="overflow-x-auto -mx-2 lg:mx-0">
        <div className="min-w-max lg:min-w-full px-2 lg:px-0">
          <table className="w-full bg-gray-800 text-white rounded-lg text-sm lg:text-base">
        <thead>
          <tr className="bg-blue-500 text-left">
            <th className="p-2 lg:p-3 text-xs lg:text-sm font-medium">Title</th>
            <th className="p-2 lg:p-3 text-xs lg:text-sm font-medium">Price</th>
            <th className="p-2 lg:p-3 text-xs lg:text-sm font-medium">Brand</th>
            <th className="p-2 lg:p-3 text-xs lg:text-sm font-medium">Category</th>
            <th className="p-2 lg:p-3 text-xs lg:text-sm font-medium">Best Seller</th>
            <th className="p-2 lg:p-3 text-xs lg:text-sm font-medium">Stock</th>
            <th className="p-2 lg:p-3 text-xs lg:text-sm font-medium min-w-[120px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const categoryDisplay =
              product.category?.name || product.categorySlug || "No Category";
            const brandDisplay = product.brandSegment || "-";
            return (
              <tr key={product.id} className="border-b border-gray-600">
                <td className="p-2 lg:p-3 text-xs lg:text-sm">
                  <div className="max-w-[150px] lg:max-w-none truncate" title={product.title}>
                    {product.title}
                  </div>
                </td>
                <td className="p-2 lg:p-3 text-xs lg:text-sm font-medium">
                  ${product.price.toFixed(2)}
                </td>
                <td className="p-2 lg:p-3 text-xs lg:text-sm capitalize">
                  {brandDisplay}
                </td>
                <td className="p-2 lg:p-3 text-xs lg:text-sm">
                  <div className="max-w-[100px] lg:max-w-none truncate" title={categoryDisplay}>
                    {categoryDisplay}
                  </div>
                </td>
                <td className="p-2 lg:p-3 text-xs lg:text-sm">
                  {product.bestSeller ? "✅ Yes" : "❌ No"}
                </td>
                <td
                  className="p-2 lg:p-3 text-xs lg:text-sm font-medium"
                  style={{
                    color: product.quantity < 3 ? "#f87171" : "white",
                  }}
                >
                  {product.quantity}
                </td>
                <td className="p-2 lg:p-3">
                  <div className="flex flex-col lg:flex-row gap-1 lg:gap-2">
                    <Link href={`/admin/products/edit/${product.id}`}>
                      <button className="bg-yellow-500 hover:bg-yellow-600 px-2 lg:px-3 py-1 rounded text-xs lg:text-sm w-full lg:w-auto transition-colors">
                        ✏️ Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 hover:bg-red-600 px-2 lg:px-3 py-1 rounded text-xs lg:text-sm w-full lg:w-auto transition-colors"
                    >
                      🗑 Delete
                    </button>
                  </div>
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
      </div>
    </div>
  );
}