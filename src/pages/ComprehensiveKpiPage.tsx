
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Target, TrendingUp, Users, Settings, PlusCircle } from 'lucide-react';
import EnhancedKpiManagement from '@/components/EnhancedKpiManagement';
import AdvancedKpiAnalytics from '@/components/AdvancedKpiAnalytics';
import KpiAnalyticsDashboard from '@/components/KpiAnalyticsDashboard';
import { useAuth } from '@/hooks/useAuth';
import { useAllKpis } from '@/hooks/useSupabaseData';

const ComprehensiveKpiPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { profile } = useAuth();
  const { data: kpis = [] } = useAllKpis();

  // Calculate overview stats
  const overviewStats = {
    totalKpis: kpis.length,
    onTargetKpis: kpis.filter(kpi => (kpi.current_value / kpi.target_value) >= 0.9).length,
    avgPerformance: kpis.length > 0 
      ? Math.round(kpis.reduce((sum, kpi) => sum + (kpi.current_value / kpi.target_value * 100), 0) / kpis.length)
      : 0,
    categories: new Set(kpis.map(kpi => kpi.category).filter(Boolean)).size
  };

  const getPerformanceStatus = (percentage: number) => {
    if (percentage >= 90) return { label: 'Excellent', variant: 'default' as const };
    if (percentage >= 75) return { label: 'Good', variant: 'secondary' as const };
    if (percentage >= 60) return { label: 'Average', variant: 'outline' as const };
    return { label: 'Needs Improvement', variant: 'destructive' as const };
  };

  const performanceStatus = getPerformanceStatus(overviewStats.avgPerformance);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-university-blue">KPI Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive KPI management and analytics platform
          </p>
        </div>
        <Badge variant={performanceStatus.variant} className="text-sm">
          {performanceStatus.label} Performance
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Management
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Workflow
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{overviewStats.totalKpis}</div>
                    <div className="text-sm text-gray-600">Total KPIs</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">{overviewStats.onTargetKpis}</div>
                    <div className="text-sm text-gray-600">On Target</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">{overviewStats.avgPerformance}%</div>
                    <div className="text-sm text-gray-600">Avg Performance</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold">{overviewStats.categories}</div>
                    <div className="text-sm text-gray-600">Categories</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common KPI management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => setActiveTab('management')}
                >
                  <PlusCircle className="h-6 w-6 mb-2" />
                  <span>Create New KPI</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => setActiveTab('analytics')}
                >
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span>View Analytics</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => setActiveTab('workflow')}
                >
                  <Users className="h-6 w-6 mb-2" />
                  <span>Review Requests</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent KPI Activity</CardTitle>
              <CardDescription>Latest updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'KPI Created', kpi: 'Research Publications', center: 'AIRC', time: '2 hours ago' },
                  { action: 'Target Updated', kpi: 'Industry Partnerships', center: 'SDC', time: '5 hours ago' },
                  { action: 'Performance Review', kpi: 'Student Engagement', center: 'BIL', time: '1 day ago' },
                  { action: 'KPI Approved', kpi: 'Clinical Trials', center: 'CRC', time: '2 days ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{activity.action}</div>
                      <div className="text-sm text-gray-600">
                        {activity.kpi} • {activity.center}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management">
          <EnhancedKpiManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <AdvancedKpiAnalytics />
        </TabsContent>

        <TabsContent value="workflow">
          <KpiAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveKpiPage;
