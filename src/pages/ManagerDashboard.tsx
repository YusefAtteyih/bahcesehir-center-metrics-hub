
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import KpiCard from '@/components/KpiCard';
import KpiChart from '@/components/KpiChart';
import { ChartBar, CalendarClock, CircleCheck, ListCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { KPI } from '@/types/center';

const ManagerDashboard: React.FC = () => {
  const { userName } = useUser();
  
  // Sample KPI data for manager's center
  const centerKpis: KPI[] = [
    {
      name: "Research Publications",
      value: 24,
      target: 30,
      unit: "papers",
      whyItMatters: "Demonstrates research output quality",
      measurement: "Published papers in peer-reviewed journals"
    },
    {
      name: "Industry Partnerships",
      value: 8,
      target: 10,
      unit: "partnerships",
      whyItMatters: "Shows industry engagement",
      measurement: "Active partnership agreements"
    },
    {
      name: "Student Engagement",
      value: 450,
      target: 500,
      unit: "students",
      whyItMatters: "Measures educational impact",
      measurement: "Students participating in center activities"
    },
    {
      name: "Funding Secured",
      value: 350000,
      target: 400000,
      unit: "₺",
      whyItMatters: "Financial sustainability",
      measurement: "Total funding secured annually"
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-university-blue">My Center Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {userName}</p>
        </div>
        <Button asChild>
          <Link to="/submit-report">Submit New Report</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Overall Performance"
          value={83}
          target={100}
          unit="%"
          icon={<ChartBar size={18} />}
          color="university-blue"
        />
        <KpiCard 
          title="KPIs On Target"
          value={16}
          target={20}
          unit="KPIs"
          icon={<CircleCheck size={18} />}
          color="green-500"
        />
        <KpiCard 
          title="Reports Submitted"
          value={3}
          target={4}
          unit="reports"
          icon={<ListCheck size={18} />}
          color="university-orange"
        />
        <KpiCard 
          title="Days to Next Report"
          value={12}
          target={30}
          unit="days"
          icon={<CalendarClock size={18} />}
          color="purple-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <KpiChart 
          kpis={centerKpis}
          title="My Center KPI Performance"
          showTrends={true}
        />

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Reports and submissions due</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { task: "Quarterly Report Q2", due: "July 15, 2025", urgent: true },
                { task: "KPI Update - Research", due: "July 20, 2025", urgent: false },
                { task: "Annual Budget Submission", due: "August 5, 2025", urgent: false },
                { task: "Team Member Updates", due: "August 12, 2025", urgent: false }
              ].map((deadline, index) => (
                <div key={index} className={`p-3 rounded-md ${deadline.urgent ? 'bg-red-50 border border-red-100' : 'bg-gray-50 border border-gray-100'}`}>
                  <div className={`font-medium ${deadline.urgent ? 'text-red-600' : 'text-gray-800'}`}>{deadline.task}</div>
                  <div className={`text-sm ${deadline.urgent ? 'text-red-500' : 'text-gray-500'}`}>Due: {deadline.due}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>KPI Details</CardTitle>
          <CardDescription>Current performance against targets with action items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Research Publications", value: 24, target: 30, status: "on-track" },
              { name: "Industry Partnerships", value: 8, target: 10, status: "at-risk" },
              { name: "Student Engagement", value: 450, target: 500, status: "on-track" },
              { name: "Funding Secured", value: 350000, target: 400000, status: "needs-attention" },
              { name: "Events Organized", value: 15, target: 15, status: "completed" }
            ].map(kpi => (
              <div key={kpi.name} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{kpi.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {kpi.value.toLocaleString()} / {kpi.target.toLocaleString()} ({Math.floor(kpi.value/kpi.target*100)}%)
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      kpi.status === 'completed' ? 'bg-green-100 text-green-700' :
                      kpi.status === 'on-track' ? 'bg-blue-100 text-blue-700' :
                      kpi.status === 'at-risk' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {kpi.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={Math.min(kpi.value/kpi.target*100, 100)} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button variant="outline" size="sm" asChild>
              <Link to="/center-settings">Update KPI Values</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerDashboard;
