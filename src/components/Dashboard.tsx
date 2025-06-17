
import React from 'react';
import KpiCard from './KpiCard';
import DepartmentPerformance from './DepartmentPerformance';
import EvaluationChart from './EvaluationChart';
import PerformanceTrend from './PerformanceTrend';
import { ChartBar, ChartLine, Star, Award, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard: React.FC = () => {
  // Sample data for KPIs
  const kpis = [
    { 
      title: 'Academic Success Rate', 
      value: 87, 
      target: 95, 
      unit: '%', 
      icon: <ChartBar className="h-5 w-5" />,
      color: 'university-blue'
    },
    { 
      title: 'Research Publications', 
      value: 156, 
      target: 200, 
      unit: '', 
      icon: <ChartLine className="h-5 w-5" />,
      color: 'university-lightBlue'
    },
    { 
      title: 'Student Satisfaction', 
      value: 4.2, 
      target: 5, 
      unit: '/5', 
      icon: <Star className="h-5 w-5" />,
      color: 'university-orange'
    },
    { 
      title: 'Faculty Performance', 
      value: 91, 
      target: 100, 
      unit: '%', 
      icon: <Award className="h-5 w-5" />,
      color: 'green-600'
    },
  ];
  
  // Sample data for department performance
  const departments = [
    { 
      id: 1, 
      name: 'Computer Engineering', 
      scoreAcademic: 92, 
      scoreResearch: 88, 
      scoreSatisfaction: 85, 
      scoreOverall: 89, 
      status: 'excellent' as const
    },
    { 
      id: 2, 
      name: 'Business Administration', 
      scoreAcademic: 85, 
      scoreResearch: 78, 
      scoreSatisfaction: 83, 
      scoreOverall: 82, 
      status: 'good' as const 
    },
    { 
      id: 3, 
      name: 'Law School', 
      scoreAcademic: 89, 
      scoreResearch: 82, 
      scoreSatisfaction: 81, 
      scoreOverall: 84, 
      status: 'good' as const
    },
    { 
      id: 4, 
      name: 'Architecture', 
      scoreAcademic: 75, 
      scoreResearch: 68, 
      scoreSatisfaction: 77, 
      scoreOverall: 73, 
      status: 'average' as const
    },
    { 
      id: 5, 
      name: 'Medicine', 
      scoreAcademic: 94, 
      scoreResearch: 91, 
      scoreSatisfaction: 88, 
      scoreOverall: 91, 
      status: 'excellent' as const
    },
    { 
      id: 6, 
      name: 'Communications', 
      scoreAcademic: 72, 
      scoreResearch: 65, 
      scoreSatisfaction: 68, 
      scoreOverall: 68, 
      status: 'needs-improvement' as const
    },
  ];
  
  // Sample data for evaluation chart
  const evaluationData = [
    { name: 'Excellent', value: 35, color: '#10b981' },
    { name: 'Good', value: 40, color: '#0069b4' },
    { name: 'Average', value: 15, color: '#f59e0b' },
    { name: 'Needs Improvement', value: 10, color: '#ef4444' },
  ];
  
  // Sample data for performance trend
  const trendData = [
    { month: 'Jan', academic: 65, research: 70, satisfaction: 60 },
    { month: 'Feb', academic: 68, research: 72, satisfaction: 64 },
    { month: 'Mar', academic: 75, research: 73, satisfaction: 69 },
    { month: 'Apr', academic: 78, research: 75, satisfaction: 72 },
    { month: 'May', academic: 82, research: 78, satisfaction: 75 },
    { month: 'Jun', academic: 87, research: 80, satisfaction: 78 },
    { month: 'Jul', academic: 85, research: 83, satisfaction: 80 },
    { month: 'Aug', academic: 83, research: 85, satisfaction: 82 },
    { month: 'Sep', academic: 87, research: 86, satisfaction: 79 },
    { month: 'Oct', academic: 89, research: 87, satisfaction: 83 },
    { month: 'Nov', academic: 91, research: 88, satisfaction: 85 },
    { month: 'Dec', academic: 92, research: 90, satisfaction: 87 },
  ];
  
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-university-blue">Department Evaluation Dashboard</h1>
        
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <KpiCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            target={kpi.target}
            unit={kpi.unit}
            icon={kpi.icon}
            color={kpi.color}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <PerformanceTrend data={trendData} />
        <EvaluationChart 
          data={evaluationData} 
          title="Overall Evaluation Distribution" 
        />
      </div>
      
      <div className="mb-8">
        <DepartmentPerformance departments={departments} />
      </div>
    </div>
  );
};

export default Dashboard;
