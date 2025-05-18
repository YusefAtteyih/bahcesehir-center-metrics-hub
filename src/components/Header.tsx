
import React from 'react';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu } from './NavigationMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from './Logo';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="bg-university-blue text-white py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-4">
        <Link to="/">
          <Logo size={isMobile ? 'sm' : 'md'} showText={!isMobile} />
        </Link>
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
          <Link to="/" className="hover:text-university-orange transition-colors">Dashboard</Link>
          <Link to="/centers" className="hover:text-university-orange transition-colors">Centers</Link>
          <Link to="#" className="hover:text-university-orange transition-colors">Reports</Link>
          <Link to="#" className="hover:text-university-orange transition-colors">Settings</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
