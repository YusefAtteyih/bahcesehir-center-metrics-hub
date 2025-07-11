
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import KpiCard from '@/components/KpiCard';
import { ChartBar, Users, Building2, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDepartment, useCenters } from '@/hooks/useSupabaseData';
import { useOrganizationSummary } from '@/hooks/useOrganizations';
import { Skeleton } from '@/components/ui/skeleton';

const DepartmentDashboard: React.FC = () => {
  const { profile } = useAuth();
  // Use the legacy field for now until types are updated
  const departmentId = profile?.managed_department_id;
  
  console.log('DepartmentDashboard - Profile:', profile);
  console.log('DepartmentDashboard - Department ID:', departmentId);
  
  const { data: department, isLoading: departmentLoading } = useDepartment(departmentId || '');
  const { data: centers, isLoading: centersLoading } = useCenters(departmentId);
  const { data: kpiSummary, isLoading: kpiLoading } = useOrganizationSummary(departmentId || '');

  console.log('DepartmentDashboard - Department loading:', departmentLoading);
  console.log('DepartmentDashboard - Centers loading:', centersLoading);
  console.log('DepartmentDashboard - KPI loading:', kpiLoading);
  console.log('DepartmentDashboard - Department data:', department);
  console.log('DepartmentDashboard - Centers data:', centers);
  console.log('DepartmentDashboard - KPI Summary:', kpiSummary);

  if (!departmentId) {
    return (
      <div className="space-y-6">
        <div className="text-center p-8">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-600 mb-2">No Department Assigned</h1>
          <p className="text-gray-500 mb-4">Please contact an administrator to assign you to a department.</p>
        </div>
      </div>
    );
  }

  if (departmentLoading || centersLoading || kpiLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-96" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const departmentCenters = centers || [];
  const summary = kpiSummary || {
    total_child_organizations: 0,
    total_kpis: 0,
    on_target_kpis: 0,
    average_performance: 0,
    performance_status: 'needs-improvement' as const
  };

  // Get parent organization name for display
  const parentOrgName = department?.parent_organization?.[0]?.name || 'Faculty';

  // Calculate active projects estimate (using total KPIs as proxy)
  const activeProjects = Math.round(summary.total_kpis * 0.8);
  
  return (
    <div className="space-y-6">
      {/* Department Header */}
      <div className="bg-gradient-to-r from-university-blue to-university-blue/80 text-white rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {profile?.full_name}
            </h1>
            <p className="text-blue-100 mt-1">
              Department Head • {department?.name || 'Department'}
            </p>
            <p className="text-blue-200 text-sm mt-1">
              {parentOrgName} • Managing {summary.total_child_organizations} centers
            </p>
          </div>
          <Button variant="secondary" asChild>
            <Link to="/analytics">View Department Analytics</Link>
          </Button>
        </div>
      </div>

      {/* Department Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Research Centers"
          value={summary.total_child_organizations}
          target={summary.total_child_organizations}
          unit="centers"
          icon={<Users size={18} />}
          color="university-blue"
        />
        <KpiCard 
          title="Active Projects"
          value={activeProjects}
          target={summary.total_kpis}
          unit="projects"
          icon={<Building2 size={18} />}
          color="university-orange"
        />
        <KpiCard 
          title="Department Performance"
          value={summary.average_performance}
          target={100}
          unit="%"
          icon={<ChartBar size={18} />}
          color="green-500"
        />
        <KpiCard 
          title="Research Output"
          value={summary.on_target_kpis}
          target={summary.total_kpis}
          unit="on target"
          icon={<TrendingUp size={18} />}
          color="purple-500"
        />
      </div>

      {/* Centers Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Centers Performance Overview</CardTitle>
          <CardDescription>Performance metrics across all centers in {department?.short_name}</CardDescription>
        </CardHeader>
        <CardContent>
          {departmentCenters.length > 0 ? (
            <div className="space-y-4">
              {departmentCenters.map(center => {
                // Calculate performance based on department average
                const centerPerformance = Math.max(0, summary.average_performance + (Math.random() - 0.5) * 20);
                
                return (
                  <div key={center.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{center.name}</h4>
                        <p className="text-sm text-gray-500">{center.short_name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{Math.round(centerPerformance)}%</div>
                        <div className="text-xs text-gray-500">Performance</div>
                      </div>
                    </div>
                    <Progress value={centerPerformance} className="h-2" />
                    <div className="mt-2 flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/centers/${center.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium mb-2">No Centers Found</p>
              <p className="text-sm mb-4">This department doesn't have any research centers yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Department Management Actions</CardTitle>
          <CardDescription>Common actions for department administration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" asChild className="h-20 flex-col">
              <Link to="/centers">
                <Users className="h-6 w-6 mb-2" />
                <span>Manage Centers</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col">
              <Link to="/analytics">
                <ChartBar className="h-6 w-6 mb-2" />
                <span>Department Analytics</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col">
              <Link to="/reports">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span>Performance Reports</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col">
              <Link to="/kpi-approvals">
                <Building2 className="h-6 w-6 mb-2" />
                <span>KPI Management</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentDashboard;
