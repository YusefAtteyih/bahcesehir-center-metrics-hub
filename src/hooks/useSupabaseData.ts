
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Center = Database['public']['Tables']['centers']['Row'];
type KPI = Database['public']['Tables']['kpis']['Row'];
type KpiUpdateRequest = Database['public']['Tables']['kpi_update_requests']['Row'];

export const useCenters = () => {
  return useQuery({
    queryKey: ['centers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('centers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Center[];
    }
  });
};

export const useCenter = (centerId: string) => {
  return useQuery({
    queryKey: ['center', centerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('centers')
        .select('*')
        .eq('id', centerId)
        .single();
      
      if (error) throw error;
      return data as Center;
    },
    enabled: !!centerId
  });
};

export const useCenterKpis = (centerId: string) => {
  return useQuery({
    queryKey: ['center-kpis', centerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .eq('center_id', centerId)
        .order('name');
      
      if (error) throw error;
      return data as KPI[];
    },
    enabled: !!centerId
  });
};

export const useKpiRequests = () => {
  return useQuery({
    queryKey: ['kpi-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_update_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as KpiUpdateRequest[];
    }
  });
};

export const useAllKpis = () => {
  return useQuery({
    queryKey: ['all-kpis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpis')
        .select(`
          *,
          centers (
            name,
            short_name
          )
        `)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });
};
