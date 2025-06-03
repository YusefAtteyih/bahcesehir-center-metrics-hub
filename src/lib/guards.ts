
import { z } from 'zod';

// Enum schemas
export const userRoleSchema = z.enum(['evaluator', 'manager', 'faculty_dean', 'department_head']);
export const requestStatusSchema = z.enum([
  'draft',
  'submitted',
  'under-review',
  'approved',
  'rejected',
  'revision-requested',
  'resubmitted'
]);
export const workflowActionSchema = z.enum([
  'submit',
  'start-review',
  'approve',
  'reject',
  'request-revision',
  'resubmit'
]);

// Profile schema
export const profileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string(),
  role: userRoleSchema,
  managed_center_id: z.string().nullable(),
  managed_department_id: z.string().nullable(),
  managed_faculty_id: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Center schema
export const centerSchema = z.object({
  id: z.string(),
  name: z.string(),
  short_name: z.string(),
  description: z.string().nullable(),
  department_id: z.string().nullable(),
  location: z.string().nullable(),
  website: z.string().nullable(),
  founded_year: z.number().nullable(),
  mission: z.string().nullable(),
  vision: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Department schema
export const departmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  short_name: z.string(),
  description: z.string().nullable(),
  faculty_id: z.string(),
  head_id: z.string().uuid().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Faculty schema
export const facultySchema = z.object({
  id: z.string(),
  name: z.string(),
  short_name: z.string(),
  description: z.string().nullable(),
  dean_id: z.string().uuid().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

// KPI schema
export const kpiSchema = z.object({
  id: z.string().uuid(),
  center_id: z.string(),
  name: z.string(),
  current_value: z.number(),
  target_value: z.number(),
  unit: z.string().nullable(),
  category: z.string().nullable(),
  why_it_matters: z.string().nullable(),
  measurement: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

// KPI Update Request schema
export const kpiUpdateRequestSchema = z.object({
  id: z.string().uuid(),
  kpi_id: z.string().uuid(),
  center_id: z.string(),
  kpi_name: z.string(),
  current_value: z.number(),
  proposed_value: z.number(),
  current_target: z.number(),
  proposed_target: z.number().nullable(),
  justification: z.string(),
  data_source: z.string(),
  measurement_period: z.string(),
  supporting_documents: z.array(z.string()).nullable(),
  impact_on_related_kpis: z.string().nullable(),
  status: requestStatusSchema,
  submitted_by: z.string().uuid(),
  submitted_date: z.string().nullable(),
  reviewed_by: z.string().uuid().nullable(),
  reviewed_date: z.string().nullable(),
  evaluator_comments: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Notification schema
export const notificationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string(),
  message: z.string(),
  type: z.string(),
  read: z.boolean(),
  request_id: z.string().uuid().nullable(),
  created_at: z.string(),
});

// Workflow History schema
export const workflowHistorySchema = z.object({
  id: z.string().uuid(),
  request_id: z.string().uuid(),
  from_state: requestStatusSchema.nullable(),
  to_state: requestStatusSchema,
  action: workflowActionSchema,
  performed_by: z.string().uuid(),
  comments: z.string().nullable(),
  created_at: z.string(),
});

// Utility functions for safe parsing
export function safeParseProfile(data: unknown) {
  return profileSchema.safeParse(data);
}

export function safeParseCenter(data: unknown) {
  return centerSchema.safeParse(data);
}

export function safeParseDepartment(data: unknown) {
  return departmentSchema.safeParse(data);
}

export function safeParseFaculty(data: unknown) {
  return facultySchema.safeParse(data);
}

export function safeParseKpi(data: unknown) {
  return kpiSchema.safeParse(data);
}

export function safeParseKpiUpdateRequest(data: unknown) {
  return kpiUpdateRequestSchema.safeParse(data);
}

export function safeParseNotification(data: unknown) {
  return notificationSchema.safeParse(data);
}

export function safeParseWorkflowHistory(data: unknown) {
  return workflowHistorySchema.safeParse(data);
}

// Validation with error handling
export function validateProfile(data: unknown) {
  const result = safeParseProfile(data);
  if (!result.success) {
    console.error('Profile validation failed:', result.error);
    throw new Error('Invalid profile data');
  }
  return result.data;
}

export function validateCenter(data: unknown) {
  const result = safeParseCenter(data);
  if (!result.success) {
    console.error('Center validation failed:', result.error);
    throw new Error('Invalid center data');
  }
  return result.data;
}

export function validateKpi(data: unknown) {
  const result = safeParseKpi(data);
  if (!result.success) {
    console.error('KPI validation failed:', result.error);
    throw new Error('Invalid KPI data');
  }
  return result.data;
}

// Export type inference
export type ProfileType = z.infer<typeof profileSchema>;
export type CenterType = z.infer<typeof centerSchema>;
export type DepartmentType = z.infer<typeof departmentSchema>;
export type FacultyType = z.infer<typeof facultySchema>;
export type KpiType = z.infer<typeof kpiSchema>;
export type KpiUpdateRequestType = z.infer<typeof kpiUpdateRequestSchema>;
export type NotificationType = z.infer<typeof notificationSchema>;
export type WorkflowHistoryType = z.infer<typeof workflowHistorySchema>;
