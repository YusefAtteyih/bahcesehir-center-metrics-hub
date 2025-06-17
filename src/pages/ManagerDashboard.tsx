
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import KpiCard from '@/components/KpiCard';
import KpiChart from '@/components/KpiChart';
import { ChartBar, CalendarClock, CircleCheck, ListCheck, User } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCenterKpis, useCenter, useKpiRequests } from '@/hooks/useSupabaseData';
import { Skeleton } from '@/components/ui/skeleton';

const ManagerDashboard: React.FC = () => {
  const { profile } = useAuth();
  const managedCenterId = profile?.managed_center_id;
  
  const { data: center, isLoading: centerLoading } = useCenter(managedCenterId || '');
  const { data: kpis, isLoading: kpisLoading } = useCenterKpis(managedCenterId || '');
  const { data: requests, isLoading: requestsLoading } = useKpiRequests();
  
  if (!managedCenterId) {
    return (
      <div className="space-y-6">
        <div className="text-center p-8">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-600 mb-2">No Department Assigned</h1>
          <p className="text-gray-500 mb-4">Please contact an administrator to assign you to a department.</p>
          <Button variant="outline" asChild>
            <Link to="/centers">Browse Departments</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (centerLoading || kpisLoading) {
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

  const centerKpis = kpis || [];
  const centerRequests = requests?.filter(r => r.center_id === managedCenterId) || [];
  const pendingRequests = centerRequests.filter(r => ['draft', 'submitted', 'under-review'].includes(r.status));
  
  // Calculate overall performance
  const overallPerformance = centerKpis.length > 0 
    ? Math.round(centerKpis.reduce((acc, kpi) => acc + (Number(kpi.current_value) / Number(kpi.target_value)) * 100, 0) / centerKpis.length)
    : 0;
  
  const kpisOnTarget = centerKpis.filter(kpi => Number(kpi.current_value) >= Number(kpi.target_value) * 0.9).length;
  const submittedReports = centerRequests.filter(r => r.status !== 'draft').length;

  return (
    <div className="space-y-6">
      {/* Personalized Header */}
      <div className="bg-gradient-to-r from-university-blue to-university-blue/80 text-white rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome to Department Evaluation Dashboard
            </h1>
            <p className="text-blue-100 mt-1">
              Managing {center?.name || 'Your Department'} • {center?.short_name}
            </p>
            <p className="text-blue-200 text-sm mt-1">
              {center?.location && `Located in ${center.location}`}
            </p>
          </div>
          <Button variant="secondary" asChild>
            <Link to="/submit-report">Submit New Report</Link>
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Overall Performance"
          value={overallPerformance}
          target={100}
          unit="%"
          icon={<ChartBar size={18} />}
          color="university-blue"
        />
        <KpiCard 
          title="KPIs On Target"
          value={kpisOnTarget}
          target={centerKpis.length}
          unit="KPIs"
          icon={<CircleCheck size={18} />}
          color="green-500"
        />
        <KpiCard 
          title="Reports Submitted"
          value={submittedReports}
          target={centerKpis.length}
          unit="reports"
          icon={<ListCheck size={18} />}
          color="university-orange"
        />
        <KpiCard 
          title="Pending Requests"
          value={pendingRequests.length}
          target={0}
          unit="requests"
          icon={<CalendarClock size={18} />}
          color="purple-500"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {centerKpis.length > 0 && (
          <KpiChart 
            kpis={centerKpis.map(kpi => ({
              name: kpi.name,
              value: Number(kpi.current_value),
              target: Number(kpi.target_value),
              unit: kpi.unit || '',
              whyItMatters: kpi.why_it_matters || '',
              measurement: kpi.measurement || ''
            }))}
            title={`${center?.short_name || 'Department'} KPI Performance`}
            showTrends={true}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest KPI update requests</CardDescription>
          </CardHeader>
          <CardContent>
            {requestsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : centerRequests.length > 0 ? (
              <div className="space-y-4">
                {centerRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="p-3 rounded-md bg-gray-50 border border-gray-100">
                    <div className="font-medium">{request.kpi_name}</div>
                    <div className="text-sm text-gray-500">
                      Status: <span className={`font-medium ${
                        request.status === 'approved' ? 'text-green-600' :
                        request.status === 'rejected' ? 'text-red-600' :
                        request.status === 'under-review' ? 'text-blue-600' :
                        'text-yellow-600'
                      }`}>
                        {request.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to="/submit-report">View All Requests</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                <p>No requests submitted yet</p>
                <Button variant="outline" size="sm" asChild className="mt-2">
                  <Link to="/submit-report">Submit Your First Report</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed KPI Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Department KPI Performance Details</CardTitle>
          <CardDescription>Current performance against your department's targets</CardDescription>
        </CardHeader>
        <CardContent>
          {centerKpis.length > 0 ? (
            <div className="space-y-4">
              {centerKpis.map(kpi => {
                const progress = Math.min((Number(kpi.current_value) / Number(kpi.target_value)) * 100, 100);
                const status = progress >= 100 ? 'completed' : 
                             progress >= 90 ? 'on-track' : 
                             progress >= 70 ? 'at-risk' : 'needs-attention';
                
                return (
                  <div key={kpi.id} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{kpi.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {Number(kpi.current_value).toLocaleString()} / {Number(kpi.target_value).toLocaleString()} {kpi.unit} ({Math.floor(progress)}%)
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          status === 'completed' ? 'bg-green-100 text-green-700' :
                          status === 'on-track' ? 'bg-blue-100 text-blue-700' :
                          status === 'at-risk' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <ChartBar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium mb-2">No KPIs configured</p>
              <p className="text-sm mb-4">Your department doesn't have any KPIs set up yet.</p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/center-settings">Configure KPIs</Link>
              </Button>
            </div>
          )}
          {centerKpis.length > 0 && (
            <div className="mt-6 flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/center-settings">Update KPI Values</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/submit-report">Submit New Report</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerDashboard;
