
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Clock, Target, Award } from 'lucide-react';
import { useKpiManagement } from '@/hooks/useKpiManagement';
import { useKpiWorkflow } from '@/hooks/useKpiWorkflow';

const KpiAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30');
  const { kpiRequests, getRequestStats } = useKpiManagement();
  const { getWorkflowHistory } = useKpiWorkflow();

  const stats = getRequestStats();

  const getApprovalRate = () => {
    const totalCompleted = stats.approved + stats.rejected;
    if (totalCompleted === 0) return 0;
    return Math.round((stats.approved / totalCompleted) * 100);
  };

  const getAverageProcessingTime = () => {
    const completedRequests = kpiRequests.filter(r => 
      ['approved', 'rejected'].includes(r.status) && r.reviewedDate
    );

    if (completedRequests.length === 0) return 0;

    const totalDays = completedRequests.reduce((acc, request) => {
      const submitted = new Date(request.submittedDate);
      const reviewed = new Date(request.reviewedDate!);
      const diffTime = Math.abs(reviewed.getTime() - submitted.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return acc + diffDays;
    }, 0);

    return Math.round(totalDays / completedRequests.length);
  };

  const getSubmissionTrend = () => {
    const days = parseInt(timeRange);
    const trendData = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const submissions = kpiRequests.filter(r => r.submittedDate === dateStr).length;
      const approvals = kpiRequests.filter(r => 
        r.reviewedDate === dateStr && r.status === 'approved'
      ).length;
      
      trendData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        submissions,
        approvals,
      });
    }
    
    return trendData;
  };

  const getCenterPerformance = () => {
    const centerStats = kpiRequests.reduce((acc, request) => {
      const centerId = request.centerId;
      if (!acc[centerId]) {
        acc[centerId] = {
          centerName: request.centerName,
          total: 0,
          approved: 0,
          pending: 0,
        };
      }
      
      acc[centerId].total++;
      if (request.status === 'approved') acc[centerId].approved++;
      if (['submitted', 'under-review', 'resubmitted'].includes(request.status)) {
        acc[centerId].pending++;
      }
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(centerStats).map((center: any) => ({
      ...center,
      approvalRate: center.total > 0 ? Math.round((center.approved / center.total) * 100) : 0,
    }));
  };

  const trendData = getSubmissionTrend();
  const centerPerformance = getCenterPerformance();
  const approvalRate = getApprovalRate();
  const avgProcessingTime = getAverageProcessingTime();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-university-blue">KPI Analytics Dashboard</h2>
          <p className="text-gray-600">Performance insights and workflow analytics</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{approvalRate}%</div>
                <div className="text-sm text-gray-600">Approval Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{avgProcessingTime}</div>
                <div className="text-sm text-gray-600">Avg. Days to Process</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Requests</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending Review</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submission & Approval Trends</CardTitle>
          <CardDescription>Track KPI submission and approval patterns over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="submissions"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  name="Submissions"
                />
                <Area
                  type="monotone"
                  dataKey="approvals"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  name="Approvals"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Center Performance</CardTitle>
          <CardDescription>KPI approval performance by research center</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {centerPerformance.map((center) => (
              <div key={center.centerName} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{center.centerName}</div>
                  <div className="text-sm text-gray-600">
                    {center.approved} approved of {center.total} total
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={center.pending > 0 ? "destructive" : "secondary"}>
                    {center.pending} pending
                  </Badge>
                  <div className="flex items-center gap-1">
                    {center.approvalRate >= 80 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className="font-bold">{center.approvalRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KpiAnalyticsDashboard;
