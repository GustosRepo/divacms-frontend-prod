"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { safeFetch } from "@/utils/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/dashboard"); // Redirect if not an admin
    }
  }, [user, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Assume safeFetch returns parsed JSON or throws on error
        const data = await safeFetch(`/admin/dashboard-stats`, { method: 'GET' });
        console.log("📊 Admin Stats:", data);
        setStats(data);
      } catch (error) {
        console.error("❌ Error fetching admin stats:", error);
      }
    };

    if (!user || !user.isAdmin) return;

    fetchStats();
  }, [user]);

  if (!user || !user.isAdmin) return null; // Prevent rendering if unauthorized

  return (
    <div className="min-h-screen pt-16">
      {/* Main Content */}
      <main className="px-4 lg:px-6 py-6 lg:py-10 text-white">
        <h1 className="text-2xl lg:text-3xl font-bold text-center text-pink-500 mb-6 lg:mb-8">📊 Admin Dashboard</h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 text-center">
          <div className="bg-black/40 p-4 lg:p-6 rounded-lg shadow-lg">
            <h2 className="text-lg lg:text-xl font-bold text-pink-400 mb-2">👥 Total Users</h2>
            <p className="text-2xl lg:text-3xl font-bold">{stats.totalUsers}</p>
          </div>

          <div className="bg-black/40 p-4 lg:p-6 rounded-lg shadow-lg">
            <h2 className="text-lg lg:text-xl font-bold text-pink-400 mb-2">📦 Total Orders</h2>
            <p className="text-2xl lg:text-3xl font-bold">{stats.totalOrders}</p>
          </div>

          <div className="bg-black/40 p-4 lg:p-6 rounded-lg shadow-lg sm:col-span-2 lg:col-span-1">
            <h2 className="text-lg lg:text-xl font-bold text-pink-400 mb-2">💰 Total Revenue</h2>
            <p className="text-2xl lg:text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Management Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 lg:mt-8">
          <Link href="/admin/users" className="w-full sm:w-auto">
            <button className="bg-pink-500 hover:bg-pink-700 px-6 lg:px-8 py-3 lg:py-4 rounded-md text-white font-medium w-full sm:w-auto transition-colors">
              👥 Manage Users
            </button>
          </Link>
          <Link href="/admin/orders" className="w-full sm:w-auto">
            <button className="bg-blue-500 hover:bg-blue-700 px-6 lg:px-8 py-3 lg:py-4 rounded-md text-white font-medium w-full sm:w-auto transition-colors">
              📦 Manage Orders
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}