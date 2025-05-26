
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import KpiCard from '@/components/KpiCard';
import KpiChart from '@/components/KpiChart';
import PerformanceAnalytics from '@/components/PerformanceAnalytics';
import { ChartBar, Users, ListCheck, CircleCheck, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { KPI } from '@/types/center';

const EvaluatorDashboard: React.FC = () => {
  const { profile } = useAuth();
  
  // Sample KPI data for the charts
  const universityKpis: KPI[] = [
    {
      name: "Research Publications",
      value: 450,
      target: 500,
      unit: "papers",
      whyItMatters: "Measures research output across all centers",
      measurement: "Total published papers per year"
    },
    {
      name: "Industry Partnerships",
      value: 85,
      target: 100,
      unit: "partnerships",
      whyItMatters: "Shows industry engagement",
      measurement: "Active partnership agreements"
    },
    {
      name: "Student Engagement",
      value: 3200,
      target: 3500,
      unit: "students",
      whyItMatters: "Measures student participation",
      measurement: "Students actively involved in center activities"
    },
    {
      name: "Funding Secured",
      value: 2800000,
      target: 3000000,
      unit: "₺",
      whyItMatters: "Financial sustainability",
      measurement: "Total funding secured annually"
    },
    {
      name: "Social Impact Projects",
      value: 42,
      target: 50,
      unit: "projects",
      whyItMatters: "Community engagement measure",
      measurement: "Active social impact initiatives"
    }
  ];

  // Analytics data for performance insights
  const analyticsData = [
    {
      category: "Research Excellence",
      current: 87,
      target: 100,
      trend: 'up' as const,
      trendValue: 5.2,
      status: 'good' as const
    },
    {
      category: "Innovation & Technology",
      current: 92,
      target: 100,
      trend: 'up' as const,
      trendValue: 8.1,
      status: 'excellent' as const
    },
    {
      category: "Industry Collaboration",
      current: 78,
      target: 100,
      trend: 'stable' as const,
      trendValue: 0.5,
      status: 'average' as const
    },
    {
      category: "Student Development",
      current: 85,
      target: 100,
      trend: 'up' as const,
      trendValue: 3.7,
      status: 'good' as const
    },
    {
      category: "Social Impact",
      current: 68,
      target: 100,
      trend: 'down' as const,
      trendValue: -2.3,
      status: 'needs-improvement' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Personalized Header */}
      <div className="bg-gradient-to-r from-university-blue to-university-blue/80 text-white rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name}</h1>
            <p className="text-blue-100 mt-1">University Centers Evaluation Dashboard</p>
            <p className="text-blue-200 text-sm mt-1">
              Comprehensive performance overview with advanced analytics
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" asChild>
              <Link to="/reports">
                <ListCheck className="h-4 w-4 mr-2" />
                View Reports
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/compare">
                <TrendingUp className="h-4 w-4 mr-2" />
                Compare Centers
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Total Centers"
          value={30}
          target={30}
          unit="centers"
          icon={<Users size={18} />}
          color="university-blue"
        />
        <KpiCard 
          title="Active KPIs"
          value={124}
          target={150}
          unit="KPIs"
          icon={<ChartBar size={18} />}
          color="university-orange"
        />
        <KpiCard 
          title="Reports Received"
          value={42}
          target={60}
          unit="reports"
          icon={<ListCheck size={18} />}
          color="green-500"
        />
        <KpiCard 
          title="Overall Performance"
          value={78}
          target={100}
          unit="%"
          icon={<CircleCheck size={18} />}
          color="purple-500"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <KpiChart 
          kpis={universityKpis}
          title="University-wide KPI Performance"
          showTrends={true}
        />
        
        <PerformanceAnalytics 
          data={analyticsData}
          title="Performance Analytics"
          showBenchmarks={true}
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance by Category</CardTitle>
            <CardDescription>Average performance across center categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Research", "Technology", "Innovation", "Social Impact", "Industry"].map(category => {
                const value = Math.floor(Math.random() * 30 + 70);
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm text-gray-500">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                );
              })}
            </div>
            <div className="mt-6">
              <Button variant="outline" size="sm" asChild>
                <Link to="/analytics">View Detailed Analytics</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from centers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { center: "BAUBUS", action: "submitted a quarterly report", time: "2 hours ago" },
                { center: "BAUGRAL", action: "updated 5 KPIs", time: "yesterday" },
                { center: "BAUBAL", action: "added new team member", time: "2 days ago" },
                { center: "BAURA", action: "created event", time: "3 days ago" },
                { center: "BAUID", action: "requested KPI target review", time: "1 week ago" }
              ].map((activity, index) => (
                <div key={index} className="border-b pb-2 last:border-0">
                  <div className="font-medium">{activity.center}</div>
                  <div className="text-sm text-gray-600">{activity.action}</div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to="/reports">View All Reports</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used evaluation tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" asChild className="h-20 flex-col">
              <Link to="/kpi-approvals">
                <CircleCheck className="h-6 w-6 mb-2" />
                <span>KPI Approvals</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col">
              <Link to="/compare">
                <ChartBar className="h-6 w-6 mb-2" />
                <span>Compare Centers</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col">
              <Link to="/analytics">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span>Analytics</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col">
              <Link to="/report-generator">
                <ListCheck className="h-6 w-6 mb-2" />
                <span>Generate Reports</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluatorDashboard;
