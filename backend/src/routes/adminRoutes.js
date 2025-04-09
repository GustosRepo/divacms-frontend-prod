import express from "express";
import { getAllUsers, updateUserRole, deleteUser, getAdminDashboardStats, getAllProducts} from "../controllers/adminController.js";
import { getAllCategories } from "../controllers/categoryController.js";
import isAdminMiddleware from "../middleware/isAdminMiddleware.js";
import { addProduct, updateProduct, deleteProduct, getProductById } from "../controllers/productController.js";

const router = express.Router();

// 🔹 Get all users
router.get("/users", isAdminMiddleware, getAllUsers);

// 🔹 Update user role
router.put("/users/:userId", isAdminMiddleware, updateUserRole);

// 🔹 Delete a user
router.delete("/users/:userId", isAdminMiddleware, deleteUser);

// ✅ Route to get admin dashboard statistics
router.get("/dashboard-stats", isAdminMiddleware, getAdminDashboardStats);

router.get("/products", isAdminMiddleware, getAllProducts);

router.get("/category", isAdminMiddleware, getAllCategories);

// 🔹 Admin Routes - Manage Products
router.get("/products", isAdminMiddleware, getAllProducts); // Fetch all products (admin only)
router.post("/products", isAdminMiddleware, addProduct); // Add a new product
router.put("/products/:id", isAdminMiddleware, updateProduct); // Edit a product
router.delete("/products/:id", isAdminMiddleware, deleteProduct); // Delete a product
router.get("/products/:id", isAdminMiddleware, getProductById);  // Get product by ID


export default router;