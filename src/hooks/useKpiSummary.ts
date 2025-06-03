
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { OrganizationSummary, OrganizationChildPerformance } from '@/types/organization';

// Use the new organization summary function
export const useOrganizationKpiSummary = (organizationId: string) => {
  return useQuery({
    queryKey: ['organization-kpi-summary', organizationId],
    queryFn: async (): Promise<OrganizationSummary> => {
      const { data, error } = await supabase.rpc('get_organization_kpi_summary', {
        organization_id_param: organizationId
      });
      
      if (error) throw error;
      return data as OrganizationSummary;
    },
    enabled: !!organizationId
  });
};

export const useOrganizationChildrenPerformance = (organizationId: string) => {
  return useQuery({
    queryKey: ['organization-children-performance', organizationId],
    queryFn: async (): Promise<OrganizationChildPerformance[]> => {
      const { data, error } = await supabase.rpc('get_organization_children_performance', {
        organization_id_param: organizationId
      });
      
      if (error) throw error;
      return data as OrganizationChildPerformance[];
    },
    enabled: !!organizationId
  });
};

// Legacy hooks for backward compatibility
export const useFacultyKpiSummary = (facultyId: string) => useOrganizationKpiSummary(facultyId);
export const useDepartmentKpiSummary = (departmentId: string) => useOrganizationKpiSummary(departmentId);
export const useFacultyDepartmentsPerformance = (facultyId: string) => useOrganizationChildrenPerformance(facultyId);
