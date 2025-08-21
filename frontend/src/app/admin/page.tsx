"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch stats");

        const data = await res.json();
        console.log("📊 Admin Stats:", data);
        setStats(data);
      } catch (error) {
        console.error("❌ Error fetching admin stats:", error);
      }
    };

    fetchStats();
  }, [user]);

  if (!user || !user.isAdmin) return null; // Prevent rendering if unauthorized

  return (
    <div className="min-h-screen flex">

      {/* Main Content */}
      <main className="flex-1 px-6 py-10 text-white">
        <h1 className="text-3xl font-bold text-center text-pink-500">📊 Admin Dashboard</h1>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 mt-8 text-center">
          <div className="bg-black/40 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-pink-400">👥 Total Users</h2>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>

          <div className="bg-black/40 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-pink-400">📦 Total Orders</h2>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
          </div>

          <div className="bg-black/40 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-pink-400">💰 Total Revenue</h2>
            <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Management Links */}
        <div className="flex flex-col items-center mt-8 space-y-4">
          <Link href="/admin/users">
            <button className="bg-pink-500 hover:bg-pink-700 px-5 py-3 rounded-md text-white">
              Manage Users
            </button>
          </Link>
          <Link href="/admin/orders">
            <button className="bg-blue-500 hover:bg-blue-700 px-5 py-3 rounded-md text-white">
              Manage Orders
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}