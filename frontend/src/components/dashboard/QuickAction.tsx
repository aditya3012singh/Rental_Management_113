import React from 'react';

interface QuickActionProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  bgColor: string;
  hoverColor: string;
  iconColor: string;
  textColor: string;
  onClick?: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({
  icon: Icon,
  title,
  description,
  bgColor,
  hoverColor,
  iconColor,
  textColor,
  onClick
}) => {
  return (
    <button 
      onClick={onClick}
      className={`${bgColor} ${hoverColor} p-4 rounded-lg text-left transition-colors`}
    >
      <Icon className={`h-6 w-6 ${iconColor} mb-2`} />
      <div className={`font-medium ${textColor}`}>{title}</div>
      <div className="text-sm opacity-80">{description}</div>
    </button>
  );
};

export default QuickAction;