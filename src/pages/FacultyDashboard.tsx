
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import KpiCard from '@/components/KpiCard';
import { ChartBar, Users, Building, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useFaculty, useDepartments, useCenters } from '@/hooks/useSupabaseData';
import { Skeleton } from '@/components/ui/skeleton';

const FacultyDashboard: React.FC = () => {
  const { profile } = useAuth();
  const facultyId = profile?.managed_faculty_id;
  
  const { data: faculty, isLoading: facultyLoading } = useFaculty(facultyId || '');
  const { data: departments, isLoading: departmentsLoading } = useDepartments(facultyId);
  const { data: centers, isLoading: centersLoading } = useCenters();

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

  if (facultyLoading || departmentsLoading || centersLoading) {
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

  const facultyDepartments = departments || [];
  const facultyCenters = centers?.filter(center => 
    facultyDepartments.some(dept => dept.id === center.department_id)
  ) || [];
  
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
              Managing {facultyDepartments.length} departments and {facultyCenters.length} centers
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
          value={facultyDepartments.length}
          target={facultyDepartments.length}
          unit="departments"
          icon={<Building size={18} />}
          color="university-blue"
        />
        <KpiCard 
          title="Research Centers"
          value={facultyCenters.length}
          target={facultyCenters.length}
          unit="centers"
          icon={<Users size={18} />}
          color="university-orange"
        />
        <KpiCard 
          title="Faculty Performance"
          value={85}
          target={100}
          unit="%"
          icon={<ChartBar size={18} />}
          color="green-500"
        />
        <KpiCard 
          title="Growth Rate"
          value={12}
          target={15}
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
            {facultyDepartments.map(department => {
              const deptCenters = facultyCenters.filter(center => center.department_id === department.id);
              const performance = Math.floor(Math.random() * 30 + 70); // Mock performance data
              
              return (
                <div key={department.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{department.name}</h4>
                      <p className="text-sm text-gray-500">{deptCenters.length} centers</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{performance}%</div>
                      <div className="text-xs text-gray-500">Performance</div>
                    </div>
                  </div>
                  <Progress value={performance} className="h-2" />
                </div>
              );
            })}
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
