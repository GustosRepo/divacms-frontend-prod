// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";

// ✅ Must be imported first to mount BEFORE body parsing
import webhookRoutes from "./src/routes/webhookRoutes.js";

const app = express();

// 🛑 RAW BODY MIDDLEWARE FIRST — THIS MUST BE ABOVE express.json()
app.use("/api/webhooks/stripe", express.raw({ type: "application/json" }), webhookRoutes);

// ✅ Other middleware BELOW raw webhook handler
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json()); // This parses body — cannot go above webhook!
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ Other routes
import authRoutes from "./src/routes/auth.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import categoryRoutes from "./src/routes/categoryRoute.js";
import productRoutes from "./src/routes/productRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import checkoutRoutes from "./src/routes/checkout.js";
import emailRoutes from "./src/routes/emailRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";

app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/email", emailRoutes);
app.use("/analytics", analyticsRoutes);

// ✅ Health route
app.get("/protected", (req, res) => {
  res.json({ message: "You are authenticated" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));