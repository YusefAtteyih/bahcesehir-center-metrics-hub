
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
      
      // Convert the database response to our expected format
      return {
        total_child_organizations: data.total_child_organizations,
        total_kpis: data.total_kpis,
        on_target_kpis: data.on_target_kpis,
        average_performance: data.average_performance,
        organization_type: data.organization_type as 'faculty' | 'department' | 'center',
        performance_status: data.performance_status as 'excellent' | 'good' | 'average' | 'needs-improvement'
      };
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
      
      // Convert the database response to our expected format
      return data.map((item: any) => ({
        organization_id: item.organization_id,
        organization_name: item.organization_name,
        organization_short_name: item.organization_short_name,
        organization_type: item.organization_type as 'faculty' | 'department' | 'center',
        child_count: item.child_count,
        kpis_count: item.kpis_count,
        average_performance: item.average_performance,
        performance_status: item.performance_status as 'excellent' | 'good' | 'average' | 'needs-improvement'
      }));
    },
    enabled: !!organizationId
  });
};

// Legacy hooks for backward compatibility
export const useFacultyKpiSummary = (facultyId: string) => useOrganizationKpiSummary(facultyId);
export const useDepartmentKpiSummary = (departmentId: string) => useOrganizationKpiSummary(departmentId);
export const useFacultyDepartmentsPerformance = (facultyId: string) => useOrganizationChildrenPerformance(facultyId);
