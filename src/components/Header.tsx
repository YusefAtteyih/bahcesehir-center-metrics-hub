
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/hooks/useAuth';
import { 
  Bell, 
  User,
  Search,
  LogOut,
  Settings
} from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from './ui/input';
import { toast } from '@/hooks/use-toast';

const Header: React.FC = () => {
  const { userRole, userName } = useUser();
  const { signOut, profile } = useAuth();
  
  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully."
      });
    }
  };

  const roleDisplay = userRole === 'evaluator' ? 'University Evaluator' : 'Center Manager';
  
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
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-medium">{userName}</span>
          <span className="text-xs text-university-orange">{roleDisplay}</span>
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-university-orange rounded-full"></span>
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-university-blue text-white rounded-full flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium md:hidden">{userName}</span>
        </div>

        <Button variant="ghost" size="icon" asChild>
          <Link to="/profile">
            <Settings className="h-4 w-4" />
          </Link>
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
