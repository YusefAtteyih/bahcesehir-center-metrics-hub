
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const NavigationMenu: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  return (
    <div className="flex flex-col space-y-4 pt-4">
      <h2 className="text-lg font-bold mb-2 text-university-blue">Menu</h2>
      
      <Link 
        to="/centers" 
        className={`${isActive('/centers') ? 'text-university-orange font-semibold' : 'text-university-blue'} hover:text-university-orange transition-colors`}
      >
        Centers
      </Link>
      
      <Link 
        to="/dashboard" 
        className={`${isActive('/dashboard') ? 'text-university-orange font-semibold' : 'text-university-blue'} hover:text-university-orange transition-colors`}
      >
        Dashboard
      </Link>
      
      <Link to="#" className="text-university-blue hover:text-university-orange transition-colors">Reports</Link>
      <Link to="#" className="text-university-blue hover:text-university-orange transition-colors">Settings</Link>
    </div>
  );
};
