
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOptimizedKpiManagement = () => {
  const { data: kpiRequests, isLoading } = useQuery({
    queryKey: ['kpi-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_update_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const getRequestStats = () => {
    if (!kpiRequests) return { total: 0, pending: 0, approved: 0, rejected: 0 };
    
    return {
      total: kpiRequests.length,
      pending: kpiRequests.filter(req => req.status === 'submitted' || req.status === 'under-review').length,
      approved: kpiRequests.filter(req => req.status === 'approved').length,
      rejected: kpiRequests.filter(req => req.status === 'rejected').length,
    };
  };

  return {
    kpiRequests: kpiRequests || [],
    getRequestStats,
    isLoading
  };
};
