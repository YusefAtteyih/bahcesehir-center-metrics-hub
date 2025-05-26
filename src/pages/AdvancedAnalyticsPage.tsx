
import React from 'react';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import { useAllKpis, useCenters } from '@/hooks/useSupabaseData';
import { Skeleton } from '@/components/ui/skeleton';

const AdvancedAnalyticsPage: React.FC = () => {
  const { data: kpis, isLoading: kpisLoading } = useAllKpis();
  const { data: centers, isLoading: centersLoading } = useCenters();

  if (kpisLoading || centersLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-96" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <AdvancedAnalytics 
      kpis={kpis || []} 
      centers={centers || []} 
    />
  );
};

export default AdvancedAnalyticsPage;
