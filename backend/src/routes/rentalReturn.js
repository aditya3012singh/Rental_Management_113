// routes/rentalReturn.routes.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {
  rentalReturnSchema
} from "../validators/validate.js"; // adjust path if needed
import { z } from "zod";

const prisma = new PrismaClient();
const router = express.Router();

// Derived schema for updates
const rentalReturnUpdateSchema = rentalReturnSchema.partial();

// ===== Create a rental return =====
router.post("/", authMiddleware, async (req, res) => {
  try {
    const parsed = rentalReturnSchema.parse(req.body);

    const rental = await prisma.rental.findUnique({
      where: { id: parsed.rentalId },
      include: { product: true }
    });
    if (!rental) return res.status(404).json({ error: "Rental not found" });

    if (req.user.role !== "ADMIN" && rental.product.providerId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to schedule return" });
    }

    if (parsed.scheduled <= new Date()) {
      return res.status(400).json({ error: "Scheduled date must be in the future" });
    }

    const rentalReturn = await prisma.rentalReturn.create({
      data: {
        rentalId: parsed.rentalId,
        scheduled: parsed.scheduled,
        completed: parsed.completed ?? false,
        lateFee: parsed.lateFee ?? 0
      }
    });

    res.status(201).json(rentalReturn);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===== Mark rental return as completed =====
router.put("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const returnId = req.params.id;

    const rentalReturn = await prisma.rentalReturn.findUnique({
      where: { id: returnId },
      include: { rental: { include: { product: true } } }
    });
    if (!rentalReturn) return res.status(404).json({ error: "Rental return not found" });

    if (req.user.role !== "ADMIN" && rentalReturn.rental.product.providerId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update return" });
    }

    if (rentalReturn.completed) {
      return res.status(400).json({ error: "Return already completed" });
    }

    const updatedReturn = await prisma.rentalReturn.update({
      where: { id: returnId },
      data: { completed: true }
    });

    res.json(updatedReturn);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===== Get all rental returns (Admin only) =====
router.get("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const returns = await prisma.rentalReturn.findMany({
      include: { rental: { include: { product: true, customer: true } } },
      orderBy: { scheduled: "desc" }
    });
    res.json(returns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== Get rental returns for logged-in provider or customer =====
router.get("/my", authMiddleware, async (req, res) => {
  try {
    let returns;

    if (req.user.role === "PROVIDER") {
      returns = await prisma.rentalReturn.findMany({
        where: { rental: { product: { providerId: req.user.id } } },
        include: { rental: { include: { customer: true, product: true } } },
        orderBy: { scheduled: "desc" }
      });
    } else if (req.user.role === "CUSTOMER") {
      returns = await prisma.rentalReturn.findMany({
        where: { rental: { customerId: req.user.id } },
        include: { rental: { include: { product: true } } },
        orderBy: { scheduled: "desc" }
      });
    } else {
      returns = await prisma.rentalReturn.findMany({
        include: { rental: { include: { product: true, customer: true } } },
        orderBy: { scheduled: "desc" }
      });
    }

    res.json(returns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== Update rental return =====
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const parsed = rentalReturnUpdateSchema.parse(req.body);

    const rentalReturn = await prisma.rentalReturn.findUnique({
      where: { id: req.params.id },
      include: { rental: { include: { product: true } } }
    });
    if (!rentalReturn) return res.status(404).json({ error: "Rental return not found" });

    if (req.user.role !== "ADMIN" && rentalReturn.rental.product.providerId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update return" });
    }

    const updatedReturn = await prisma.rentalReturn.update({
      where: { id: req.params.id },
      data: parsed
    });

    res.json(updatedReturn);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===== Delete a rental return (Admin only) =====
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    await prisma.rentalReturn.delete({ where: { id: req.params.id } });
    res.json({ message: "Rental return deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
