
export type OrganizationType = 'faculty' | 'department' | 'center';

export interface Organization {
  id: string;
  name: string;
  short_name: string;
  description: string | null;
  type: OrganizationType;
  parent_organization_id: string | null;
  location: string | null;
  website: string | null;
  founded_year: number | null;
  mission: string | null;
  vision: string | null;
  head_id: string | null;
  dean_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrganizationWithParent extends Organization {
  parent_organization?: {
    name: string;
    short_name: string;
    type: OrganizationType;
  };
}

export interface OrganizationSummary {
  total_child_organizations: number;
  total_kpis: number;
  on_target_kpis: number;
  average_performance: number;
  organization_type: OrganizationType;
  performance_status: 'excellent' | 'good' | 'average' | 'needs-improvement';
}

export interface OrganizationChildPerformance {
  organization_id: string;
  organization_name: string;
  organization_short_name: string;
  organization_type: OrganizationType;
  child_count: number;
  kpis_count: number;
  average_performance: number;
  performance_status: 'excellent' | 'good' | 'average' | 'needs-improvement';
}
