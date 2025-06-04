
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import KpiTable from '@/components/KpiTable';
import KpiCard from '@/components/KpiCard';
import { ChartBar, TrendingUp, ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCenter, useCenterKpis } from '@/hooks/useSupabaseData';

const CenterDetailPage: React.FC = () => {
  const { centerId } = useParams<{ centerId: string }>();
  
  const { data: center, isLoading: centerLoading, error: centerError } = useCenter(centerId || '');
  const { data: kpis, isLoading: kpisLoading, error: kpisError } = useCenterKpis(centerId || '');

  if (centerLoading || kpisLoading) {
    return (
      <div className="min-h-screen bg-university-lightGray flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-8 px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-university-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading center data...</p>
        </main>
        <footer className="bg-university-blue text-white p-4 text-center">
          <p>© {new Date().getFullYear()} Bahcesehir University - Center Performance System</p>
        </footer>
      </div>
    );
  }

  if (centerError || kpisError || !center) {
    return (
      <div className="min-h-screen bg-university-lightGray flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-8 px-4 text-center">
          <h1 className="text-3xl font-bold text-university-blue mb-4">Center Not Found</h1>
          <p className="mb-6">The center you are looking for does not exist or there was an error loading it.</p>
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
  const getPerformanceData = () => {
    if (!kpis || kpis.length === 0) {
      return { averagePerformance: 0, kpiCount: 0 };
    }
    
    const performanceValues = kpis.map(kpi => (Number(kpi.current_value) / Number(kpi.target_value)) * 100);
    const averagePerformance = performanceValues.reduce((sum, val) => sum + val, 0) / performanceValues.length;
    
    return { averagePerformance, kpiCount: kpis.length };
  };

  const { averagePerformance, kpiCount } = getPerformanceData();

  // Determine performance status
  const getPerformanceStatus = (performance: number) => {
    if (performance >= 90) return { label: 'Excellent', color: 'text-green-500' };
    if (performance >= 75) return { label: 'Good', color: 'text-green-400' };
    if (performance >= 60) return { label: 'Average', color: 'text-yellow-500' };
    return { label: 'Needs Improvement', color: 'text-red-500' };
  };

  const status = getPerformanceStatus(averagePerformance);

  // Get parent organization information
  const parentOrgName = center.parent_organization?.[0]?.name || 'Unknown Department';
  const facultyName = 'Faculty'; // This would need another query to get faculty info

  // Transform database KPIs to match the KpiTable expected format
  const transformedKpis = kpis?.map(kpi => ({
    name: kpi.name,
    value: Number(kpi.current_value),
    target: Number(kpi.target_value),
    unit: kpi.unit || '',
    whyItMatters: kpi.why_it_matters || '',
    measurement: kpi.measurement || ''
  })) || [];

  return (
    <div className="min-h-screen bg-university-lightGray flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant="outline" asChild size="sm">
              <Link to="/centers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Centers
              </Link>
            </Button>
            <Button variant="outline" asChild size="sm">
              <Link to={`/centers/${center.id}/profile`}>
                <Info className="mr-2 h-4 w-4" />
                Center Profile
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-university-blue">{center.name}</h1>
              <p className="text-xl text-gray-600">{center.short_name}</p>
              <p className="text-md text-gray-500">
                {parentOrgName} • {facultyName}
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-lg mr-2">Overall Performance:</p>
              <p className={`text-lg font-bold ${status.color}`}>
                {kpiCount > 0 ? `${status.label} (${averagePerformance.toFixed(0)}%)` : 'No KPIs Available'}
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
                <p className="text-gray-700">{center.description || 'No description available'}</p>
                {center.mission && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800">Mission:</h4>
                    <p className="text-gray-700">{center.mission}</p>
                  </div>
                )}
                {center.vision && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800">Vision:</h4>
                    <p className="text-gray-700">{center.vision}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <h2 className="text-xl font-bold text-university-blue mb-4">Key Performance Indicators</h2>
            {kpis && kpis.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kpis.map((kpi, index) => {
                  const kpiIcon = index % 2 === 0 ? <ChartBar className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />;
                  const progressPercentage = Math.min((Number(kpi.current_value) / Number(kpi.target_value)) * 100, 100);
                  const color = progressPercentage >= 75 ? 'primary' : progressPercentage >= 60 ? 'orange' : 'red';
                  
                  return (
                    <KpiCard
                      key={kpi.id}
                      title={kpi.name}
                      value={Number(kpi.current_value)}
                      target={Number(kpi.target_value)}
                      unit={kpi.unit || ''}
                      icon={kpiIcon}
                      color={color}
                    />
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600">No KPIs available for this center yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="kpis" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>KPI Explanations</CardTitle>
                <CardDescription>Why each KPI matters and how it's measured</CardDescription>
              </CardHeader>
              <CardContent>
                {transformedKpis.length > 0 ? (
                  <KpiTable kpis={transformedKpis} />
                ) : (
                  <p className="text-center text-gray-600 py-8">No KPI data available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="targets" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>2025 Target Benchmarks</CardTitle>
                <CardDescription>Numeric goals aligned with each KPI</CardDescription>
              </CardHeader>
              <CardContent>
                {transformedKpis.length > 0 ? (
                  <KpiTable kpis={transformedKpis} showDetails={false} />
                ) : (
                  <p className="text-center text-gray-600 py-8">No target data available.</p>
                )}
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
