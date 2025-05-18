
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { centers } from '@/data/centers';
import KpiTable from '@/components/KpiTable';
import KpiCard from '@/components/KpiCard';
import { ChartBar, TrendingUp, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CenterDetailPage: React.FC = () => {
  const { centerId } = useParams<{ centerId: string }>();
  
  const center = useMemo(() => 
    centers.find(c => c.id === centerId), 
    [centerId]
  );

  if (!center) {
    return (
      <div className="min-h-screen bg-university-lightGray flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-8 px-4 text-center">
          <h1 className="text-3xl font-bold text-university-blue mb-4">Center Not Found</h1>
          <p className="mb-6">The center you are looking for does not exist.</p>
          <Button asChild>
            <Link to="/centers">Back to Centers</Link>
          </Button>
        </main>
        <footer className="bg-university-blue text-white p-4 text-center">
          <p>© {new Date().getFullYear()} Bahcesehir University - Center Performance System</p>
        </footer>
      </div>
    );
  }

  // Calculate overall performance percentage
  const performanceValues = center.kpis.map(kpi => (kpi.value / kpi.target) * 100);
  const averagePerformance = performanceValues.reduce((sum, val) => sum + val, 0) / performanceValues.length;

  // Determine performance status
  const getPerformanceStatus = (performance: number) => {
    if (performance >= 90) return { label: 'Excellent', color: 'text-green-500' };
    if (performance >= 75) return { label: 'Good', color: 'text-green-400' };
    if (performance >= 60) return { label: 'Average', color: 'text-yellow-500' };
    return { label: 'Needs Improvement', color: 'text-red-500' };
  };

  const status = getPerformanceStatus(averagePerformance);

  return (
    <div className="min-h-screen bg-university-lightGray flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/centers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Centers
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-university-blue">{center.name}</h1>
              <p className="text-xl text-gray-600">{center.shortName}</p>
            </div>
            <div className="flex items-center">
              <p className="text-lg mr-2">Overall Performance:</p>
              <p className={`text-lg font-bold ${status.color}`}>
                {status.label} ({averagePerformance.toFixed(0)}%)
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="kpis">KPI Details</TabsTrigger>
            <TabsTrigger value="targets">Target Benchmarks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Center Overview</CardTitle>
                <CardDescription>Purpose and Activities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{center.description}</p>
              </CardContent>
            </Card>
            
            <h2 className="text-xl font-bold text-university-blue mb-4">Headline KPIs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {center.kpis.map((kpi, index) => {
                const kpiIcon = index % 2 === 0 ? <ChartBar className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />;
                const progressPercentage = Math.min((kpi.value / kpi.target) * 100, 100);
                const color = progressPercentage >= 75 ? 'primary' : progressPercentage >= 60 ? 'orange' : 'red';
                
                return (
                  <KpiCard
                    key={index}
                    title={kpi.name}
                    value={kpi.value}
                    target={kpi.target}
                    unit={kpi.unit || ''}
                    icon={kpiIcon}
                    color={color}
                  />
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="kpis" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>KPI Explanations</CardTitle>
                <CardDescription>Why each KPI matters and how it's measured</CardDescription>
              </CardHeader>
              <CardContent>
                <KpiTable kpis={center.kpis} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="targets" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>2025 Draft Target Benchmarks</CardTitle>
                <CardDescription>Numeric goals aligned with each KPI</CardDescription>
              </CardHeader>
              <CardContent>
                <KpiTable kpis={center.kpis} showDetails={false} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="bg-university-blue text-white p-4 text-center">
        <p>© {new Date().getFullYear()} Bahcesehir University - Center Performance System</p>
      </footer>
    </div>
  );
};

export default CenterDetailPage;
