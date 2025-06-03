import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

type KPI = Database['public']['Tables']['kpis']['Row'];
type KpiUpdateRequest = Database['public']['Tables']['kpi_update_requests']['Row'];
type KpiUpdateRequestInsert = Database['public']['Tables']['kpi_update_requests']['Insert'];
type Profile = Database['public']['Tables']['profiles']['Row'];

// Re-export organization hooks for backward compatibility
export {
  useOrganizations,
  useFaculties,
  useDepartments,
  useCenters,
  useOrganization,
  useOrganizationKpis,
  useOrganizationChildren,
  useOrganizationSummary,
  useOrganizationChildrenPerformance,
  useCreateOrganization,
  useUpdateOrganization
} from './useOrganizations';

// Legacy hooks that now use the organizations table
export const useFaculty = (facultyId: string) => {
  return useQuery({
    queryKey: ['organization', facultyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', facultyId)
        .eq('type', 'faculty')
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!facultyId
  });
};

export const useDepartment = (departmentId: string) => {
  return useQuery({
    queryKey: ['organization', departmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select(`
          *,
          parent_organization:organizations!parent_organization_id (
            name,
            short_name,
            type
          )
        `)
        .eq('id', departmentId)
        .eq('type', 'department')
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!departmentId
  });
};

export const useCenter = (centerId: string) => {
  return useQuery({
    queryKey: ['organization', centerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select(`
          *,
          parent_organization:organizations!parent_organization_id (
            name,
            short_name,
            type
          )
        `)
        .eq('id', centerId)
        .eq('type', 'center')
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!centerId
  });
};

export const useCenterKpis = (centerId: string) => {
  return useQuery({
    queryKey: ['organization-kpis', centerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .eq('organization_id', centerId)
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
          organizations!kpi_update_requests_organization_id_fkey (
            name,
            short_name,
            type
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
          organizations (
            name,
            short_name,
            type
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const insertData: KpiUpdateRequestInsert = {
        organization_id: requestData.organization_id!,
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
        .select(`
          *,
          organizations!kpi_update_requests_organization_id_fkey (
            name,
            short_name,
            type
          )
        `)
        .single();
      
      if (error) throw error;
      return data;
    },
    onMutate: async (newRequest) => {
      await queryClient.cancelQueries({ queryKey: ['kpi-requests'] });

      const previousRequests = queryClient.getQueryData(['kpi-requests']);

      const optimisticRequest = {
        id: `temp-${Date.now()}`,
        organization_id: newRequest.organization_id!,
        kpi_id: newRequest.kpi_id!,
        kpi_name: newRequest.kpi_name!,
        current_value: newRequest.current_value!,
        proposed_value: newRequest.proposed_value!,
        current_target: newRequest.current_target!,
        proposed_target: newRequest.proposed_target,
        justification: newRequest.justification!,
        data_source: newRequest.data_source!,
        measurement_period: newRequest.measurement_period!,
        impact_on_related_kpis: newRequest.impact_on_related_kpis,
        supporting_documents: newRequest.supporting_documents,
        status: 'submitted' as const,
        submitted_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        submitted_by: 'temp-user',
        reviewed_by: null,
        reviewed_date: null,
        evaluator_comments: null,
        organizations: {
          name: 'Loading...',
          short_name: 'Loading...',
          type: 'center' as const
        }
      };

      queryClient.setQueryData(['kpi-requests'], (old: any) => 
        old ? [optimisticRequest, ...old] : [optimisticRequest]
      );

      return { previousRequests };
    },
    onError: (err, newRequest, context) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(['kpi-requests'], context.previousRequests);
      }
      
      toast({
        title: "Error",
        description: "Failed to submit KPI request. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi-requests'] });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "KPI request submitted successfully.",
      });
    }
  });
};

export const useUpdateKpiRequest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<KpiUpdateRequest> }) => {
      if (updates.status && ['approved', 'rejected', 'revision-requested'].includes(updates.status) && user) {
        console.log('Using apply_kpi_transition function for status:', updates.status);
        
        const { error } = await supabase
          .rpc('apply_kpi_transition', {
            request_id: id,
            new_status: updates.status,
            reviewer_id: user.id,
            comments: updates.evaluator_comments || null
          });
        
        if (error) throw error;
        
        return { id, ...updates };
      } else {
        const { data, error } = await supabase
          .from('kpi_update_requests')
          .update(updates)
          .eq('id', id)
          .select(`
            *,
            organizations!kpi_update_requests_organization_id_fkey (
              name,
              short_name,
              type
            )
          `)
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['kpi-requests'] });
      
      const previousRequests = queryClient.getQueryData(['kpi-requests']);
      
      queryClient.setQueryData(['kpi-requests'], (old: any) => {
        if (!old) return old;
        return old.map((request: any) => 
          request.id === id 
            ? { ...request, ...updates, updated_at: new Date().toISOString() }
            : request
        );
      });

      return { previousRequests };
    },
    onError: (err, variables, context) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(['kpi-requests'], context.previousRequests);
      }
      
      toast({
        title: "Error",
        description: "Failed to update KPI request. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi-requests'] });
    },
    onSuccess: (data, variables) => {
      const actionMessages = {
        'approved': 'KPI request approved successfully.',
        'rejected': 'KPI request rejected.',
        'revision-requested': 'Revision requested for KPI request.',
        'under-review': 'KPI request is now under review.'
      };
      
      const message = actionMessages[variables.updates.status as keyof typeof actionMessages] || 'KPI request updated successfully.';
      
      toast({
        title: "Success",
        description: message,
      });
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
      queryClient.invalidateQueries({ queryKey: ['organization-kpis'] });
    }
  });
};
