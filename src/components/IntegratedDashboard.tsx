
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, BarChart3, FileText, Settings, Bell, Users, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import RealTimeMonitor from './RealTimeMonitor';
import ComprehensiveReports from './ComprehensiveReports';
import WorkflowHistoryChart from './WorkflowHistoryChart';
import KpiAnalyticsDashboard from './KpiAnalyticsDashboard';
import { useKpiManagement } from '@/hooks/useKpiManagement';
import { useKpiWorkflow } from '@/hooks/useKpiWorkflow';

const IntegratedDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { kpiRequests, getRequestStats } = useKpiManagement();
  const { workflowHistory } = useKpiWorkflow();

  const stats = getRequestStats();

  // Memoize quick stats calculation
  const quickStats = useMemo(() => {
    const totalCenters = new Set(kpiRequests.map(r => r.centerId)).size;
    const approvalRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;
    const avgProcessingTime = 3.2; // This would be calculated from actual data
    
    return {
      totalCenters,
      approvalRate,
      avgProcessingTime,
      activeWorkflows: stats.pending + stats.underReview
    };
  }, [kpiRequests, stats]);

  // Memoize system health data
  const systemHealth = useMemo(() => ({
    apiPerformance: 95,
    databaseHealth: 98,
    systemUptime: 99.9,
    activeUsers: 24
  }), []);

  // Memoize recent activity data
  const recentActivity = useMemo(() => {
    return workflowHistory
      .slice(-5)
      .reverse()
      .map(activity => ({
        ...activity,
        timeAgo: new Date(Date.now() - Math.random() * 86400000).toLocaleString()
      }));
  }, [workflowHistory]);

  // Memoize performance trend data
  const performanceTrend = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        requests: Math.floor(Math.random() * 20 + 10),
        approvals: Math.floor(Math.random() * 15 + 5),
        performance: Math.floor(Math.random() * 20 + 70)
      });
    }
    return days;
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-university-blue">Integrated Dashboard</h1>
        <p className="text-gray-600 mt-1">Comprehensive view of system performance and operations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Real-Time
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{quickStats.totalCenters}</div>
                    <div className="text-sm text-gray-600">Active Centers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">{quickStats.approvalRate}%</div>
                    <div className="text-sm text-gray-600">Approval Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold">{quickStats.activeWorkflows}</div>
                    <div className="text-sm text-gray-600">Active Workflows</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">{quickStats.avgProcessingTime}d</div>
                    <div className="text-sm text-gray-600">Avg Processing</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>7-day performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="requests"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Requests"
                      />
                      <Line
                        type="monotone"
                        dataKey="approvals"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Approvals"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current system status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>API Performance</span>
                    <span>{systemHealth.apiPerformance}%</span>
                  </div>
                  <Progress value={systemHealth.apiPerformance} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Database Health</span>
                    <span>{systemHealth.databaseHealth}%</span>
                  </div>
                  <Progress value={systemHealth.databaseHealth} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>System Uptime</span>
                    <span>{systemHealth.systemUptime}%</span>
                  </div>
                  <Progress value={systemHealth.systemUptime} className="h-2" />
                </div>
                <div className="pt-2 border-t">
                  <div className="text-sm text-gray-600">Active Users</div>
                  <div className="text-2xl font-bold">{systemHealth.activeUsers}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest workflow actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {activity.action.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-xs text-gray-500">
                          by {activity.performedBy} • {activity.timeAgo}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.toState}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  View All Notifications
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Weekly Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage User Permissions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  System Configuration
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitor">
          <RealTimeMonitor />
        </TabsContent>

        <TabsContent value="analytics">
          <KpiAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="reports">
          <ComprehensiveReports />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Settings</CardTitle>
              <CardDescription>Configure your dashboard preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Settings Configuration</h3>
                  <p className="text-gray-600">Dashboard settings and preferences would be configured here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegratedDashboard;
