import pkg from "@prisma/client";
import sendEmail from "../services/emailServices.js";const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export const getAllOrders = async (req, res) => {
  try {
    let { status, startDate, endDate, sort, page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ message: "Page and limit must be positive numbers." });
    }

    // Build filters dynamically
    let filters = {};
    if (status) filters.status = status;
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.gte = new Date(startDate);
      if (endDate) filters.createdAt.lte = new Date(endDate);
    }

    // Get total count for pagination
    const totalOrders = await prisma.order.count({ where: filters });

    // Fetch orders with filters, pagination, and sorting
    const orders = await prisma.order.findMany({
      where: filters,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        User: {
          select: {
            email: true,
          },
        },
        OrderItem: {
          include: {
            Product: {
              select: {
                title: true,
                price: true,
              },
            },
          },
        },
      },
    });

    res.json({
      page,
      limit,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔹 Get orders for the logged-in user
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { product: true },
    });

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }

    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", details: error.message });
  }
};

// 🔹 Create a new order with validation
export const createOrder = async (req, res) => {
  const {
    userId,
    email,
    items,
    totalAmount,
    status,
    trackingCode,
    shippingInfo,
    pointsUsed,
  } = req.body;

  if (!userId || !email || !items || items.length === 0 || !shippingInfo) {
    return res.status(400).json({ message: "Missing required order fields" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { points: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    let userPoints = user.points || 0;
    let discount = 0;

    if (pointsUsed === 50) discount = totalAmount * 0.05;
    if (pointsUsed === 100) discount = totalAmount * 0.1;

    const finalTotal = Math.max(0, totalAmount - discount);

    // ✅ Begin transaction to ensure data integrity
    const newOrder = await prisma.$transaction(async (prisma) => {
      // ✅ Loop through each ordered item
      for (const item of items) {
        // 🔍 Fetch product
        const product = await prisma.product.findUnique({
          where: { id: item.id },
          select: { quantity: true },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.id} not found.`);
        }

        if (product.quantity < item.quantity) {
          throw new Error(`Not enough stock for product ID ${item.id}.`);
        }

        // 🔻 Deduct purchased quantity
        await prisma.product.update({
          where: { id: item.id },
          data: { quantity: product.quantity - item.quantity },
        });
      }

      // ✅ Create order after stock is updated
      return prisma.order.create({
        data: {
          User: { connect: { id: userId } },
          email,
          totalAmount: finalTotal,
          status: status || "Pending",
          trackingCode: trackingCode || "Processing",
          shippingInfo,
          orderItem: {
            create: items.map((item) => ({
              Product: { connect: { id: item.id } },
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });
    });
    console.log("✅ Order successfully saved:", order);
    // ✅ Update user points balance
    const newPointsBalance = userPoints - pointsUsed + Math.floor(finalTotal);
    await prisma.user.update({
      where: { id: userId },
      data: { points: newPointsBalance },
    });

    res
      .status(201)
      .json({
        message: "Order placed!",
        order: newOrder,
        pointsUsed,
        discountApplied: discount,
      });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res
      .status(500)
      .json({ message: "Error creating order", details: error.message });
  }
};

// 🔹 Update order status (Admin Only)
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status, trackingCode } = req.body; // ✅ Accept trackingCode

  // ✅ Ensure status is valid
  if (!["Pending", "Shipped", "Delivered", "Canceled"].includes(status)) {
    return res.status(400).json({
      message:
        "Invalid status. Must be Pending, Shipped, Delivered, or Canceled.",
    });
  }

  try {
    // ✅ Check if the order exists
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    let updateData = { status };
    if (status === "Shipped" && trackingCode) {
      updateData.trackingCode = trackingCode;
    }

    // ✅ Update the order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    // ✅ If shipped, send tracking email
    if (status === "Shipped" && trackingCode) {
      try {
        await sendShippingNotification(orderId);
        console.log(`📦 Shipping notification sent to ${updatedOrder.email}`);
      } catch (err) {
        console.error("❌ Failed to send shipping notification email:", err);
      }
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("❌ Error updating order:", error);
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
};
// 🔹 Delete order (Admin Only)
export const deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // 🧹 Delete related OrderItems first
    await prisma.orderItem.deleteMany({ where: { orderId } });

    // 🗑 Now delete the order
    await prisma.order.delete({ where: { id: orderId } });

    res.json({ message: "Order deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    res
      .status(500)
      .json({ message: "Error deleting order", details: error.message });
  }
};

// 🔹 Get user-specific orders (Admin Only)
export const getUserOrders = async (req, res) => {
  try {
    console.log("🔍 Incoming request headers:", req.headers); // ✅ Debug incoming headers
    console.log("🔍 Decoded user from auth middleware:", req.user); // ✅ Debug authentication

    const userId = req.user?.id || req.user?.userId; // support both cases
    if (!userId) {
      console.error("❌ Missing user ID in request!");
      return res
        .status(400)
        .json({ message: "User ID is missing from request." });
    }

    console.log("🔍 Fetching orders for user:", userId);

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        OrderItem: {
          include: {
            Product: true,
          },
        },
      },
    });

    if (!orders.length) {
      console.log("❌ No orders found for user:", userId);
      return res.status(404).json({ message: "No orders found." });
    }

    console.log("✅ Orders found:", orders);
    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res
      .status(500)
      .json({ message: "Error fetching user orders", details: error.message });
  }
};

export const getFilteredOrders = async (req, res) => {
  try {
    let { status, page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ message: "Page and limit must be positive numbers." });
    }

    const filters = {};
    if (status) filters.status = status;

    const totalOrders = await prisma.order.count({ where: filters });

    // ✅ Ensure user.email is fetched properly
    const orders = await prisma.order.findMany({
      where: filters,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        User: {
          select: { email: true },
        },
        OrderItem: {
          include: {
            Product: {
              select: {
                title: true,
                price: true,
              },
            },
          },
        },
      },
    });

    res.json({
      page,
      limit,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      orders: orders.map((order) => ({
        ...order,
        customerEmail: order.user?.email || order.email, // ✅ Use user.email if exists, otherwise fallback to order email
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const searchOrdersByEmail = async (req, res) => {
  try {
    const { email, page = 1, limit = 10 } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email query is required" });
    }

    const totalOrders = await prisma.order.count({
      where: {
        user: { email: { contains: email, mode: "insensitive" } },
      },
    });

    const orders = await prisma.order.findMany({
      where: {
        user: { email: { contains: email, mode: "insensitive" } },
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        User: { select: { id: true, email: true } },
        Product: { select: { id: true, title: true, price: true } },
      },
    });

    res.json({
      page,
      limit,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching orders", error: error.message });
  }
};

// ✅ Function to Track Orders
export const trackOrder = async (req, res) => {
  const { orderId, email } = req.query;

  if (!orderId || !email) {
    return res.status(400).json({ error: "Order ID and email are required" });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { orderId },
      include: { orderItem: true }, // ✅ Include order items
    });

    if (!order || order.email !== email) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      orderId: order.orderId,
      status: order.status,
      trackingCode: order.trackingCode,
      totalAmount: order.totalAmount,
      orderItem: order.orderItem,
      estimatedDelivery: "5-7 business days", // ✅ Can be dynamic later
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;


    // ✅ Use orderId field, not id
    const order = await prisma.order.findUnique({
      where: { id: orderId }    });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.userId !== userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized to cancel this order." });
    }

    if (order.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Order cannot be canceled after it has been processed." });
    }

    await prisma.order.update({
      where: { id: orderId }, // ✅ FIXED
      data: { status: "Canceled" },
    });

    console.log(`✅ Order ${orderId} has been canceled.`);
    res.json({ message: "Order successfully canceled." });
  } catch (error) {
    console.error("❌ Error canceling order:", error);
    res.status(500).json({ message: "Error canceling order", details: error.message });
  }
};

// 🔹 Get a single order
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id, name, email } },
        orderItem: { include: { product: true } },
      },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};

export const sendShippingNotification = async (orderId) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || !order.email || !order.trackingCode) return;

  await sendEmail(
    order.email,
    "🎉 Your Order Has Shipped!",
    `
      <p>Hey Diva💅</p>
      <p>Your order has officially shipped!</p>
      <p><strong>Tracking Code:</strong> ${order.trackingCode}</p>
      <p>You can expect your order soon. Thanks again for shopping with us 💖</p>
    `
  );

  console.log(`📦 Shipping email sent to ${order.email}`);
};
