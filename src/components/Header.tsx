
import React from 'react';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu } from './NavigationMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUser } from '@/contexts/UserContext';
import Logo from './Logo';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const { userRole } = useUser();
  
  return (
    <header className="bg-university-blue text-white py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-4">
        <Link to="/">
          <Logo size={isMobile ? 'sm' : 'md'} showText={!isMobile} />
        </Link>
        {!isMobile && (
          <div className="bg-university-orange text-white text-xs px-3 py-1 rounded-full">
            {userRole === 'evaluator' ? 'Evaluator View' : 'Manager View'}
          </div>
        )}
      </div>
      
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <NavigationMenu />
          </SheetContent>
        </Sheet>
      ) : (
        <nav className="flex items-center space-x-6">
          <Link to="/centers" className="hover:text-university-orange transition-colors">Centers</Link>
          
          {userRole === 'evaluator' ? (
            <>
              <Link to="/dashboard" className="hover:text-university-orange transition-colors">Dashboard</Link>
              <Link to="#" className="hover:text-university-orange transition-colors">Reports</Link>
            </>
          ) : (
            <>
              <Link to="#" className="hover:text-university-orange transition-colors">Submit Reports</Link>
              <Link to="#" className="hover:text-university-orange transition-colors">Center Settings</Link>
            </>
          )}
          
          <Link to="/role-switcher" className="hover:text-university-orange transition-colors">
            <Button variant="outline" size="sm" className="text-white border-white hover:bg-university-orange hover:text-white">
              Switch Role
            </Button>
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
