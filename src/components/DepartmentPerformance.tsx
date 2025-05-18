
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Department {
  id: number;
  name: string;
  scoreAcademic: number;
  scoreResearch: number;
  scoreSatisfaction: number;
  scoreOverall: number;
  status: 'excellent' | 'good' | 'average' | 'needs-improvement';
}

interface DepartmentPerformanceProps {
  departments: Department[];
}

const getStatusColor = (status: Department['status']) => {
  switch (status) {
    case 'excellent': return 'bg-green-100 text-green-800';
    case 'good': return 'bg-blue-100 text-blue-800';
    case 'average': return 'bg-yellow-100 text-yellow-800';
    case 'needs-improvement': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: Department['status']) => {
  switch (status) {
    case 'excellent': return 'Excellent';
    case 'good': return 'Good';
    case 'average': return 'Average';
    case 'needs-improvement': return 'Needs Improvement';
    default: return 'Unknown';
  }
};

const DepartmentPerformance: React.FC<DepartmentPerformanceProps> = ({ departments }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 animate-fade-in">
      <h2 className="text-xl font-bold text-university-blue mb-4">Department Performance</h2>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Academic</TableHead>
              <TableHead>Research</TableHead>
              <TableHead>Satisfaction</TableHead>
              <TableHead>Overall</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell className="font-medium">{dept.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={dept.scoreAcademic} className="w-16 h-2" />
                    <span className="text-sm">{dept.scoreAcademic}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={dept.scoreResearch} className="w-16 h-2" />
                    <span className="text-sm">{dept.scoreResearch}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={dept.scoreSatisfaction} className="w-16 h-2" />
                    <span className="text-sm">{dept.scoreSatisfaction}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={dept.scoreOverall} className="w-16 h-2" />
                    <span className="text-sm font-semibold">{dept.scoreOverall}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(dept.status)}>
                    {getStatusText(dept.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DepartmentPerformance;
