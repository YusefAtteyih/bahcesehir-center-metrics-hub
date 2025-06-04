
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Download, Filter } from 'lucide-react';
import { useAllKpis } from '@/hooks/useSupabaseData';
import { useOrganizations } from '@/hooks/useOrganizations';

const AdvancedKpiAnalytics: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30');
  const [selectedView, setSelectedView] = useState('performance');
  const [selectedComparison, setSelectedComparison] = useState('centers');

  const { data: kpis = [] } = useAllKpis();
  const { data: organizations = [] } = useOrganizations();

  // Filter organizations by type
  const centers = organizations.filter(org => org.type === 'center');
  const departments = organizations.filter(org => org.type === 'department');
  const faculties = organizations.filter(org => org.type === 'faculty');

  // Generate performance trend data (simulated)
  const performanceTrendData = useMemo(() => {
    const days = parseInt(selectedTimeRange);
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const performance = 70 + Math.sin(i * 0.1) * 10 + Math.random() * 5;
      const target = 85;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        performance: Math.round(performance),
        target,
        difference: Math.round(performance - target)
      });
    }
    
    return data;
  }, [selectedTimeRange]);

  // Category performance analysis
  const categoryPerformance = useMemo(() => {
    const categoryStats = kpis.reduce((acc, kpi) => {
      const category = kpi.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { category, total: 0, current: 0, target: 0 };
      }
      acc[category].total++;
      acc[category].current += kpi.current_value;
      acc[category].target += kpi.target_value;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(categoryStats).map((cat: any) => ({
      ...cat,
      performance: cat.target > 0 ? Math.round((cat.current / cat.target) * 100) : 0,
      avgCurrent: Math.round(cat.current / cat.total),
      avgTarget: Math.round(cat.target / cat.total)
    }));
  }, [kpis]);

  // Organization comparison data
  const organizationComparison = useMemo(() => {
    const orgStats = centers.map(center => {
      const centerKpis = kpis.filter(kpi => kpi.organization_id === center.id);
      const totalPerformance = centerKpis.reduce((sum, kpi) => {
        return sum + (kpi.target_value > 0 ? (kpi.current_value / kpi.target_value) * 100 : 0);
      }, 0);
      
      const parentOrg = organizations.find(org => org.id === center.parent_organization_id);
      
      return {
        name: center.short_name,
        fullName: center.name,
        kpiCount: centerKpis.length,
        performance: centerKpis.length > 0 ? Math.round(totalPerformance / centerKpis.length) : 0,
        department: parentOrg?.short_name || 'N/A'
      };
    }).filter(center => center.kpiCount > 0);

    return orgStats.sort((a, b) => b.performance - a.performance);
  }, [centers, kpis, organizations]);

  // Performance distribution
  const performanceDistribution = useMemo(() => {
    const ranges = [
      { range: '90-100%', min: 90, max: 100, count: 0, color: '#10b981' },
      { range: '75-89%', min: 75, max: 89, count: 0, color: '#3b82f6' },
      { range: '60-74%', min: 60, max: 74, count: 0, color: '#f59e0b' },
      { range: '0-59%', min: 0, max: 59, count: 0, color: '#ef4444' }
    ];

    kpis.forEach(kpi => {
      const performance = kpi.target_value > 0 ? (kpi.current_value / kpi.target_value) * 100 : 0;
      const range = ranges.find(r => performance >= r.min && performance <= r.max);
      if (range) range.count++;
    });

    return ranges;
  }, [kpis]);

  // Correlation analysis (KPI count vs Performance)
  const correlationData = useMemo(() => {
    return organizationComparison.map(org => ({
      x: org.kpiCount,
      y: org.performance,
      name: org.name,
      department: org.department
    }));
  }, [organizationComparison]);

  const exportAnalytics = () => {
    const data = {
      performanceTrend: performanceTrendData,
      categoryPerformance,
      organizationComparison,
      performanceDistribution,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kpi-analytics-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-university-blue">Advanced KPI Analytics</h2>
          <p className="text-gray-600">Deep insights and performance analysis</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="365">1 year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportAnalytics}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="categories">Category Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Organization Comparison</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends Over Time</CardTitle>
              <CardDescription>Track performance changes and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="performance"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      name="Performance %"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#10b981"
                      strokeDasharray="5 5"
                      name="Target %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">+5.2%</div>
                    <div className="text-sm text-gray-600">Performance Growth</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">78%</div>
                    <div className="text-sm text-gray-600">Avg Performance</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold">-7%</div>
                    <div className="text-sm text-gray-600">Target Gap</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Category</CardTitle>
                <CardDescription>Compare KPI performance across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="performance" fill="#3b82f6" name="Performance %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>KPI distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryPerformance.map((category, index) => (
                    <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{category.category}</div>
                        <div className="text-sm text-gray-600">{category.total} KPIs</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{category.performance}%</div>
                        <Badge variant={category.performance >= 80 ? "default" : "secondary"}>
                          {category.performance >= 80 ? "Good" : "Needs Focus"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Performance Ranking</CardTitle>
                <CardDescription>Performance comparison across research centers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={organizationComparison.slice(0, 10)} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={60} />
                      <Tooltip />
                      <Bar dataKey="performance" fill="#3b82f6" name="Performance %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>KPI Count vs Performance</CardTitle>
                <CardDescription>Correlation between number of KPIs and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={correlationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="x" name="KPI Count" />
                      <YAxis dataKey="y" name="Performance %" />
                      <Tooltip formatter={(value, name, props) => [
                        `${value}${name === 'y' ? '%' : ''}`,
                        name === 'x' ? 'KPI Count' : 'Performance %'
                      ]} />
                      <Scatter dataKey="y" fill="#3b82f6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>How KPIs are distributed across performance ranges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={performanceDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="count"
                        nameKey="range"
                      >
                        {performanceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Ranges</CardTitle>
                <CardDescription>Detailed breakdown of performance distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceDistribution.map((range, index) => (
                    <div key={range.range} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: range.color }}
                        />
                        <div>
                          <div className="font-medium">{range.range}</div>
                          <div className="text-sm text-gray-600">Performance Range</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{range.count}</div>
                        <div className="text-sm text-gray-600">KPIs</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedKpiAnalytics;
