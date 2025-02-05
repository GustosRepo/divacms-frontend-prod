import express from "express";
import { getAllCategories, addCategory, deleteCategory } from "../controllers/categoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Public: Get all categories
router.get("/", getAllCategories);

// 🔹 Admin: Add a new category
router.post("/", authMiddleware, addCategory);

// 🔹 Admin: Delete a category
router.delete("/:id", authMiddleware, deleteCategory);

export default router;