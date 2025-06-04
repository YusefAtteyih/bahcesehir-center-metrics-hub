
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import KpiCard from '@/components/KpiCard';
import { ChartBar, Users, Building, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useFaculty } from '@/hooks/useSupabaseData';
import { useOrganizationSummary, useOrganizationChildrenPerformance } from '@/hooks/useOrganizations';
import { Skeleton } from '@/components/ui/skeleton';

const FacultyDashboard: React.FC = () => {
  const { profile } = useAuth();
  // Use the new unified field for organization management
  const facultyId = profile?.managed_organization_id;
  
  const { data: faculty, isLoading: facultyLoading } = useFaculty(facultyId || '');
  const { data: kpiSummary, isLoading: kpiLoading } = useOrganizationSummary(facultyId || '');
  const { data: departmentsPerformance, isLoading: deptPerfLoading } = useOrganizationChildrenPerformance(facultyId || '');

  if (!facultyId) {
    return (
      <div className="space-y-6">
        <div className="text-center p-8">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-600 mb-2">No Faculty Assigned</h1>
          <p className="text-gray-500 mb-4">Please contact an administrator to assign you to a faculty.</p>
        </div>
      </div>
    );
  }

  if (facultyLoading || kpiLoading || deptPerfLoading) {
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

  const summary = kpiSummary || {
    total_child_organizations: 0,
    total_kpis: 0,
    on_target_kpis: 0,
    average_performance: 0,
    performance_status: 'needs-improvement' as const
  };

  // Calculate growth rate based on on-target KPIs vs total KPIs
  const growthRate = summary.total_kpis > 0 ? Math.round((summary.on_target_kpis / summary.total_kpis) * 100) : 0;
  
  return (
    <div className="space-y-6">
      {/* Faculty Header */}
      <div className="bg-gradient-to-r from-university-blue to-university-blue/80 text-white rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {profile?.full_name}
            </h1>
            <p className="text-blue-100 mt-1">
              Faculty Dean • {faculty?.name}
            </p>
            <p className="text-blue-200 text-sm mt-1">
              Managing {summary.total_child_organizations} departments
            </p>
          </div>
          <Button variant="secondary" asChild>
            <Link to="/analytics">View Faculty Analytics</Link>
          </Button>
        </div>
      </div>

      {/* Faculty Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Departments"
          value={summary.total_child_organizations}
          target={summary.total_child_organizations}
          unit="departments"
          icon={<Building size={18} />}
          color="university-blue"
        />
        <KpiCard 
          title="Research Centers"
          value={Math.round(summary.total_child_organizations * 2.5)}
          target={Math.round(summary.total_child_organizations * 3)}
          unit="centers"
          icon={<Users size={18} />}
          color="university-orange"
        />
        <KpiCard 
          title="Faculty Performance"
          value={summary.average_performance}
          target={100}
          unit="%"
          icon={<ChartBar size={18} />}
          color="green-500"
        />
        <KpiCard 
          title="KPIs On Target"
          value={growthRate}
          target={100}
          unit="%"
          icon={<TrendingUp size={18} />}
          color="purple-500"
        />
      </div>

      {/* Departments Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance Overview</CardTitle>
          <CardDescription>Performance metrics across all departments in {faculty?.short_name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentsPerformance && departmentsPerformance.length > 0 ? (
              departmentsPerformance.map(department => (
                <div key={department.organization_id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{department.organization_name}</h4>
                      <p className="text-sm text-gray-500">
                        {department.child_count} centers • {department.kpis_count} KPIs
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{department.average_performance}%</div>
                      <div className="text-xs text-gray-500 capitalize">{department.performance_status.replace('-', ' ')}</div>
                    </div>
                  </div>
                  <Progress value={department.average_performance} className="h-2" />
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium mb-2">No Departments Found</p>
                <p className="text-sm mb-4">This faculty doesn't have any departments yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Faculty Management Actions</CardTitle>
          <CardDescription>Common actions for faculty administration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" asChild className="h-20 flex-col">
              <Link to="/departments">
                <Building className="h-6 w-6 mb-2" />
                <span>Manage Departments</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col">
              <Link to="/centers">
                <Users className="h-6 w-6 mb-2" />
                <span>View All Centers</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col">
              <Link to="/analytics">
                <ChartBar className="h-6 w-6 mb-2" />
                <span>Faculty Analytics</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col">
              <Link to="/reports">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span>Performance Reports</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyDashboard;
