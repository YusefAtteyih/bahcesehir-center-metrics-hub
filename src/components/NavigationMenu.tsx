
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '@/hooks/useAuth';
import { Settings, ChartBar, Users, BarChart3, TrendingUp, Monitor } from 'lucide-react';
import UserMenu from './UserMenu';

export const NavigationMenu: React.FC = () => {
  const location = useLocation();
  const { userRole } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col space-y-4 pt-4 flex-1">
        <div className="mb-6 px-2 flex items-center justify-between">
          <Logo size="sm" showText={true} />
          <UserMenu />
        </div>
        
        <h2 className="text-lg font-bold mb-2 text-university-blue px-2">Menu</h2>
        
        <nav className="space-y-1 px-2">
          <Link 
            to="/centers" 
            className={`${isActive('/centers') ? 'text-university-orange font-semibold bg-university-orange/10' : 'text-university-blue'} hover:text-university-orange hover:bg-university-orange/5 transition-colors flex items-center gap-2 px-3 py-2 rounded-md`}
          >
            <Users size={18} />
            <span>Centers</span>
          </Link>
          
          {userRole === 'evaluator' && (
            <>
              <Link 
                to="/dashboard" 
                className={`${isActive('/dashboard') ? 'text-university-orange font-semibold bg-university-orange/10' : 'text-university-blue'} hover:text-university-orange hover:bg-university-orange/5 transition-colors flex items-center gap-2 px-3 py-2 rounded-md`}
              >
                <ChartBar size={18} />
                <span>Dashboard</span>
              </Link>
              
              <Link 
                to="/analytics" 
                className={`${isActive('/analytics') ? 'text-university-orange font-semibold bg-university-orange/10' : 'text-university-blue'} hover:text-university-orange hover:bg-university-orange/5 transition-colors flex items-center gap-2 px-3 py-2 rounded-md`}
              >
                <TrendingUp size={18} />
                <span>Analytics</span>
              </Link>
              
              <Link 
                to="/integrated-dashboard" 
                className={`${isActive('/integrated-dashboard') ? 'text-university-orange font-semibold bg-university-orange/10' : 'text-university-blue'} hover:text-university-orange hover:bg-university-orange/5 transition-colors flex items-center gap-2 px-3 py-2 rounded-md`}
              >
                <Monitor size={18} />
                <span>Integrated Dashboard</span>
              </Link>
              
              <Link 
                to="/kpi-approvals" 
                className={`${isActive('/kpi-approvals') ? 'text-university-orange font-semibold bg-university-orange/10' : 'text-university-blue'} hover:text-university-orange hover:bg-university-orange/5 transition-colors flex items-center gap-2 px-3 py-2 rounded-md`}
              >
                <BarChart3 size={18} />
                <span>KPI Approvals</span>
              </Link>
              
              <Link 
                to="/reports" 
                className={`${isActive('/reports') ? 'text-university-orange font-semibold bg-university-orange/10' : 'text-university-blue'} hover:text-university-orange hover:bg-university-orange/5 transition-colors flex items-center gap-2 px-3 py-2 rounded-md`}
              >
                <Settings size={18} />
                <span>Reports</span>
              </Link>
            </>
          )}
          
          {userRole === 'manager' && (
            <>
              <Link 
                to="/dashboard" 
                className={`${isActive('/dashboard') || isActive('/my-center') ? 'text-university-orange font-semibold bg-university-orange/10' : 'text-university-blue'} hover:text-university-orange hover:bg-university-orange/5 transition-colors flex items-center gap-2 px-3 py-2 rounded-md`}
              >
                <ChartBar size={18} />
                <span>My Center</span>
              </Link>
              
              <Link 
                to="/submit-report" 
                className={`${isActive('/submit-report') ? 'text-university-orange font-semibold bg-university-orange/10' : 'text-university-blue'} hover:text-university-orange hover:bg-university-orange/5 transition-colors flex items-center gap-2 px-3 py-2 rounded-md`}
              >
                <ChartBar size={18} />
                <span>Submit Reports</span>
              </Link>
              
              <Link 
                to="/center-settings" 
                className={`${isActive('/center-settings') ? 'text-university-orange font-semibold bg-university-orange/10' : 'text-university-blue'} hover:text-university-orange hover:bg-university-orange/5 transition-colors flex items-center gap-2 px-3 py-2 rounded-md`}
              >
                <Settings size={18} />
                <span>Center Settings</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};
