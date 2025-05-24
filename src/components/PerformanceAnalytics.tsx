
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Target, Award } from 'lucide-react';

interface AnalyticsData {
  category: string;
  current: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  status: 'excellent' | 'good' | 'average' | 'needs-improvement';
}

interface PerformanceAnalyticsProps {
  data: AnalyticsData[];
  title: string;
  showBenchmarks?: boolean;
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ 
  data, 
  title, 
  showBenchmarks = false 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'average': return 'bg-yellow-100 text-yellow-800';
      case 'needs-improvement': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const overallPerformance = Math.round(
    data.reduce((acc, item) => acc + (item.current / item.target) * 100, 0) / data.length
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-university-blue" />
            {title}
          </CardTitle>
          <CardDescription>Detailed performance analytics with trend analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-university-blue">{overallPerformance}%</div>
              <div className="text-sm text-gray-600">Overall Performance</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {data.filter(d => d.status === 'excellent' || d.status === 'good').length}
              </div>
              <div className="text-sm text-gray-600">Strong Areas</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {data.filter(d => d.status === 'needs-improvement').length}
              </div>
              <div className="text-sm text-gray-600">Improvement Areas</div>
            </div>
          </div>
          
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{item.category}</h3>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {getTrendIcon(item.trend)}
                    <span className={item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                      {item.trendValue > 0 ? '+' : ''}{item.trendValue}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current: {item.current}</span>
                    <span>Target: {item.target}</span>
                  </div>
                  <Progress 
                    value={Math.min((item.current / item.target) * 100, 100)} 
                    className="h-2"
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {Math.round((item.current / item.target) * 100)}% of target
                  </div>
                </div>
                
                {showBenchmarks && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs text-gray-500">
                      <Target className="w-3 h-3 inline mr-1" />
                      University Average: {Math.round(item.target * 0.8)} | 
                      Top Performer: {Math.round(item.target * 1.2)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAnalytics;
