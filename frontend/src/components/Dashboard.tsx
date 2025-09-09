"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import MyOrders from "@/components/MyOrders";
import AccountSettings from "@/components/AccountSettings";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHome from "./DashboardHome";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [points, setPoints] = useState<number | null>(null);

  // ✅ Fetch user's points from backend
  useEffect(() => {
    if (!user) return;

    const fetchUserPoints = async () => {
      try {
        const userId = user.userId || user.id;
        const data = await (await fetch(`/api/proxy/users/${userId}`, { credentials: 'include' })).json();
        setPoints(data.points ?? data.user?.points ?? null);
      } catch (err) {
        console.error("❌ Error fetching user points:", err);
      }
    };

    fetchUserPoints();
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <h2 className="text-3xl font-bold">🚫 Access Denied</h2>
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen pt-16 bg-gray-900 text-white">
      {/* Sidebar */}
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {activeTab === "home" && <DashboardHome userName={user.name} points={points} />}
        {activeTab === "orders" && <MyOrders />}
        {activeTab === "account" && <AccountSettings />}
      </main>
    </div>
  );
}