
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { toast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { CheckCircle, XCircle, Clock, FileText, Calendar, User } from 'lucide-react';

const ReportReview: React.FC = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  
  const form = useForm({
    defaultValues: {
      comments: '',
      feedback: ''
    }
  });

  // Mock report data - in real app would fetch from API
  const reportData = {
    id: reportId,
    title: 'Q4 2024 Performance Report',
    centerName: 'Business Analytics and Insights Center',
    submittedBy: 'Dr. Ahmet Yılmaz',
    submittedDate: '2024-12-15',
    status: 'pending',
    content: {
      summary: 'This quarter showed significant improvement in research output and industry partnerships.',
      kpiUpdates: [
        { name: 'Research Publications', value: 24, target: 30, status: 'on-track' },
        { name: 'Industry Partnerships', value: 8, target: 10, status: 'behind' },
        { name: 'Student Engagement', value: 450, target: 500, status: 'on-track' }
      ],
      achievements: [
        'Successfully launched new AI research initiative',
        'Secured 3 new industry partnerships',
        'Published 8 peer-reviewed papers'
      ],
      challenges: [
        'Recruitment delays for senior researcher positions',
        'Budget constraints for equipment upgrades'
      ]
    }
  };

  const handleReview = (action: 'approve' | 'reject' | 'request-revision') => {
    const data = form.getValues();
    console.log(`${action} report with feedback:`, data);
    
    toast({
      title: `Report ${action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : 'Revision Requested'}`,
      description: `The report has been ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'sent back for revision'}.`,
    });
    
    navigate('/reports');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'behind': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-university-blue">Report Review</h1>
          <p className="text-gray-600 mt-1">Review and provide feedback on submitted reports</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/reports')}>
          Back to Reports
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {reportData.title}
                  </CardTitle>
                  <CardDescription>{reportData.centerName}</CardDescription>
                </div>
                <Badge variant={reportData.status === 'pending' ? 'secondary' : 'default'}>
                  {reportData.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {reportData.submittedBy}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {reportData.submittedDate}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Executive Summary</h3>
                <p className="text-gray-700">{reportData.content.summary}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">KPI Performance</h3>
                <div className="space-y-2">
                  {reportData.content.kpiUpdates.map((kpi, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(kpi.status)}
                        <span className="font-medium">{kpi.name}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {kpi.value} / {kpi.target}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Key Achievements</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {reportData.content.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Challenges & Issues</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {reportData.content.challenges.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Actions</CardTitle>
              <CardDescription>Provide feedback and take action on this report</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Review Comments</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your review comments..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="feedback"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Feedback for Improvement</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Suggestions for improvement..."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handleReview('approve')}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Approve Report
                    </Button>
                    <Button 
                      onClick={() => handleReview('request-revision')}
                      variant="outline"
                      className="w-full"
                    >
                      Request Revision
                    </Button>
                    <Button 
                      onClick={() => handleReview('reject')}
                      variant="destructive"
                      className="w-full"
                    >
                      Reject Report
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportReview;
