import express from "express";
import { PrismaClient, PaymentStatusEnum } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * Create a payment record
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { invoiceId, amount, method, transactionId, status } = req.body;

    // Fetch invoice with customer ownership
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        rental: {
          include: {
            customer: { select: { userId: true } },
          },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    if (req.user.role !== "ADMIN" && invoice.rental.customer.userId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to pay this invoice" });
    }

    // Validate status if provided
    let paymentStatus = status || PaymentStatusEnum.PAID;
    if (!Object.values(PaymentStatusEnum).includes(paymentStatus)) {
      return res.status(400).json({ error: "Invalid payment status" });
    }

    const payment = await prisma.payment.create({
      data: {
        invoiceId,
        amount,
        method,
        transactionId,
        status: paymentStatus,
      },
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get payments for logged-in user
 */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        invoice: {
          rental: {
            customer: {
              userId: req.user.id,
            },
          },
        },
      },
      include: {
        invoice: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all payments (Admin only)
 */
router.get("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { invoice: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update payment status
 */
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!Object.values(PaymentStatusEnum).includes(status)) {
      return res.status(400).json({ error: "Invalid payment status" });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: {
        invoice: {
          include: {
            rental: {
              include: {
                customer: { select: { userId: true } },
              },
            },
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    if (
      req.user.role !== "ADMIN" &&
      payment.invoice.rental.customer.userId !== req.user.id
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updated = await prisma.payment.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete payment (Admin only)
 */
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    await prisma.payment.delete({ where: { id: req.params.id } });
    res.json({ message: "Payment deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
