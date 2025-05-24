
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { WorkflowHistory } from '@/types/workflow';
import { Clock, CheckCircle, XCircle, AlertCircle, Eye, RotateCcw } from 'lucide-react';

interface WorkflowHistoryChartProps {
  history: WorkflowHistory[];
}

const WorkflowHistoryChart: React.FC<WorkflowHistoryChartProps> = ({ history }) => {
  const getActionCounts = () => {
    const counts = history.reduce((acc, item) => {
      acc[item.action] = (acc[item.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([action, count]) => ({
      action: action.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count,
      fill: getActionColor(action)
    }));
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'submit': return '#3b82f6';
      case 'approve': return '#10b981';
      case 'reject': return '#ef4444';
      case 'request-revision': return '#f59e0b';
      case 'start-review': return '#8b5cf6';
      case 'resubmit': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'submit': return <Clock className="w-4 h-4" />;
      case 'approve': return <CheckCircle className="w-4 h-4" />;
      case 'reject': return <XCircle className="w-4 h-4" />;
      case 'request-revision': return <AlertCircle className="w-4 h-4" />;
      case 'start-review': return <Eye className="w-4 h-4" />;
      case 'resubmit': return <RotateCcw className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const actionData = getActionCounts();

  const getTimeSeriesData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayActions = history.filter(h => 
        h.performedAt.split('T')[0] === dateStr
      ).length;

      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        actions: dayActions
      });
    }
    return last7Days;
  };

  const timeSeriesData = getTimeSeriesData();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workflow Actions Distribution</CardTitle>
          <CardDescription>Breakdown of all workflow actions performed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={actionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ action, count }) => `${action}: ${count}`}
                  >
                    {actionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3">
              {actionData.map((item) => (
                <div key={item.action} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getActionIcon(item.action.toLowerCase().replace(' ', '-'))}
                    <span className="font-medium">{item.action}</span>
                  </div>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Workflow actions over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="actions" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowHistoryChart;
