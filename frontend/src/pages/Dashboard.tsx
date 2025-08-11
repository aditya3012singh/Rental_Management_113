import React from 'react';
import { Plus, FileText, BarChart3, Settings } from 'lucide-react';
import { stats, mockOrders } from '../data/mockData';
import StatCard from '../components/dashboard/StatCard';
import QuickAction from '../components/dashboard/QuickAction';
import OrdersTable from '../components/dashboard/OrdersTable';

const Dashboard: React.FC = () => {
  const quickActions = [
    {
      icon: Plus,
      title: 'Add Product',
      description: 'Create new rental item',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900'
    },
    {
      icon: FileText,
      title: 'New Order',
      description: 'Manual order creation',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-900'
    },
    {
      icon: BarChart3,
      title: 'View Reports',
      description: 'Analytics dashboard',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-900'
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'System configuration',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-900'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <QuickAction key={index} {...action} />
        ))}
      </div>

      {/* Orders Table with Pagination */}
      <OrdersTable orders={mockOrders} />
    </div>
  );
};

export default Dashboard;