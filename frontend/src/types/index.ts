// Core user and authentication types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'PROVIDER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: CustomerProfile | ProviderProfile;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  emergencyContact?: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  businessName?: string;
  businessType?: string;
  taxId?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'CUSTOMER' | 'PROVIDER';
}

export interface OTPForm {
  email: string;
  otp: string;
}

// Product and rental types
export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  basePrice: number;
  images: string[];
  isActive: boolean;
  providerId: string;
  provider?: User;
  specifications?: Record<string, any>;
  rentalDurations: RentalDuration[];
  availability: ProductAvailability[];
  createdAt: string;
  updatedAt: string;
}

export interface RentalDuration {
  id: string;
  productId: string;
  durationInDays: number;
  priceMultiplier: number;
  label: string; // "Per Hour", "Per Day", "Per Week", etc.
}

export interface ProductAvailability {
  id: string;
  productId: string;
  startDate: string;
  endDate: string;
  isBooked: boolean;
  rentalId?: string;
}

export interface Rental {
  id: string;
  customerId: string;
  customer?: User;
  productId: string;
  product?: Product;
  availabilityId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: RentalStatus;
  quotation?: Quotation;
  invoices: Invoice[];
  pickups: Pickup[];
  returns: RentalReturn[];
  createdAt: string;
  updatedAt: string;
}

export type RentalStatus = 
  | 'PENDING' 
  | 'QUOTATION_SENT' 
  | 'CONFIRMED' 
  | 'PICKUP_SCHEDULED' 
  | 'PICKED_UP' 
  | 'RETURNED' 
  | 'COMPLETED' 
  | 'CANCELLED';

export interface Quotation {
  id: string;
  rentalId: string;
  rental?: Rental;
  price: number;
  validTill?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
}

// Invoice and payment types
export interface Invoice {
  id: string;
  rentalId: string;
  rental?: Rental;
  amount: number;
  type: 'RENTAL' | 'LATE_FEE' | 'DAMAGE' | 'DEPOSIT';
  status: InvoiceStatus;
  dueDate?: string;
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

export type InvoiceStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface Payment {
  id: string;
  invoiceId: string;
  invoice?: Invoice;
  amount: number;
  method: 'CARD' | 'BANK_TRANSFER' | 'CASH' | 'UPI';
  status: PaymentStatus;
  transactionId?: string;
  gatewayResponse?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

// Logistics types
export interface Pickup {
  id: string;
  rentalId: string;
  rental?: Rental;
  scheduledDate: string;
  actualDate?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  notes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RentalReturn {
  id: string;
  rentalId: string;
  rental?: Rental;
  scheduledDate: string;
  actualDate?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  lateFee?: number;
  damageAssessment?: string;
  notes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'CUSTOMER_REMINDER' | 'PROVIDER_ALERT' | 'SYSTEM_UPDATE' | 'PAYMENT_DUE';
  title: string;
  message: string;
  isRead: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
}

// Pricing types
export interface Pricelist {
  id: string;
  name: string;
  description?: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  items: PricelistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PricelistItem {
  id: string;
  pricelistId: string;
  productId: string;
  product?: Product;
  price: number;
  discount?: number;
  createdAt: string;
  updatedAt: string;
}

// Filter and search types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: string; // date range
  providerId?: string;
  search?: string;
}

export interface RentalFilters {
  status?: RentalStatus;
  customerId?: string;
  productId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// Dashboard and analytics types
export interface DashboardStats {
  totalRevenue: number;
  activeRentals: number;
  totalProducts: number;
  totalCustomers: number;
  pendingReturns: number;
  overduePayments: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  rentals: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  totalRevenue: number;
  totalRentals: number;
}

export interface CustomerStats {
  customerId: string;
  customerName: string;
  totalSpent: number;
  totalRentals: number;
}

// API response wrappers
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}