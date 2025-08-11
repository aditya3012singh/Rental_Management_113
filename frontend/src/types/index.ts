export interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
  bg: string;
  trend: 'up' | 'down';
}

export interface Order {
  id: string;
  customer: string;
  product: string;
  status: 'Active' | 'Overdue' | 'Returning' | 'Confirmed';
  amount: string;
  due: string;
  duration: string;
  location: string;
  phone: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  price: {
    hour: number;
    day: number;
    week: number;
    month: number;
  };
  stock: number;
  available: number;
  rented: number;
  ecoScore: number;
  rating: number;
  totalRentals: number;
  revenue: string;
  condition: 'Excellent' | 'Good' | 'Fair';
  lastMaintenance: string;
}

export interface Delivery {
  id: string;
  type: 'Pickup' | 'Return' | 'Delivery';
  customer: string;
  product: string;
  address: string;
  time: string;
  date: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  driver: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: any;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}