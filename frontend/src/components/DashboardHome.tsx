import React from "react";

interface DashboardHomeProps {
  userName: string;
  points: number | null;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ userName, points }) => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow text-center">
      <h1 className="text-4xl font-bold text-pink-500">
        🎉 Welcome, {userName}! 💖
      </h1>
      <p className="text-lg text-gray-300 mt-2">
        Thank you for being a part of Diva Factory Nails! ✨
      </p>

      {/* Diva Points Card */}
      <div className="mt-6 p-6 bg-black/40 rounded-lg shadow-lg max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-pink-400 flex items-center justify-center">
          💎 DIVA POINTS
        </h2>
        <p className="text-white mt-2 text-lg">
          You have{" "}
          <span className="text-pink-500 font-bold">
            {points !== null ? points : "Loading..."}
          </span>{" "}
          points!
        </p>
        <p className="text-gray-300 text-sm mt-2">
          Earn points with every purchase and after 100 points are accumulated we automatically apply 10% off your next order!
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;