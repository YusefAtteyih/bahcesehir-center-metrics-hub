
export interface KPI {
  name: string;
  value: number;
  target: number;
  unit?: string;
  whyItMatters: string;
  measurement: string;
}

export interface CenterContact {
  name: string;
  role: string;
  email: string;
  phone?: string;
  photo?: string;
}

export interface CenterActivity {
  title: string;
  description: string;
  date?: string;
  type: 'research' | 'event' | 'publication' | 'outreach' | 'other';
}

export interface Center {
  id: string;
  name: string;
  shortName: string;
  description: string;
  headlineKPIs: string[];
  kpis: KPI[];
  category?: string;
  
  // Additional profile information
  location?: string;
  website?: string;
  foundedYear?: number;
  contacts?: CenterContact[];
  mission?: string;
  vision?: string;
  keyAchievements?: string[];
  recentActivities?: CenterActivity[];
}
