
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DynamicReportForm from '@/components/DynamicReportForm';
import { ArrowLeft } from 'lucide-react';

const ReportSubmission: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<'monthly' | 'quarterly' | 'annual' | 'kpi-update' | null>(null);

  const handleReportTypeSelect = (type: 'monthly' | 'quarterly' | 'annual' | 'kpi-update') => {
    setSelectedReportType(type);
  };

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data);
    // Handle form submission based on report type
  };

  const handleSaveDraft = (data: any) => {
    console.log('Draft saved:', data);
    // Handle draft saving
  };

  const resetSelection = () => {
    setSelectedReportType(null);
  };

  if (selectedReportType) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={resetSelection}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Report Types
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-university-blue">
              {selectedReportType === 'monthly' && 'Monthly Report'}
              {selectedReportType === 'quarterly' && 'Quarterly Report'}
              {selectedReportType === 'annual' && 'Annual Report'}
              {selectedReportType === 'kpi-update' && 'KPI Update Request'}
            </h1>
            <p className="text-gray-600 mt-1">
              {selectedReportType === 'kpi-update' 
                ? 'Submit KPI updates for evaluator approval'
                : `Complete your ${selectedReportType} report`
              }
            </p>
          </div>
        </div>
        
        <DynamicReportForm
          reportType={selectedReportType}
          onSubmit={handleFormSubmit}
          onSaveDraft={handleSaveDraft}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-university-blue">Submit Center Report</h1>
        <p className="text-gray-600 mt-1">Select the type of report you want to submit</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-university-blue"
          onClick={() => handleReportTypeSelect('monthly')}
        >
          <CardHeader>
            <CardTitle className="text-university-blue">Monthly Report</CardTitle>
            <CardDescription>
              Regular operational updates and monthly performance tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• KPI performance updates</li>
              <li>• Operational metrics</li>
              <li>• Budget utilization</li>
              <li>• Staff activities</li>
              <li>• Challenges and action items</li>
            </ul>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-university-blue"
          onClick={() => handleReportTypeSelect('quarterly')}
        >
          <CardHeader>
            <CardTitle className="text-university-blue">Quarterly Report</CardTitle>
            <CardDescription>
              Comprehensive performance review and strategic updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Quarterly KPI analysis</li>
              <li>• Strategic initiative progress</li>
              <li>• Financial summary</li>
              <li>• Research outputs</li>
              <li>• Stakeholder engagement</li>
            </ul>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-university-blue"
          onClick={() => handleReportTypeSelect('annual')}
        >
          <CardHeader>
            <CardTitle className="text-university-blue">Annual Report</CardTitle>
            <CardDescription>
              Comprehensive yearly assessment and strategic planning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Annual KPI performance</li>
              <li>• Impact assessment</li>
              <li>• Financial annual report</li>
              <li>• Strategic planning</li>
              <li>• Long-term outlook</li>
            </ul>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-university-orange"
          onClick={() => handleReportTypeSelect('kpi-update')}
        >
          <CardHeader>
            <CardTitle className="text-university-orange">KPI Update Request</CardTitle>
            <CardDescription>
              Submit KPI updates for evaluator approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Update KPI values</li>
              <li>• Request target adjustments</li>
              <li>• Provide justification</li>
              <li>• Requires evaluator approval</li>
              <li>• Quick submission process</li>
            </ul>
            <div className="mt-3 p-2 bg-orange-50 rounded-md">
              <div className="text-xs text-orange-800 font-medium">
                ⚠️ Requires Approval - All KPI updates must be reviewed and approved by evaluators
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportSubmission;
