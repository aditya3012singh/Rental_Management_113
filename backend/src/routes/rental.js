// routes/rental.routes.js
import express from "express";
import { PrismaClient, RentalStatus } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * Create a rental booking
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId, availabilityId, startDate, endDate, price } = req.body;

    // Validate product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Check if availability slot exists and is free
    const availability = await prisma.productAvailability.findUnique({
      where: { id: availabilityId },
    });

    if (!availability || availability.isBooked) {
      return res.status(400).json({ error: "Slot unavailable" });
    }

    // Create rental with initial status QUOTATION
    const rental = await prisma.rental.create({
      data: {
        customerId: req.user.id,
        productId,
        availabilityId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        price,
        status: RentalStatus.QUOTATION,
      },
    });

    // Mark availability as booked
    await prisma.productAvailability.update({
      where: { id: availabilityId },
      data: { isBooked: true },
    });

    // Log rental history
    await prisma.rentalHistory.create({
      data: {
        rentalId: rental.id,
        oldStatus: null,
        newStatus: RentalStatus.QUOTATION,
        changedById: req.user.id,
      },
    });

    res.status(201).json(rental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all rentals (Admin only)
 */
router.get("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const rentals = await prisma.rental.findMany({
      include: {
        product: true,
        customer: true,
        history: true,
        quotation: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get rentals for logged-in user
 */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const rentals = await prisma.rental.findMany({
      where: { customerId: req.user.id },
      include: {
        product: true,
        history: true,
        quotation: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update rental status
 */
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const rental = await prisma.rental.findUnique({
      where: { id: req.params.id },
    });
    if (!rental) return res.status(404).json({ error: "Rental not found" });

    // Only admin or customer can update their own rental
    if (req.user.role !== "ADMIN" && rental.customerId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const oldStatus = rental.status;

    const updatedRental = await prisma.rental.update({
      where: { id: req.params.id },
      data: { status },
    });

    // Log rental status change
    await prisma.rentalHistory.create({
      data: {
        rentalId: rental.id,
        oldStatus,
        newStatus: status,
        changedById: req.user.id,
      },
    });

    // If cancelled/completed, free up the availability slot
    if ([RentalStatus.CANCELLED, RentalStatus.COMPLETED].includes(status)) {
      await prisma.productAvailability.update({
        where: { id: rental.availabilityId },
        data: { isBooked: false },
      });
    }

    res.json(updatedRental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete rental (Admin only)
 */
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const rental = await prisma.rental.findUnique({
      where: { id: req.params.id },
    });
    if (!rental) return res.status(404).json({ error: "Rental not found" });

    await prisma.rental.delete({ where: { id: req.params.id } });

    // Free slot if booked
    if (rental.availabilityId) {
      await prisma.productAvailability.update({
        where: { id: rental.availabilityId },
        data: { isBooked: false },
      });
    }

    res.json({ message: "Rental deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
