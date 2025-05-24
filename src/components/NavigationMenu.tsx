
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useUser } from '@/contexts/UserContext';
import { Settings, ChartBar, Users, BarChart3, TrendingUp, Monitor } from 'lucide-react';

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
            to="/analytics" 
            className={`${isActive('/analytics') ? 'text-university-orange font-semibold' : 'text-university-blue'} hover:text-university-orange transition-colors flex items-center gap-2`}
          >
            <TrendingUp size={18} />
            <span>Analytics</span>
          </Link>
          
          <Link 
            to="/integrated-dashboard" 
            className={`${isActive('/integrated-dashboard') ? 'text-university-orange font-semibold' : 'text-university-blue'} hover:text-university-orange transition-colors flex items-center gap-2`}
          >
            <Monitor size={18} />
            <span>Integrated Dashboard</span>
          </Link>
          
          <Link 
            to="/kpi-approvals" 
            className={`${isActive('/kpi-approvals') ? 'text-university-orange font-semibold' : 'text-university-blue'} hover:text-university-orange transition-colors flex items-center gap-2`}
          >
            <BarChart3 size={18} />
            <span>KPI Approvals</span>
          </Link>
          
          <Link 
            to="/reports" 
            className={`${isActive('/reports') ? 'text-university-orange font-semibold' : 'text-university-blue'} hover:text-university-orange transition-colors flex items-center gap-2`}
          >
            <Settings size={18} />
            <span>Reports</span>
          </Link>
        </>
      )}
      
      {userRole === 'manager' && (
        <>
          <Link 
            to="/my-center" 
            className={`${isActive('/my-center') ? 'text-university-orange font-semibold' : 'text-university-blue'} hover:text-university-orange transition-colors flex items-center gap-2`}
          >
            <ChartBar size={18} />
            <span>My Center</span>
          </Link>
          
          <Link 
            to="/submit-report" 
            className={`${isActive('/submit-report') ? 'text-university-orange font-semibold' : 'text-university-blue'} hover:text-university-orange transition-colors flex items-center gap-2`}
          >
            <ChartBar size={18} />
            <span>Submit Reports</span>
          </Link>
          
          <Link 
            to="/center-settings" 
            className={`${isActive('/center-settings') ? 'text-university-orange font-semibold' : 'text-university-blue'} hover:text-university-orange transition-colors flex items-center gap-2`}
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
