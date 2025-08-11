import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {
  productSchema,
  rentalDurationSchema,
  productAvailabilitySchema,
} from "../validators/validate.js";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * Create a new product (Admin only)
 */
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const parsed = productSchema.parse(req.body);
    const product = await prisma.product.create({
      data: parsed,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Get all products with rental durations and availability
 */
router.get("/", async (req, res) => {
  try {
    const { skip = 0, take = 20 } = req.query;

    const products = await prisma.product.findMany({
      skip: Number(skip),
      take: Number(take),
      include: {
        rentalDurations: true,
        availability: {
          orderBy: { startDate: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get a single product by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        rentalDurations: true,
        availability: {
          orderBy: { startDate: "asc" },
        },
      },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update a product (Admin only)
 */
router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const parsed = productSchema.partial().parse(req.body);
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: parsed,
    });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Delete a product (Admin only)
 */
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    // Optional: delete related durations & availability first
    await prisma.rentalDuration.deleteMany({ where: { productId: req.params.id } });
    await prisma.productAvailability.deleteMany({ where: { productId: req.params.id } });

    await prisma.product.delete({ where: { id: req.params.id } });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Add rental duration to a product (Admin only)
 */
router.post("/:id/duration", authMiddleware, isAdmin, async (req, res) => {
  try {
    const productExists = await prisma.product.findUnique({
      where: { id: req.params.id },
    });
    if (!productExists) return res.status(404).json({ error: "Product not found" });

    const parsed = rentalDurationSchema.parse({
      ...req.body,
      productId: req.params.id,
    });

    const rentalDuration = await prisma.rentalDuration.create({ data: parsed });

    res.status(201).json(rentalDuration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Add availability for a product (Admin only)
 */
router.post("/:id/availability", authMiddleware, isAdmin, async (req, res) => {
  try {
    const productExists = await prisma.product.findUnique({
      where: { id: req.params.id },
    });
    if (!productExists) return res.status(404).json({ error: "Product not found" });

    const parsed = productAvailabilitySchema.parse({
      ...req.body,
      productId: req.params.id,
    });

    parsed.startDate = new Date(parsed.startDate);
    parsed.endDate = new Date(parsed.endDate);

    if (parsed.startDate >= parsed.endDate) {
      return res.status(400).json({ error: "Start date must be before end date" });
    }

    const availability = await prisma.productAvailability.create({
      data: {
        ...parsed,
        isBooked: false, // ensure new slots are initially free
      },
    });

    res.status(201).json(availability);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Update availability slot (Admin only)
 */
router.put("/availability/:availabilityId", authMiddleware, isAdmin, async (req, res) => {
  try {
    const parsed = productAvailabilitySchema.partial().parse(req.body);
    if (parsed.startDate) parsed.startDate = new Date(parsed.startDate);
    if (parsed.endDate) parsed.endDate = new Date(parsed.endDate);

    if (parsed.startDate && parsed.endDate && parsed.startDate >= parsed.endDate) {
      return res.status(400).json({ error: "Start date must be before end date" });
    }

    const availability = await prisma.productAvailability.update({
      where: { id: req.params.availabilityId },
      data: parsed,
    });

    res.json(availability);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Delete availability slot (Admin only)
 */
router.delete("/availability/:availabilityId", authMiddleware, isAdmin, async (req, res) => {
  try {
    await prisma.productAvailability.delete({
      where: { id: req.params.availabilityId },
    });
    res.json({ message: "Availability slot deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
