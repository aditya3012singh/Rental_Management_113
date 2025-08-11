// routes/pickup.routes.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * Schedule a pickup for a rental
 * - Only provider or admin can schedule pickup
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { rentalId, scheduled } = req.body;

    const rental = await prisma.rental.findUnique({
      where: { id: rentalId },
      include: { product: true },
    });
    if (!rental) return res.status(404).json({ error: "Rental not found" });

    if (req.user.role !== "ADMIN" && rental.product.providerId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to schedule pickup" });
    }

    const pickup = await prisma.pickup.create({
      data: {
        rentalId,
        scheduled: new Date(scheduled),
        completed: false,
      },
    });

    res.status(201).json(pickup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Mark pickup as completed
 * - Only provider or admin
 */
router.put("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const pickupId = req.params.id;

    const pickup = await prisma.pickup.findUnique({
      where: { id: pickupId },
      include: { rental: { include: { product: true } } },
    });
    if (!pickup) return res.status(404).json({ error: "Pickup not found" });

    if (req.user.role !== "ADMIN" && pickup.rental.product.providerId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update pickup" });
    }

    if (pickup.completed) {
      return res.status(400).json({ error: "Pickup already completed" });
    }

    const updatedPickup = await prisma.pickup.update({
      where: { id: pickupId },
      data: { completed: true },
    });

    res.json(updatedPickup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all pickups (Admin only)
 */
router.get("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const pickups = await prisma.pickup.findMany({
      include: {
        rental: {
          include: {
            product: true,
            customer: true, // Assuming rental.customerId exists
          },
        },
      },
      orderBy: { scheduled: "desc" },
    });
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get pickups for logged-in provider or customer
 */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    let pickups;

    if (req.user.role === "PROVIDER") {
      pickups = await prisma.pickup.findMany({
        where: {
          rental: {
            product: { providerId: req.user.id },
          },
        },
        include: {
          rental: {
            include: { customer: true, product: true },
          },
        },
        orderBy: { scheduled: "desc" },
      });
    } else if (req.user.role === "CUSTOMER") {
      pickups = await prisma.pickup.findMany({
        where: {
          rental: { customerId: req.user.id },
        },
        include: {
          rental: { include: { product: true } },
        },
        orderBy: { scheduled: "desc" },
      });
    } else {
      pickups = await prisma.pickup.findMany({
        include: {
          rental: { include: { product: true, customer: true } },
        },
        orderBy: { scheduled: "desc" },
      });
    }

    res.json(pickups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete a pickup (Admin only)
 */
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    await prisma.pickup.delete({ where: { id: req.params.id } });
    res.json({ message: "Pickup deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
