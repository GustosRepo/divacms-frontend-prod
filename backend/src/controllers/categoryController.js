import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔹 Get All Categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Add a New Category (Admin Only)
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Ensure only admin can add categories
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const newCategory = await prisma.category.create({
      data: { name },
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Delete a Category (Admin Only)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure only admin can delete categories
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    await prisma.category.delete({
      where: { id },
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};