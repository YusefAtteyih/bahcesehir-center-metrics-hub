
import React from 'react';
import { KPI } from '@/types/center';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

interface KpiTableProps {
  kpis: KPI[];
  showDetails?: boolean;
}

const KpiTable: React.FC<KpiTableProps> = ({ kpis, showDetails = true }) => {
  const formatValue = (value: number, unit?: string) => {
    if (unit === '₺') {
      return `${unit} ${value.toLocaleString()}`;
    } else if (unit === '%') {
      return `${value}${unit}`;
    } else if (value >= 1000) {
      return value.toLocaleString();
    }
    return `${value}${unit ? ' ' + unit : ''}`;
  };

  const calculateProgress = (value: number, target: number) => {
    return Math.min(Math.round((value / target) * 100), 100);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">KPI</TableHead>
            <TableHead className="text-right">Current Value</TableHead>
            <TableHead className="text-right">2025 Target</TableHead>
            <TableHead>Progress</TableHead>
            {showDetails && <TableHead>Why It Matters</TableHead>}
            {showDetails && <TableHead>Measurement</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {kpis.map((kpi, i) => {
            const progress = calculateProgress(kpi.value, kpi.target);
            return (
              <TableRow key={i}>
                <TableCell className="font-medium">{kpi.name}</TableCell>
                <TableCell className="text-right">{formatValue(kpi.value, kpi.unit)}</TableCell>
                <TableCell className="text-right">{formatValue(kpi.target, kpi.unit)}</TableCell>
                <TableCell className="w-[200px]">
                  <div className="space-y-1">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">{progress}%</p>
                  </div>
                </TableCell>
                {showDetails && <TableCell className="text-sm">{kpi.whyItMatters}</TableCell>}
                {showDetails && <TableCell className="text-sm">{kpi.measurement}</TableCell>}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default KpiTable;
