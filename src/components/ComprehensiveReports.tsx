import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, Calendar as CalendarIcon, Filter, TrendingUp, Users, Target, Award } from 'lucide-react';
import { useKpiManagement } from '@/hooks/useKpiManagement';
import { useKpiWorkflow } from '@/hooks/useKpiWorkflow';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ReportConfig {
  type: 'performance' | 'workflow' | 'center' | 'custom';
  period: 'week' | 'month' | 'quarter' | 'year';
  format: 'pdf' | 'excel' | 'csv';
  filters: {
    centers?: string[];
    status?: string[];
    dateRange?: { start: Date; end: Date };
  };
}

const ComprehensiveReports: React.FC = () => {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: 'performance',
    period: 'month',
    format: 'pdf',
    filters: {}
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});

  const { kpiRequests, getRequestStats } = useKpiManagement();
  const { workflowHistory } = useKpiWorkflow();

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would call an API to generate the report
    console.log('Generating report with config:', reportConfig);
    
    setIsGenerating(false);
  };

  const getPerformanceData = () => {
    const centerPerformance = kpiRequests.reduce((acc, request) => {
      const centerId = request.centerId;
      if (!acc[centerId]) {
        acc[centerId] = {
          centerName: request.centerName,
          total: 0,
          approved: 0,
          rejected: 0,
          pending: 0
        };
      }
      
      acc[centerId].total++;
      if (request.status === 'approved') acc[centerId].approved++;
      if (request.status === 'rejected') acc[centerId].rejected++;
      if (['submitted', 'under-review', 'resubmitted'].includes(request.status)) {
        acc[centerId].pending++;
      }
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(centerPerformance);
  };

  const getWorkflowData = () => {
    const actionCounts = workflowHistory.reduce((acc, item) => {
      acc[item.action] = (acc[item.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4'];
    
    return Object.entries(actionCounts).map(([action, count], index) => ({
      name: action.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: count,
      fill: colors[index % colors.length]
    }));
  };

  const performanceData = getPerformanceData();
  const workflowData = getWorkflowData();
  const stats = getRequestStats();

  const reportTypes = [
    { value: 'performance', label: 'Performance Report', icon: TrendingUp },
    { value: 'workflow', label: 'Workflow Analysis', icon: FileText },
    { value: 'center', label: 'Center Comparison', icon: Users },
    { value: 'custom', label: 'Custom Report', icon: Target }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-university-blue">Comprehensive Reports</h2>
        <p className="text-gray-600">Generate detailed reports and analytics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>Configure your report parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select 
                value={reportConfig.type} 
                onValueChange={(value: any) => setReportConfig({...reportConfig, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Period</label>
              <Select 
                value={reportConfig.period} 
                onValueChange={(value: any) => setReportConfig({...reportConfig, period: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select 
                value={reportConfig.format} 
                onValueChange={(value: any) => setReportConfig({...reportConfig, format: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Action</label>
              <Button 
                onClick={generateReport}
                disabled={isGenerating}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </div>

          {reportConfig.type === 'custom' && (
            <div className="mt-4 p-4 border rounded-lg space-y-4">
              <h4 className="font-medium">Custom Filters</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange.start && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.start ? format(dateRange.start, "PPP") : <span>Pick start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.start}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange.end && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.end ? format(dateRange.end, "PPP") : <span>Pick end date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.end}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Center performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="centerName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="approved" fill="#10b981" name="Approved" />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                  <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workflow Distribution</CardTitle>
            <CardDescription>Breakdown of workflow actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workflowData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {workflowData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
          <CardDescription>Key performance indicators summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
          <CardDescription>Manage automated report generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Weekly Performance Summary', schedule: 'Every Monday at 9:00 AM', status: 'active' },
              { name: 'Monthly Center Comparison', schedule: 'First day of month at 8:00 AM', status: 'active' },
              { name: 'Quarterly Executive Report', schedule: 'First day of quarter at 10:00 AM', status: 'paused' }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{report.name}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    {report.schedule}
                  </div>
                </div>
                <Badge variant={report.status === 'active' ? 'default' : 'secondary'}>
                  {report.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveReports;
