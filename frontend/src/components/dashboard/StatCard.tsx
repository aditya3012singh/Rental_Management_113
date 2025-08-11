import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { StatCard as StatCardType } from '../../types';

interface StatCardProps {
  stat: StatCardType;
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const IconComponent = stat.icon;
  const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${stat.bg}`}>
          <IconComponent className={`h-6 w-6 ${stat.color}`} />
        </div>
        <div className="flex items-center gap-1">
          <TrendIcon className={`h-4 w-4 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {stat.change}
          </span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
      <p className="text-gray-600 text-sm">{stat.title}</p>
    </div>
  );
};

export default StatCard;