
export interface KpiUpdateRequest {
  id: string;
  centerId: string;
  centerName: string;
  kpiName: string;
  currentValue: number;
  proposedValue: number;
  currentTarget: number;
  proposedTarget?: number;
  justification: string;
  supportingDocuments?: string[];
  submittedBy: string;
  submittedDate: string;
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'revision-requested' | 'resubmitted';
  evaluatorComments?: string;
  reviewedBy?: string;
  reviewedDate?: string;
  dataSource: string;
  measurementPeriod: string;
  impactOnRelatedKpis?: string;
}

export interface ReportTemplate {
  reportType: 'monthly' | 'quarterly' | 'annual' | 'kpi-update';
  fields: FormField[];
  validationRules: ValidationRule[];
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'file' | 'date' | 'currency';
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: string;
  dependsOn?: string;
  showWhen?: any;
}

export interface ValidationRule {
  field: string;
  rule: string;
  message: string;
}
