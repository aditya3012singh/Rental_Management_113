import { CurrentRental, ScheduleItem, UsageGuidelines, EcoTip, ConditionReport, SupportTicket, SupportMessage, Notification } from '../types/enduser';

export const currentRental: CurrentRental = {
  id: '#R-2401',
  product: 'Professional Power Drill Kit',
  image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400',
  pickupDate: '2024-01-10',
  returnDate: '2024-01-17',
  location: '123 Main St, Downtown Warehouse',
  status: 'Active',
  progress: 60,
  daysLeft: 2,
  customerName: 'John Smith',
  customerPhone: '+1 234-567-8901',
  emergencyContact: '+1 800-ECO-RENT',
  serialNumber: 'PD-2024-001',
  condition: 'Excellent',
  batteryLevel: 85,
  lastUsed: '2024-01-13'
};

export const upcomingSchedule: ScheduleItem[] = [
  {
    type: 'Return Reminder',
    product: 'Professional Power Drill Kit',
    date: '2024-01-17',
    time: '2:00 PM',
    status: 'upcoming',
    location: 'Downtown Warehouse',
    instructions: 'Please ensure all accessories are included',
    priority: 'high'
  },
  {
    type: 'Pickup Scheduled',
    product: '4-Person Camping Tent Pro',
    date: '2024-01-20',
    time: '10:00 AM',
    status: 'scheduled',
    location: 'Outdoor Center',
    instructions: 'Bring ID and rental confirmation',
    priority: 'medium'
  },
  {
    type: 'Maintenance Check',
    product: 'Professional Power Drill Kit',
    date: '2024-01-16',
    time: '11:00 AM',
    status: 'optional',
    location: 'Your Location',
    instructions: 'Optional performance check',
    priority: 'low'
  },
];

export const usageGuidelines: UsageGuidelines = {
  safety: [
    'Always wear safety glasses when operating power tools',
    'Keep hands away from rotating parts and drill bits',
    'Ensure battery is properly inserted before use',
    'Disconnect battery when changing drill bits or attachments',
    'Store in dry location when not in use'
  ],
  operation: [
    'Select appropriate drill bit for your material type',
    'Adjust torque setting based on screw size and material',
    'Hold drill firmly with both hands during operation',
    'Apply steady, even pressure - let the tool do the work',
    'Allow motor to cool between heavy-duty applications'
  ],
  maintenance: [
    'Clean tool after each use with dry cloth',
    'Check battery charge level before starting work',
    'Inspect drill bits for wear and replace if damaged',
    'Store batteries at room temperature when not in use',
    'Report any unusual sounds or performance issues immediately'
  ]
};

export const ecoTips: EcoTip[] = [
  {
    title: 'Battery Optimization',
    tip: 'Let the battery cool down between uses to extend its life and maintain efficiency. This can improve battery life by up to 30%.',
    icon: '🔋',
    category: 'Energy Efficiency',
    impact: 'High',
    co2Saved: '0.2 kg'
  },
  {
    title: 'Right Tool Selection',
    tip: 'Use the correct drill bit size to reduce energy consumption by up to 15% and achieve better results.',
    icon: '⚡',
    category: 'Efficiency',
    impact: 'Medium',
    co2Saved: '0.1 kg'
  },
  {
    title: 'Proper Storage',
    tip: 'Store tools in a dry place to prevent rust and maintain optimal performance, extending product lifespan.',
    icon: '📦',
    category: 'Longevity',
    impact: 'High',
    co2Saved: '0.3 kg'
  },
  {
    title: 'Smart Usage',
    tip: 'Plan your drilling tasks in batches to minimize setup time and maximize battery efficiency.',
    icon: '🎯',
    category: 'Planning',
    impact: 'Medium',
    co2Saved: '0.15 kg'
  },
];

export const conditionReports: ConditionReport[] = [
  {
    id: 'CR-001',
    type: 'Pre-Rental',
    date: '2024-01-10',
    status: 'Completed',
    aiScore: 95,
    issues: 0,
    photos: 8,
    summary: 'Excellent condition, no issues detected'
  },
  {
    id: 'CR-002',
    type: 'Mid-Rental Check',
    date: '2024-01-13',
    status: 'Completed',
    aiScore: 92,
    issues: 1,
    photos: 5,
    summary: 'Minor wear on drill bit, normal usage'
  },
  {
    id: 'CR-003',
    type: 'Post-Rental',
    date: 'Pending',
    status: 'Pending',
    aiScore: null,
    issues: null,
    photos: 0,
    summary: 'Upload required before return'
  },
];

export const generateSupportTickets = (count: number): SupportTicket[] => {
  const subjects = [
    'Battery not charging properly',
    'Drill bit stuck in chuck',
    'Unusual noise during operation',
    'Missing accessories',
    'Delivery scheduling issue',
    'Return process question'
  ];
  const statuses: SupportTicket['status'][] = ['open', 'in_progress', 'resolved', 'closed'];
  const priorities: SupportTicket['priority'][] = ['high', 'medium', 'low'];

  return Array.from({ length: count }, (_, i) => ({
    id: `TKT-${(i + 1).toString().padStart(4, '0')}`,
    subject: subjects[i % subjects.length],
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    createdDate: new Date(Date.now() - (i * 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lastUpdate: new Date(Date.now() - (i * 12) * 60 * 60 * 1000).toISOString().split('T')[0],
    messages: [
      {
        id: `MSG-${i + 1}-1`,
        sender: 'user',
        message: `I'm experiencing an issue with ${subjects[i % subjects.length].toLowerCase()}.`,
        timestamp: new Date(Date.now() - (i * 2) * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: `MSG-${i + 1}-2`,
        sender: 'support',
        message: 'Thank you for contacting us. We\'re looking into this issue and will get back to you shortly.',
        timestamp: new Date(Date.now() - (i * 2 - 0.5) * 24 * 60 * 60 * 1000).toISOString(),
      }
    ]
  }));
};

export const generateNotifications = (count: number): Notification[] => {
  const types: Notification['type'][] = ['reminder', 'tip', 'maintenance', 'payment', 'promotion'];
  const priorities: Notification['priority'][] = ['high', 'medium', 'low'];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    type: types[i % types.length],
    title: `${types[i % types.length].charAt(0).toUpperCase() + types[i % types.length].slice(1)} Notification`,
    message: `This is a sample ${types[i % types.length]} notification message for end users.`,
    time: `${i + 1} ${i === 0 ? 'hour' : 'hours'} ago`,
    priority: priorities[i % priorities.length],
    read: i % 3 === 0,
    actionUrl: i % 4 === 0 ? '/schedule' : undefined
  }));
};

export const mockSupportTickets = generateSupportTickets(12);
export const mockNotifications = generateNotifications(10);