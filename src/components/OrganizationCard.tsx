
import React from 'react';
import { Link } from 'react-router-dom';
import { ChartBar, TrendingUp, Info, Building2, GraduationCap, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrganizationKpis } from '@/hooks/useOrganizations';
import type { Organization, OrganizationType } from '@/types/organization';

interface OrganizationCardProps {
  organization: Organization & {
    parent_organization?: {
      name: string;
      short_name: string;
      type: OrganizationType;
    };
  };
}

const getTypeIcon = (type: OrganizationType) => {
  switch (type) {
    case 'faculty':
      return <GraduationCap className="w-4 h-4" />;
    case 'department':
      return <Users className="w-4 h-4" />;
    case 'center':
      return <Building2 className="w-4 h-4" />;
    default:
      return <Building2 className="w-4 h-4" />;
  }
};

const getTypeColor = (type: OrganizationType) => {
  switch (type) {
    case 'faculty':
      return 'bg-purple-100 text-purple-800';
    case 'department':
      return 'bg-blue-100 text-blue-800';
    case 'center':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization }) => {
  const { data: kpis, isLoading } = useOrganizationKpis(organization.id);
  
  const getPerformanceData = () => {
    if (!kpis || kpis.length === 0) {
      return { averagePerformance: 0, kpiCount: 0 };
    }
    
    const performanceValues = kpis.map(kpi => (Number(kpi.current_value) / Number(kpi.target_value)) * 100);
    const averagePerformance = performanceValues.reduce((sum, val) => sum + val, 0) / performanceValues.length;
    
    return { averagePerformance, kpiCount: kpis.length };
  };

  const { averagePerformance, kpiCount } = getPerformanceData();
  
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
            <CardTitle className="text-university-blue flex items-center gap-2">
              {getTypeIcon(organization.type)}
              {organization.short_name}
            </CardTitle>
            <CardDescription className="text-base font-medium">{organization.name}</CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={getTypeColor(organization.type)}>
              {organization.type}
            </Badge>
            <Badge variant={averagePerformance >= 75 ? 'default' : averagePerformance >= 60 ? 'outline' : 'destructive'}>
              {kpiCount > 0 ? status.label : 'No Data'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{organization.description || 'No description available'}</p>
        
        {organization.parent_organization && (
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="bg-gray-50">
              {organization.parent_organization.short_name}
            </Badge>
            <Badge variant="outline" className="bg-blue-50">
              {organization.parent_organization.type}
            </Badge>
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
          <Link to={`/organizations/${organization.id}/kpis`}>
            <ChartBar className="w-4 h-4 mr-1" />
            <span>KPIs</span>
          </Link>
        </Button>
        <Button asChild variant="default" className="w-1/2">
          <Link to={`/organizations/${organization.id}/profile`}>
            <Info className="w-4 h-4 mr-1" />
            <span>Profile</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrganizationCard;
