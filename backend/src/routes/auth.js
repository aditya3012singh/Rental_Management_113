// File: routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { PrismaClient, UserRole } from "@prisma/client";
import Redis from "ioredis";
import {
  userSchema,
  loginSchema,
  updateProfileSchema,
  deleteUserSchema
} from "../validate/validate.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { z } from "zod";

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL);

redis.ping().then(console.log); // Should log "PONG"

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =======================
// OTP GENERATION
// =======================
router.post("/generate-otp", async (req, res) => {
  const email = req.body.email?.toLowerCase();
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await redis.set(`otp:${email}`, otpCode, "EX", 600); // 10 minutes expiry

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your verification code is ${otpCode}`,
    });

    res.json({ message: "OTP sent to email!" });
  } catch (error) {
    console.error("OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// =======================
// OTP VERIFICATION
// =======================
router.post("/verify-otp", async (req, res) => {
  const email = req.body.email?.toLowerCase();
  const code = req.body.code;

  try {
    const storedOtp = await redis.get(`otp:${email}`);
    if (!storedOtp || storedOtp !== code) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await redis.del(`otp:${email}`);
    await redis.set(`verified:${email}`, "true", "EX", 600);

    return res.json({ message: "OTP verified. You can now sign up." });
  } catch (error) {
    console.error("OTP verification failed:", error);
    return res.status(500).json({ message: "Failed to verify OTP." });
  }
});

// =======================
// CHECK IF ADMIN EXISTS
// =======================
router.get("/check-admin", async (req, res) => {
  try {
    const adminCount = await prisma.user.count({
      where: { role: UserRole.ADMIN },
    });

    res.status(200).json({
      adminExists: adminCount > 0,
      adminCount,
    });
  } catch (error) {
    console.error("Error checking admin existence:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// =======================
// CHECK IF USER EXISTS
// =======================
router.get("/check-user", async (req, res) => {
  const email = req.query.email?.toString().toLowerCase();
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    res.status(200).json({ exists: !!existingUser });
  } catch (error) {
    console.error("Error checking user existence:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// =======================
// SIGNUP
// =======================
router.post("/signup", async (req, res) => {
  try {
    const signupSchema = userSchema.extend({
      password: z.string().min(6),
      role: z.nativeEnum(UserRole).optional(),
      phone: z.string().optional(),
      avatarUrl: z.string().url().optional(),
    });

    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) return res.status(403).json({ errors: parsed.error.errors });

    const { email: rawEmail, name, password, role, phone, avatarUrl } = parsed.data;
    const email = rawEmail.toLowerCase();

    const isVerified = await redis.get(`verified:${email}`);
    if (!isVerified) {
      return res.status(403).json({ message: "Please verify your email via OTP before signing up." });
    }

    if (role === UserRole.ADMIN) {
      const adminCount = await prisma.user.count({ where: { role: UserRole.ADMIN } });
      if (adminCount > 0) {
        return res.status(403).json({ message: "Admin already exists." });
      }
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: hashedPassword,
        role: role ?? UserRole.CUSTOMER,
        phone,
        avatarUrl,
      },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    await redis.del(`verified:${email}`);

    return res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, phone, avatarUrl },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

// =======================
// SIGNIN
// =======================
router.post("/signin", async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.errors });

    const email = parsed.data.email.toLowerCase();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(403).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!isPasswordValid) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    const { passwordHash, ...userWithoutPassword } = user;
    res.json({ message: "Login successful", token, user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
});

// =======================
// DELETE USER (Admin only)
// =======================
router.delete("/user", authMiddleware, isAdmin, async (req, res) => {
  try {
    const parsed = deleteUserSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.errors });

    const { userId } = parsed.data;
    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// =======================
// GET CURRENT USER
// =======================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true, phone: true, avatarUrl: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Failed to fetch user info" });
  }
});

// =======================
// GET ALL USERS (Admin only)
// =======================
router.get("/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, phone: true, avatarUrl: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// =======================
// UPDATE PROFILE
// =======================
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const parsed = updateProfileSchema.extend({
      phone: z.string().optional(),
      avatarUrl: z.string().url().optional(),
    }).safeParse(req.body);

    if (!parsed.success) return res.status(400).json({ errors: parsed.error.errors });

    const { name, password, phone, avatarUrl } = parsed.data;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (avatarUrl) updateData.avatarUrl = avatarUrl;
    if (password) updateData.passwordHash = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, createdAt: true, phone: true, avatarUrl: true },
    });

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
