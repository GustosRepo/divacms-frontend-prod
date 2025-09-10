"use client";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const router = useRouter();

  return (
    <>
      {/* Mobile Navigation - Top Bar */}
      <nav className="lg:hidden fixed top-16 left-0 w-full bg-black/70 shadow-lg z-40 border-b border-gray-600 backdrop-blur-md">
        <div className="px-4 py-3">
          <h2 className="text-lg font-bold text-pink-400 text-center mb-3">🎀 ADMIN PANEL</h2>
          <div className="flex justify-around space-x-2">
            <button
              onClick={() => router.push("/admin/products")}
              className="flex-1 px-2 py-2 rounded-md text-xs font-medium transition-colors bg-gray-700 text-gray-300 hover:bg-pink-500 hover:text-white"
            >
              🛍 Products
            </button>
            <button
              onClick={() => router.push("/admin/orders")}
              className="flex-1 px-2 py-2 rounded-md text-xs font-medium transition-colors bg-gray-700 text-gray-300 hover:bg-pink-500 hover:text-white"
            >
              📦 Orders
            </button>
            <button
              onClick={() => router.push("/admin/users")}
              className="flex-1 px-2 py-2 rounded-md text-xs font-medium transition-colors bg-gray-700 text-gray-300 hover:bg-pink-500 hover:text-white"
            >
              👥 Users
            </button>
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-16 w-80 h-screen bg-black/50 shadow-lg border-r border-gray-600 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-pink-400 pt-6 text-center mb-6">🎀 ADMIN PANEL</h2>
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => router.push("/admin/products")}
                className="w-full flex items-center px-4 py-3 rounded-md bg-gray-700 text-gray-300 hover:bg-pink-500 hover:text-white font-medium transition-colors"
              >
                🛍 Manage Products
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/admin/orders")}
                className="w-full flex items-center px-4 py-3 rounded-md bg-gray-700 text-gray-300 hover:bg-pink-500 hover:text-white font-medium transition-colors"
              >
                📦 Manage Orders
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/admin/users")}
                className="w-full flex items-center px-4 py-3 rounded-md bg-gray-700 text-gray-300 hover:bg-pink-500 hover:text-white font-medium transition-colors"
              >
                👥 Manage Users
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}