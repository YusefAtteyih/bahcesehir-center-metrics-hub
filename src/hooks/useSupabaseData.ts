
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Center = Database['public']['Tables']['centers']['Row'];
type KPI = Database['public']['Tables']['kpis']['Row'];
type KpiUpdateRequest = Database['public']['Tables']['kpi_update_requests']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

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
        .select(`
          *,
          centers!kpi_update_requests_center_id_fkey (
            name,
            short_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
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

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data as Profile;
    }
  });
};

export const useCreateKpiRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (requestData: Partial<KpiUpdateRequest>) => {
      const { data, error } = await supabase
        .from('kpi_update_requests')
        .insert([requestData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi-requests'] });
    }
  });
};

export const useUpdateKpiRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<KpiUpdateRequest> }) => {
      const { data, error } = await supabase
        .from('kpi_update_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi-requests'] });
    }
  });
};

export const useUpdateKpi = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<KPI> }) => {
      const { data, error } = await supabase
        .from('kpis')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-kpis'] });
      queryClient.invalidateQueries({ queryKey: ['center-kpis'] });
    }
  });
};
