import express from "express";
import { PrismaClient, InvoiceTypeEnum, InvoiceStatusEnum } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const prisma = new PrismaClient();
const router = express.Router();

// Create Invoice
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { rentalId, amount, type, status } = req.body;

    if (!Object.values(InvoiceTypeEnum).includes(type)) {
      return res.status(400).json({ error: "Invalid invoice type" });
    }
    if (status && !Object.values(InvoiceStatusEnum).includes(status)) {
      return res.status(400).json({ error: "Invalid invoice status" });
    }

    const invoice = await prisma.invoice.create({
      data: {
        rentalId,
        amount,
        type,
        status: status || "PENDING",
      },
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Invoices (Admin)
router.get("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { rental: { include: { customer: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Invoice by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { rental: { include: { customer: true } } },
    });

    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    if (
      req.user.role !== "ADMIN" &&
      invoice.rental.customer.userId !== req.user.id
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Invoice Status (Admin)
router.put("/:id/status", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!Object.values(InvoiceStatusEnum).includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await prisma.invoice.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Invoice (Admin)
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    await prisma.invoice.delete({ where: { id: req.params.id } });
    res.json({ message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
