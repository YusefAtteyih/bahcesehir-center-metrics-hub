
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/hooks/useAuth';
import Logo from './Logo';
import { 
  Users, 
  LayoutDashboard, 
  ChartBar, 
  Settings,
  ListCheck,
  CircleCheck,
  LogOut,
  User
} from 'lucide-react';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';

// Use a simple wrapper that uses the proper interface
const SidebarGroup: React.FC<React.PropsWithChildren<{defaultOpen?: boolean}>> = ({ 
  children,
  defaultOpen
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || false);
  
  return (
    <div className="flex flex-col space-y-2 py-2">
      {children}
    </div>
  );
};

const SidebarGroupLabel: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="px-3 text-xs font-semibold text-gray-500 uppercase">
      {children}
    </div>
  );
};

const SidebarGroupContent: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="space-y-1">{children}</div>;
};

const AppSidebar: React.FC = () => {
  const { userRole, userName } = useUser();
  const { signOut, profile } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  
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
  
  // Helper to determine if a route is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <Sidebar variant="floating" className="border-r border-gray-200">
      <SidebarRail />
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-3">
          <Logo size={isCollapsed ? "sm" : "md"} showText={!isCollapsed} />
          {!isCollapsed && (
            <div className="px-2 py-1 text-xs font-medium bg-university-orange text-white rounded-full">
              {userRole === 'evaluator' ? 'Evaluator' : 'Manager'}
            </div>
          )}
        </div>
        <SidebarTrigger className="absolute right-2 top-3" />
      </SidebarHeader>
      
      <SidebarContent>
        {/* User Info Section */}
        {!isCollapsed && (
          <SidebarGroup defaultOpen>
            <SidebarGroupContent>
              <div className="px-3 py-2 bg-gray-50 rounded-md mx-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-university-blue text-white rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{userName}</p>
                    <p className="text-xs text-gray-500">
                      {userRole === 'evaluator' ? 'University Evaluator' : 'Center Manager'}
                    </p>
                  </div>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Navigation */}
        <SidebarGroup defaultOpen>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/dashboard')}>
                  <NavLink to="/dashboard" className="flex items-center gap-3">
                    <LayoutDashboard size={18} />
                    {!isCollapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/centers')}>
                  <NavLink to="/centers" className="flex items-center gap-3">
                    <Users size={18} />
                    {!isCollapsed && <span>Centers</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Role-specific navigation */}
        {userRole === 'evaluator' && (
          <SidebarGroup defaultOpen>
            <SidebarGroupLabel>Evaluation Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/reports')}>
                    <NavLink to="/reports" className="flex items-center gap-3">
                      <ListCheck size={18} />
                      {!isCollapsed && <span>Reports Hub</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/compare')}>
                    <NavLink to="/compare" className="flex items-center gap-3">
                      <ChartBar size={18} />
                      {!isCollapsed && <span>Compare Centers</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/kpi-approvals')}>
                    <NavLink to="/kpi-approvals" className="flex items-center gap-3">
                      <CircleCheck size={18} />
                      {!isCollapsed && <span>KPI Approvals</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {userRole === 'manager' && (
          <SidebarGroup defaultOpen>
            <SidebarGroupLabel>Center Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/submit-report')}>
                    <NavLink to="/submit-report" className="flex items-center gap-3">
                      <CircleCheck size={18} />
                      {!isCollapsed && <span>Submit Report</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/center-settings')}>
                    <NavLink to="/center-settings" className="flex items-center gap-3">
                      <Settings size={18} />
                      {!isCollapsed && <span>Center Settings</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 space-y-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start"
            asChild
          >
            <NavLink to="/profile">
              <User className="h-4 w-4 mr-2" />
              {!isCollapsed && "Profile"}
            </NavLink>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start" 
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {!isCollapsed && "Sign Out"}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
