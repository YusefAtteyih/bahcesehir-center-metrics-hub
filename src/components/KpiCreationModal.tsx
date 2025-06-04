
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import KpiCreationForm from './KpiCreationForm';

interface KpiCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KpiCreationModal: React.FC<KpiCreationModalProps> = ({ 
  open, 
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New KPI</DialogTitle>
        </DialogHeader>
        <KpiCreationForm 
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default KpiCreationModal;
