
export interface KPI {
  name: string;
  value: number;
  target: number;
  unit?: string;
  whyItMatters: string;
  measurement: string;
}

export interface Center {
  id: string;
  name: string;
  shortName: string;
  description: string;
  headlineKPIs: string[];
  kpis: KPI[];
  category?: string;
}
