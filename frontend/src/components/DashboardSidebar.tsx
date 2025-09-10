import React from "react";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <>
      {/* Mobile Navigation - Top Bar */}
      <nav className="lg:hidden fixed top-16 left-0 w-full bg-slate-700 shadow-lg z-40 border-b border-slate-600">
        <div className="px-4 py-3">
          <h2 className="text-lg font-bold text-pink-400 text-center mb-3">🎀 DASHBOARD</h2>
          <div className="flex justify-around space-x-2">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "home" 
                  ? "bg-pink-500 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              🏠 Home
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "orders" 
                  ? "bg-pink-500 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              📦 Orders
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "account" 
                  ? "bg-pink-500 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-16 w-80 h-screen bg-slate-700 shadow-lg border-r border-slate-600 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-pink-400 text-center mb-6">🎀 DASHBOARD</h2>
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => setActiveTab("home")}
                className={`w-full px-4 py-3 rounded-md font-medium transition-colors ${
                  activeTab === "home" 
                    ? "bg-pink-500 text-white shadow-md" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                🏠 Home
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full px-4 py-3 rounded-md font-medium transition-colors ${
                  activeTab === "orders" 
                    ? "bg-pink-500 text-white shadow-md" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                📦 My Orders
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("account")}
                className={`w-full px-4 py-3 rounded-md font-medium transition-colors ${
                  activeTab === "account" 
                    ? "bg-pink-500 text-white shadow-md" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                ⚙️ Account Settings
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;