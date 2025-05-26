import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Download, Mail, Calendar, Clock, Users, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportGeneratorProps {
  kpis: any[];
  centers: any[];
  requests: any[];
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ kpis, centers, requests }) => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState('');
  const [selectedCenters, setSelectedCenters] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [scheduleReport, setScheduleReport] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState('');

  const reportTypes = [
    { id: 'performance', name: 'Performance Report', description: 'Comprehensive KPI performance analysis' },
    { id: 'center-comparison', name: 'Center Comparison', description: 'Compare performance across centers' },
    { id: 'category-analysis', name: 'Category Analysis', description: 'Deep dive into specific KPI categories' },
    { id: 'trend-analysis', name: 'Trend Analysis', description: 'Historical performance trends' },
    { id: 'executive-summary', name: 'Executive Summary', description: 'High-level overview for leadership' },
    { id: 'detailed-audit', name: 'Detailed Audit', description: 'Complete audit trail and compliance report' }
  ];

  const categories = Array.from(new Set(kpis.map(kpi => kpi.category).filter(Boolean)));

  const handleCenterToggle = (centerId: string) => {
    setSelectedCenters(prev => 
      prev.includes(centerId) 
        ? prev.filter(id => id !== centerId)
        : [...prev, centerId]
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  const generateReport = async () => {
    if (!reportType || selectedCenters.length === 0) {
      toast({
        title: "Incomplete Selection",
        description: "Please select a report type and at least one center.",
        variant: "destructive"
      });
      return;
    }

    // Filter data based on selections
    const filteredKpis = kpis.filter(kpi => {
      const centerMatch = selectedCenters.includes(kpi.center_id);
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(kpi.category);
      return centerMatch && categoryMatch;
    });

    const filteredCenters = centers.filter(center => selectedCenters.includes(center.id));

    // Generate report data
    const reportData = {
      title: reportTitle || `${reportTypes.find(t => t.id === reportType)?.name} - ${new Date().toLocaleDateString()}`,
      type: reportType,
      generatedAt: new Date().toISOString(),
      timeframe,
      customNotes,
      centers: filteredCenters,
      kpis: filteredKpis,
      summary: {
        totalKpis: filteredKpis.length,
        centersIncluded: filteredCenters.length,
        avgPerformance: Math.round(filteredKpis.reduce((acc, kpi) => acc + (Number(kpi.current_value) / Number(kpi.target_value)) * 100, 0) / filteredKpis.length),
        onTargetKpis: filteredKpis.filter(kpi => Number(kpi.current_value) >= Number(kpi.target_value) * 0.9).length
      },
      includeCharts,
      includeRecommendations
    };

    // Create and download report
    const reportContent = generateReportContent(reportData);
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportData.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Report Generated",
      description: "Your report has been generated and downloaded successfully.",
    });

    if (scheduleReport && emailRecipients) {
      toast({
        title: "Report Scheduled",
        description: `Report will be sent to ${emailRecipients} according to the schedule.`,
      });
    }
  };

  const generateReportContent = (data: any) => {
    let content = `${data.title}\n`;
    content += `Generated: ${new Date(data.generatedAt).toLocaleString()}\n`;
    content += `Timeframe: ${data.timeframe}\n\n`;

    content += `EXECUTIVE SUMMARY\n`;
    content += `================\n`;
    content += `Total KPIs Analyzed: ${data.summary.totalKpis}\n`;
    content += `Centers Included: ${data.summary.centersIncluded}\n`;
    content += `Average Performance: ${data.summary.avgPerformance}%\n`;
    content += `KPIs On Target: ${data.summary.onTargetKpis} (${Math.round((data.summary.onTargetKpis / data.summary.totalKpis) * 100)}%)\n\n`;

    content += `CENTER DETAILS\n`;
    content += `==============\n`;
    data.centers.forEach((center: any) => {
      const centerKpis = data.kpis.filter((kpi: any) => kpi.center_id === center.id);
      const avgPerf = centerKpis.length > 0 
        ? Math.round(centerKpis.reduce((acc: number, kpi: any) => acc + (Number(kpi.current_value) / Number(kpi.target_value)) * 100, 0) / centerKpis.length)
        : 0;
      
      content += `${center.name} (${center.short_name})\n`;
      content += `  KPIs: ${centerKpis.length}\n`;
      content += `  Average Performance: ${avgPerf}%\n`;
      content += `  On Target: ${centerKpis.filter((kpi: any) => Number(kpi.current_value) >= Number(kpi.target_value) * 0.9).length}\n\n`;
    });

    content += `KPI DETAILS\n`;
    content += `===========\n`;
    data.kpis.forEach((kpi: any) => {
      const performance = Math.round((Number(kpi.current_value) / Number(kpi.target_value)) * 100);
      content += `${kpi.name} (${kpi.centers?.short_name || 'Unknown'})\n`;
      content += `  Current: ${Number(kpi.current_value).toLocaleString()} ${kpi.unit}\n`;
      content += `  Target: ${Number(kpi.target_value).toLocaleString()} ${kpi.unit}\n`;
      content += `  Performance: ${performance}%\n`;
      content += `  Category: ${kpi.category || 'Uncategorized'}\n\n`;
    });

    if (data.customNotes) {
      content += `ADDITIONAL NOTES\n`;
      content += `================\n`;
      content += `${data.customNotes}\n\n`;
    }

    if (data.includeRecommendations) {
      content += `RECOMMENDATIONS\n`;
      content += `===============\n`;
      content += `1. Focus on underperforming KPIs (< 70% of target)\n`;
      content += `2. Share best practices from high-performing centers\n`;
      content += `3. Review and adjust targets for consistently overperforming KPIs\n`;
      content += `4. Implement regular monitoring and review cycles\n\n`;
    }

    content += `Report generated by University Centers KPI Management System\n`;
    return content;
  };

  const getReportPreview = () => {
    if (!reportType || selectedCenters.length === 0) return null;

    const filteredKpis = kpis.filter(kpi => {
      const centerMatch = selectedCenters.includes(kpi.center_id);
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(kpi.category);
      return centerMatch && categoryMatch;
    });

    return {
      kpiCount: filteredKpis.length,
      centerCount: selectedCenters.length,
      avgPerformance: Math.round(filteredKpis.reduce((acc, kpi) => acc + (Number(kpi.current_value) / Number(kpi.target_value)) * 100, 0) / filteredKpis.length)
    };
  };

  const preview = getReportPreview();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-university-blue">Report Generator</h1>
        <p className="text-gray-600 mt-1">Create comprehensive performance reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
              <CardDescription>Configure your report settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-gray-500">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportTitle">Report Title (Optional)</Label>
                <Input
                  id="reportTitle"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Custom report title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Period</SelectItem>
                    <SelectItem value="q1-2025">Q1 2025</SelectItem>
                    <SelectItem value="q4-2024">Q4 2024</SelectItem>
                    <SelectItem value="2024">Year 2024</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Centers to Include</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {centers.map(center => (
                    <div key={center.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={center.id}
                        checked={selectedCenters.includes(center.id)}
                        onCheckedChange={() => handleCenterToggle(center.id)}
                      />
                      <Label htmlFor={center.id} className="text-sm">
                        {center.short_name} - {center.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {categories.length > 0 && (
                <div className="space-y-3">
                  <Label>Categories to Include (Optional)</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox 
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryToggle(category)}
                        />
                        <Label htmlFor={category} className="text-sm">{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="customNotes">Additional Notes</Label>
                <Textarea
                  id="customNotes"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Add any custom notes or context for this report..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeCharts"
                  checked={includeCharts}
                  onCheckedChange={(checked) => setIncludeCharts(checked === true)}
                />
                <Label htmlFor="includeCharts">Include charts and visualizations</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeRecommendations"
                  checked={includeRecommendations}
                  onCheckedChange={(checked) => setIncludeRecommendations(checked === true)}
                />
                <Label htmlFor="includeRecommendations">Include recommendations</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="scheduleReport"
                  checked={scheduleReport}
                  onCheckedChange={(checked) => setScheduleReport(checked === true)}
                />
                <Label htmlFor="scheduleReport">Schedule recurring reports</Label>
              </div>

              {scheduleReport && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="emailRecipients">Email Recipients</Label>
                  <Input
                    id="emailRecipients"
                    value={emailRecipients}
                    onChange={(e) => setEmailRecipients(e.target.value)}
                    placeholder="email1@example.com, email2@example.com"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <CardDescription>Preview of your report configuration</CardDescription>
            </CardHeader>
            <CardContent>
              {preview ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">
                      {reportTypes.find(t => t.id === reportType)?.name}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">KPIs:</span>
                      <Badge variant="outline">{preview.kpiCount}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Centers:</span>
                      <Badge variant="outline">{preview.centerCount}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Performance:</span>
                      <Badge variant="outline">{preview.avgPerformance}%</Badge>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button onClick={generateReport} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select report type and centers to see preview</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Total KPIs: {kpis.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Active Centers: {centers.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">Pending Requests: {requests?.filter(r => ['submitted', 'under-review'].includes(r.status)).length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
