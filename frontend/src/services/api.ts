import type {
  User,
  AuthResponse,
  Product,
  Rental,
  Quotation,
  Invoice,
  Payment,
  Notification,
  Pickup,
  RentalReturn,
  Pricelist,
  LoginForm,
  SignupForm,
  OTPForm,
  ProductFilters,
  RentalFilters,
  RentalStatus,
  PaymentStatus,
  InvoiceStatus
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let forceLogoutFn: () => void = () => {};

export const setForceLogout = (fn: () => void) => {
  forceLogoutFn = fn;
};

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private getAuthHeadersForFormData() {
    const token = localStorage.getItem('auth_token');
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse(response: Response) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('auth_token');
      forceLogoutFn();
      return;
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error('Invalid response format.');
    }

    if (!response.ok) {
      throw new Error(data?.message || data?.error || 'Unexpected error');
    }

    return data;
  }

  // =====================
  // AUTH ENDPOINTS
  // =====================
  async generateOTP(email: string) {
    const response = await fetch(`${API_BASE_URL}/auth/generate-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return this.handleResponse(response);
  }

  async verifyOTP(data: OTPForm) {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async signup(data: SignupForm): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async signin(data: LoginForm): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }
  
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('auth_token');

      // If no token, don't throw — just return a "logged out" state
      if (!token) {
        return { user: null };
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      // rethrow only if you want AuthProvider's onError to handle it
      throw error;
    }
  }

  async updateProfile(data: Partial<User>) {
    const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async checkAdmin() {
    const response = await fetch(`${API_BASE_URL}/auth/check-admin`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return this.handleResponse(response);
  }

  async checkUser(email: string) {
    const response = await fetch(`${API_BASE_URL}/auth/check-user?email=${encodeURIComponent(email)}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return this.handleResponse(response);
  }

  async getAllUsers(): Promise<{ users: User[] }> {
    const response = await fetch(`${API_BASE_URL}/auth/users`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async deleteUser(userId: string) {
    const response = await fetch(`${API_BASE_URL}/auth/user`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ userId }),
    });
    return this.handleResponse(response);
  }

  // =====================
  // ADMIN ENDPOINTS
  // =====================
  async getDashboard() {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async impersonateUser(userId: string) {
    const response = await fetch(`${API_BASE_URL}/admin/impersonate/${userId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // =====================
  // PRODUCT ENDPOINTS
  // =====================
  async getAllProducts(params?: { skip?: number; take?: number }): Promise<Product[]> {
    const queryParams = new URLSearchParams();
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.take) queryParams.append('take', params.take.toString());

    const response = await fetch(`${API_BASE_URL}/product?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getProductById(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createProduct(data: Partial<Product>) {
    const response = await fetch(`${API_BASE_URL}/product`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateProduct(id: string, data: Partial<Product>) {
    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteProduct(id: string) {
    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async addProductDuration(id: string, data: { durationInDays: number; priceMultiplier: number }) {
    const response = await fetch(`${API_BASE_URL}/product/${id}/duration`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async addProductAvailability(id: string, data: { startDate: string; endDate: string }) {
    const response = await fetch(`${API_BASE_URL}/product/${id}/availability`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateProductAvailability(availabilityId: string, data: Partial<{ startDate: string; endDate: string; isBooked: boolean }>) {
    const response = await fetch(`${API_BASE_URL}/product/availability/${availabilityId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteProductAvailability(availabilityId: string) {
    const response = await fetch(`${API_BASE_URL}/product/availability/${availabilityId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // =====================
  // RENTAL ENDPOINTS
  // =====================
  async createRental(data: {
    productId: string;
    availabilityId: string;
    startDate: string;
    endDate: string;
    price: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/rental`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getAllRentals(): Promise<Rental[]> {
    const response = await fetch(`${API_BASE_URL}/rental`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getMyRentals(): Promise<Rental[]> {
    const response = await fetch(`${API_BASE_URL}/rental/my`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateRentalStatus(id: string, status: RentalStatus) {
    const response = await fetch(`${API_BASE_URL}/rental/${id}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return this.handleResponse(response);
  }

  async deleteRental(id: string) {
    const response = await fetch(`${API_BASE_URL}/rental/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // =====================
  // QUOTATION ENDPOINTS
  // =====================
  async createQuotation(data: { rentalId: string; price: number; validTill?: string }) {
    const response = await fetch(`${API_BASE_URL}/quotation`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async acceptQuotation(id: string) {
    const response = await fetch(`${API_BASE_URL}/quotation/${id}/accept`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getAllQuotations(): Promise<Quotation[]> {
    const response = await fetch(`${API_BASE_URL}/quotation`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getMyQuotations(): Promise<Quotation[]> {
    const response = await fetch(`${API_BASE_URL}/quotation/my`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async deleteQuotation(id: string) {
    const response = await fetch(`${API_BASE_URL}/quotation/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // =====================
  // INVOICE ENDPOINTS
  // =====================
  async createInvoice(data: {
    rentalId: string;
    amount: number;
    type: 'RENTAL' | 'LATE_FEE' | 'DAMAGE';
    status?: InvoiceStatus;
  }) {
    const response = await fetch(`${API_BASE_URL}/invoice`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getAllInvoices(): Promise<Invoice[]> {
    const response = await fetch(`${API_BASE_URL}/invoice`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    const response = await fetch(`${API_BASE_URL}/invoice/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateInvoiceStatus(id: string, status: InvoiceStatus) {
    const response = await fetch(`${API_BASE_URL}/invoice/${id}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return this.handleResponse(response);
  }

  async deleteInvoice(id: string) {
    const response = await fetch(`${API_BASE_URL}/invoice/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // =====================
  // PAYMENT ENDPOINTS
  // =====================
  async createPayment(data: {
    invoiceId: string;
    amount: number;
    method: 'CARD' | 'BANK_TRANSFER' | 'CASH' | 'UPI';
    transactionId?: string;
    status?: PaymentStatus;
  }) {
    const response = await fetch(`${API_BASE_URL}/payment`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getMyPayments(): Promise<Payment[]> {
    const response = await fetch(`${API_BASE_URL}/payment/my`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getAllPayments(): Promise<Payment[]> {
    const response = await fetch(`${API_BASE_URL}/payment`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updatePaymentStatus(id: string, status: PaymentStatus) {
    const response = await fetch(`${API_BASE_URL}/payment/${id}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return this.handleResponse(response);
  }

  async deletePayment(id: string) {
    const response = await fetch(`${API_BASE_URL}/payment/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Mock payment processing for demo
  async processPayment(paymentData: {
    amount: number;
    method: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
  }) {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success/failure
    const isSuccess = Math.random() > 0.1; // 90% success rate
    
    if (isSuccess) {
      return {
        success: true,
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: 'Payment processed successfully'
      };
    } else {
      throw new Error('Payment failed. Please try again.');
    }
  }

  // =====================
  // NOTIFICATION ENDPOINTS
  // =====================
  async createNotification(data: {
    type: 'CUSTOMER_REMINDER' | 'PROVIDER_ALERT' | 'SYSTEM_UPDATE';
    message: string;
    userId: string;
    sendDate?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/notification`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getMyNotifications(): Promise<Notification[]> {
    const response = await fetch(`${API_BASE_URL}/notification`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async markNotificationAsRead(id: string, isRead: boolean = true) {
    const response = await fetch(`${API_BASE_URL}/notification/${id}/read`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ isRead }),
    });
    return this.handleResponse(response);
  }

  async deleteNotification(id: string) {
    const response = await fetch(`${API_BASE_URL}/notification/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // =====================
  // PICKUP ENDPOINTS
  // =====================
  async createPickup(data: { rentalId: string; scheduled: string }) {
    const response = await fetch(`${API_BASE_URL}/pickup`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async completePickup(id: string) {
    const response = await fetch(`${API_BASE_URL}/pickup/${id}/complete`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getAllPickups(): Promise<Pickup[]> {
    const response = await fetch(`${API_BASE_URL}/pickup`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getMyPickups(): Promise<Pickup[]> {
    const response = await fetch(`${API_BASE_URL}/pickup/my`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async deletePickup(id: string) {
    const response = await fetch(`${API_BASE_URL}/pickup/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // =====================
  // RENTAL RETURN ENDPOINTS
  // =====================
  async createRentalReturn(data: {
    rentalId: string;
    scheduled: string;
    completed?: boolean;
    lateFee?: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/rental-return`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async completeRentalReturn(id: string) {
    const response = await fetch(`${API_BASE_URL}/rental-return/${id}/complete`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getAllRentalReturns(): Promise<RentalReturn[]> {
    const response = await fetch(`${API_BASE_URL}/rental-return`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getMyRentalReturns(): Promise<RentalReturn[]> {
    const response = await fetch(`${API_BASE_URL}/rental-return/my`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateRentalReturn(id: string, data: Partial<RentalReturn>) {
    const response = await fetch(`${API_BASE_URL}/rental-return/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteRentalReturn(id: string) {
    const response = await fetch(`${API_BASE_URL}/rental-return/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // =====================
  // REPORTS ENDPOINTS (Mock Data)
  // =====================
  async getRevenue(params: { startDate: string; endDate: string }) {
    // Mock revenue data
    return new Promise(resolve => {
      setTimeout(() => {
        const days = Math.ceil((new Date(params.endDate).getTime() - new Date(params.startDate).getTime()) / (1000 * 60 * 60 * 24));
        const data = Array.from({ length: days }, (_, i) => ({
          date: new Date(new Date(params.startDate).getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          revenue: Math.floor(Math.random() * 5000) + 1000,
          rentals: Math.floor(Math.random() * 20) + 5
        }));
        resolve({ data });
      }, 500);
    });
  }

  async getRentalStatus() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: [
            { status: 'CONFIRMED', count: 25 },
            { status: 'PICKUP_SCHEDULED', count: 15 },
            { status: 'PICKED_UP', count: 30 },
            { status: 'RETURNED', count: 40 },
            { status: 'COMPLETED', count: 80 }
          ]
        });
      }, 300);
    });
  }

  async getTopProducts() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: [
            { productName: 'Canon EOS R5', totalRevenue: 25000, totalRentals: 45 },
            { productName: 'MacBook Pro 16"', totalRevenue: 18000, totalRentals: 32 },
            { productName: 'Sony A7 III', totalRevenue: 15000, totalRentals: 38 },
            { productName: 'DJI Mavic Air 2', totalRevenue: 12000, totalRentals: 28 },
            { productName: 'Nikon D850', totalRevenue: 10000, totalRentals: 22 }
          ]
        });
      }, 400);
    });
  }
}

export const apiService = new ApiService();
export default apiService;