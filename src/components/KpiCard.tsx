
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: number;
  target: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  target, 
  unit, 
  icon,
  color 
}) => {
  // Fix progress calculation based on unit type
  const progressPercentage = unit === 'percent' 
    ? Math.min(value, 100)
    : Math.min((value / target) * 100, 100);
  
  return (
    <div className={cn("kpi-card animate-fade-in", `border-${color}`)}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <div className={`p-2 rounded-full bg-${color}/10 text-${color}`}>
          {icon}
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-2xl font-bold">
            {value}
            <span className="text-sm text-gray-500 ml-1">{unit}</span>
          </span>
          <span className="text-sm text-gray-500">
            Target: {target} {unit}
          </span>
        </div>
        
        <div className="space-y-1">
          <Progress value={progressPercentage} className={`h-2 bg-gray-100`} />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{progressPercentage.toFixed(0)}%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
