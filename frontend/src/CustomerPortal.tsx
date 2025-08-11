import React, { useState } from 'react';
import { 
  Search, ShoppingBag, Calendar, CreditCard, Camera, 
  Bell, User, Leaf, Heart, LogOut, Award
} from 'lucide-react';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Browse from './pages/customer/Browse';
import Rentals from './pages/customer/Rentals';
import CalendarPage from './pages/customer/Calendar';
import Contracts from './pages/customer/Contracts';
import Payments from './pages/customer/Payments';
import ComingSoon from './pages/ComingSoon';
import DamageChecker from './pages/Damage-detector';
import { sustainabilityData } from './data/customerData';
import { SidebarItem } from './types';

interface CustomerPortalProps {
  onLogout: () => void;
}

const CustomerPortal: React.FC<CustomerPortalProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('browse');

  const sidebarItems: SidebarItem[] = [
    { id: 'browse', label: 'Browse Products', icon: Search },
    { id: 'rentals', label: 'My Rentals', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'contracts', label: 'Orders & Contracts', icon: CreditCard },
    { id: 'payments', label: 'Payments & Billing', icon: CreditCard },
    { id: 'scans', label: 'Condition Reports', icon: Camera },
    { id: 'sustainability', label: 'My Impact', icon: Leaf },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  const getPageTitle = () => {
    return sidebarItems.find(item => item.id === activeTab)?.label || 'Browse Products';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'browse':
        return <Browse />;
      case 'rentals':
        return <Rentals />;
      case 'calendar':
        return <CalendarPage />;
      case 'contracts':
        return <Contracts />;
      case 'payments':
        return <Payments />;
      case 'scans':
        return <DamageChecker />;
      default:
        return <ComingSoon title={getPageTitle()} />;
    }
  };

  const CustomSidebar = () => (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <div className="flex items-center">
          <Leaf className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">EcoRent</h2>
            <p className="text-sm text-gray-500">Customer Portal</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          const unreadCount = item.id === 'notifications' ? 3 : 0;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
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
            <span className="font-medium text-green-900">{sustainabilityData.ecoLevel}</span>
          </div>
          <div className="text-sm text-green-700">CO₂ Saved: {sustainabilityData.totalCO2Saved} kg</div>
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
            <span className="text-green-700 text-sm font-medium">
              Total CO₂ Saved: {sustainabilityData.totalCO2Saved} kg
            </span>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-blue-700 text-sm font-medium">
              Savings: ${sustainabilityData.totalSavings}
            </span>
          </div>
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

export default CustomerPortal;