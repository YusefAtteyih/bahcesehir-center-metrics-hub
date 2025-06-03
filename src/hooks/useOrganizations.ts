
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import type { Organization, OrganizationType, OrganizationSummary, OrganizationChildPerformance } from '@/types/organization';

// Get all organizations with optional filtering by type
export const useOrganizations = (type?: OrganizationType, parentId?: string) => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['organizations', type, parentId, profile?.role],
    queryFn: async () => {
      let query = supabase
        .from('organizations')
        .select(`
          *,
          parent_organization:organizations!parent_organization_id (
            name,
            short_name,
            type
          )
        `)
        .order('name');
      
      if (type) {
        query = query.eq('type', type);
      }
      
      if (parentId) {
        query = query.eq('parent_organization_id', parentId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Organization[];
    }
  });
};

// Get a single organization by ID
export const useOrganization = (organizationId: string) => {
  return useQuery({
    queryKey: ['organization', organizationId],
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
        .eq('id', organizationId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!organizationId
  });
};

// Get organizations by type (replacing old faculty/department/center hooks)
export const useFaculties = () => useOrganizations('faculty');
export const useDepartments = (facultyId?: string) => useOrganizations('department', facultyId);
export const useCenters = (departmentId?: string) => useOrganizations('center', departmentId);

// Get KPIs for an organization
export const useOrganizationKpis = (organizationId: string) => {
  return useQuery({
    queryKey: ['organization-kpis', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .eq('organization_id', organizationId)
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: !!organizationId
  });
};

// Get organization hierarchy (children)
export const useOrganizationChildren = (organizationId: string) => {
  return useQuery({
    queryKey: ['organization-children', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('parent_organization_id', organizationId)
        .order('name');
      
      if (error) throw error;
      return data as Organization[];
    },
    enabled: !!organizationId
  });
};

// Get organization summary using the new database function
export const useOrganizationSummary = (organizationId: string) => {
  return useQuery({
    queryKey: ['organization-summary', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_organization_kpi_summary', {
        organization_id_param: organizationId
      });
      
      if (error) throw error;
      return data as OrganizationSummary;
    },
    enabled: !!organizationId
  });
};

// Get children performance using the new database function
export const useOrganizationChildrenPerformance = (organizationId: string) => {
  return useQuery({
    queryKey: ['organization-children-performance', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_organization_children_performance', {
        organization_id_param: organizationId
      });
      
      if (error) throw error;
      return data as OrganizationChildPerformance[];
    },
    enabled: !!organizationId
  });
};

// Create organization mutation
export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (organization: Partial<Organization>) => {
      const { data, error } = await supabase
        .from('organizations')
        .insert(organization)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast({
        title: "Success",
        description: "Organization created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create organization.",
        variant: "destructive",
      });
    }
  });
};

// Update organization mutation
export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Organization> }) => {
      const { data, error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organization'] });
      toast({
        title: "Success",
        description: "Organization updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update organization.",
        variant: "destructive",
      });
    }
  });
};
