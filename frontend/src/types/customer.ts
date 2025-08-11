export interface Product {
  id: number;
  name: string;
  image: string;
  price: {
    hour: number;
    day: number;
    week: number;
    month: number;
  };
  originalPrice: number;
  ecoScore: number;
  category: string;
  rating: number;
  reviews: number;
  available: boolean;
  co2Saved: string;
  features: string[];
  location: string;
  distance: string;
  deliveryTime: string;
  savings: string;
  popularity: number;
  isWishlisted: boolean;
  discount: number;
}

export interface Rental {
  id: string;
  product: string;
  image: string;
  status: 'Active' | 'Completed' | 'Upcoming' | 'Cancelled';
  pickup: string;
  return: string;
  amount: string;
  co2Saved: string;
  location: string;
  duration: string;
  progress: number;
  nextAction: string;
  rating: number | null;
  canExtend: boolean;
  trackingId: string;
  contract?: Contract;
}

export interface Contract {
  id: string;
  rentalId: string;
  signedDate: string;
  terms: string[];
  status: 'Active' | 'Completed' | 'Pending';
  totalAmount: string;
  deposit: string;
  insurance: string;
  cancellationPolicy: string;
  documentUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
}

export interface SustainabilityData {
  totalCO2Saved: number;
  totalSavings: number;
  productsRented: number;
  treesEquivalent: number;
  monthlyTrend: string;
  ecoLevel: string;
  nextLevel: string;
  progressToNext: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'pickup' | 'return' | 'maintenance' | 'reminder';
  product: string;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
}

export interface Payment {
  id: string;
  rentalId: string;
  amount: string;
  date: string;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'rental' | 'deposit' | 'insurance' | 'late_fee';
  description: string;
}

export interface Notification {
  id: number;
  type: 'reminder' | 'tip' | 'maintenance' | 'payment' | 'promotion';
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
  actionUrl?: string;
}