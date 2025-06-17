
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import Header from './Header';
import { useUser } from '@/contexts/UserContext';

const AppLayout: React.FC = () => {
  const { userRole } = useUser();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-university-lightGray">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
          <footer className="bg-university-blue text-white p-4 text-center">
            <p>© {new Date().getFullYear()} Bahcesehir University - Department Evaluation System</p>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
