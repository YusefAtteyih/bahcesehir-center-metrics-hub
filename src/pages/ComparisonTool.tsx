
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Plus, X, Download, Search, Filter } from 'lucide-react';
import { useCenters, useDepartments } from '@/hooks/useSupabaseData';
import { Badge } from '@/components/ui/badge';

const ComparisonTool: React.FC = () => {
  const [selectedCenters, setSelectedCenters] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showDetailedView, setShowDetailedView] = useState(false);

  const { data: departments = [] } = useDepartments();
  const { data: centers = [] } = useCenters(selectedDepartment === 'all' ? undefined : selectedDepartment);
  
  // Enhanced comparison metrics with more detail
  const comparisonMetrics = [
    { 
      name: "Research Output", 
      description: "Published papers and research activities",
      weight: 0.25,
      subcategories: ["Publications", "Citations", "Research Grants"]
    },
    { 
      name: "Student Engagement", 
      description: "Student participation in center activities",
      weight: 0.20,
      subcategories: ["Event Attendance", "Project Participation", "Satisfaction Score"]
    },
    { 
      name: "Industry Partnerships", 
      description: "Active collaborations with industry",
      weight: 0.20,
      subcategories: ["Active Partnerships", "Joint Projects", "Funding Secured"]
    },
    { 
      name: "Funding Efficiency", 
      description: "Ratio of outputs to funding received",
      weight: 0.15,
      subcategories: ["Budget Utilization", "ROI", "Cost per Output"]
    },
    { 
      name: "Social Impact", 
      description: "Measurable impact on society",
      weight: 0.20,
      subcategories: ["Community Projects", "Public Engagement", "Policy Influence"]
    }
  ];

  const availableCenters = centers.filter(center =>
    !selectedCenters.find(selected => selected.id === center.id) &&
    (searchTerm === '' || center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     center.short_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (categoryFilter === 'all' || center.category === categoryFilter)
  );

  const addCenter = (center: any) => {
    if (selectedCenters.length < 5) {
      setSelectedCenters([...selectedCenters, center]);
    }
  };

  const removeCenter = (centerId: string) => {
    setSelectedCenters(selectedCenters.filter(center => center.id !== centerId));
  };

  const generateScoreForCenter = (centerIndex: number, metricIndex: number) => {
    // Generate consistent scores based on center and metric
    const seed = (centerIndex + 1) * (metricIndex + 1) * 17;
    return 60 + (seed % 40);
  };

  const getOverallScore = (centerIndex: number) => {
    return Math.round(comparisonMetrics.reduce((acc, metric, metricIndex) => 
      acc + generateScoreForCenter(centerIndex, metricIndex) * metric.weight, 0
    ));
  };

  const exportComparison = () => {
    // Simulate export functionality
    const data = selectedCenters.map((center, centerIndex) => ({
      center: center.short_name,
      overall: getOverallScore(centerIndex),
      ...comparisonMetrics.reduce((acc, metric, metricIndex) => ({
        ...acc,
        [metric.name]: generateScoreForCenter(centerIndex, metricIndex)
      }), {})
    }));
    
    console.log('Exporting comparison data:', data);
    // In real implementation, this would generate and download a file
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    if (score >= 55) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const categories = [...new Set(centers.map(c => c.category).filter(Boolean))];

  React.useEffect(() => {
    if (selectedCenters.length === 0 && centers.length > 0) {
      setSelectedCenters(centers.slice(0, 3));
    }
  }, [centers]);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-university-blue">Center Comparison Tool</h1>
        <p className="text-gray-600 mt-1">Compare performance metrics across multiple centers with detailed analytics</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Selected Centers ({selectedCenters.length}/5)</CardTitle>
                <CardDescription>Centers included in the comparison</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDetailedView(!showDetailedView)}
                  size="sm"
                >
                  {showDetailedView ? 'Simple View' : 'Detailed View'}
                </Button>
                <Button onClick={exportComparison} size="sm" className="flex items-center gap-2">
                  <Download size={16} />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 mb-6">
              {selectedCenters.map((center, centerIndex) => (
                <div key={center.id} className="border rounded-md px-3 py-2 flex items-center gap-2 bg-gray-50">
                  <div className="w-3 h-3 rounded-full bg-university-blue"></div>
                  <span className="font-medium">{center.short_name}</span>
                  <Badge className={getScoreColor(getOverallScore(centerIndex))}>
                    {getOverallScore(centerIndex)}%
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 rounded-full hover:bg-red-100"
                    onClick={() => removeCenter(center.id)}
                  >
                    <X size={12} />
                  </Button>
                </div>
              ))}
            </div>
            
            {selectedCenters.length > 0 && (
              <div className="space-y-6">
                {comparisonMetrics.map((metric, metricIndex) => (
                  <div key={metricIndex} className="space-y-4">
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{metric.name}</h3>
                          <p className="text-sm text-gray-500">{metric.description}</p>
                        </div>
                        <Badge variant="outline">Weight: {(metric.weight * 100).toFixed(0)}%</Badge>
                      </div>
                      {showDetailedView && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-400">
                            Includes: {metric.subcategories.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {selectedCenters.map((center, centerIndex) => {
                        const score = generateScoreForCenter(centerIndex, metricIndex);
                        return (
                          <div key={`${center.id}-${metricIndex}`} className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">{center.short_name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">{score}/100</span>
                                {score > 80 && (
                                  <span className="text-green-600 inline-flex items-center">
                                    <Check size={14} />
                                  </span>
                                )}
                              </div>
                            </div>
                            <Progress value={score} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus size={18} />
              Add Centers
            </CardTitle>
            <CardDescription>Search and add centers to compare</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search centers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedDepartment} onValueChange={(val) => { setSelectedDepartment(val); setSelectedCenters([]); }}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter size={16} />
                    <SelectValue placeholder="Filter by department" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.short_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter size={16} />
                    <SelectValue placeholder="Filter by category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category!}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableCenters.map(center => (
                <div 
                  key={center.id} 
                  className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => addCenter(center)}
                >
                  <div>
                    <div className="font-medium text-sm">{center.short_name}</div>
                    <div className="text-xs text-gray-500">{center.name}</div>
                    {center.category && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {center.category}
                      </Badge>
                    )}
                  </div>
                  <Button size="sm" variant="outline" disabled={selectedCenters.length >= 5}>
                    <Plus size={12} />
                  </Button>
                </div>
              ))}
              
              {availableCenters.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  {searchTerm || categoryFilter !== 'all' ? 'No centers match your filters' : 'No more centers available'}
                </div>
              )}
            </div>
            
            {selectedCenters.length >= 5 && (
              <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                Maximum of 5 centers can be compared at once
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComparisonTool;
