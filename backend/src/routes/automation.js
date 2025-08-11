import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Service: Apply late fees
export async function applyLateFees() {
  const today = new Date();

  const overdueRentals = await prisma.rental.findMany({
    where: {
      endDate: { lt: today },
      status: { not: "COMPLETED" }
    },
    include: { product: true }
  });

  for (const rental of overdueRentals) {
    const daysLate = Math.ceil((today - rental.endDate) / (1000 * 60 * 60 * 24));
    const lateFee = rental.product.basePrice * 0.1 * daysLate;

    await prisma.rentalReturn.upsert({
      where: { rentalId: rental.id },
      update: { lateFee },
      create: {
        rentalId: rental.id,
        scheduled: today,
        completed: false,
        lateFee
      }
    });
  }

  return overdueRentals.length;
}

// Service: Send overdue reminders
export async function sendOverdueReminders() {
  const today = new Date();

  const overdueRentals = await prisma.rental.findMany({
    where: {
      endDate: { lt: today },
      status: { not: "COMPLETED" }
    },
    include: { customer: true, product: true }
  });

  for (const rental of overdueRentals) {
    await prisma.notification.create({
      data: {
        type: "CUSTOMER_REMINDER",
        message: `Your rental for ${rental.product.name} is overdue. Please return it.`,
        userId: rental.customerId,
        sendDate: today,
        isRead: false
      }
    });
  }

  return overdueRentals.length;
}

// -----------------
// ROUTES
// -----------------

// Manual trigger late fees
router.post("/apply-late-fees", async (req, res) => {
  try {
    const count = await applyLateFees();
    res.json({ message: `Applied late fees to ${count} rentals` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to apply late fees" });
  }
});

// Manual trigger reminders
router.post("/send-overdue-reminders", async (req, res) => {
  try {
    const count = await sendOverdueReminders();
    res.json({ message: `Sent ${count} overdue reminders` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send reminders" });
  }
});

export default router;
