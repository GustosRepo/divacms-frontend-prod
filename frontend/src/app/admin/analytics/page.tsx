"use client";
import { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  orderStatusCount: { status: string; _count: { status: number } }[];
  salesTrends: { createdAt: string; _sum: { totalAmount: number } }[];
  topSellingProducts: { id: string; title: string; quantitySold: number }[];
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("http://localhost:3001/analytics"); // ✅ Ensure correct endpoint
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <p className="text-center">Loading analytics...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!analytics) return <p className="text-center">No analytics data available.</p>; // ✅ Fallback for null

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">📊 Admin Analytics</h1>

      {/* Revenue & Orders Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <h2 className="text-xl font-bold">Total Revenue</h2>
          <p className="text-3xl text-green-400">${analytics.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <h2 className="text-xl font-bold">Total Orders</h2>
          <p className="text-3xl">{analytics.totalOrders}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-3xl">{analytics.totalUsers}</p>
        </div>
      </div>

      {/* Orders by Status - Pie Chart */}
      {analytics.orderStatusCount.length > 0 && (
        <div className="mt-8 flex justify-center">
          <ResponsiveContainer width="50%" height={300}>
            <PieChart>
              <Pie
                data={analytics.orderStatusCount}
                dataKey="_count.status"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={(entry: { status: string }) => entry.status}
              >
                {analytics.orderStatusCount.map((entry: { status: string; _count: { status: number } }, index: number) => (
                  <Cell key={`cell-${index}`} fill={['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Sales Trends - Bar Chart */}
      {analytics.salesTrends.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">📈 Sales Trends (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.salesTrends}>
              <XAxis dataKey="createdAt" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="_sum.totalAmount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Selling Products */}
      {analytics.topSellingProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">🔥 Top Selling Products</h2>
          <ul>
            {analytics.topSellingProducts.map((product) => (
              <li key={product.id} className="bg-gray-800 p-4 rounded-lg mb-2">
                <span className="font-bold">{product.title}</span> - Sold: {product.quantitySold}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}