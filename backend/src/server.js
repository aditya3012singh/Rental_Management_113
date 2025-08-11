import express from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import automationRoutes, { applyLateFees, sendOverdueReminders } from "./routes/automation.js";

// Load env variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

// ----------------------
// ROUTES
// ----------------------
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import bulkRoutes from "./routes/bulk.js";
import customerRoutes from "./routes/customer.js";
import invoiceRoutes from "./routes/invoice.js";
import notificationRoutes from "./routes/notification.js";
import paymentRoutes from "./routes/payment.js";
import pickupRoutes from "./routes/pickup.js";
import pricelistRoutes from "./routes/pricelist.js";
import productRoutes from "./routes/product.js";
import quotationRoutes from "./routes/quotation.js";
import rentalRoutes from "./routes/rental.js";
import rentalReturnRoutes from "./routes/rentalReturn.js";
import reportRoutes from "./routes/report.js";
import searchRoutes from "./routes/search.js";

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/automation", automationRoutes);
app.use("/api/bulk", bulkRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/pickup", pickupRoutes);
app.use("/api/pricelist", pricelistRoutes);
app.use("/api/product", productRoutes);
app.use("/api/quotation", quotationRoutes);
app.use("/api/rental", rentalRoutes);
app.use("/api/rental-return", rentalReturnRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/search", searchRoutes);

// ----------------------
// CRON JOBS
// ----------------------

// Daily late fees
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily late fee job...");
  const count = await applyLateFees();
  console.log(`Applied late fees to ${count} rentals`);
});

// Daily overdue reminders
cron.schedule("0 8 * * *", async () => {
  console.log("Running daily overdue reminder job...");
  const count = await sendOverdueReminders();
  console.log(`Sent ${count} reminders`);
});

// ----------------------
// START SERVER
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
