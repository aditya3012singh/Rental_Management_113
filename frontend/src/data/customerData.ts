import { Product, Rental, Category, SustainabilityData, CalendarEvent, Payment, Notification, Contract } from '../types/customer';

export const generateProducts = (count: number): Product[] => {
  const categories = ['Power Tools', 'Camping', 'Electronics', 'Photography', 'Party Supplies', 'Furniture', 'Sports'];
  const baseProducts = [
    'Power Drill', 'Camping Tent', 'HD Projector', 'Camera Kit', 'Party Speakers', 'Folding Table', 
    'Mountain Bike', 'Gaming Console', 'Pressure Washer', 'Lawn Mower', 'Chainsaw', 'Angle Grinder'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${baseProducts[i % baseProducts.length]} ${i > 11 ? 'Pro v' + Math.floor(i / 12) : 'Pro'}`,
    image: `https://images.pexels.com/photos/${162553 + (i * 100)}/pexels-photo-${162553 + (i * 100)}.jpeg?auto=compress&cs=tinysrgb&w=400`,
    price: {
      hour: 8 + (i % 30),
      day: 35 + (i % 100),
      week: 200 + (i % 500),
      month: 750 + (i % 2000)
    },
    originalPrice: 299 + (i % 2000),
    ecoScore: 75 + (i % 25),
    category: categories[i % categories.length],
    rating: 4.2 + ((i % 8) * 0.1),
    reviews: 50 + (i % 300),
    available: i % 5 !== 0,
    co2Saved: `${(1.5 + (i % 20) * 0.3).toFixed(1)} kg`,
    features: ['Feature A', 'Feature B', 'Feature C', 'Feature D'].slice(0, 2 + (i % 3)),
    location: ['Downtown Warehouse', 'Outdoor Center', 'Tech Hub', 'Creative Studio'][i % 4],
    distance: `${(1.2 + (i % 5) * 0.8).toFixed(1)} km`,
    deliveryTime: ['Same day', 'Next day', '2-3 days'][i % 3],
    savings: `$${(200 + (i % 1000)).toLocaleString()} vs buying`,
    popularity: 60 + (i % 40),
    isWishlisted: i % 7 === 0,
    discount: i % 4 === 0 ? 10 + (i % 20) : 0
  }));
};

export const generateRentals = (count: number): Rental[] => {
  const products = ['Power Drill Kit', 'Camping Tent Pro', 'HD Projector', 'Camera Kit', 'Party Speakers'];
  const statuses: Rental['status'][] = ['Active', 'Completed', 'Upcoming', 'Cancelled'];
  const locations = ['Downtown Warehouse', 'Outdoor Center', 'Tech Hub', 'Creative Studio'];

  return Array.from({ length: count }, (_, i) => ({
    id: `#R-${(2400 + i).toString().padStart(4, '0')}`,
    product: `${products[i % products.length]} ${i > 4 ? 'v' + Math.floor(i / 5) : ''}`,
    image: `https://images.pexels.com/photos/${162553 + (i * 100)}/pexels-photo-${162553 + (i * 100)}.jpeg?auto=compress&cs=tinysrgb&w=400`,
    status: statuses[i % statuses.length],
    pickup: new Date(Date.now() - (i * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    return: new Date(Date.now() + ((7 - i) * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    amount: `$${(200 + (i * 50) % 800).toString()}`,
    co2Saved: `${(2.0 + (i % 15) * 0.5).toFixed(1)} kg`,
    location: locations[i % locations.length],
    duration: `${(3 + i % 14)} days`,
    progress: i % 4 === 0 ? 60 : i % 4 === 1 ? 100 : 0,
    nextAction: i % 4 === 0 ? 'Return in 2 days' : i % 4 === 1 ? 'Rate experience' : 'Pickup in 5 days',
    rating: i % 4 === 1 ? 4 + (i % 2) : null,
    canExtend: i % 4 === 0,
    trackingId: `TRK-${(i + 1).toString().padStart(3, '0')}`
  }));
};

export const generateContracts = (count: number): Contract[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `CON-${(2400 + i).toString().padStart(4, '0')}`,
    rentalId: `#R-${(2400 + i).toString().padStart(4, '0')}`,
    signedDate: new Date(Date.now() - (i * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    terms: [
      'Renter is responsible for any damage beyond normal wear',
      'Late returns incur additional daily charges',
      'Equipment must be returned clean and in working condition',
      'Insurance coverage included for accidental damage'
    ],
    status: ['Active', 'Completed', 'Pending'][i % 3] as Contract['status'],
    totalAmount: `$${(200 + (i * 50) % 800).toString()}`,
    deposit: `$${(50 + (i * 10) % 200).toString()}`,
    insurance: `$${(15 + (i * 5) % 50).toString()}`,
    cancellationPolicy: '24-hour notice required for cancellation',
    documentUrl: `/contracts/CON-${(2400 + i).toString().padStart(4, '0')}.pdf`
  }));
};

export const categories: Category[] = [
  { id: 'all', name: 'All Categories', count: 247, icon: '🏪' },
  { id: 'power-tools', name: 'Power Tools', count: 45, icon: '🔧' },
  { id: 'camping', name: 'Camping', count: 32, icon: '⛺' },
  { id: 'electronics', name: 'Electronics', count: 28, icon: '📱' },
  { id: 'photography', name: 'Photography', count: 19, icon: '📸' },
  { id: 'party', name: 'Party Supplies', count: 41, icon: '🎉' },
  { id: 'furniture', name: 'Furniture', count: 36, icon: '🪑' },
  { id: 'sports', name: 'Sports', count: 46, icon: '⚽' },
];

export const sustainabilityData: SustainabilityData = {
  totalCO2Saved: 18.0,
  totalSavings: 2450,
  productsRented: 12,
  treesEquivalent: 3.2,
  monthlyTrend: '+24%',
  ecoLevel: 'Green Champion',
  nextLevel: 'Eco Warrior',
  progressToNext: 75
};

export const generateCalendarEvents = (count: number): CalendarEvent[] => {
  const types: CalendarEvent['type'][] = ['pickup', 'return', 'maintenance', 'reminder'];
  const products = ['Power Drill Kit', 'Camping Tent Pro', 'HD Projector', 'Camera Kit'];
  const locations = ['Downtown Warehouse', 'Outdoor Center', 'Tech Hub', 'Creative Studio'];

  return Array.from({ length: count }, (_, i) => ({
    id: `EVT-${(i + 1).toString().padStart(3, '0')}`,
    title: `${types[i % types.length].charAt(0).toUpperCase() + types[i % types.length].slice(1)} - ${products[i % products.length]}`,
    date: new Date(Date.now() + (i - 15) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: `${9 + (i % 8)}:${(i % 4) * 15 || '00'} ${i % 2 ? 'AM' : 'PM'}`,
    type: types[i % types.length],
    product: products[i % products.length],
    location: locations[i % locations.length],
    status: ['scheduled', 'completed', 'cancelled'][i % 3] as CalendarEvent['status'],
    priority: ['high', 'medium', 'low'][i % 3] as CalendarEvent['priority']
  }));
};

export const generatePayments = (count: number): Payment[] => {
  const methods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Apple Pay'];
  const types: Payment['type'][] = ['rental', 'deposit', 'insurance', 'late_fee'];
  const statuses: Payment['status'][] = ['completed', 'pending', 'failed'];

  return Array.from({ length: count }, (_, i) => ({
    id: `PAY-${(i + 1).toString().padStart(4, '0')}`,
    rentalId: `#R-${(2400 + i).toString().padStart(4, '0')}`,
    amount: `$${(50 + (i * 25) % 500).toString()}`,
    date: new Date(Date.now() - (i * 3) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    method: methods[i % methods.length],
    status: statuses[i % statuses.length],
    type: types[i % types.length],
    description: `Payment for ${types[i % types.length].replace('_', ' ')}`
  }));
};

export const generateNotifications = (count: number): Notification[] => {
  const types: Notification['type'][] = ['reminder', 'tip', 'maintenance', 'payment', 'promotion'];
  const priorities: Notification['priority'][] = ['high', 'medium', 'low'];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    type: types[i % types.length],
    title: `${types[i % types.length].charAt(0).toUpperCase() + types[i % types.length].slice(1)} Notification`,
    message: `This is a sample ${types[i % types.length]} notification message.`,
    time: `${i + 1} ${i === 0 ? 'hour' : 'hours'} ago`,
    priority: priorities[i % priorities.length],
    read: i % 3 === 0,
    actionUrl: i % 4 === 0 ? '/rentals' : undefined
  }));
};

export const mockProducts = generateProducts(48);
export const mockRentals = generateRentals(25);
export const mockContracts = generateContracts(25);
export const mockCalendarEvents = generateCalendarEvents(30);
export const mockPayments = generatePayments(20);
export const mockNotifications = generateNotifications(15);