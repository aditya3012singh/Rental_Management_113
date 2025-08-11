import React from 'react';
import { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import CustomerPortal from './CustomerPortal';
import EndUserPortal from './EndUserPortal';

function App() {
  const [currentPortal, setCurrentPortal] = useState<'admin' | 'customer' | 'enduser'>('admin');

  const handleLogout = () => {
    console.log('Logout clicked');
    setCurrentPortal('admin');
  };

  const renderPortal = () => {
    switch (currentPortal) {
      case 'admin':
        return <AdminDashboard onLogout={handleLogout} />;
      case 'customer':
        return <CustomerPortal onLogout={handleLogout} />;
      case 'enduser':
        return <EndUserPortal onLogout={handleLogout} />;
      default:
        return <AdminDashboard onLogout={handleLogout} />;
    }
  };

  return (
    <div>
      {/* Portal Switcher - for demo purposes */}
      <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-2 border">
        <select
          value={currentPortal}
          onChange={(e) => setCurrentPortal(e.target.value as 'admin' | 'customer' | 'enduser')}
          className="px-3 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="admin">Admin Portal</option>
          <option value="customer">Customer Portal</option>
          <option value="enduser">End User Portal</option>
        </select>
      </div>
      {renderPortal()}
    </div>
  );
}

export default App;