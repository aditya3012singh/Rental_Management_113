export interface CurrentRental {
  id: string;
  product: string;
  image: string;
  pickupDate: string;
  returnDate: string;
  location: string;
  status: 'Active' | 'Completed' | 'Upcoming';
  progress: number;
  daysLeft: number;
  customerName: string;
  customerPhone: string;
  emergencyContact: string;
  serialNumber: string;
  condition: string;
  batteryLevel: number;
  lastUsed: string;
}

export interface ScheduleItem {
  type: string;
  product: string;
  date: string;
  time: string;
  status: 'upcoming' | 'scheduled' | 'optional';
  location: string;
  instructions: string;
  priority: 'high' | 'medium' | 'low';
}

export interface UsageGuidelines {
  safety: string[];
  operation: string[];
  maintenance: string[];
}

export interface EcoTip {
  title: string;
  tip: string;
  icon: string;
  category: string;
  impact: 'High' | 'Medium' | 'Low';
  co2Saved: string;
}

export interface ConditionReport {
  id: string;
  type: 'Pre-Rental' | 'Mid-Rental Check' | 'Post-Rental';
  date: string;
  status: 'Completed' | 'Pending';
  aiScore: number | null;
  issues: number | null;
  photos: number;
  summary: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'high' | 'medium' | 'low';
  createdDate: string;
  lastUpdate: string;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  sender: 'user' | 'support';
  message: string;
  timestamp: string;
  attachments?: string[];
}