import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// 📊 Get total users, orders, and revenue
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalOrders = await prisma.order.count();
    
    const revenueData = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    });
    const totalRevenue = revenueData._sum.totalAmount || 0;

    res.json({ totalUsers, totalOrders, totalRevenue });
  } catch (error) {
    console.error("❌ Error fetching analytics:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📊 Get sales by date (for charts)
export const getSalesByDate = async (req, res) => {
  try {
    const salesData = await prisma.order.groupBy({
      by: ["createdAt"],
      _sum: { totalAmount: true },
      orderBy: { createdAt: "asc" },
    });

    const formattedData = salesData.map((sale) => ({
      date: sale.createdAt.toISOString().split("T")[0], // Format date
      revenue: sale._sum.totalAmount || 0,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("❌ Error fetching sales data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};