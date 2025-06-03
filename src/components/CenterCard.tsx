
import React from 'react';
import { Link } from 'react-router-dom';
import { ChartBar, TrendingUp, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCenterKpis } from '@/hooks/useSupabaseData';

interface CenterCardProps {
  center: {
    id: string;
    name: string;
    short_name: string;
    description: string | null;
    departments?: {
      name: string;
      short_name: string;
      faculties?: {
        name: string;
        short_name: string;
      };
    };
  };
}

const CenterCard: React.FC<CenterCardProps> = ({ center }) => {
  const { data: kpis, isLoading } = useCenterKpis(center.id);
  
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
    if (performance >= 90) return { label: 'Excellent', color: 'bg-green-500' };
    if (performance >= 75) return { label: 'Good', color: 'bg-green-400' };
    if (performance >= 60) return { label: 'Average', color: 'bg-yellow-500' };
    return { label: 'Needs Improvement', color: 'bg-red-500' };
  };
  
  const status = getPerformanceStatus(averagePerformance);
  
  return (
    <Card className="h-full border-l-4 hover:shadow-lg transition-shadow" style={{ borderLeftColor: averagePerformance >= 75 ? '#4ade80' : averagePerformance >= 60 ? '#facc15' : '#ef4444' }}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-university-blue">{center.short_name}</CardTitle>
            <CardDescription className="text-base font-medium">{center.name}</CardDescription>
          </div>
          <Badge variant={averagePerformance >= 75 ? 'default' : averagePerformance >= 60 ? 'outline' : 'destructive'}>
            {kpiCount > 0 ? status.label : 'No Data'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{center.description || 'No description available'}</p>
        
        {center.departments && (
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="bg-gray-50">
              {center.departments.short_name}
            </Badge>
            {center.departments.faculties && (
              <Badge variant="outline" className="bg-blue-50">
                {center.departments.faculties.short_name}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center mt-2">
          <ChartBar className="w-4 h-4 mr-2 text-university-blue" />
          <span className="text-sm font-medium">Performance: </span>
          <span className="ml-1 text-sm">
            {isLoading ? 'Loading...' : kpiCount > 0 ? `${averagePerformance.toFixed(0)}% of targets` : 'No KPIs'}
          </span>
        </div>
        <div className="flex items-center mt-2">
          <TrendingUp className="w-4 h-4 mr-2 text-university-blue" />
          <span className="text-sm font-medium">KPIs: </span>
          <span className="ml-1 text-sm">
            {isLoading ? 'Loading...' : `${kpiCount} metrics tracked`}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild variant="outline" className="w-1/2">
          <Link to={`/centers/${center.id}`}>
            <ChartBar className="w-4 h-4 mr-1" />
            <span>KPIs</span>
          </Link>
        </Button>
        <Button asChild variant="default" className="w-1/2">
          <Link to={`/centers/${center.id}/profile`}>
            <Info className="w-4 h-4 mr-1" />
            <span>Profile</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CenterCard;
