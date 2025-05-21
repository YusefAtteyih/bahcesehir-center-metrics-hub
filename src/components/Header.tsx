
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { 
  Bell, 
  User,
  Search,
  Menu 
} from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from './ui/input';

const Header: React.FC = () => {
  const { userRole, userName } = useUser();
  
  return (
    <header className="bg-white border-b border-gray-200 py-2 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        
        <div className="relative max-w-md w-full hidden md:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search..." 
            className="pl-9 h-9 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 hidden md:block">
          {userRole === 'evaluator' ? 'University Evaluator' : 'Center Manager'}
        </span>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-university-orange rounded-full"></span>
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-university-blue text-white rounded-full flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium hidden md:block">{userName}</span>
        </div>

        <Link to="/role-switcher" className="text-xs text-university-blue hover:underline hidden sm:block">
          Switch Role
        </Link>
      </div>
    </header>
  );
};

export default Header;
