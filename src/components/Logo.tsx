
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 bg-university-orange rounded-full scale-75 translate-x-1 translate-y-1"></div>
        <div className="relative bg-university-blue text-white rounded-full flex items-center justify-center font-bold" 
             style={{ width: size === 'sm' ? '32px' : size === 'md' ? '40px' : '48px', height: size === 'sm' ? '32px' : size === 'md' ? '40px' : '48px' }}>
          <span className="text-xs">CPS</span>
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-university-blue leading-tight">Center Performance</span>
          <span className="text-university-orange leading-tight text-sm">System</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
