import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔹 Fetch all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.params.userId },
      include: { product: true },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Create a new order
export const createOrder = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const newOrder = await prisma.order.create({
      data: {
        userId,
        productId,
      },
    });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Update an order status
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Admin-Only: Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { product: true, user: true },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId; // Get user ID from token

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { product: true },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};