
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import KpiCard from '@/components/KpiCard';
import { ChartBar, CalendarClock, CircleCheck, ListCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const ManagerDashboard: React.FC = () => {
  const { userName } = useUser();
  
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>My Center KPIs</CardTitle>
            <CardDescription>Current performance against targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Research Publications", value: 24, target: 30 },
                { name: "Industry Partnerships", value: 8, target: 10 },
                { name: "Student Engagement", value: 450, target: 500 },
                { name: "Funding Secured", value: 350000, target: 400000 },
                { name: "Events Organized", value: 15, target: 15 }
              ].map(kpi => (
                <div key={kpi.name} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{kpi.name}</span>
                    <span className="text-sm text-gray-500">
                      {kpi.value} / {kpi.target} ({Math.floor(kpi.value/kpi.target*100)}%)
                    </span>
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
    </div>
  );
};

export default ManagerDashboard;
