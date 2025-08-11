import React, { useState } from 'react';
import { 
  Calendar, FileText, Camera, Leaf, Bell, User, 
  LogOut, Award, Phone, HelpCircle
} from 'lucide-react';
import ComingSoon from './pages/ComingSoon';
import { currentRental } from './data/enduserData';
import { SidebarItem } from './types';

interface EndUserPortalProps {
  onLogout: () => void;
}

const EndUserPortal: React.FC<EndUserPortalProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('schedule');

  const sidebarItems: SidebarItem[] = [
    { id: 'schedule', label: 'Schedule & Timeline', icon: Calendar },
    { id: 'usage', label: 'Usage Guidelines', icon: FileText },
    { id: 'condition', label: 'Condition Reporting', icon: Camera },
    { id: 'ecotips', label: 'Eco Tips & Impact', icon: Leaf },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  const getPageTitle = () => {
    return sidebarItems.find(item => item.id === activeTab)?.label || 'Schedule & Timeline';
  };

  const renderContent = () => {
    return <ComingSoon title={getPageTitle()} />;
  };

  const CustomSidebar = () => (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <div className="flex items-center">
          <Leaf className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">EcoRent</h2>
            <p className="text-sm text-gray-500">End User Portal</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          const unreadCount = item.id === 'notifications' ? 2 : 0;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <IconComponent className="h-5 w-5 mr-3" />
              {item.label}
              {unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-0 w-64 p-6">
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-900">Eco User</span>
          </div>
          <div className="text-sm text-green-700">CO₂ Saved: 2.3 kg</div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );

  const CustomHeader = () => (
    <header className="bg-white shadow-sm border-b p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
        <div className="flex items-center gap-4">
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <span className="text-green-700 text-sm font-medium">Active Rental</span>
          </div>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Emergency
          </button>
        </div>
      </div>
    </header>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <CustomSidebar />
      <div className="flex-1 overflow-auto">
        <CustomHeader />
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default EndUserPortal;