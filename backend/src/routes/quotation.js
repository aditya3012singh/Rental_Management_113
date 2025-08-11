// routes/quotation.routes.js
import express from "express";
import { PrismaClient, RentalStatus, Role } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * Helper: safely parse IDs (UUID or number)
 */
const parseId = (id) => id?.toString().trim();

/**
 * Create or update a quotation for a rental
 * - Only provider or admin can create/update quotation
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const rentalId = parseId(req.body.rentalId);
    const { price, validTill } = req.body;

    if (!rentalId || !price) {
      return res.status(400).json({ error: "rentalId and price are required" });
    }

    // Fetch rental with product info
    const rental = await prisma.rental.findUnique({
      where: { id: rentalId },
      include: { product: true },
    });

    if (!rental) {
      return res.status(404).json({ error: "Rental not found" });
    }

    // Only provider or admin can create/update quotation
    if (
      req.user.role !== Role.ADMIN &&
      rental.product.providerId !== req.user.id
    ) {
      return res.status(403).json({ error: "Not authorized to quote this rental" });
    }

    // Check if quotation already exists for this rental
    const existingQuotation = await prisma.quotation.findUnique({
      where: { rentalId },
    });

    let quotation;
    if (existingQuotation) {
      quotation = await prisma.quotation.update({
        where: { rentalId },
        data: {
          price,
          validTill: validTill ? new Date(validTill) : null,
          isAccepted: false,
        },
      });
    } else {
      quotation = await prisma.quotation.create({
        data: {
          rentalId,
          price,
          validTill: validTill ? new Date(validTill) : null,
          isAccepted: false,
        },
      });
    }

    res.status(200).json(quotation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Accept a quotation (Customer action)
 */
router.post("/:id/accept", authMiddleware, async (req, res) => {
  try {
    const quotationId = parseId(req.params.id);

    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { rental: true },
    });

    if (!quotation) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    // Only the customer who created the rental can accept
    if (quotation.rental.customerId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to accept this quotation" });
    }

    if (quotation.isAccepted) {
      return res.status(400).json({ error: "Quotation already accepted" });
    }

    // Accept quotation
    const updatedQuotation = await prisma.quotation.update({
      where: { id: quotationId },
      data: { isAccepted: true },
    });

    // Update rental status
    await prisma.rental.update({
      where: { id: quotation.rentalId },
      data: { status: RentalStatus.CONFIRMED },
    });

    res.json(updatedQuotation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all quotations (Admin only)
 */
router.get("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const quotations = await prisma.quotation.findMany({
      include: {
        rental: {
          include: {
            product: true,
            customer: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get quotations for the logged-in user
 */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    let quotations;

    if (req.user.role === Role.CUSTOMER) {
      quotations = await prisma.quotation.findMany({
        where: { rental: { customerId: req.user.id } },
        include: { rental: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      });
    } else if (req.user.role === Role.PROVIDER) {
      quotations = await prisma.quotation.findMany({
        where: { rental: { product: { providerId: req.user.id } } },
        include: { rental: { include: { customer: true, product: true } } },
        orderBy: { createdAt: "desc" },
      });
    } else {
      quotations = await prisma.quotation.findMany({
        include: { rental: { include: { product: true, customer: true } } },
        orderBy: { createdAt: "desc" },
      });
    }

    res.json(quotations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete a quotation (Admin only)
 */
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    await prisma.quotation.delete({ where: { id } });
    res.json({ message: "Quotation deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
