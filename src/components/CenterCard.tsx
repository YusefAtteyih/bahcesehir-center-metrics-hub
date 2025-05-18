
import React from 'react';
import { Link } from 'react-router-dom';
import { Center } from '@/types/center';
import { ChartBar, TrendingUp, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface CenterCardProps {
  center: Center;
}

const CenterCard: React.FC<CenterCardProps> = ({ center }) => {
  // Calculate overall performance percentage
  const performanceValues = center.kpis.map(kpi => (kpi.value / kpi.target) * 100);
  const averagePerformance = performanceValues.reduce((sum, val) => sum + val, 0) / performanceValues.length;
  
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
            <CardTitle className="text-university-blue">{center.shortName}</CardTitle>
            <CardDescription className="text-base font-medium">{center.name}</CardDescription>
          </div>
          <Badge variant={averagePerformance >= 75 ? 'default' : averagePerformance >= 60 ? 'outline' : 'destructive'}>
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{center.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {center.headlineKPIs.slice(0, 3).map((kpi, index) => (
            <Badge variant="outline" key={index} className="bg-gray-50">
              {kpi}
            </Badge>
          ))}
          {center.headlineKPIs.length > 3 && (
            <Badge variant="outline" className="bg-gray-50">
              +{center.headlineKPIs.length - 3} more
            </Badge>
          )}
        </div>
        <div className="flex items-center mt-2">
          <ChartBar className="w-4 h-4 mr-2 text-university-blue" />
          <span className="text-sm font-medium">Performance: </span>
          <span className="ml-1 text-sm">{averagePerformance.toFixed(0)}% of targets</span>
        </div>
        <div className="flex items-center mt-2">
          <TrendingUp className="w-4 h-4 mr-2 text-university-blue" />
          <span className="text-sm font-medium">KPIs: </span>
          <span className="ml-1 text-sm">{center.kpis.length} metrics tracked</span>
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
