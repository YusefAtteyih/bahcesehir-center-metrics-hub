
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';

interface KpiAnalyticsPanelProps {
  kpis: any[];
  centers: any[];
}

const KpiAnalyticsPanel: React.FC<KpiAnalyticsPanelProps> = ({ kpis, centers }) => {
  // Performance by Center
  const getCenterPerformance = () => {
    return centers.map(center => {
      const centerKpis = kpis.filter(kpi => kpi.center_id === center.id);
      const avgPerformance = centerKpis.length > 0
        ? centerKpis.reduce((acc, kpi) => acc + (Number(kpi.current_value) / Number(kpi.target_value)) * 100, 0) / centerKpis.length
        : 0;
      
      return {
        name: center.short_name,
        performance: Math.round(avgPerformance),
        kpiCount: centerKpis.length
      };
    }).sort((a, b) => b.performance - a.performance);
  };

  // Performance by Category
  const getCategoryPerformance = () => {
    const categories = Array.from(new Set(kpis.map(kpi => kpi.category).filter(Boolean)));
    
    return categories.map(category => {
      const categoryKpis = kpis.filter(kpi => kpi.category === category);
      const avgPerformance = categoryKpis.length > 0
        ? categoryKpis.reduce((acc, kpi) => acc + (Number(kpi.current_value) / Number(kpi.target_value)) * 100, 0) / categoryKpis.length
        : 0;
      
      return {
        name: category,
        performance: Math.round(avgPerformance),
        count: categoryKpis.length
      };
    }).sort((a, b) => b.performance - a.performance);
  };

  // Performance Distribution
  const getPerformanceDistribution = () => {
    const excellent = kpis.filter(kpi => (Number(kpi.current_value) / Number(kpi.target_value)) >= 1).length;
    const good = kpis.filter(kpi => {
      const ratio = Number(kpi.current_value) / Number(kpi.target_value);
      return ratio >= 0.9 && ratio < 1;
    }).length;
    const average = kpis.filter(kpi => {
      const ratio = Number(kpi.current_value) / Number(kpi.target_value);
      return ratio >= 0.7 && ratio < 0.9;
    }).length;
    const poor = kpis.filter(kpi => (Number(kpi.current_value) / Number(kpi.target_value)) < 0.7).length;

    return [
      { name: 'Excellent (≥100%)', value: excellent, color: '#10b981' },
      { name: 'Good (90-99%)', value: good, color: '#3b82f6' },
      { name: 'Average (70-89%)', value: average, color: '#f59e0b' },
      { name: 'Poor (<70%)', value: poor, color: '#ef4444' },
    ];
  };

  // Top and Bottom Performers
  const getTopBottomPerformers = () => {
    const performanceData = kpis.map(kpi => ({
      ...kpi,
      performance: (Number(kpi.current_value) / Number(kpi.target_value)) * 100
    })).sort((a, b) => b.performance - a.performance);

    return {
      top: performanceData.slice(0, 5),
      bottom: performanceData.slice(-5).reverse()
    };
  };

  const centerPerformance = getCenterPerformance();
  const categoryPerformance = getCategoryPerformance();
  const performanceDistribution = getPerformanceDistribution();
  const topBottomPerformers = getTopBottomPerformers();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance by Center</CardTitle>
            <CardDescription>Average KPI performance across centers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={centerPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Performance']} />
                  <Bar dataKey="performance" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Distribution</CardTitle>
            <CardDescription>KPI performance levels across the university</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {performanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {performanceDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Performance Analysis</CardTitle>
          <CardDescription>Performance breakdown by KPI categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryPerformance.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{category.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{category.count} KPIs</Badge>
                    <span className="font-bold">{category.performance}%</span>
                  </div>
                </div>
                <Progress value={category.performance} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-green-500" />
              Top Performers
            </CardTitle>
            <CardDescription>Best performing KPIs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topBottomPerformers.top.map((kpi, index) => (
                <div key={kpi.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{kpi.name}</div>
                    <div className="text-sm text-gray-600">{kpi.centers?.short_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{Math.round(kpi.performance)}%</div>
                    <div className="text-xs text-gray-500">
                      {Number(kpi.current_value).toLocaleString()}/{Number(kpi.target_value).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              Needs Attention
            </CardTitle>
            <CardDescription>KPIs requiring improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topBottomPerformers.bottom.map((kpi, index) => (
                <div key={kpi.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{kpi.name}</div>
                    <div className="text-sm text-gray-600">{kpi.centers?.short_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">{Math.round(kpi.performance)}%</div>
                    <div className="text-xs text-gray-500">
                      {Number(kpi.current_value).toLocaleString()}/{Number(kpi.target_value).toLocaleString()}
                    </div>
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

export default KpiAnalyticsPanel;
