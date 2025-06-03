
import { useState, useCallback } from 'react';
import { KpiUpdateRequest } from '@/types/approval';
import { useKpiWorkflow } from './useKpiWorkflow';
import { useUser } from '@/contexts/UserContext';

export const useKpiManagement = () => {
  const { userRole } = useUser();
  const { executeWorkflowAction } = useKpiWorkflow();
  
  const [kpiRequests, setKpiRequests] = useState<KpiUpdateRequest[]>([
    {
      id: '1',
      centerId: 'cs-center',
      centerName: 'Computer Science Research Center',
      kpiName: 'Research Publications',
      currentValue: 45,
      proposedValue: 50,
      currentTarget: 60,
      proposedTarget: 65,
      justification: 'We have completed 5 additional publications this quarter and expect to exceed our original target. Requesting target adjustment to reflect our improved capacity.',
      submittedBy: 'Dr. Computer Science',
      submittedDate: '2025-01-15',
      status: 'submitted',
      dataSource: 'University Research Database',
      measurementPeriod: 'Q4 2024',
      impactOnRelatedKpis: 'This may positively impact our funding KPI as more publications often lead to better grant opportunities.'
    },
    {
      id: '2',
      centerId: 'biotech-center',
      centerName: 'Biotechnology Innovation Center',
      kpiName: 'Patent Applications',
      currentValue: 8,
      proposedValue: 10,
      currentTarget: 15,
      proposedTarget: 18,
      justification: 'New research breakthroughs have led to more patent applications. Adjusting target to reflect increased innovation capacity.',
      submittedBy: 'Dr. Biotech Manager',
      submittedDate: '2025-01-14',
      status: 'under-review',
      dataSource: 'Patent Management System',
      measurementPeriod: 'Jan 2025'
    },
    {
      id: '3',
      centerId: 'business-center',
      centerName: 'Business Development Center',
      kpiName: 'Startup Incubations',
      currentValue: 15,
      proposedValue: 18,
      currentTarget: 25,
      justification: 'Successful completion of 3 additional startup incubations ahead of schedule.',
      submittedBy: 'Dr. Business Manager',
      submittedDate: '2025-01-13',
      status: 'approved',
      evaluatorComments: 'Excellent progress. Approved based on strong supporting evidence.',
      reviewedBy: 'Prof. Evaluation Team',
      reviewedDate: '2025-01-16',
      dataSource: 'Incubation Management System',
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
    
    // Note: Notifications are now handled automatically by the database function
    // when KPI requests are processed through useSupabaseData hooks
    
    return newRequest;
  }, []);

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

        // Note: Notifications are now handled automatically by the database function
        // when using the Supabase hooks for real KPI requests
      }
    );

    return success;
  }, [kpiRequests, executeWorkflowAction]);

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
