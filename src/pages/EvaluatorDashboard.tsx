
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import KpiCard from '@/components/KpiCard';
import { ChartBar, Users, ListCheck, CircleCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const EvaluatorDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-university-blue">University Centers Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of all centers performance metrics</p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance by Category</CardTitle>
            <CardDescription>Average performance across center categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Research", "Technology", "Innovation", "Social Impact", "Industry"].map(category => (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{category}</span>
                    <span className="text-sm text-gray-500">
                      {Math.floor(Math.random() * 30 + 70)}%
                    </span>
                  </div>
                  <Progress value={Math.floor(Math.random() * 30 + 70)} className="h-2" />
                </div>
              ))}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EvaluatorDashboard;
