
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPI } from '@/types/center';

interface KpiChartProps {
  kpis: KPI[];
  title: string;
  showTrends?: boolean;
}

const KpiChart: React.FC<KpiChartProps> = ({ kpis, title, showTrends = false }) => {
  // Prepare data for bar chart
  const barData = kpis.map(kpi => ({
    name: kpi.name.substring(0, 15) + (kpi.name.length > 15 ? '...' : ''),
    value: kpi.value,
    target: kpi.target,
    progress: Math.min((kpi.value / kpi.target) * 100, 100)
  }));

  // Generate trend data (simulated)
  const trendData = kpis.slice(0, 5).map(kpi => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      [kpi.name]: Math.floor(kpi.value * (0.8 + Math.random() * 0.4))
    }));
  }).reduce((acc, curr) => {
    curr.forEach((item, index) => {
      if (!acc[index]) acc[index] = { month: item.month };
      Object.assign(acc[index], item);
    });
    return acc;
  }, [] as any[]);

  const colors = ['#0069b4', '#ff7200', '#10b981', '#9f7aea', '#ed64a6'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Interactive KPI visualization with performance insights</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress">Progress View</TabsTrigger>
            <TabsTrigger value="comparison">Value vs Target</TabsTrigger>
            {showTrends && <TabsTrigger value="trends">Trends</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="progress" className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(1)}%`, 
                    name === 'progress' ? 'Progress' : name
                  ]}
                />
                <Bar dataKey="progress" fill="#0069b4" name="Progress %" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="comparison" className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0069b4" name="Current Value" />
                <Bar dataKey="target" fill="#ff7200" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          {showTrends && (
            <TabsContent value="trends" className="h-[400px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  {kpis.slice(0, 5).map((kpi, index) => (
                    <Line 
                      key={kpi.name}
                      type="monotone" 
                      dataKey={kpi.name} 
                      stroke={colors[index]} 
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default KpiChart;
