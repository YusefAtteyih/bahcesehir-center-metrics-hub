
import React from 'react';
import ReportGenerator from '@/components/ReportGenerator';
import { useAllKpis, useCenters, useKpiRequests } from '@/hooks/useSupabaseData';
import { Skeleton } from '@/components/ui/skeleton';

const ReportGeneratorPage: React.FC = () => {
  const { data: kpis, isLoading: kpisLoading } = useAllKpis();
  const { data: centers, isLoading: centersLoading } = useCenters();
  const { data: requests, isLoading: requestsLoading } = useKpiRequests();

  if (kpisLoading || centersLoading || requestsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-96" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96" />
          </div>
          <div>
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ReportGenerator 
      kpis={kpis || []} 
      centers={centers || []} 
      requests={requests || []}
    />
  );
};

export default ReportGeneratorPage;
