import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, Search, Filter, Eye, AlertCircle, RotateCcw } from 'lucide-react';
import { KpiUpdateRequest } from '@/types/approval';
import { useKpiManagement } from '@/hooks/useKpiManagement';
import { useKpiWorkflow } from '@/hooks/useKpiWorkflow';

const KpiApprovalDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<KpiUpdateRequest | null>(null);
  const [evaluatorComments, setEvaluatorComments] = useState('');

  const { kpiRequests, updateKpiRequest, getRequestStats } = useKpiManagement();
  const { getAvailableActions, requiresComment, getStateInfo } = useKpiWorkflow();

  const filteredRequests = kpiRequests.filter(request => {
    const matchesSearch = request.centerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.kpiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = getRequestStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'revision-requested': return 'bg-orange-100 text-orange-800';
      case 'resubmitted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="w-4 h-4" />;
      case 'under-review': return <Eye className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'revision-requested': return <AlertCircle className="w-4 h-4" />;
      case 'resubmitted': return <RotateCcw className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleWorkflowAction = (requestId: string, action: 'approve' | 'reject' | 'request-revision') => {
    const request = kpiRequests.find(r => r.id === requestId);
    if (!request) return;

    const needsComment = requiresComment(request.status, action);
    if (needsComment && !evaluatorComments.trim()) {
      toast({
        title: "Comments Required",
        description: `Please provide comments for this ${action} action.`,
        variant: "destructive"
      });
      return;
    }

    const success = updateKpiRequest(requestId, action, evaluatorComments);
    
    if (success) {
      setSelectedRequest(null);
      setEvaluatorComments('');
    }
  };

  const handleStartReview = (requestId: string) => {
    const request = kpiRequests.find(r => r.id === requestId);
    if (!request) return;

    if (request.status === 'submitted' || request.status === 'resubmitted') {
      updateKpiRequest(requestId, 'start-review' as any);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-university-blue">KPI Approval Dashboard</h1>
        <p className="text-gray-600 mt-1">Review and approve KPI updates from center managers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending Approval</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{stats.underReview}</div>
                <div className="text-sm text-gray-600">Under Review</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{stats.needingRevision}</div>
                <div className="text-sm text-gray-600">Needs Revision</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{stats.thisWeek}</div>
                <div className="text-sm text-gray-600">This Week</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>KPI Update Requests</CardTitle>
          <CardDescription>Review and manage KPI update submissions with enhanced workflow</CardDescription>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by center, KPI, or submitter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="revision-requested">Revision Requested</SelectItem>
                <SelectItem value="resubmitted">Resubmitted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Center</TableHead>
                <TableHead>KPI</TableHead>
                <TableHead>Current → Proposed</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => {
                const availableActions = getAvailableActions(request.status, 'evaluator');
                const stateInfo = getStateInfo(request.status);
                
                return (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.centerName}</TableCell>
                    <TableCell>{request.kpiName}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>{request.currentValue} → {request.proposedValue || request.currentValue}</div>
                        {request.proposedTarget && (
                          <div className="text-sm text-gray-500">
                            Target: {request.currentTarget} → {request.proposedTarget}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{request.submittedBy}</TableCell>
                    <TableCell>{request.submittedDate}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(request.status)}
                          {stateInfo?.name || request.status.replace('-', ' ')}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {availableActions.includes('start-review') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartReview(request.id)}
                          >
                            Start Review
                          </Button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                            >
                              Review Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Review KPI Update Request</DialogTitle>
                              <DialogDescription>
                                {request.centerName} - {request.kpiName}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedRequest && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Current Value</label>
                                    <div className="text-lg">{selectedRequest.currentValue}</div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Proposed Value</label>
                                    <div className="text-lg">{selectedRequest.proposedValue || 'No change'}</div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Current Target</label>
                                    <div className="text-lg">{selectedRequest.currentTarget}</div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Proposed Target</label>
                                    <div className="text-lg">{selectedRequest.proposedTarget || 'No change'}</div>
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="text-sm font-medium">Justification</label>
                                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                                    {selectedRequest.justification}
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Data Source</label>
                                    <div>{selectedRequest.dataSource}</div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Measurement Period</label>
                                    <div>{selectedRequest.measurementPeriod}</div>
                                  </div>
                                </div>
                                
                                {selectedRequest.impactOnRelatedKpis && (
                                  <div>
                                    <label className="text-sm font-medium">Impact on Related KPIs</label>
                                    <div className="mt-1 p-3 bg-blue-50 rounded-md">
                                      {selectedRequest.impactOnRelatedKpis}
                                    </div>
                                  </div>
                                )}
                                
                                <div>
                                  <label className="text-sm font-medium">Evaluator Comments</label>
                                  <Textarea
                                    placeholder="Add your review comments..."
                                    value={evaluatorComments}
                                    onChange={(e) => setEvaluatorComments(e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            )}
                            
                            <DialogFooter className="gap-2">
                              {getAvailableActions(selectedRequest?.status || '', 'evaluator').map(action => (
                                <Button
                                  key={action}
                                  variant={action === 'approve' ? 'default' : action === 'reject' ? 'destructive' : 'outline'}
                                  onClick={() => handleWorkflowAction(selectedRequest?.id || '', action as any)}
                                  disabled={requiresComment(selectedRequest?.status || '', action) && !evaluatorComments.trim()}
                                >
                                  {action.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Button>
                              ))}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default KpiApprovalDashboard;
