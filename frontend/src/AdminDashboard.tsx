import React, { useState } from 'react';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Delivery from './pages/Delivery';
import Sustainability from './pages/Sustainability';
import ComingSoon from './pages/ComingSoon';
import { sidebarItems } from './data/mockData';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const getPageTitle = () => {
    return sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'delivery':
        return <Delivery />;
      case 'sustainability':
        return <Sustainability />;
      default:
        return <ComingSoon title={getPageTitle()} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
        sidebarItems={sidebarItems}
      />

      <div className="flex-1 overflow-auto">
        <Header title={getPageTitle()} />
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;