
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatBarProps {
  icon: LucideIcon;
  label: string;
  value: number;
  maxValue?: number;
  color: 'red' | 'yellow' | 'pink' | 'blue' | 'green';
}

const StatBar: React.FC<StatBarProps> = ({ 
  icon: Icon, 
  label, 
  value, 
  maxValue = 100, 
  color 
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  const getColorClasses = (color: string) => {
    const colors = {
      red: {
        text: 'text-red-400',
        bg: 'bg-red-500',
        gradient: 'from-red-500 to-red-600'
      },
      yellow: {
        text: 'text-yellow-400',
        bg: 'bg-yellow-500',
        gradient: 'from-yellow-500 to-orange-500'
      },
      pink: {
        text: 'text-pink-400',
        bg: 'bg-pink-500',
        gradient: 'from-pink-500 to-purple-500'
      },
      blue: {
        text: 'text-blue-400',
        bg: 'bg-blue-500',
        gradient: 'from-blue-500 to-cyan-500'
      },
      green: {
        text: 'text-green-400',
        bg: 'bg-green-500',
        gradient: 'from-green-500 to-emerald-500'
      }
    };
    return colors[color] || colors.pink;
  };

  const colorClasses = getColorClasses(color);

  return (
    <div className="flex items-center space-x-3">
      <Icon className={`w-4 h-4 ${colorClasses.text}`} />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white text-sm font-medium">{label}</span>
          <span className={`text-sm font-bold ${colorClasses.text}`}>
            {value}/{maxValue}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full bg-gradient-to-r ${colorClasses.gradient} transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatBar;
