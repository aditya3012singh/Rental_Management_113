import express from "express";
import { PrismaClient, UserRole } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { userSchema } from "../validators/validate.js";

const prisma = new PrismaClient();
const router = express.Router();

// Create customer profile
router.post("/", authMiddleware, async (req, res) => {
  try {
    const parsed = userSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role !== UserRole.CUSTOMER) {
      return res.status(403).json({ error: "Only customers can create a profile" });
    }

    if (user.name?.trim()) {
      return res.status(400).json({ error: "Profile already created" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: parsed.name,
        phone: parsed.phone,
      },
    });

    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get logged-in user's profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update logged-in user's profile
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const parsed = userSchema.partial().parse(req.body);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: parsed,
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete logged-in user's profile
router.delete("/me", authMiddleware, async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.user.id },
    });
    res.json({ message: "User profile deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all customers (Admin only)
router.get("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: UserRole.CUSTOMER },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a customer's rental history (Admin only)
router.get("/:id/rentals", authMiddleware, isAdmin, async (req, res) => {
  try {
    const rentals = await prisma.rental.findMany({
      where: { customerId: req.params.id },
      include: {
        product: true,
        rentalHistories: true,
      },
    });
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
