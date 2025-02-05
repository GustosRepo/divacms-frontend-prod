import express from "express";
import { getAllProducts, addProduct, updateProduct, getProductsByCategory} from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import isAdminMiddleware from "../middleware/isAdminMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/category/:categoryId", getProductsByCategory); // NEW ROUTE ✅
router.post("/", isAdminMiddleware, addProduct); // Only admin can add products
router.put("/:id", isAdminMiddleware, updateProduct); // Only admin can update products

export default router;