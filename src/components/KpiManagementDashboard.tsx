
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAllKpis } from '@/hooks/useSupabaseData';
import { useOptimizedKpiManagement } from '@/hooks/useOptimizedKpiManagement';
import { useOrganizations } from '@/hooks/useOrganizations';
import { Plus, Search, Filter, TrendingUp, TrendingDown, Minus, BarChart3, Target, Users, Activity } from 'lucide-react';
import KpiCreationModal from './KpiCreationModal';
import KpiBulkActions from './KpiBulkActions';
import KpiAnalyticsPanel from './KpiAnalyticsPanel';

const KpiManagementDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedKpis, setSelectedKpis] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: allKpis, isLoading: kpisLoading, error: kpisError } = useAllKpis();
  const { data: organizations, isLoading: organizationsLoading, error: organizationsError } = useOrganizations();
  const { kpiRequests, getRequestStats, isLoading: requestsLoading } = useOptimizedKpiManagement();

  const kpis = allKpis || [];
  const organizationsList = organizations || [];

  // Memoized filtering for performance
  const filteredKpis = useMemo(() => {
    return kpis.filter(kpi => {
      const organization = organizationsList.find(org => org.id === kpi.organization_id);
      const matchesSearch = kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           organization?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || kpi.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [kpis, organizationsList, searchTerm, selectedCategory]);

  // Memoized categories calculation
  const categories = useMemo(() => {
    return Array.from(new Set(kpis.map(kpi => kpi.category).filter(Boolean)));
  }, [kpis]);

  // Memoized analytics calculation
  const analytics = useMemo(() => {
    const totalKpis = kpis.length;
    const onTargetKpis = kpis.filter(kpi => Number(kpi.current_value) >= Number(kpi.target_value) * 0.9).length;
    const belowTargetKpis = kpis.filter(kpi => Number(kpi.current_value) < Number(kpi.target_value) * 0.7).length;
    const averagePerformance = totalKpis > 0 
      ? Math.round(kpis.reduce((acc, kpi) => acc + (Number(kpi.current_value) / Number(kpi.target_value)) * 100, 0) / totalKpis)
      : 0;

    return {
      totalKpis,
      onTargetKpis,
      belowTargetKpis,
      averagePerformance,
      organizationCount: organizationsList.length
    };
  }, [kpis, organizationsList]);

  const stats = getRequestStats();

  const handleKpiSelection = (kpiId: string, selected: boolean) => {
    if (selected) {
      setSelectedKpis(prev => [...prev, kpiId]);
    } else {
      setSelectedKpis(prev => prev.filter(id => id !== kpiId));
    }
  };

  const getPerformanceStatus = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return { status: 'excellent', color: 'bg-green-500' };
    if (percentage >= 90) return { status: 'good', color: 'bg-blue-500' };
    if (percentage >= 70) return { status: 'average', color: 'bg-yellow-500' };
    return { status: 'needs-improvement', color: 'bg-red-500' };
  };

  if (kpisLoading || organizationsLoading || requestsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-university-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading KPI data...</p>
        </div>
      </div>
    );
  }

  if (kpisError || organizationsError) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-600">Error loading data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-university-blue">KPI Management Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive KPI oversight and management</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create KPI
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="bulk-actions">Bulk Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{analytics.totalKpis}</div>
                    <div className="text-sm text-gray-600">Total KPIs</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">{analytics.onTargetKpis}</div>
                    <div className="text-sm text-gray-600">On Target</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="text-2xl font-bold">{analytics.belowTargetKpis}</div>
                    <div className="text-sm text-gray-600">Below Target</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">{analytics.averagePerformance}%</div>
                    <div className="text-sm text-gray-600">Avg Performance</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold">{analytics.organizationCount}</div>
                    <div className="text-sm text-gray-600">Organizations</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>KPI Performance Overview</CardTitle>
              <CardDescription>Quick overview of all KPIs across organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {kpis.slice(0, 10).map(kpi => {
                  const performance = (Number(kpi.current_value) / Number(kpi.target_value)) * 100;
                  const status = getPerformanceStatus(Number(kpi.current_value), Number(kpi.target_value));
                  const organization = organizationsList.find(org => org.id === kpi.organization_id);
                  
                  return (
                    <div key={kpi.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{kpi.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {organization?.short_name}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {Number(kpi.current_value).toLocaleString()} / {Number(kpi.target_value).toLocaleString()} {kpi.unit}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32">
                          <Progress value={Math.min(performance, 100)} className="h-2" />
                        </div>
                        <Badge className={`${status.color} text-white`}>
                          {Math.round(performance)}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search KPIs or centers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category!}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>KPI Management</CardTitle>
              <CardDescription>Manage and monitor all KPIs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredKpis.length > 0 ? filteredKpis.map(kpi => {
                  const performance = (Number(kpi.current_value) / Number(kpi.target_value)) * 100;
                  const status = getPerformanceStatus(Number(kpi.current_value), Number(kpi.target_value));
                  
                  return (
                    <div key={kpi.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedKpis.includes(kpi.id)}
                        onChange={(e) => handleKpiSelection(kpi.id, e.target.checked)}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{kpi.name}</span>
                          <Badge variant="outline">{kpi.centers?.short_name}</Badge>
                          {kpi.category && (
                            <Badge variant="secondary" className="text-xs">{kpi.category}</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          Current: {Number(kpi.current_value).toLocaleString()} | 
                          Target: {Number(kpi.target_value).toLocaleString()} {kpi.unit}
                        </div>
                        <div className="w-full mt-2">
                          <Progress value={Math.min(performance, 100)} className="h-1" />
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${status.color} text-white mb-2`}>
                          {Math.round(performance)}%
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {status.status.replace('-', ' ')}
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No KPIs found matching your criteria.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <KpiAnalyticsPanel kpis={kpis} centers={organizationsList} />
        </TabsContent>

        <TabsContent value="bulk-actions">
          <KpiBulkActions selectedKpis={selectedKpis} kpis={kpis} />
        </TabsContent>
      </Tabs>

      <KpiCreationModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
};

export default KpiManagementDashboard;
