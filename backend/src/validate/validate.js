import { z } from "zod";

// -------------------
// Enums
// -------------------
export const UserRoleEnum = z.enum(["CUSTOMER", "END_USER", "PROVIDER", "ADMIN"]);
export const RentalStatusEnum = z.enum([
  "QUOTATION",
  "CONFIRMED",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
]);
export const PaymentStatusEnum = z.enum([
  "PENDING",
  "PAID",
  "PARTIAL",
  "REFUNDED",
]);
export const InvoiceTypeEnum = z.enum(["FULL", "PARTIAL", "LATE_FEE"]);
export const NotificationTypeEnum = z.enum([
  "CUSTOMER_REMINDER",
  "END_USER_REMINDER",
]);

// -------------------
// User
// -------------------
export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  role: UserRoleEnum.default("CUSTOMER"),
  phone: z.string().optional(),
});

// -------------------
// Auth Schemas
// -------------------
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
});

export const deleteUserSchema = z.object({
  userId: z.string().cuid(),
});

// -------------------
// Product
// -------------------
export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  isRentable: z.boolean().default(true),
  unitType: z.string().min(1),
  basePrice: z.number().nonnegative(),
});

// -------------------
// Rental Duration
// -------------------
export const rentalDurationSchema = z.object({
  productId: z.string().cuid(),
  duration: z.string().min(1),
  price: z.number().nonnegative(),
});

// -------------------
// Product Availability
// -------------------
export const productAvailabilitySchema = z.object({
  productId: z.string().cuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isBooked: z.boolean().default(false),
});

// -------------------
// Rental
// -------------------
export const rentalSchema = z.object({
  customerId: z.string().cuid(),
  productId: z.string().cuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  status: RentalStatusEnum.default("QUOTATION"),
});

// -------------------
// Rental History
// -------------------
export const rentalHistorySchema = z.object({
  rentalId: z.string().cuid(),
  oldStatus: RentalStatusEnum,
  newStatus: RentalStatusEnum,
  changedById: z.string().cuid().optional(),
});

// -------------------
// Quotation
// -------------------
export const quotationSchema = z.object({
  rentalId: z.string().cuid(),
  price: z.number().nonnegative(),
  validTill: z.coerce.date().optional(),
  isAccepted: z.boolean().default(false),
});

// -------------------
// Pickup
// -------------------
export const pickupSchema = z.object({
  rentalId: z.string().cuid(),
  scheduled: z.coerce.date(),
  completed: z.boolean().default(false),
});

// -------------------
// Rental Return
// -------------------
export const rentalReturnSchema = z.object({
  rentalId: z.string().cuid(),
  scheduled: z.coerce.date(),
  completed: z.boolean().default(false),
  lateFee: z.number().nonnegative().optional(),
});

// Bulk complete returns
export const bulkCompleteReturnsSchema = z.object({
  returnIds: z.array(z.string().cuid()).min(1, "At least one return ID is required"),
});

// Late fee automation
export const lateFeeAutomationSchema = z.object({
  date: z.coerce.date(),
  lateFeePerDay: z.number().nonnegative().default(50), // default fee per day
});

// -------------------
// Pricelist
// -------------------
export const pricelistSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  validFrom: z.coerce.date(),
  validTo: z.coerce.date(),
});

// -------------------
// Pricelist Item
// -------------------
export const pricelistItemSchema = z.object({
  pricelistId: z.string().cuid(),
  productId: z.string().cuid(),
  price: z.number().nonnegative(),
  discount: z.number().nonnegative().optional(),
});

// -------------------
// Invoice
// -------------------
export const invoiceSchema = z.object({
  rentalId: z.string().cuid(),
  amount: z.number().nonnegative(),
  type: InvoiceTypeEnum,
  status: PaymentStatusEnum.default("PENDING"),
});

// -------------------
// Payment
// -------------------
export const paymentSchema = z.object({
  invoiceId: z.string().cuid(),
  amount: z.number().nonnegative(),
  method: z.string().min(1),
  transactionId: z.string().optional(),
  status: PaymentStatusEnum.default("PAID"),
});

// -------------------
// Notification
// -------------------
export const notificationSchema = z.object({
  type: NotificationTypeEnum,
  message: z.string().min(1),
  userId: z.string().cuid(),
  sendDate: z.coerce.date(),
  isRead: z.boolean().default(false),
});
