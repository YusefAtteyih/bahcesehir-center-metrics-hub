
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';

type Center = Database['public']['Tables']['centers']['Row'];
type Faculty = Database['public']['Tables']['faculties']['Row'];
type Department = Database['public']['Tables']['departments']['Row'];
type KPI = Database['public']['Tables']['kpis']['Row'];
type KpiUpdateRequest = Database['public']['Tables']['kpi_update_requests']['Row'];
type KpiUpdateRequestInsert = Database['public']['Tables']['kpi_update_requests']['Insert'];
type Profile = Database['public']['Tables']['profiles']['Row'];

// Faculty hooks
export const useFaculties = () => {
  return useQuery({
    queryKey: ['faculties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faculties')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Faculty[];
    }
  });
};

export const useFaculty = (facultyId: string) => {
  return useQuery({
    queryKey: ['faculty', facultyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faculties')
        .select('*')
        .eq('id', facultyId)
        .single();
      
      if (error) throw error;
      return data as Faculty;
    },
    enabled: !!facultyId
  });
};

// Department hooks
export const useDepartments = (facultyId?: string) => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['departments', facultyId, profile?.role],
    queryFn: async () => {
      let query = supabase
        .from('departments')
        .select(`
          *,
          faculties (
            name,
            short_name
          )
        `)
        .order('name');
      
      // Only filter by faculty if user is not an evaluator and facultyId is provided
      if (facultyId && profile?.role !== 'evaluator') {
        query = query.eq('faculty_id', facultyId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });
};

export const useDepartment = (departmentId: string) => {
  return useQuery({
    queryKey: ['department', departmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select(`
          *,
          faculties (
            name,
            short_name
          )
        `)
        .eq('id', departmentId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!departmentId
  });
};

export const useCenters = (departmentId?: string) => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['centers', departmentId, profile?.role],
    queryFn: async () => {
      let query = supabase
        .from('centers')
        .select(`
          *,
          departments (
            name,
            short_name,
            faculties (
              name,
              short_name
            )
          )
        `)
        .order('name');
      
      // Only filter by department if user is not an evaluator and departmentId is provided
      if (departmentId && profile?.role !== 'evaluator') {
        query = query.eq('department_id', departmentId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as (Center & {
        departments?: {
          name: string;
          short_name: string;
          faculties?: {
            name: string;
            short_name: string;
          };
        };
      })[];
    }
  });
};

export const useCenter = (centerId: string) => {
  return useQuery({
    queryKey: ['center', centerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('centers')
        .select(`
          *,
          departments (
            name,
            short_name,
            faculties (
              name,
              short_name
            )
          )
        `)
        .eq('id', centerId)
        .single();
      
      if (error) throw error;
      return data;
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
    mutationFn: async (requestData: Partial<KpiUpdateRequestInsert>) => {
      // Ensure required fields are present
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const insertData: KpiUpdateRequestInsert = {
        center_id: requestData.center_id!,
        kpi_id: requestData.kpi_id!,
        kpi_name: requestData.kpi_name!,
        current_value: requestData.current_value!,
        proposed_value: requestData.proposed_value!,
        current_target: requestData.current_target!,
        proposed_target: requestData.proposed_target,
        justification: requestData.justification!,
        data_source: requestData.data_source!,
        measurement_period: requestData.measurement_period!,
        impact_on_related_kpis: requestData.impact_on_related_kpis,
        supporting_documents: requestData.supporting_documents,
        submitted_by: user.id,
        submitted_date: new Date().toISOString(),
        status: 'submitted'
      };

      const { data, error } = await supabase
        .from('kpi_update_requests')
        .insert(insertData)
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
