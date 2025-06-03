import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Search, Plus, Download, Upload, Trash2, Edit, BarChart3, Target, TrendingUp } from 'lucide-react';
import { useAllKpis, useUpdateKpi } from '@/hooks/useSupabaseData';
import { useOrganizations } from '@/hooks/useOrganizations';
import KpiCreationForm from './KpiCreationForm';
import { toast } from '@/hooks/use-toast';

const EnhancedKpiManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOrganization, setSelectedOrganization] = useState('all');
  const [selectedKpis, setSelectedKpis] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState<any>(null);

  const { data: kpis = [], isLoading: kpisLoading, refetch } = useAllKpis();
  const { data: organizations = [] } = useOrganizations();
  const updateKpi = useUpdateKpi();

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(kpis.map(kpi => kpi.category).filter(Boolean)));
    return uniqueCategories.sort();
  }, [kpis]);

  const filteredKpis = useMemo(() => {
    return kpis.filter(kpi => {
      const organization = organizations.find(org => org.id === kpi.organization_id);
      const matchesSearch = kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          organization?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || kpi.category === selectedCategory;
      const matchesOrganization = selectedOrganization === 'all' || kpi.organization_id === selectedOrganization;
      
      return matchesSearch && matchesCategory && matchesOrganization;
    });
  }, [kpis, organizations, searchTerm, selectedCategory, selectedOrganization]);

  const getPerformanceScore = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const getPerformanceStatus = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-green-500' };
    if (score >= 75) return { label: 'Good', color: 'bg-blue-500' };
    if (score >= 60) return { label: 'Average', color: 'bg-yellow-500' };
    return { label: 'Needs Improvement', color: 'bg-red-500' };
  };

  const handleSelectKpi = (kpiId: string, checked: boolean) => {
    setSelectedKpis(prev => 
      checked 
        ? [...prev, kpiId]
        : prev.filter(id => id !== kpiId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedKpis(checked ? filteredKpis.map(kpi => kpi.id) : []);
  };

  const handleBulkDelete = async () => {
    try {
      // In a real implementation, you'd call a bulk delete API
      toast({
        title: "Bulk Delete",
        description: `${selectedKpis.length} KPIs would be deleted. (Demo mode)`,
      });
      setSelectedKpis([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete KPIs",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const exportData = filteredKpis.map(kpi => {
      const organization = organizations.find(org => org.id === kpi.organization_id);
      return {
        Name: kpi.name,
        Organization: organization?.name || '',
        Category: kpi.category,
        'Current Value': kpi.current_value,
        'Target Value': kpi.target_value,
        Unit: kpi.unit || '',
        'Performance %': Math.round(getPerformanceScore(kpi.current_value, kpi.target_value))
      };
    });

    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kpis-export.csv';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "KPI data exported successfully",
    });
  };

  const stats = useMemo(() => {
    const total = filteredKpis.length;
    const onTarget = filteredKpis.filter(kpi => getPerformanceScore(kpi.current_value, kpi.target_value) >= 90).length;
    const avgPerformance = total > 0 
      ? filteredKpis.reduce((sum, kpi) => sum + getPerformanceScore(kpi.current_value, kpi.target_value), 0) / total
      : 0;
    
    return { total, onTarget, avgPerformance: Math.round(avgPerformance) };
  }, [filteredKpis]);

  if (kpisLoading) {
    return <div>Loading KPIs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-university-blue">KPI Management</h2>
          <p className="text-gray-600">Manage and monitor key performance indicators</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create KPI
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New KPI</DialogTitle>
            </DialogHeader>
            <KpiCreationForm 
              onSuccess={() => {
                setIsCreateDialogOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-gray-600">Total KPIs</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{stats.onTarget}</div>
                <div className="text-sm text-gray-600">On Target</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{stats.avgPerformance}%</div>
                <div className="text-sm text-gray-600">Avg Performance</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Filters and Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search KPIs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
              <SelectTrigger>
                <SelectValue placeholder="All Organizations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map(organization => (
                  <SelectItem key={organization.id} value={organization.id}>
                    {organization.short_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {selectedKpis.length > 0 && (
            <div className="flex gap-2 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">{selectedKpis.length} KPIs selected</span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Selected
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedKpis.length} KPIs? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* KPI List */}
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>KPI List ({filteredKpis.length})</CardTitle>
            <Checkbox
              checked={selectedKpis.length === filteredKpis.length && filteredKpis.length > 0}
              onCheckedChange={handleSelectAll}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredKpis.map((kpi) => {
              const score = getPerformanceScore(kpi.current_value, kpi.target_value);
              const status = getPerformanceStatus(score);
              const organization = organizations.find(org => org.id === kpi.organization_id);
              
              return (
                <div key={kpi.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedKpis.includes(kpi.id)}
                      onCheckedChange={(checked) => handleSelectKpi(kpi.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{kpi.name}</h4>
                          <p className="text-sm text-gray-600">
                            {organization?.name} • {kpi.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={status.color + ' text-white'}>
                            {status.label}
                          </Badge>
                          <Button variant="outline" size="sm" onClick={() => setEditingKpi(kpi)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-2">
                        <div>
                          <div className="text-sm text-gray-500">Current</div>
                          <div className="font-medium">{kpi.current_value} {kpi.unit}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Target</div>
                          <div className="font-medium">{kpi.target_value} {kpi.unit}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Performance</div>
                          <div className="font-medium">{Math.round(score)}%</div>
                        </div>
                      </div>
                      <Progress value={score} className="h-2" />
                      {kpi.why_it_matters && (
                        <p className="text-xs text-gray-500 mt-2">{kpi.why_it_matters}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingKpi && (
        <Dialog open={!!editingKpi} onOpenChange={() => setEditingKpi(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit KPI</DialogTitle>
            </DialogHeader>
            <KpiCreationForm
              initialData={editingKpi}
              isEditing={true}
              kpiId={editingKpi.id}
              onSuccess={() => {
                setEditingKpi(null);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EnhancedKpiManagement;
