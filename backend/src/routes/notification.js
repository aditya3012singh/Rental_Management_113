import express from "express";
import { PrismaClient, NotificationTypeEnum } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * Create a notification (Admin only)
 */
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { type, message, userId, sendDate } = req.body;

    // Validate type if enum exists
    if (!Object.values(NotificationTypeEnum).includes(type)) {
      return res.status(400).json({ error: "Invalid notification type" });
    }

    // Prepare sendDate
    let parsedSendDate = undefined;
    if (sendDate) {
      const date = new Date(sendDate);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ error: "Invalid sendDate" });
      }
      parsedSendDate = date;
    }

    const notification = await prisma.notification.create({
      data: {
        type,
        message,
        userId,
        sendDate: parsedSendDate || new Date(),
        isRead: false,
      },
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get notifications for logged-in user
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { sendDate: "desc" },
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Mark notification as read/unread
 */
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id },
    });
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.userId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updated = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: Boolean(req.body.isRead) },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete a notification (Admin or owner)
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id },
    });
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.userId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.notification.delete({ where: { id: req.params.id } });
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
