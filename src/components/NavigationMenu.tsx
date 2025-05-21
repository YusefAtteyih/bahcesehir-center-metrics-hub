
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useUser } from '@/contexts/UserContext';
import { Settings, ChartBar, Users } from 'lucide-react';

export const NavigationMenu: React.FC = () => {
  const location = useLocation();
  const { userRole } = useUser();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  return (
    <div className="flex flex-col space-y-4 pt-4">
      <div className="mb-6 px-2">
        <Logo size="sm" showText={true} />
      </div>
      
      <h2 className="text-lg font-bold mb-2 text-university-blue">Menu</h2>
      
      <Link 
        to="/centers" 
        className={`${isActive('/centers') ? 'text-university-orange font-semibold' : 'text-university-blue'} hover:text-university-orange transition-colors flex items-center gap-2`}
      >
        <Users size={18} />
        <span>Centers</span>
      </Link>
      
      {userRole === 'evaluator' && (
        <>
          <Link 
            to="/dashboard" 
            className={`${isActive('/dashboard') ? 'text-university-orange font-semibold' : 'text-university-blue'} hover:text-university-orange transition-colors flex items-center gap-2`}
          >
            <ChartBar size={18} />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="#" 
            className="text-university-blue hover:text-university-orange transition-colors flex items-center gap-2"
          >
            <Settings size={18} />
            <span>Reports</span>
          </Link>
        </>
      )}
      
      {userRole === 'manager' && (
        <>
          <Link 
            to="#" 
            className="text-university-blue hover:text-university-orange transition-colors flex items-center gap-2"
          >
            <ChartBar size={18} />
            <span>Submit Reports</span>
          </Link>
          
          <Link 
            to="#" 
            className="text-university-blue hover:text-university-orange transition-colors flex items-center gap-2"
          >
            <Settings size={18} />
            <span>Center Settings</span>
          </Link>
        </>
      )}
      
      <div className="mt-auto pt-6">
        <Link 
          to="/role-switcher" 
          className="text-university-blue hover:text-university-orange transition-colors"
        >
          Switch Role
        </Link>
      </div>
    </div>
  );
};
