
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Users, Target, Clock, CheckCircle, AlertTriangle, BarChart3, Filter, Download, Calendar } from 'lucide-react';
import KpiAnalyticsDashboard from '@/components/KpiAnalyticsDashboard';
import WorkflowHistoryChart from '@/components/WorkflowHistoryChart';
import WorkflowTimeline from '@/components/WorkflowTimeline';
import { useKpiManagement } from '@/hooks/useKpiManagement';
import { useKpiWorkflow } from '@/hooks/useKpiWorkflow';

const AnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCenter, setSelectedCenter] = useState('all');
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');

  const { kpiRequests, getRequestStats } = useKpiManagement();
  const { workflowHistory } = useKpiWorkflow();

  const stats = getRequestStats();

  const getAdvancedMetrics = () => {
    const totalRequests = kpiRequests.length;
    const centers = new Set(kpiRequests.map(r => r.centerId)).size;
    const avgProcessingTime = 3.2; // Would be calculated from actual workflow data
    const throughputRate = totalRequests > 0 ? (stats.approved / totalRequests) * 100 : 0;
    
    return {
      totalRequests,
      activeCenters: centers,
      avgProcessingTime,
      throughputRate,
      bottlenecks: stats.underReview + stats.needingRevision
    };
  };

  const getPerformanceTrends = () => {
    // Generate sample trend data for the last 30 days
    const trends = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      trends.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        requests: Math.floor(Math.random() * 15 + 5),
        approvals: Math.floor(Math.random() * 12 + 3),
        rejections: Math.floor(Math.random() * 3 + 1),
        performance: Math.floor(Math.random() * 20 + 70)
      });
    }
    return trends;
  };

  const getCenterPerformance = () => {
    const centerStats = kpiRequests.reduce((acc, request) => {
      const centerId = request.centerId;
      if (!acc[centerId]) {
        acc[centerId] = {
          centerName: request.centerName,
          total: 0,
          approved: 0,
          rejected: 0,
          pending: 0,
          avgTime: Math.random() * 5 + 1
        };
      }
      
      acc[centerId].total++;
      if (request.status === 'approved') acc[centerId].approved++;
      if (request.status === 'rejected') acc[centerId].rejected++;
      if (['submitted', 'under-review', 'resubmitted'].includes(request.status)) {
        acc[centerId].pending++;
      }
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(centerStats);
  };

  const getWorkflowEfficiency = () => {
    const workflowStats = workflowHistory.reduce((acc, item) => {
      const action = item.action;
      if (!acc[action]) {
        acc[action] = { count: 0, avgTime: Math.random() * 24 + 1 };
      }
      acc[action].count++;
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(workflowStats).map(([action, data]: [string, any]) => ({
      action: action.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count: data.count,
      avgTime: data.avgTime.toFixed(1),
      efficiency: Math.min(100, (data.count / workflowHistory.length) * 100)
    }));
  };

  const getPredictiveInsights = () => {
    return [
      {
        title: "Approval Rate Trend",
        prediction: "Expected to increase by 12% next month",
        confidence: 85,
        trend: "up",
        impact: "high"
      },
      {
        title: "Processing Time",
        prediction: "Average time may increase due to new requirements",
        confidence: 72,
        trend: "up",
        impact: "medium"
      },
      {
        title: "Center Participation",
        prediction: "3 new centers expected to join the system",
        confidence: 90,
        trend: "up",
        impact: "high"
      },
      {
        title: "Workflow Bottlenecks",
        prediction: "Review stage showing signs of congestion",
        confidence: 78,
        trend: "down",
        impact: "medium"
      }
    ];
  };

  const metrics = getAdvancedMetrics();
  const trends = getPerformanceTrends();
  const centerPerformance = getCenterPerformance();
  const workflowEfficiency = getWorkflowEfficiency();
  const predictions = getPredictiveInsights();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-university-blue">Advanced Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and performance analytics</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{metrics.totalRequests}</div>
                <div className="text-sm text-gray-600">Total Requests</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{metrics.activeCenters}</div>
                <div className="text-sm text-gray-600">Active Centers</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{metrics.avgProcessingTime}d</div>
                <div className="text-sm text-gray-600">Avg Processing</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{metrics.throughputRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Throughput Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{metrics.bottlenecks}</div>
                <div className="text-sm text-gray-600">Bottlenecks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="centers">Centers</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>30-day performance trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="requests"
                        stackId="1"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                        name="Requests"
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
                <CardTitle>Workflow Distribution</CardTitle>
                <CardDescription>Current status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Approved</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(stats.approved / stats.total) * 100} className="w-20 h-2" />
                      <span className="text-sm text-gray-500">{stats.approved}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Under Review</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(stats.underReview / stats.total) * 100} className="w-20 h-2" />
                      <span className="text-sm text-gray-500">{stats.underReview}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pending</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(stats.pending / stats.total) * 100} className="w-20 h-2" />
                      <span className="text-sm text-gray-500">{stats.pending}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Rejected</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(stats.rejected / stats.total) * 100} className="w-20 h-2" />
                      <span className="text-sm text-gray-500">{stats.rejected}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends Analysis</CardTitle>
              <CardDescription>Detailed trend analysis over selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends}>
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
                    <Line
                      type="monotone"
                      dataKey="rejections"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Rejections"
                    />
                    <Line
                      type="monotone"
                      dataKey="performance"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Performance Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="centers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Center Performance Comparison</CardTitle>
              <CardDescription>Comparative analysis across all centers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={centerPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="centerName" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="approved" fill="#10b981" name="Approved" />
                    <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                    <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Efficiency</CardTitle>
                <CardDescription>Analysis of workflow step performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflowEfficiency.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.action}</span>
                        <span className="text-gray-500">{item.count} actions</span>
                      </div>
                      <Progress value={item.efficiency} className="h-2" />
                      <div className="text-xs text-gray-500">Avg time: {item.avgTime}h</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Request Timeline</CardTitle>
                <CardDescription>Select a request to view its workflow timeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select value={selectedRequestId} onValueChange={setSelectedRequestId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a request to view timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      {kpiRequests.slice(0, 10).map((request) => (
                        <SelectItem key={request.id} value={request.id}>
                          {request.centerName} - {request.kpiName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedRequestId && (
                    <WorkflowTimeline 
                      history={workflowHistory} 
                      requestId={selectedRequestId}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Analytics</CardTitle>
              <CardDescription>AI-powered insights and predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predictions.map((prediction, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{prediction.title}</h4>
                      <div className="flex items-center gap-1">
                        {prediction.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <Badge variant={prediction.impact === 'high' ? 'default' : 'secondary'}>
                          {prediction.impact}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{prediction.prediction}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Confidence</span>
                        <span>{prediction.confidence}%</span>
                      </div>
                      <Progress value={prediction.confidence} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <KpiAnalyticsDashboard />
          <WorkflowHistoryChart history={workflowHistory} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
