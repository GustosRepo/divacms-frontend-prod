import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import categoryRoutes from "./src/routes/categoryRoute.js";
import productRoutes from "./src/routes/productRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

// Protected Test Route
app.get("/protected", (req, res) => {
  res.json({ message: "You are authenticated" });
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));