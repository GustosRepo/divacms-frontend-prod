"use client";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const router = useRouter();

  return (
    <aside className="w-1/5 min-h-screen bg-black/50 p-6 shadow-lg">
      <h2 className="text-xl font-bold text-pink-400">🎀 ADMIN PANEL</h2>
      <ul className="mt-4 space-y-3">
        <li>
          <button
            onClick={() => router.push("/admin/products")}
            className="w-full flex items-center px-4 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-pink-500 hover:text-white"
          >
            🛍 Manage Products
          </button>
        </li>
        <li>
          <button
            onClick={() => router.push("/admin/orders")}
            className="w-full flex items-center px-4 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-pink-500 hover:text-white"
          >
            📦 Manage Orders
          </button>
        </li>
        <li>
          <button
            onClick={() => router.push("/admin/users")}
            className="w-full flex items-center px-4 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-pink-500 hover:text-white"
          >
            👥 Manage Users
          </button>
        </li>
      </ul>
    </aside>
  );
}