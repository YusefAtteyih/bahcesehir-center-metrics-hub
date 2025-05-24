
import { useState, useCallback } from 'react';
import { KpiUpdateRequest } from '@/types/approval';
import { useKpiWorkflow } from './useKpiWorkflow';
import { useNotifications } from './useNotifications';
import { useUser } from '@/contexts/UserContext';

export const useKpiManagement = () => {
  const { userRole } = useUser();
  const { executeWorkflowAction } = useKpiWorkflow();
  const { notifyKpiSubmission, notifyKpiApproval, notifyRevisionRequest } = useNotifications();
  
  const [kpiRequests, setKpiRequests] = useState<KpiUpdateRequest[]>([
    {
      id: '1',
      centerId: 'baubus',
      centerName: 'Business Analytics Center',
      kpiName: 'Research Publications',
      currentValue: 24,
      proposedValue: 28,
      currentTarget: 30,
      proposedTarget: 35,
      justification: 'We have completed 4 additional publications this quarter and expect to exceed our original target. Requesting target adjustment to reflect our improved capacity.',
      submittedBy: 'Dr. Ahmet Yılmaz',
      submittedDate: '2025-01-15',
      status: 'submitted',
      dataSource: 'University Research Database',
      measurementPeriod: 'Q4 2024',
      impactOnRelatedKpis: 'This may positively impact our funding KPI as more publications often lead to better grant opportunities.'
    },
    {
      id: '2',
      centerId: 'baugral',
      centerName: 'Graphics and AI Lab',
      kpiName: 'Industry Partnerships',
      currentValue: 12,
      proposedValue: 12,
      currentTarget: 15,
      proposedTarget: 18,
      justification: 'New partnerships with tech companies are in pipeline. Adjusting target to reflect market opportunities.',
      submittedBy: 'Dr. Mehmet Kaya',
      submittedDate: '2025-01-14',
      status: 'under-review',
      dataSource: 'Partnership Management System',
      measurementPeriod: 'Jan 2025'
    },
    {
      id: '3',
      centerId: 'baubal',
      centerName: 'Biomedical Analytics Lab',
      kpiName: 'Student Engagement',
      currentValue: 85,
      proposedValue: 92,
      currentTarget: 100,
      justification: 'New student programs have increased engagement significantly. Current data shows sustained improvement.',
      submittedBy: 'Dr. Ayşe Demir',
      submittedDate: '2025-01-13',
      status: 'approved',
      evaluatorComments: 'Excellent progress. Approved based on strong supporting evidence.',
      reviewedBy: 'Prof. Evaluation Team',
      reviewedDate: '2025-01-16',
      dataSource: 'Student Information System',
      measurementPeriod: 'Fall 2024'
    }
  ]);

  const submitKpiUpdate = useCallback((kpiData: Partial<KpiUpdateRequest>) => {
    const newRequest: KpiUpdateRequest = {
      id: `${Date.now()}-${Math.random()}`,
      centerId: kpiData.centerId || 'unknown',
      centerName: kpiData.centerName || 'Unknown Center',
      kpiName: kpiData.kpiName || 'Unknown KPI',
      currentValue: kpiData.currentValue || 0,
      proposedValue: kpiData.proposedValue || kpiData.currentValue || 0,
      currentTarget: kpiData.currentTarget || 0,
      proposedTarget: kpiData.proposedTarget,
      justification: kpiData.justification || '',
      submittedBy: kpiData.submittedBy || 'Current Manager',
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'submitted',
      dataSource: kpiData.dataSource || '',
      measurementPeriod: kpiData.measurementPeriod || '',
      impactOnRelatedKpis: kpiData.impactOnRelatedKpis,
      supportingDocuments: kpiData.supportingDocuments
    };

    setKpiRequests(prev => [newRequest, ...prev]);
    
    // Notify evaluators of new submission
    notifyKpiSubmission(newRequest.centerName, newRequest.kpiName);
    
    return newRequest;
  }, [notifyKpiSubmission]);

  const updateKpiRequest = useCallback((
    requestId: string,
    action: 'approve' | 'reject' | 'request-revision',
    comments?: string
  ) => {
    const request = kpiRequests.find(r => r.id === requestId);
    if (!request) return false;

    const success = executeWorkflowAction(
      request,
      { action, comments },
      (updatedRequest) => {
        setKpiRequests(prev => 
          prev.map(r => r.id === requestId ? updatedRequest : r)
        );

        // Send notifications based on action
        if (action === 'approve') {
          notifyKpiApproval(request.kpiName, true);
        } else if (action === 'reject') {
          notifyKpiApproval(request.kpiName, false);
        } else if (action === 'request-revision') {
          notifyRevisionRequest(request.kpiName, comments || '');
        }
      }
    );

    return success;
  }, [kpiRequests, executeWorkflowAction, notifyKpiApproval, notifyRevisionRequest]);

  const getKpiRequestsByStatus = useCallback((status: KpiUpdateRequest['status']) => {
    return kpiRequests.filter(r => r.status === status);
  }, [kpiRequests]);

  const getKpiRequestsByCenter = useCallback((centerId: string) => {
    return kpiRequests.filter(r => r.centerId === centerId);
  }, [kpiRequests]);

  const getPendingApprovals = useCallback(() => {
    return kpiRequests.filter(r => ['submitted', 'under-review', 'resubmitted'].includes(r.status));
  }, [kpiRequests]);

  const getRequestStats = useCallback(() => {
    const stats = {
      total: kpiRequests.length,
      pending: kpiRequests.filter(r => r.status === 'submitted').length,
      underReview: kpiRequests.filter(r => r.status === 'under-review').length,
      approved: kpiRequests.filter(r => r.status === 'approved').length,
      rejected: kpiRequests.filter(r => r.status === 'rejected').length,
      needingRevision: kpiRequests.filter(r => r.status === 'revision-requested').length,
      thisWeek: kpiRequests.filter(r => {
        const submittedDate = new Date(r.submittedDate);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return submittedDate > weekAgo;
      }).length
    };
    return stats;
  }, [kpiRequests]);

  return {
    kpiRequests,
    submitKpiUpdate,
    updateKpiRequest,
    getKpiRequestsByStatus,
    getKpiRequestsByCenter,
    getPendingApprovals,
    getRequestStats
  };
};
