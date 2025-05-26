
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Trash2, Target, FileText, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface KpiBulkActionsProps {
  selectedKpis: string[];
  kpis: any[];
}

const KpiBulkActions: React.FC<KpiBulkActionsProps> = ({ selectedKpis, kpis }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkValue, setBulkValue] = useState('');
  const [bulkPercentage, setBulkPercentage] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [reportNotes, setReportNotes] = useState('');

  const selectedKpiData = kpis.filter(kpi => selectedKpis.includes(kpi.id));

  const handleBulkUpdate = async (action: string) => {
    if (selectedKpis.length === 0) {
      toast({
        title: "No KPIs Selected",
        description: "Please select KPIs to perform bulk actions.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let updates: any = {};

      switch (action) {
        case 'update-targets':
          if (!bulkValue) {
            toast({
              title: "Missing Value",
              description: "Please enter a target value.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          updates.target_value = Number(bulkValue);
          break;

        case 'update-current':
          if (!bulkValue) {
            toast({
              title: "Missing Value",
              description: "Please enter a current value.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          updates.current_value = Number(bulkValue);
          break;

        case 'adjust-targets':
          if (!bulkPercentage) {
            toast({
              title: "Missing Percentage",
              description: "Please enter a percentage adjustment.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          // This would need individual updates based on current targets
          for (const kpiId of selectedKpis) {
            const kpi = kpis.find(k => k.id === kpiId);
            if (kpi) {
              const adjustment = 1 + (Number(bulkPercentage) / 100);
              const newTarget = Number(kpi.target_value) * adjustment;
              await supabase
                .from('kpis')
                .update({ target_value: newTarget })
                .eq('id', kpiId);
            }
          }
          
          toast({
            title: "Targets Updated",
            description: `Updated targets for ${selectedKpis.length} KPIs by ${bulkPercentage}%.`,
          });
          setLoading(false);
          return;
      }

      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from('kpis')
          .update(updates)
          .in('id', selectedKpis);

        if (error) throw error;

        toast({
          title: "KPIs Updated",
          description: `Successfully updated ${selectedKpis.length} KPIs.`,
        });
      }
    } catch (error) {
      console.error('Error updating KPIs:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update KPIs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setBulkValue('');
      setBulkPercentage('');
    }
  };

  const generateReport = () => {
    if (selectedKpis.length === 0) {
      toast({
        title: "No KPIs Selected",
        description: "Please select KPIs to generate a report.",
        variant: "destructive",
      });
      return;
    }

    const reportData = selectedKpiData.map(kpi => ({
      name: kpi.name,
      center: kpi.centers?.short_name || 'Unknown',
      current: Number(kpi.current_value),
      target: Number(kpi.target_value),
      performance: Math.round((Number(kpi.current_value) / Number(kpi.target_value)) * 100),
      category: kpi.category || 'Uncategorized'
    }));

    const csvContent = [
      ['KPI Name', 'Center', 'Current Value', 'Target Value', 'Performance %', 'Category'],
      ...reportData.map(row => [
        row.name,
        row.center,
        row.current.toString(),
        row.target.toString(),
        row.performance.toString(),
        row.category
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kpi-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Report Generated",
      description: "KPI report has been downloaded as CSV.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Actions</CardTitle>
          <CardDescription>
            Perform actions on multiple KPIs at once. {selectedKpis.length} KPIs selected.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedKpis.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No KPIs Selected</h3>
              <p className="text-gray-600">Select KPIs from the Management tab to perform bulk actions</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <h4 className="font-semibold">Selected KPIs:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedKpiData.slice(0, 10).map(kpi => (
                    <Badge key={kpi.id} variant="outline">
                      {kpi.name} ({kpi.centers?.short_name})
                    </Badge>
                  ))}
                  {selectedKpiData.length > 10 && (
                    <Badge variant="secondary">+{selectedKpiData.length - 10} more</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Update Operations</h4>
                  
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="New target value"
                        value={bulkValue}
                        onChange={(e) => setBulkValue(e.target.value)}
                      />
                      <Button 
                        onClick={() => handleBulkUpdate('update-targets')}
                        disabled={loading}
                        variant="outline"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Update Targets
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="New current value"
                        value={bulkValue}
                        onChange={(e) => setBulkValue(e.target.value)}
                      />
                      <Button 
                        onClick={() => handleBulkUpdate('update-current')}
                        disabled={loading}
                        variant="outline"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Update Current
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Adjustment %"
                        value={bulkPercentage}
                        onChange={(e) => setBulkPercentage(e.target.value)}
                      />
                      <Button 
                        onClick={() => handleBulkUpdate('adjust-targets')}
                        disabled={loading}
                        variant="outline"
                      >
                        Adjust Targets
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Report Generation</h4>
                  
                  <Button 
                    onClick={generateReport}
                    className="w-full"
                    variant="outline"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export to CSV
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="outline">
                        <Send className="w-4 h-4 mr-2" />
                        Generate Custom Report
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Generate Custom Report</DialogTitle>
                        <DialogDescription>
                          Create a detailed report for the selected KPIs
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reportTitle">Report Title</Label>
                          <Input
                            id="reportTitle"
                            value={reportTitle}
                            onChange={(e) => setReportTitle(e.target.value)}
                            placeholder="Q4 2024 KPI Performance Report"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reportNotes">Additional Notes</Label>
                          <Textarea
                            id="reportNotes"
                            value={reportNotes}
                            onChange={(e) => setReportNotes(e.target.value)}
                            placeholder="Add any additional context or notes for this report..."
                            rows={3}
                          />
                        </div>
                        <Button onClick={generateReport} className="w-full">
                          Generate Report
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {selectedKpis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected KPIs Summary</CardTitle>
            <CardDescription>Overview of selected KPIs performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{selectedKpis.length}</div>
                <div className="text-sm text-blue-600">Selected KPIs</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {selectedKpiData.filter(kpi => 
                    (Number(kpi.current_value) / Number(kpi.target_value)) >= 1
                  ).length}
                </div>
                <div className="text-sm text-green-600">At/Above Target</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {selectedKpiData.filter(kpi => {
                    const ratio = Number(kpi.current_value) / Number(kpi.target_value);
                    return ratio >= 0.7 && ratio < 1;
                  }).length}
                </div>
                <div className="text-sm text-yellow-600">Near Target</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {selectedKpiData.filter(kpi => 
                    (Number(kpi.current_value) / Number(kpi.target_value)) < 0.7
                  ).length}
                </div>
                <div className="text-sm text-red-600">Below Target</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KpiBulkActions;
