
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { useUser } from '@/contexts/UserContext';
import Logo from './Logo';
import { 
  Users, 
  LayoutDashboard, 
  ChartBar, 
  SquareCheckIcon, 
  Settings,
  ListCheck,
  ListFilter,
  CircleCheck
} from 'lucide-react';
import { Button } from './ui/button';

const AppSidebar: React.FC = () => {
  const { userRole } = useUser();
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  
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
        {/* Common navigation items for all roles */}
        <SidebarGroup defaultOpen>
          <SidebarGroupLabel>Centers</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/centers')}>
                  <NavLink to="/centers" className="flex items-center gap-3">
                    <Users size={18} />
                    {!isCollapsed && <span>All Centers</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Evaluator-specific navigation items */}
        {userRole === 'evaluator' && (
          <SidebarGroup defaultOpen>
            <SidebarGroupLabel>Evaluation Tools</SidebarGroupLabel>
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
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Manager-specific navigation items */}
        {userRole === 'manager' && (
          <SidebarGroup defaultOpen>
            <SidebarGroupLabel>My Center</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/my-center')}>
                    <NavLink to="/my-center" className="flex items-center gap-3">
                      <LayoutDashboard size={18} />
                      {!isCollapsed && <span>Center Dashboard</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
        <div className="p-4">
          <Button asChild variant="outline" size="sm" className="w-full">
            <NavLink to="/role-switcher">Switch Role</NavLink>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
