
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from "@/hooks/use-toast";
import { ReportTemplate, FormField as FormFieldType } from '@/types/approval';

interface DynamicReportFormProps {
  reportType: 'monthly' | 'quarterly' | 'annual' | 'kpi-update';
  onSubmit: (data: any) => void;
  onSaveDraft: (data: any) => void;
}

const DynamicReportForm: React.FC<DynamicReportFormProps> = ({ reportType, onSubmit, onSaveDraft }) => {
  const form = useForm();
  
  const getReportTemplate = (type: string): ReportTemplate => {
    const templates: Record<string, ReportTemplate> = {
      'monthly': {
        reportType: 'monthly',
        fields: [
          { name: 'period', label: 'Reporting Period', type: 'text', required: true, placeholder: 'e.g., May 2025' },
          { name: 'summary', label: 'Monthly Summary', type: 'textarea', required: true, placeholder: 'Brief summary of this month\'s activities...' },
          { name: 'kpiUpdates', label: 'KPI Performance Updates', type: 'textarea', required: true, placeholder: 'Current month KPI performance vs targets...' },
          { name: 'operationalMetrics', label: 'Operational Metrics', type: 'textarea', required: true, placeholder: 'Events held, publications, outreach activities...' },
          { name: 'budgetUtilization', label: 'Budget Utilization', type: 'currency', required: true, placeholder: 'Monthly budget usage...' },
          { name: 'staffActivities', label: 'Staff Activities & Achievements', type: 'textarea', required: true, placeholder: 'Key staff accomplishments this month...' },
          { name: 'challenges', label: 'Challenges & Action Items', type: 'textarea', required: true, placeholder: 'Current challenges and immediate actions needed...' },
          { name: 'supportingDocs', label: 'Supporting Documents', type: 'file', required: false }
        ],
        validationRules: []
      },
      'quarterly': {
        reportType: 'quarterly',
        fields: [
          { name: 'period', label: 'Quarter', type: 'select', required: true, options: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'] },
          { name: 'executiveSummary', label: 'Executive Summary', type: 'textarea', required: true, placeholder: 'Comprehensive quarterly overview...' },
          { name: 'kpiAnalysis', label: 'Quarterly KPI Analysis', type: 'textarea', required: true, placeholder: 'Detailed KPI performance with trend analysis...' },
          { name: 'strategicProgress', label: 'Strategic Initiative Progress', type: 'textarea', required: true, placeholder: 'Progress on strategic goals and initiatives...' },
          { name: 'financialSummary', label: 'Financial Summary', type: 'textarea', required: true, placeholder: 'Budget vs actual spending analysis...' },
          { name: 'researchOutputs', label: 'Research Outputs', type: 'textarea', required: true, placeholder: 'Publications, grants, collaborations...' },
          { name: 'stakeholderEngagement', label: 'Stakeholder Engagement', type: 'textarea', required: true, placeholder: 'Key stakeholder interactions and outcomes...' },
          { name: 'riskAssessment', label: 'Risk Assessment', type: 'textarea', required: true, placeholder: 'Identified risks and mitigation strategies...' },
          { name: 'nextQuarterPlanning', label: 'Next Quarter Objectives', type: 'textarea', required: true, placeholder: 'Planned activities and goals for next quarter...' }
        ],
        validationRules: []
      },
      'annual': {
        reportType: 'annual',
        fields: [
          { name: 'year', label: 'Year', type: 'select', required: true, options: ['2024', '2025', '2026'] },
          { name: 'executiveSummary', label: 'Executive Summary', type: 'textarea', required: true, placeholder: 'Comprehensive annual overview for stakeholders...' },
          { name: 'annualKpiPerformance', label: 'Annual KPI Performance', type: 'textarea', required: true, placeholder: 'Full year KPI analysis with historical comparison...' },
          { name: 'impactSummary', label: 'Annual Impact Summary', type: 'textarea', required: true, placeholder: 'Key achievements and impact on university goals...' },
          { name: 'financialReport', label: 'Financial Annual Report', type: 'textarea', required: true, placeholder: 'Complete financial performance analysis...' },
          { name: 'researchImpact', label: 'Research Impact Assessment', type: 'textarea', required: true, placeholder: 'Research outcomes and their broader impact...' },
          { name: 'strategicGoalsEvaluation', label: 'Strategic Goals Achievement', type: 'textarea', required: true, placeholder: 'Evaluation of strategic goal completion...' },
          { name: 'staffDevelopment', label: 'Staff Development Summary', type: 'textarea', required: true, placeholder: 'Team growth and capacity building initiatives...' },
          { name: 'partnerships', label: 'External Partnerships', type: 'textarea', required: true, placeholder: 'Key partnerships and collaborations established...' },
          { name: 'nextYearBudget', label: 'Next Year Budget Proposal', type: 'currency', required: true, placeholder: 'Proposed budget for next year...' },
          { name: 'strategicPlanning', label: 'Long-term Strategic Planning', type: 'textarea', required: true, placeholder: '3-5 year outlook and strategic direction...' },
          { name: 'publicEngagement', label: 'Media & Public Engagement', type: 'textarea', required: true, placeholder: 'Public outreach and media activities...' }
        ],
        validationRules: []
      },
      'kpi-update': {
        reportType: 'kpi-update',
        fields: [
          { name: 'kpiSelection', label: 'Select KPI', type: 'select', required: true, 
            options: ['Research Publications', 'Industry Partnerships', 'Student Engagement', 'Funding Secured', 'Social Impact Projects'] },
          { name: 'currentValue', label: 'Current Value', type: 'number', required: true, placeholder: 'Enter current KPI value...' },
          { name: 'proposedValue', label: 'Proposed New Value', type: 'number', required: false, placeholder: 'If updating current value...' },
          { name: 'targetAdjustment', label: 'Target Adjustment', type: 'number', required: false, placeholder: 'New target if adjustment needed...' },
          { name: 'measurementPeriod', label: 'Measurement Period', type: 'text', required: true, placeholder: 'e.g., May 2025, Q2 2025...' },
          { name: 'dataSource', label: 'Data Source Verification', type: 'text', required: true, placeholder: 'Source of the data and verification method...' },
          { name: 'justification', label: 'Justification for Changes', type: 'textarea', required: true, placeholder: 'Detailed explanation for any changes or updates...' },
          { name: 'supportingEvidence', label: 'Supporting Evidence', type: 'file', required: false },
          { name: 'relatedKpiImpact', label: 'Impact on Related KPIs', type: 'textarea', required: false, placeholder: 'How this change affects other KPIs...' },
          { name: 'nextMeasurement', label: 'Next Measurement Timeline', type: 'date', required: true }
        ],
        validationRules: []
      }
    };
    
    return templates[type] || templates['monthly'];
  };

  const template = getReportTemplate(reportType);
  const progress = Math.round((Object.keys(form.watch()).length / template.fields.length) * 100);

  const handleSubmit = (data: any) => {
    if (reportType === 'kpi-update') {
      // For KPI updates, mark as requiring approval
      toast({
        title: "KPI Update Submitted",
        description: "Your KPI update has been submitted for evaluator approval.",
      });
    } else {
      toast({
        title: "Report Submitted",
        description: "Your report has been successfully submitted.",
      });
    }
    onSubmit(data);
  };

  const handleSaveDraft = () => {
    const data = form.getValues();
    onSaveDraft(data);
    toast({
      title: "Draft Saved",
      description: "Your progress has been saved as a draft.",
    });
  };

  const renderField = (field: FormFieldType) => {
    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name}
        render={({ field: fieldData }) => (
          <FormItem>
            <FormLabel>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            <FormControl>
              {field.type === 'textarea' && (
                <Textarea
                  placeholder={field.placeholder}
                  className="min-h-24"
                  {...fieldData}
                />
              )}
              {field.type === 'text' && (
                <Input
                  placeholder={field.placeholder}
                  {...fieldData}
                />
              )}
              {field.type === 'number' && (
                <Input
                  type="number"
                  placeholder={field.placeholder}
                  {...fieldData}
                />
              )}
              {field.type === 'currency' && (
                <Input
                  type="number"
                  placeholder={field.placeholder}
                  {...fieldData}
                />
              )}
              {field.type === 'date' && (
                <Input
                  type="date"
                  {...fieldData}
                />
              )}
              {field.type === 'select' && field.options && (
                <Select onValueChange={fieldData.onChange} defaultValue={fieldData.value}>
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {field.type === 'file' && (
                <Input
                  type="file"
                  multiple
                  onChange={(e) => fieldData.onChange(e.target.files)}
                />
              )}
            </FormControl>
            {field.placeholder && field.type !== 'select' && (
              <FormDescription>{field.placeholder}</FormDescription>
            )}
          </FormItem>
        )}
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {reportType === 'monthly' && 'Monthly Report'}
              {reportType === 'quarterly' && 'Quarterly Report'}
              {reportType === 'annual' && 'Annual Report'}
              {reportType === 'kpi-update' && 'KPI Update Request'}
            </CardTitle>
            <CardDescription>
              {reportType === 'kpi-update' 
                ? 'Submit KPI updates for evaluator approval'
                : `Complete your ${reportType} report with all required information`
              }
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Progress</div>
            <Progress value={progress} className="w-24 h-2" />
            <div className="text-xs text-gray-400">{progress}%</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {template.fields.map(renderField)}
            </div>
            
            <div className="flex justify-between pt-6 border-t">
              <Button type="button" variant="outline" onClick={handleSaveDraft}>
                Save Draft
              </Button>
              <div className="space-x-2">
                <Button type="button" variant="outline">Preview</Button>
                <Button type="submit">
                  {reportType === 'kpi-update' ? 'Submit for Approval' : 'Submit Report'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DynamicReportForm;
