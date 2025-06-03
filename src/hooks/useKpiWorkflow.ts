
import { useState, useCallback } from 'react';
import { KpiUpdateRequest } from '@/types/approval';
import { WorkflowHistory, KPI_WORKFLOW_STATES, KPI_WORKFLOW_TRANSITIONS } from '@/types/workflow';
import { useUser } from '@/contexts/UserContext';
import { toast } from "@/hooks/use-toast";

interface WorkflowAction {
  action: string;
  comments?: string;
}

export const useKpiWorkflow = () => {
  const { userRole } = useUser();
  const [workflowHistory, setWorkflowHistory] = useState<WorkflowHistory[]>([]);

  const canPerformAction = useCallback((
    currentState: string,
    action: string,
    userRole: 'manager' | 'evaluator' | 'faculty_dean' | 'department_head'
  ): boolean => {
    const transition = KPI_WORKFLOW_TRANSITIONS.find(
      t => t.fromState === currentState && t.action === action
    );
    
    if (!transition) return false;
    
    return transition.allowedRoles.includes(userRole);
  }, []);

  const getAvailableActions = useCallback((
    currentState: string,
    userRole: 'manager' | 'evaluator' | 'faculty_dean' | 'department_head'
  ): string[] => {
    return KPI_WORKFLOW_TRANSITIONS
      .filter(t => t.fromState === currentState && t.allowedRoles.includes(userRole))
      .map(t => t.action);
  }, []);

  const requiresComment = useCallback((
    currentState: string,
    action: string
  ): boolean => {
    const transition = KPI_WORKFLOW_TRANSITIONS.find(
      t => t.fromState === currentState && t.action === action
    );
    
    return transition?.requiresComment || false;
  }, []);

  const executeWorkflowAction = useCallback((
    request: KpiUpdateRequest,
    workflowAction: WorkflowAction,
    onSuccess?: (updatedRequest: KpiUpdateRequest) => void
  ): boolean => {
    if (!userRole) {
      toast({
        title: "Error",
        description: "User role not defined",
        variant: "destructive"
      });
      return false;
    }

    const { action, comments } = workflowAction;
    
    if (!canPerformAction(request.status, action, userRole)) {
      toast({
        title: "Action Not Allowed",
        description: `You cannot perform '${action}' on a request in '${request.status}' state.`,
        variant: "destructive"
      });
      return false;
    }

    if (requiresComment(request.status, action) && !comments?.trim()) {
      toast({
        title: "Comments Required",
        description: `This action requires comments to be provided.`,
        variant: "destructive"
      });
      return false;
    }

    const transition = KPI_WORKFLOW_TRANSITIONS.find(
      t => t.fromState === request.status && t.action === action
    );

    if (!transition) {
      toast({
        title: "Invalid Transition",
        description: "The requested workflow transition is not valid.",
        variant: "destructive"
      });
      return false;
    }

    // Create workflow history entry
    const historyEntry: WorkflowHistory = {
      id: `${Date.now()}-${Math.random()}`,
      requestId: request.id,
      fromState: request.status,
      toState: transition.toState,
      action,
      performedBy: userRole === 'manager' ? request.submittedBy : 'Current User',
      performedAt: new Date().toISOString(),
      comments
    };

    // Update request status
    const updatedRequest: KpiUpdateRequest = {
      ...request,
      status: transition.toState as KpiUpdateRequest['status'],
      evaluatorComments: comments || request.evaluatorComments,
      reviewedBy: ['evaluator', 'faculty_dean', 'department_head'].includes(userRole) ? 'Current User' : request.reviewedBy,
      reviewedDate: ['evaluator', 'faculty_dean', 'department_head'].includes(userRole) ? new Date().toISOString().split('T')[0] : request.reviewedDate
    };

    // Update workflow history
    setWorkflowHistory(prev => [...prev, historyEntry]);

    // Show success message
    const actionMessages = {
      'submit': 'KPI update submitted for review',
      'start-review': 'Review started',
      'approve': 'KPI update approved',
      'reject': 'KPI update rejected',
      'request-revision': 'Revision requested',
      'resubmit': 'KPI update resubmitted'
    };

    toast({
      title: "Success",
      description: actionMessages[action as keyof typeof actionMessages] || `Action '${action}' completed`,
    });

    if (onSuccess) {
      onSuccess(updatedRequest);
    }

    return true;
  }, [userRole, canPerformAction, requiresComment]);

  const getWorkflowHistory = useCallback((requestId: string): WorkflowHistory[] => {
    return workflowHistory.filter(h => h.requestId === requestId);
  }, [workflowHistory]);

  const getStateInfo = useCallback((stateId: string) => {
    return KPI_WORKFLOW_STATES.find(s => s.id === stateId);
  }, []);

  return {
    canPerformAction,
    getAvailableActions,
    requiresComment,
    executeWorkflowAction,
    getWorkflowHistory,
    getStateInfo,
    workflowHistory,
    workflowStates: KPI_WORKFLOW_STATES,
    workflowTransitions: KPI_WORKFLOW_TRANSITIONS
  };
};
