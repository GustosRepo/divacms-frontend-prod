import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔹 Fetch all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔹 Add a new product (Admin only)
export const addProduct = async (req, res) => {
  const { title, description, price, image, categoryId } = req.body;
  try {
    const product = await prisma.product.create({
      data: { title, description, price, image, categoryId },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔹 Update product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryId } = req.body;

    // Validate category existence
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { categoryId },
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Validate category existence
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // Fetch products based on categoryId
    const products = await prisma.product.findMany({
      where: { categoryId },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products by category", error: error.message });
  }
};