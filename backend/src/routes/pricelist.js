// routes/pricelist.routes.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * Utility: Validate date
 */
const isValidDate = (d) => !isNaN(new Date(d).getTime());

/**
 * Create a new pricelist
 */
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { name, description, validFrom, validTo } = req.body;

    if (!name || !validFrom || !validTo) {
      return res.status(400).json({ error: "Name, validFrom, and validTo are required" });
    }

    if (!isValidDate(validFrom) || !isValidDate(validTo)) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const pricelist = await prisma.pricelist.create({
      data: {
        name,
        description: description || "",
        validFrom: new Date(validFrom),
        validTo: new Date(validTo),
      },
    });

    res.status(201).json(pricelist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all pricelists (with optional pagination)
 */
router.get("/", async (req, res) => {
  try {
    const { skip = 0, take = 20 } = req.query;

    const pricelists = await prisma.pricelist.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
      include: { items: { include: { product: true } } },
      orderBy: { validFrom: "desc" },
    });

    res.json(pricelists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get single pricelist by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const pricelist = await prisma.pricelist.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { product: true } } },
    });

    if (!pricelist) return res.status(404).json({ error: "Pricelist not found" });

    res.json(pricelist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update pricelist
 */
router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { name, description, validFrom, validTo } = req.body;

    if (validFrom && !isValidDate(validFrom)) {
      return res.status(400).json({ error: "Invalid validFrom date" });
    }
    if (validTo && !isValidDate(validTo)) {
      return res.status(400).json({ error: "Invalid validTo date" });
    }

    const updated = await prisma.pricelist.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        validFrom: validFrom ? new Date(validFrom) : undefined,
        validTo: validTo ? new Date(validTo) : undefined,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete pricelist
 */
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    await prisma.pricelist.delete({ where: { id: req.params.id } });
    res.json({ message: "Pricelist deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Add item to pricelist
 */
router.post("/:id/items", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { productId, price, discount } = req.body;
    const pricelistId = req.params.id;

    // Validate product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Validate pricelist exists
    const pricelist = await prisma.pricelist.findUnique({ where: { id: pricelistId } });
    if (!pricelist) {
      return res.status(404).json({ error: "Pricelist not found" });
    }

    const item = await prisma.pricelistItem.create({
      data: {
        pricelistId,
        productId,
        price,
        discount: discount != null ? discount : 0,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update pricelist item
 */
router.put("/:id/items/:itemId", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { price, discount } = req.body;
    const itemId = req.params.itemId;

    const existing = await prisma.pricelistItem.findUnique({ where: { id: itemId } });
    if (!existing) {
      return res.status(404).json({ error: "Pricelist item not found" });
    }

    const updated = await prisma.pricelistItem.update({
      where: { id: itemId },
      data: {
        price,
        discount: discount != null ? discount : 0,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete pricelist item
 */
router.delete("/:id/items/:itemId", authMiddleware, isAdmin, async (req, res) => {
  try {
    const existing = await prisma.pricelistItem.findUnique({ where: { id: req.params.itemId } });
    if (!existing) {
      return res.status(404).json({ error: "Pricelist item not found" });
    }

    await prisma.pricelistItem.delete({ where: { id: req.params.itemId } });
    res.json({ message: "Pricelist item deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
