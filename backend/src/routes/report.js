import { Router } from "express";
import { prisma } from "../prismaClient.js";
import { z } from "zod";

const router = Router();

// Date range schema for reports
const dateRangeSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

// --------------------
// GET /reports/revenue
// --------------------
router.get("/revenue", async (req, res) => {
  try {
    const { startDate, endDate } = dateRangeSchema.parse(req.query);

    const revenue = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: "PAID",
      },
    });

    res.json({ revenue: revenue._sum.amount || 0 });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --------------------
// GET /reports/rental-status
// --------------------
router.get("/rental-status", async (req, res) => {
  try {
    const rentalsByStatus = await prisma.rental.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    res.json(rentalsByStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --------------------
// GET /reports/top-products
// --------------------
router.get("/top-products", async (req, res) => {
  try {
    const topProducts = await prisma.rental.groupBy({
      by: ["productId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    const productsWithDetails = await Promise.all(
      topProducts.map(async (p) => ({
        ...p,
        product: await prisma.product.findUnique({ where: { id: p.productId } }),
      }))
    );

    res.json(productsWithDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
