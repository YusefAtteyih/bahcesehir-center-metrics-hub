
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, Trash2 } from 'lucide-react';

interface KpiBulkActionsProps {
  selectedKpis: string[];
  kpis: any[];
}

const KpiBulkActions: React.FC<KpiBulkActionsProps> = ({ 
  selectedKpis, 
  kpis 
}) => {
  const handleExport = () => {
    console.log('Exporting KPIs:', selectedKpis);
  };

  const handleBulkDelete = () => {
    console.log('Deleting KPIs:', selectedKpis);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Actions</CardTitle>
        <CardDescription>
          Perform actions on multiple KPIs at once
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {selectedKpis.length} KPIs selected
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExport}
            disabled={selectedKpis.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Selected
          </Button>
          
          <Button variant="outline" disabled>
            <Upload className="w-4 h-4 mr-2" />
            Import KPIs
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={handleBulkDelete}
            disabled={selectedKpis.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KpiBulkActions;
