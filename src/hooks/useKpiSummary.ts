
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface FacultyKpiSummary {
  total_departments: number;
  total_centers: number;
  total_kpis: number;
  on_target_kpis: number;
  average_performance: number;
  performance_status: 'excellent' | 'good' | 'average' | 'needs-improvement';
}

interface DepartmentKpiSummary {
  total_centers: number;
  total_kpis: number;
  on_target_kpis: number;
  average_performance: number;
  research_output: number;
  performance_status: 'excellent' | 'good' | 'average' | 'needs-improvement';
}

interface DepartmentPerformance {
  department_id: string;
  department_name: string;
  department_short_name: string;
  centers_count: number;
  kpis_count: number;
  average_performance: number;
  performance_status: 'excellent' | 'good' | 'average' | 'needs-improvement';
}

export const useFacultyKpiSummary = (facultyId: string) => {
  return useQuery({
    queryKey: ['faculty-kpi-summary', facultyId],
    queryFn: async (): Promise<FacultyKpiSummary> => {
      const { data, error } = await supabase.rpc('get_faculty_kpi_summary', {
        faculty_id_param: facultyId
      });
      
      if (error) throw error;
      return data as FacultyKpiSummary;
    },
    enabled: !!facultyId
  });
};

export const useDepartmentKpiSummary = (departmentId: string) => {
  return useQuery({
    queryKey: ['department-kpi-summary', departmentId],
    queryFn: async (): Promise<DepartmentKpiSummary> => {
      const { data, error } = await supabase.rpc('get_department_kpi_summary', {
        department_id_param: departmentId
      });
      
      if (error) throw error;
      return data as DepartmentKpiSummary;
    },
    enabled: !!departmentId
  });
};

export const useFacultyDepartmentsPerformance = (facultyId: string) => {
  return useQuery({
    queryKey: ['faculty-departments-performance', facultyId],
    queryFn: async (): Promise<DepartmentPerformance[]> => {
      const { data, error } = await supabase.rpc('get_faculty_departments_performance', {
        faculty_id_param: facultyId
      });
      
      if (error) throw error;
      return data as DepartmentPerformance[];
    },
    enabled: !!facultyId
  });
};
