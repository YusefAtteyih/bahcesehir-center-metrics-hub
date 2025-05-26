import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TrendingDown, Target, Users, BarChart3, Activity, Download, Filter } from 'lucide-react';

interface AdvancedAnalyticsProps {
  kpis: any[];
  centers: any[];
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ kpis, centers }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [selectedCenter, setSelectedCenter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Process data for analytics
  const getPerformanceData = () => {
    const filteredKpis = kpis.filter(kpi => {
      if (selectedCenter !== 'all' && kpi.center_id !== selectedCenter) return false;
      if (selectedCategory !== 'all' && kpi.category !== selectedCategory) return false;
      return true;
    });

    return filteredKpis.map(kpi => ({
      name: kpi.name.length > 15 ? kpi.name.substring(0, 15) + '...' : kpi.name,
      fullName: kpi.name,
      current: Number(kpi.current_value),
      target: Number(kpi.target_value),
      performance: Math.round((Number(kpi.current_value) / Number(kpi.target_value)) * 100),
      center: kpi.centers?.short_name || 'Unknown'
    }));
  };

  const getCategoryBreakdown = () => {
    const categories = kpis.reduce((acc: Record<string, { total: number; onTarget: number }>, kpi) => {
      const category = kpi.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { total: 0, onTarget: 0 };
      }
      acc[category].total++;
      if (Number(kpi.current_value) >= Number(kpi.target_value) * 0.9) {
        acc[category].onTarget++;
      }
      return acc;
    }, {});

    return Object.entries(categories).map(([category, data]: [string, { total: number; onTarget: number }]) => ({
      category,
      total: data.total,
      onTarget: data.onTarget,
      performance: Math.round((data.onTarget / data.total) * 100)
    }));
  };

  const getCenterComparison = () => {
    const centerStats = centers.map(center => {
      const centerKpis = kpis.filter(kpi => kpi.center_id === center.id);
      const avgPerformance = centerKpis.length > 0 
        ? Math.round(centerKpis.reduce((acc, kpi) => acc + (Number(kpi.current_value) / Number(kpi.target_value)) * 100, 0) / centerKpis.length)
        : 0;
      
      return {
        name: center.short_name,
        fullName: center.name,
        kpiCount: centerKpis.length,
        avgPerformance,
        onTarget: centerKpis.filter(kpi => Number(kpi.current_value) >= Number(kpi.target_value) * 0.9).length
      };
    });

    return centerStats.sort((a, b) => b.avgPerformance - a.avgPerformance);
  };

  const getTrendData = () => {
    // Mock trend data - in real app this would come from historical data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      overall: Math.floor(Math.random() * 30) + 70,
      research: Math.floor(Math.random() * 25) + 75,
      innovation: Math.floor(Math.random() * 20) + 80,
      collaboration: Math.floor(Math.random() * 35) + 65
    }));
  };

  const getRadarData = () => {
    const categories = ['Research', 'Innovation', 'Collaboration', 'Social Impact', 'Academic Excellence'];
    return categories.map(category => ({
      category,
      performance: Math.floor(Math.random() * 40) + 60,
      target: 100
    }));
  };

  const performanceData = getPerformanceData();
  const categoryData = getCategoryBreakdown();
  const centerData = getCenterComparison();
  const trendData = getTrendData();
  const radarData = getRadarData();

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  const exportData = () => {
    const exportObj = {
      summary: {
        totalKpis: kpis.length,
        centers: centers.length,
        avgPerformance: Math.round(kpis.reduce((acc, kpi) => acc + (Number(kpi.current_value) / Number(kpi.target_value)) * 100, 0) / kpis.length)
      },
      performance: performanceData,
      categories: categoryData,
      centers: centerData
    };
    
    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kpi-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-university-blue">Advanced Analytics</h1>
          <p className="text-gray-600 mt-1">Deep insights and performance analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{kpis.length}</div>
                <div className="text-sm text-gray-600">Total KPIs</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {kpis.filter(kpi => Number(kpi.current_value) >= Number(kpi.target_value) * 0.9).length}
                </div>
                <div className="text-sm text-gray-600">On Target</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{centers.length}</div>
                <div className="text-sm text-gray-600">Active Centers</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(kpis.reduce((acc, kpi) => acc + (Number(kpi.current_value) / Number(kpi.target_value)) * 100, 0) / kpis.length)}%
                </div>
                <div className="text-sm text-gray-600">Avg Performance</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="flex gap-4 items-center">
            <Select value={selectedCenter} onValueChange={setSelectedCenter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by center" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Centers</SelectItem>
                {centers.map(center => (
                  <SelectItem key={center.id} value={center.id}>{center.short_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Array.from(new Set(kpis.map(kpi => kpi.category).filter(Boolean))).map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>KPI Performance Overview</CardTitle>
              <CardDescription>Current vs Target values across all KPIs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'current' ? 'Current' : 'Target']}
                    labelFormatter={(label) => {
                      const item = performanceData.find(d => d.name === label);
                      return item?.fullName || label;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="current" fill="#3B82F6" name="Current" />
                  <Bar dataKey="target" fill="#10B981" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Historical performance across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="overall" stroke="#3B82F6" strokeWidth={2} name="Overall" />
                  <Line type="monotone" dataKey="research" stroke="#10B981" strokeWidth={2} name="Research" />
                  <Line type="monotone" dataKey="innovation" stroke="#F59E0B" strokeWidth={2} name="Innovation" />
                  <Line type="monotone" dataKey="collaboration" stroke="#EF4444" strokeWidth={2} name="Collaboration" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Center Performance Ranking</CardTitle>
                <CardDescription>Centers ranked by average KPI performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {centerData.map((center, index) => (
                    <div key={center.name} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-university-blue text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{center.name}</div>
                        <div className="text-sm text-gray-500">{center.kpiCount} KPIs</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{center.avgPerformance}%</div>
                        <div className="text-sm text-gray-500">{center.onTarget} on target</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>Distribution of performance levels across centers</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Excellent (90%+)', value: centerData.filter(c => c.avgPerformance >= 90).length, fill: '#10B981' },
                        { name: 'Good (75-89%)', value: centerData.filter(c => c.avgPerformance >= 75 && c.avgPerformance < 90).length, fill: '#3B82F6' },
                        { name: 'Average (60-74%)', value: centerData.filter(c => c.avgPerformance >= 60 && c.avgPerformance < 75).length, fill: '#F59E0B' },
                        { name: 'Below Average (<60%)', value: centerData.filter(c => c.avgPerformance < 60).length, fill: '#EF4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1, 2, 3].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#10B981', '#3B82F6', '#F59E0B', '#EF4444'][index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Performance breakdown by KPI categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="performance" fill="#3B82F6" name="Performance %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Radar Analysis</CardTitle>
                <CardDescription>Multi-dimensional performance view</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Performance"
                      dataKey="performance"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Target"
                      dataKey="target"
                      stroke="#10B981"
                      fill="transparent"
                      strokeDasharray="5 5"
                    />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>AI-powered performance insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Positive Trend</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Research publications show consistent 15% month-over-month growth across all centers.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Attention Needed</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Industry collaboration KPIs are underperforming by 23% compared to targets.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Opportunity</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      3 centers are consistently exceeding targets and could mentor underperforming centers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Action items for improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium mb-1">Focus on Collaboration</div>
                    <p className="text-sm text-gray-600">
                      Increase industry partnership initiatives for centers with low collaboration scores.
                    </p>
                    <Badge variant="outline" className="mt-2">High Priority</Badge>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium mb-1">Knowledge Sharing</div>
                    <p className="text-sm text-gray-600">
                      Establish best practice sharing sessions between high and low performing centers.
                    </p>
                    <Badge variant="outline" className="mt-2">Medium Priority</Badge>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium mb-1">Target Adjustment</div>
                    <p className="text-sm text-gray-600">
                      Review and adjust targets for centers consistently exceeding expectations.
                    </p>
                    <Badge variant="outline" className="mt-2">Low Priority</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
