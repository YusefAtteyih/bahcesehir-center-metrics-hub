
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const AnalyticsPage = React.lazy(() => import('@/pages/AnalyticsPage'));

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-university-blue" />
      <p className="text-gray-600">Loading Analytics...</p>
    </div>
  </div>
);

const LazyAnalytics: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AnalyticsPage />
    </Suspense>
  );
};

export default LazyAnalytics;
