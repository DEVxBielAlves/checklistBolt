import React from 'react';
import { Truck } from 'lucide-react';

interface HeaderProps {
  currentStep: number;
  totalSteps: number;
}

export const Header: React.FC<HeaderProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Truck size={24} />
          <h1 className="text-lg font-bold">Checklist Basell</h1>
        </div>
        <div className="text-sm bg-blue-700 px-3 py-1 rounded-full">
          {currentStep}/{totalSteps}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-blue-500 rounded-full h-2">
        <div 
          className="bg-white h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};