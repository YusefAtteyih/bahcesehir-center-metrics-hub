
import { useMemo, useCallback } from 'react';
import { useKpiRequests, useCreateKpiRequest, useUpdateKpiRequest } from './useSupabaseData';
import { useUser } from '@/contexts/UserContext';

export const useOptimizedKpiManagement = () => {
  const { userRole } = useUser();
  const { data: kpiRequests = [], isLoading, error } = useKpiRequests();
  const createKpiMutation = useCreateKpiRequest();
  const updateKpiMutation = useUpdateKpiRequest();

  // Memoized calculations for performance
  const getRequestStats = useMemo(() => {
    if (!kpiRequests.length) {
      return {
        total: 0,
        pending: 0,
        underReview: 0,
        approved: 0,
        rejected: 0,
        needingRevision: 0,
        thisWeek: 0
      };
    }

    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const stats = kpiRequests.reduce((acc, request) => {
      acc.total++;
      
      switch (request.status) {
        case 'submitted':
          acc.pending++;
          break;
        case 'under-review':
          acc.underReview++;
          break;
        case 'approved':
          acc.approved++;
          break;
        case 'rejected':
          acc.rejected++;
          break;
        case 'revision-requested':
          acc.needingRevision++;
          break;
      }

      if (request.submitted_date && new Date(request.submitted_date) > weekAgo) {
        acc.thisWeek++;
      }

      return acc;
    }, {
      total: 0,
      pending: 0,
      underReview: 0,
      approved: 0,
      rejected: 0,
      needingRevision: 0,
      thisWeek: 0
    });

    return stats;
  }, [kpiRequests]);

  const submitKpiUpdate = useCallback((kpiData: any) => {
    return createKpiMutation.mutateAsync(kpiData);
  }, [createKpiMutation]);

  const updateKpiRequest = useCallback((
    requestId: string,
    action: 'approve' | 'reject' | 'request-revision' | 'start-review',
    comments?: string
  ) => {
    const statusMap = {
      'approve': 'approved',
      'reject': 'rejected',
      'request-revision': 'revision-requested',
      'start-review': 'under-review'
    } as const;

    const updates: any = {
      status: statusMap[action],
      reviewed_date: new Date().toISOString()
    };

    if (comments) {
      updates.evaluator_comments = comments;
    }

    return updateKpiMutation.mutateAsync({ id: requestId, updates });
  }, [updateKpiMutation]);

  const getKpiRequestsByStatus = useCallback((status: string) => {
    return kpiRequests.filter(r => r.status === status);
  }, [kpiRequests]);

  const getKpiRequestsByCenter = useCallback((centerId: string) => {
    return kpiRequests.filter(r => r.center_id === centerId);
  }, [kpiRequests]);

  const getPendingApprovals = useCallback(() => {
    return kpiRequests.filter(r => ['submitted', 'under-review', 'resubmitted'].includes(r.status));
  }, [kpiRequests]);

  return {
    kpiRequests,
    isLoading,
    error,
    submitKpiUpdate,
    updateKpiRequest,
    getKpiRequestsByStatus,
    getKpiRequestsByCenter,
    getPendingApprovals,
    getRequestStats,
    isSubmitting: createKpiMutation.isPending,
    isUpdating: updateKpiMutation.isPending
  };
};
