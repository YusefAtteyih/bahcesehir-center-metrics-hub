
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, Clock, Award, AlertTriangle } from 'lucide-react';
import { useKpiManagement } from '@/hooks/useKpiManagement';

const PerformanceMetrics: React.FC = () => {
  const { kpiRequests, getRequestStats } = useKpiManagement();
  const stats = getRequestStats();

  const getProcessingEfficiency = () => {
    const totalRequests = stats.total;
    const processedRequests = stats.approved + stats.rejected;
    return totalRequests > 0 ? Math.round((processedRequests / totalRequests) * 100) : 0;
  };

  const getQualityScore = () => {
    const totalProcessed = stats.approved + stats.rejected;
    if (totalProcessed === 0) return 0;
    return Math.round((stats.approved / totalProcessed) * 100);
  };

  const getResponseTime = () => {
    const completedRequests = kpiRequests.filter(r => 
      ['approved', 'rejected'].includes(r.status) && r.reviewedDate
    );

    if (completedRequests.length === 0) return 'N/A';

    const totalHours = completedRequests.reduce((acc, request) => {
      const submitted = new Date(request.submittedDate);
      const reviewed = new Date(request.reviewedDate!);
      const diffTime = Math.abs(reviewed.getTime() - submitted.getTime());
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return acc + diffHours;
    }, 0);

    const avgHours = Math.round(totalHours / completedRequests.length);
    return avgHours < 24 ? `${avgHours}h` : `${Math.round(avgHours / 24)}d`;
  };

  const getBottleneckAnalysis = () => {
    const statusCounts = {
      'submitted': stats.pending,
      'under-review': stats.underReview,
      'revision-requested': stats.needingRevision,
    };

    const maxStatus = Object.entries(statusCounts).reduce((a, b) => 
      statusCounts[a[0]] > statusCounts[b[0]] ? a : b
    );

    return {
      status: maxStatus[0].replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count: maxStatus[1]
    };
  };

  const processingEfficiency = getProcessingEfficiency();
  const qualityScore = getQualityScore();
  const responseTime = getResponseTime();
  const bottleneck = getBottleneckAnalysis();

  const metrics = [
    {
      title: 'Processing Efficiency',
      value: `${processingEfficiency}%`,
      progress: processingEfficiency,
      icon: <Target className="w-5 h-5 text-blue-500" />,
      description: 'Percentage of requests processed vs submitted',
      trend: processingEfficiency >= 80 ? 'up' : 'down',
    },
    {
      title: 'Quality Score',
      value: `${qualityScore}%`,
      progress: qualityScore,
      icon: <Award className="w-5 h-5 text-green-500" />,
      description: 'Approval rate of processed requests',
      trend: qualityScore >= 70 ? 'up' : 'down',
    },
    {
      title: 'Avg Response Time',
      value: responseTime,
      progress: responseTime === 'N/A' ? 0 : Math.max(0, 100 - (parseInt(responseTime) * 10)),
      icon: <Clock className="w-5 h-5 text-orange-500" />,
      description: 'Average time from submission to decision',
      trend: 'neutral',
    },
    {
      title: 'Current Bottleneck',
      value: bottleneck.status,
      progress: Math.min(100, (bottleneck.count / stats.total) * 100),
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      description: `${bottleneck.count} requests in this stage`,
      trend: 'down',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-university-blue">Performance Metrics</h3>
        <p className="text-gray-600 text-sm">Key performance indicators for workflow efficiency</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {metric.icon}
                  {metric.title}
                </div>
                {metric.trend !== 'neutral' && (
                  <div className="flex items-center gap-1">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                )}
              </CardTitle>
              <CardDescription>{metric.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <Badge variant={metric.trend === 'up' ? 'default' : metric.trend === 'down' ? 'destructive' : 'secondary'}>
                    {metric.progress}%
                  </Badge>
                </div>
                <Progress value={metric.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workflow Health Summary</CardTitle>
          <CardDescription>Overall system performance assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-sm text-green-700">Approved This Period</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.pending + stats.underReview}</div>
              <div className="text-sm text-blue-700">In Progress</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.needingRevision}</div>
              <div className="text-sm text-orange-700">Needs Attention</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;
