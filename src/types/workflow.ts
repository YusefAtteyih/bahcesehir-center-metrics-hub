
export interface WorkflowState {
  id: string;
  name: string;
  description: string;
  isInitial: boolean;
  isFinal: boolean;
  allowedTransitions: string[];
}

export interface WorkflowTransition {
  fromState: string;
  toState: string;
  action: string;
  requiresComment: boolean;
  allowedRoles: ('manager' | 'evaluator' | 'faculty_dean' | 'department_head')[];
}

export interface WorkflowHistory {
  id: string;
  requestId: string;
  fromState: string;
  toState: string;
  action: string;
  performedBy: string;
  performedAt: string;
  comments?: string;
}

export const KPI_WORKFLOW_STATES: WorkflowState[] = [
  {
    id: 'draft',
    name: 'Draft',
    description: 'Manager is still editing',
    isInitial: true,
    isFinal: false,
    allowedTransitions: ['submitted']
  },
  {
    id: 'submitted',
    name: 'Submitted',
    description: 'Sent to evaluators for review',
    isInitial: false,
    isFinal: false,
    allowedTransitions: ['under-review', 'approved', 'rejected', 'revision-requested']
  },
  {
    id: 'under-review',
    name: 'Under Review',
    description: 'Evaluator is actively reviewing',
    isInitial: false,
    isFinal: false,
    allowedTransitions: ['approved', 'rejected', 'revision-requested']
  },
  {
    id: 'approved',
    name: 'Approved',
    description: 'Accepted and applied to center data',
    isInitial: false,
    isFinal: true,
    allowedTransitions: []
  },
  {
    id: 'rejected',
    name: 'Rejected',
    description: 'Declined with feedback',
    isInitial: false,
    isFinal: true,
    allowedTransitions: []
  },
  {
    id: 'revision-requested',
    name: 'Revision Requested',
    description: 'Needs more information from manager',
    isInitial: false,
    isFinal: false,
    allowedTransitions: ['resubmitted']
  },
  {
    id: 'resubmitted',
    name: 'Resubmitted',
    description: 'Manager has addressed revision requests',
    isInitial: false,
    isFinal: false,
    allowedTransitions: ['under-review', 'approved', 'rejected', 'revision-requested']
  }
];

export const KPI_WORKFLOW_TRANSITIONS: WorkflowTransition[] = [
  {
    fromState: 'draft',
    toState: 'submitted',
    action: 'submit',
    requiresComment: false,
    allowedRoles: ['manager']
  },
  {
    fromState: 'submitted',
    toState: 'under-review',
    action: 'start-review',
    requiresComment: false,
    allowedRoles: ['evaluator', 'faculty_dean', 'department_head']
  },
  {
    fromState: 'submitted',
    toState: 'approved',
    action: 'approve',
    requiresComment: false,
    allowedRoles: ['evaluator', 'faculty_dean', 'department_head']
  },
  {
    fromState: 'submitted',
    toState: 'rejected',
    action: 'reject',
    requiresComment: true,
    allowedRoles: ['evaluator', 'faculty_dean', 'department_head']
  },
  {
    fromState: 'submitted',
    toState: 'revision-requested',
    action: 'request-revision',
    requiresComment: true,
    allowedRoles: ['evaluator', 'faculty_dean', 'department_head']
  },
  {
    fromState: 'under-review',
    toState: 'approved',
    action: 'approve',
    requiresComment: false,
    allowedRoles: ['evaluator', 'faculty_dean', 'department_head']
  },
  {
    fromState: 'under-review',
    toState: 'rejected',
    action: 'reject',
    requiresComment: true,
    allowedRoles: ['evaluator', 'faculty_dean', 'department_head']
  },
  {
    fromState: 'under-review',
    toState: 'revision-requested',
    action: 'request-revision',
    requiresComment: true,
    allowedRoles: ['evaluator', 'faculty_dean', 'department_head']
  },
  {
    fromState: 'revision-requested',
    toState: 'resubmitted',
    action: 'resubmit',
    requiresComment: false,
    allowedRoles: ['manager']
  },
  {
    fromState: 'resubmitted',
    toState: 'under-review',
    action: 'start-review',
    requiresComment: false,
    allowedRoles: ['evaluator', 'faculty_dean', 'department_head']
  },
  {
    fromState: 'resubmitted',
    toState: 'approved',
    action: 'approve',
    requiresComment: false,
    allowedRoles: ['evaluator', 'faculty_dean', 'department_head']
  },
  {
    fromState: 'resubmitted',
    toState: 'rejected',
    action: 'reject',
    requiresComment: true,
    allowedRoles: ['evaluator', 'faculty_dean', 'department_head']
  },
  {
    fromState: 'resubmitted',
    toState: 'revision-requested',
    action: 'request-revision',
    requiresComment: true,
    allowedRoles: ['evaluator', 'faculty_dean', 'department_head']
  }
];
