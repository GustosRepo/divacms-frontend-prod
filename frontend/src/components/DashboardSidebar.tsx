import React from "react";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-1/5 text-center min-h-screen pt-[64px] bg-slate-700 p-6 shadow-lg">
      <h2 className="text-xl font-bold text-pink-400">🎀 DASHBOARD</h2>
      <ul className="mt-4 space-y-3">
        <li>
          <button
            onClick={() => setActiveTab("home")}
            className={`w-full px-4 py-2 rounded-md ${
              activeTab === "home" ? "bg-pink-500 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            🏠 Home
          </button>
        </li>
        <li>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full px-4 py-2 rounded-md ${
              activeTab === "orders" ? "bg-pink-500 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            📦 My Orders
          </button>
        </li>
        <li>
          <button
            onClick={() => setActiveTab("account")}
            className={`w-full px-4 py-2 rounded-md ${
              activeTab === "account" ? "bg-pink-500 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            ⚙️ Account Settings
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default DashboardSidebar;