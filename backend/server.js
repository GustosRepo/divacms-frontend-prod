require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// 🔹 GET All Products
app.get("/products", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// 🔹 ADD a Product (Admin Only)
app.post("/products", async (req, res) => {
  const { title, description, price, image } = req.body;
  const product = await prisma.product.create({
    data: { title, description, price, image },
  });
  res.json(product);
});

// 🔹 User Registration
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });
  res.json(user);
});

// 🔹 User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// 🔹 Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
