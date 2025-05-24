
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkflowHistory } from '@/types/workflow';
import { Clock, CheckCircle, XCircle, AlertCircle, Eye, RotateCcw, User } from 'lucide-react';

interface WorkflowTimelineProps {
  history: WorkflowHistory[];
  requestId: string;
}

const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({ history, requestId }) => {
  const requestHistory = history
    .filter(h => h.requestId === requestId)
    .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime());

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'submit': return <Clock className="w-4 h-4" />;
      case 'start-review': return <Eye className="w-4 h-4" />;
      case 'approve': return <CheckCircle className="w-4 h-4" />;
      case 'reject': return <XCircle className="w-4 h-4" />;
      case 'request-revision': return <AlertCircle className="w-4 h-4" />;
      case 'resubmit': return <RotateCcw className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'submit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'start-review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approve': return 'bg-green-100 text-green-800 border-green-200';
      case 'reject': return 'bg-red-100 text-red-800 border-red-200';
      case 'request-revision': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'resubmit': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getActionTitle = (action: string) => {
    return action.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (requestHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow Timeline</CardTitle>
          <CardDescription>No workflow history available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Timeline</CardTitle>
        <CardDescription>Complete history of workflow actions for this request</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requestHistory.map((entry, index) => {
            const { date, time } = formatDate(entry.performedAt);
            const isLatest = index === 0;
            
            return (
              <div key={entry.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full border-2 ${getActionColor(entry.action)} ${isLatest ? 'ring-2 ring-blue-300' : ''}`}>
                    {getActionIcon(entry.action)}
                  </div>
                  {index < requestHistory.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>
                  )}
                </div>
                
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getActionColor(entry.action)}>
                      {getActionTitle(entry.action)}
                    </Badge>
                    {isLatest && (
                      <Badge variant="outline" className="text-xs">Latest</Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{entry.performedBy}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {date} at {time}
                    </div>
                  </div>
                  
                  {entry.comments && (
                    <div className="p-3 bg-gray-50 rounded-md text-sm">
                      <strong>Comments:</strong> {entry.comments}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Transitioned from <strong>{entry.fromState.replace('-', ' ')}</strong> to <strong>{entry.toState.replace('-', ' ')}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowTimeline;
