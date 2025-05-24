
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KpiAnalyticsDashboard from '@/components/KpiAnalyticsDashboard';
import WorkflowHistoryChart from '@/components/WorkflowHistoryChart';
import WorkflowTimeline from '@/components/WorkflowTimeline';
import { useKpiWorkflow } from '@/hooks/useKpiWorkflow';
import { useKpiManagement } from '@/hooks/useKpiManagement';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Analytics: React.FC = () => {
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const { workflowHistory } = useKpiWorkflow();
  const { kpiRequests } = useKpiManagement();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-university-blue">Analytics & Insights</h1>
        <p className="text-gray-600 mt-1">Comprehensive analytics for KPI management and workflow performance</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="workflow">Workflow Analytics</TabsTrigger>
          <TabsTrigger value="timeline">Request Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <KpiAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          <WorkflowHistoryChart history={workflowHistory} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <div className="flex gap-4 items-center mb-6">
            <label className="text-sm font-medium">Select Request:</label>
            <Select value={selectedRequestId} onValueChange={setSelectedRequestId}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Choose a request to view timeline" />
              </SelectTrigger>
              <SelectContent>
                {kpiRequests.map((request) => (
                  <SelectItem key={request.id} value={request.id}>
                    {request.centerName} - {request.kpiName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRequestId && (
            <WorkflowTimeline 
              history={workflowHistory} 
              requestId={selectedRequestId}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
