import {
  LayoutDashboard, Package, Calendar, Truck, FileText, 
  BarChart3, Leaf, Users, DollarSign, AlertCircle, 
  Settings, Star
} from 'lucide-react';
import { StatCard, Order, Product, Delivery, SidebarItem } from '../types';

export const stats: StatCard[] = [
  { 
    title: 'Active Rentals', 
    value: '247', 
    change: '+12%', 
    icon: Package, 
    color: 'text-blue-600', 
    bg: 'bg-blue-50', 
    trend: 'up' 
  },
  { 
    title: 'Monthly Revenue', 
    value: '$45,230', 
    change: '+8%', 
    icon: DollarSign, 
    color: 'text-green-600', 
    bg: 'bg-green-50', 
    trend: 'up' 
  },
  { 
    title: 'Total Customers', 
    value: '1,834', 
    change: '+24%', 
    icon: Users, 
    color: 'text-purple-600', 
    bg: 'bg-purple-50', 
    trend: 'up' 
  },
  { 
    title: 'CO₂ Saved', 
    value: '2.4 Tons', 
    change: '+18%', 
    icon: Leaf, 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-50', 
    trend: 'up' 
  },
  { 
    title: 'Overdue Returns', 
    value: '12', 
    change: '-5%', 
    icon: AlertCircle, 
    color: 'text-red-600', 
    bg: 'bg-red-50', 
    trend: 'down' 
  },
  { 
    title: 'Avg Rating', 
    value: '4.8', 
    change: '+0.2', 
    icon: Star, 
    color: 'text-yellow-600', 
    bg: 'bg-yellow-50', 
    trend: 'up' 
  },
];

// Generate more mock orders for pagination
export const generateMockOrders = (count: number): Order[] => {
  const customers = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Chen', 'David Wilson', 'Lisa Anderson', 'Tom Rodriguez', 'Jessica Brown'];
  const products = ['Power Drill Pro X1', '4-Person Camping Tent', 'HD Projector 4K', 'Professional Camera Kit', 'Cordless Impact Driver', 'Portable Generator', 'Mountain Bike', 'Gaming Laptop'];
  const statuses: Order['status'][] = ['Active', 'Overdue', 'Returning', 'Confirmed'];
  const locations = ['Downtown Office', 'Residential Area', 'Business District', 'Creative Hub', 'Tech Campus', 'Shopping Center'];

  return Array.from({ length: count }, (_, i) => ({
    id: `#ORD-${(2400 + i).toString().padStart(4, '0')}`,
    customer: customers[i % customers.length],
    product: products[i % products.length],
    status: statuses[i % statuses.length],
    amount: `$${(100 + (i * 23) % 400).toString()}`,
    due: new Date(Date.now() + (i % 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration: `${(i % 14) + 1} days`,
    location: locations[i % locations.length],
    phone: `+1 234-567-${(8900 + i).toString().slice(-4)}`
  }));
};

// Generate more mock products for pagination
export const generateMockProducts = (count: number): Product[] => {
  const categories = ['Power Tools', 'Camping Equipment', 'Electronics', 'Furniture', 'Sports Equipment', 'Party Supplies'];
  const conditions: Product['condition'][] = ['Excellent', 'Good', 'Fair'];
  const baseProducts = [
    'Power Drill', 'Camping Tent', 'HD Projector', 'Camera Kit', 'Impact Driver', 'Generator', 
    'Mountain Bike', 'Gaming Laptop', 'Party Speakers', 'Folding Table', 'Sleeping Bag', 'Drone'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${baseProducts[i % baseProducts.length]} ${i > 11 ? 'v' + Math.floor(i / 12) : ''}`,
    category: categories[i % categories.length],
    image: `https://images.pexels.com/photos/${162553 + (i * 100)}/pexels-photo-${162553 + (i * 100)}.jpeg?auto=compress&cs=tinysrgb&w=400`,
    price: {
      hour: 8 + (i % 20),
      day: 35 + (i % 50),
      week: 200 + (i % 300),
      month: 750 + (i % 1000)
    },
    stock: 5 + (i % 15),
    available: 3 + (i % 10),
    rented: i % 5,
    ecoScore: 75 + (i % 25),
    rating: 4.2 + ((i % 8) * 0.1),
    totalRentals: 50 + (i % 200),
    revenue: `$${((i + 1) * 1000 + (i % 1000) * 10).toLocaleString()}`,
    condition: conditions[i % conditions.length],
    lastMaintenance: new Date(Date.now() - (i % 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }));
};

export const mockOrders = generateMockOrders(50);
export const mockProducts = generateMockProducts(36);

export const deliverySchedule: Delivery[] = [
  {
    id: 'DEL-001',
    type: 'Pickup',
    customer: 'John Smith',
    product: 'Power Drill Pro X1',
    address: '123 Main St, Downtown',
    time: '10:00 AM',
    date: '2024-01-15',
    status: 'Scheduled',
    driver: 'Mike Wilson'
  },
  {
    id: 'DEL-002',
    type: 'Return',
    customer: 'Sarah Johnson',
    product: 'Camping Tent',
    address: '456 Oak Ave, Suburbs',
    time: '2:30 PM',
    date: '2024-01-15',
    status: 'In Progress',
    driver: 'Lisa Chen'
  },
  {
    id: 'DEL-003',
    type: 'Delivery',
    customer: 'Emily Davis',
    product: 'HD Projector',
    address: '789 Business Blvd',
    time: '4:00 PM',
    date: '2024-01-15',
    status: 'Completed',
    driver: 'Tom Rodriguez'
  },
];

export const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Product Management', icon: Package },
  { id: 'availability', label: 'Availability Calendar', icon: Calendar },
  { id: 'orders', label: 'Orders & Contracts', icon: FileText },
  { id: 'delivery', label: 'Delivery Management', icon: Truck },
  { id: 'scans', label: 'AI Condition Reports', icon: AlertCircle },
  { id: 'invoicing', label: 'Invoicing & Payments', icon: DollarSign },
  { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'sustainability', label: 'Sustainability', icon: Leaf },
  { id: 'customers', label: 'Customer Management', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];