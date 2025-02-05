import express from "express";
import { getUserOrders, createOrder, updateOrderStatus, getMyOrders } from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my-orders", authMiddleware, getMyOrders); // NEW ✅
router.get("/:userId", authMiddleware, getUserOrders);
router.post("/", authMiddleware, createOrder);
router.put("/:orderId", authMiddleware, updateOrderStatus); // ⬅ New update route

export default router;