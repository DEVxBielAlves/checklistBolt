import React from 'react';
import { Check, X, Minus } from 'lucide-react';

interface StatusButtonProps {
  status: 'conforme' | 'nao_conforme' | 'na';
  isSelected: boolean;
  onClick: () => void;
}

export const StatusButton: React.FC<StatusButtonProps> = ({ status, isSelected, onClick }) => {
  const getConfig = () => {
    switch (status) {
      case 'conforme':
        return {
          icon: <Check size={16} />,
          label: 'Conforme',
          bgColor: isSelected ? 'bg-green-600' : 'bg-gray-100',
          textColor: isSelected ? 'text-white' : 'text-gray-700',
          borderColor: 'border-green-600'
        };
      case 'nao_conforme':
        return {
          icon: <X size={16} />,
          label: 'Não Conforme',
          bgColor: isSelected ? 'bg-red-600' : 'bg-gray-100',
          textColor: isSelected ? 'text-white' : 'text-gray-700',
          borderColor: 'border-red-600'
        };
      case 'na':
        return {
          icon: <Minus size={16} />,
          label: 'N/A',
          bgColor: isSelected ? 'bg-yellow-600' : 'bg-gray-100',
          textColor: isSelected ? 'text-white' : 'text-gray-700',
          borderColor: 'border-yellow-600'
        };
    }
  };

  const config = getConfig();

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center space-x-1 px-3 py-2 rounded-lg border-2 
        transition-all duration-200 text-sm font-medium min-w-[90px]
        w-full sm:w-auto
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${isSelected ? 'shadow-md' : 'hover:shadow-sm'}
      `}
    >
      {config.icon}
      <span>{config.label}</span>
    </button>
  );
};