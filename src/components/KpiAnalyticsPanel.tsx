
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Target } from 'lucide-react';

interface KpiAnalyticsPanelProps {
  kpis: any[];
  centers: any[];
}

const KpiAnalyticsPanel: React.FC<KpiAnalyticsPanelProps> = ({ 
  kpis, 
  centers 
}) => {
  const getPerformanceScore = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const categoryStats = kpis.reduce((acc, kpi) => {
    if (!kpi.category) return acc;
    
    if (!acc[kpi.category]) {
      acc[kpi.category] = { count: 0, totalPerformance: 0 };
    }
    
    acc[kpi.category].count++;
    acc[kpi.category].totalPerformance += getPerformanceScore(kpi.current_value, kpi.target_value);
    
    return acc;
  }, {} as Record<string, { count: number; totalPerformance: number }>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance Analytics
          </CardTitle>
          <CardDescription>
            Detailed analysis of KPI performance across categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, stats]) => {
              const avgPerformance = stats.totalPerformance / stats.count;
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category}</span>
                    <Badge variant="outline">
                      {stats.count} KPIs
                    </Badge>
                  </div>
                  <Progress value={avgPerformance} className="h-2" />
                  <div className="text-sm text-gray-600">
                    {Math.round(avgPerformance)}% average performance
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {kpis
              .sort((a, b) => getPerformanceScore(b.current_value, b.target_value) - getPerformanceScore(a.current_value, a.target_value))
              .slice(0, 5)
              .map((kpi) => {
                const performance = getPerformanceScore(kpi.current_value, kpi.target_value);
                
                return (
                  <div key={kpi.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{kpi.name}</div>
                      <div className="text-sm text-gray-600">{kpi.category}</div>
                    </div>
                    <Badge 
                      variant={performance >= 90 ? 'default' : performance >= 75 ? 'secondary' : 'outline'}
                    >
                      {Math.round(performance)}%
                    </Badge>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KpiAnalyticsPanel;
