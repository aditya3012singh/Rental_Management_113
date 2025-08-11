import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  title: string;
  showQuickAction?: boolean;
  onQuickAction?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, showQuickAction = true, onQuickAction }) => {
  return (
    <header className="bg-white shadow-sm border-b p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-4">
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <span className="text-green-700 text-sm font-medium">Live Updates</span>
          </div>
          {showQuickAction && (
            <button 
              onClick={onQuickAction}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Quick Action
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;