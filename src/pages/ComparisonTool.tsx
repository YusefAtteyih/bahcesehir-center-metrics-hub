
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { centers } from '@/data/centers';
import { Check, Plus } from 'lucide-react';

const ComparisonTool: React.FC = () => {
  // For demo, we'll just use the first 3 centers
  const selectedCenters = centers.slice(0, 3);
  
  // Sample comparison metrics
  const comparisonMetrics = [
    { name: "Research Output", description: "Published papers and research activities" },
    { name: "Student Engagement", description: "Student participation in center activities" },
    { name: "Industry Partnerships", description: "Active collaborations with industry" },
    { name: "Funding Efficiency", description: "Ratio of outputs to funding received" },
    { name: "Social Impact", description: "Measurable impact on society" }
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-university-blue">Center Comparison Tool</h1>
        <p className="text-gray-600 mt-1">Compare performance metrics across multiple centers</p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Selected Centers</CardTitle>
              <CardDescription>Centers included in the comparison</CardDescription>
            </div>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Add Center</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {selectedCenters.map(center => (
              <div key={center.id} className="border rounded-md px-3 py-2 flex items-center gap-2 bg-gray-50">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getRandomColor() }}></div>
                <span className="font-medium">{center.shortName}</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">×</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
          <CardDescription>Key metrics across selected centers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {comparisonMetrics.map((metric, index) => (
              <div key={index} className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">{metric.name}</h3>
                  <p className="text-sm text-gray-500">{metric.description}</p>
                </div>
                <div className="space-y-3">
                  {selectedCenters.map(center => {
                    // Generate random value for demo
                    const value = Math.floor(Math.random() * 100);
                    return (
                      <div key={`${center.id}-${index}`} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{center.shortName}</span>
                          <span className="text-sm text-gray-500">
                            {value}/100
                            {value > 80 && (
                              <span className="ml-2 text-green-600 inline-flex items-center">
                                <Check size={14} />
                              </span>
                            )}
                          </span>
                        </div>
                        <Progress 
                          value={value}
                          className="h-2"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to generate random colors for the demo
function getRandomColor() {
  const colors = ['#4C51BF', '#ED8936', '#38B2AC', '#9F7AEA', '#ED64A6'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default ComparisonTool;
