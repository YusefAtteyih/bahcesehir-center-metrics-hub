
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, Clock, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { useKpiManagement } from '@/hooks/useKpiManagement';
import { useKpiWorkflow } from '@/hooks/useKpiWorkflow';

interface RealTimeMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  status: 'good' | 'warning' | 'critical';
  unit: string;
}

const RealTimeMonitor: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);

  const { kpiRequests, getRequestStats } = useKpiManagement();
  const { workflowHistory } = useKpiWorkflow();

  const generateRealtimeData = () => {
    const stats = getRequestStats();
    
    const newMetrics: RealTimeMetric[] = [
      {
        id: 'pending-approvals',
        name: 'Pending Approvals',
        value: stats.pending,
        change: Math.random() * 10 - 5,
        status: stats.pending > 10 ? 'warning' : 'good',
        unit: 'requests'
      },
      {
        id: 'approval-rate',
        name: 'Approval Rate',
        value: stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0,
        change: Math.random() * 20 - 10,
        status: stats.total > 0 && (stats.approved / stats.total) > 0.8 ? 'good' : 'warning',
        unit: '%'
      },
      {
        id: 'avg-processing-time',
        name: 'Avg Processing Time',
        value: Math.floor(Math.random() * 5 + 2),
        change: Math.random() * 2 - 1,
        status: 'good',
        unit: 'days'
      },
      {
        id: 'active-centers',
        name: 'Active Centers',
        value: new Set(kpiRequests.map(r => r.centerId)).size,
        change: Math.random() * 2 - 1,
        status: 'good',
        unit: 'centers'
      }
    ];

    setMetrics(newMetrics);

    // Generate activity timeline data
    const now = new Date();
    const timeline = [];
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      timeline.push({
        time: time.getHours() + ':00',
        submissions: Math.floor(Math.random() * 5),
        approvals: Math.floor(Math.random() * 3),
        rejections: Math.floor(Math.random() * 2)
      });
    }
    setActivityData(timeline);
    setLastUpdate(new Date());
  };

  useEffect(() => {
    generateRealtimeData();
    
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(generateRealtimeData, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive, kpiRequests]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-university-blue">Real-Time Monitor</h2>
          <p className="text-gray-600">Live system performance and activity tracking</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <Button
            variant={isLive ? "destructive" : "default"}
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLive ? 'animate-spin' : ''}`} />
            {isLive ? 'Stop Live' : 'Start Live'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                {getStatusIcon(metric.status)}
                <Badge className={getStatusColor(metric.status)}>
                  {metric.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">
                  {metric.value} {metric.unit}
                </div>
                <div className="text-sm text-gray-600">{metric.name}</div>
                <div className="flex items-center gap-1 text-xs">
                  {metric.change >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={metric.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {Math.abs(metric.change).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>24-Hour Activity Timeline</CardTitle>
          <CardDescription>Real-time workflow activity over the last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="submissions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Submissions"
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
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current system performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Response Time</span>
                <span>150ms</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Database Performance</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>System Uptime</span>
                <span>99.9%</span>
              </div>
              <Progress value={99.9} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>System notifications and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: 'warning', message: 'High volume of pending approvals', time: '5 min ago' },
                { type: 'info', message: 'System maintenance scheduled', time: '1 hour ago' },
                { type: 'success', message: 'Backup completed successfully', time: '2 hours ago' },
              ].map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />}
                  {alert.type === 'info' && <Activity className="w-4 h-4 text-blue-500 mt-0.5" />}
                  {alert.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />}
                  <div className="flex-1">
                    <div className="text-sm font-medium">{alert.message}</div>
                    <div className="text-xs text-gray-500">{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeMonitor;
