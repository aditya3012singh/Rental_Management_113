// routes/bulk.routes.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { z } from "zod";

const prisma = new PrismaClient();
const router = express.Router();

// --------------------
// Zod schemas
// --------------------
const bulkDeleteSchema = z.object({
  model: z.enum(["product", "rental", "invoice", "user"]),
  ids: z.array(z.string().cuid()).min(1)
});

const bulkUpdateRentalStatusSchema = z.object({
  rentalIds: z.array(z.string().cuid()).min(1),
  status: z.enum(["QUOTATION", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"])
});

// --------------------
// Bulk delete
// --------------------
router.post("/delete", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { model, ids } = bulkDeleteSchema.parse(req.body);

    const deleteResult = await prisma[model].deleteMany({
      where: { id: { in: ids } }
    });

    res.json({ message: `Deleted ${deleteResult.count} ${model}(s)` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --------------------
// Bulk update rental status
// --------------------
router.post("/rental/status", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { rentalIds, status } = bulkUpdateRentalStatusSchema.parse(req.body);

    const updateResult = await prisma.rental.updateMany({
      where: { id: { in: rentalIds } },
      data: { status }
    });

    res.json({ message: `Updated ${updateResult.count} rentals to ${status}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
