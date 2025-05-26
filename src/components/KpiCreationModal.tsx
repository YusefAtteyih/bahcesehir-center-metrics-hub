
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface KpiCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  centers: Array<{ id: string; name: string; short_name: string }>;
}

const KpiCreationModal: React.FC<KpiCreationModalProps> = ({ open, onOpenChange, centers }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    centerId: '',
    category: '',
    unit: '',
    targetValue: '',
    currentValue: '0',
    whyItMatters: '',
    measurement: ''
  });

  const categories = [
    'Academic Excellence',
    'Research & Innovation',
    'Industry Collaboration',
    'Student Development',
    'Social Impact',
    'Financial Performance',
    'Operational Efficiency'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('kpis')
        .insert({
          name: formData.name,
          center_id: formData.centerId,
          category: formData.category,
          unit: formData.unit,
          target_value: Number(formData.targetValue),
          current_value: Number(formData.currentValue),
          why_it_matters: formData.whyItMatters,
          measurement: formData.measurement
        });

      if (error) throw error;

      toast({
        title: "KPI Created",
        description: "New KPI has been successfully created.",
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        centerId: '',
        category: '',
        unit: '',
        targetValue: '',
        currentValue: '0',
        whyItMatters: '',
        measurement: ''
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error creating KPI:', error);
      toast({
        title: "Error",
        description: "Failed to create KPI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name && formData.centerId && formData.category && 
                     formData.unit && formData.targetValue && formData.whyItMatters;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New KPI</DialogTitle>
          <DialogDescription>
            Define a new Key Performance Indicator for monitoring center performance
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">KPI Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Research Publications"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="center">Center *</Label>
              <Select value={formData.centerId} onValueChange={(value) => handleInputChange('centerId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select center" />
                </SelectTrigger>
                <SelectContent>
                  {centers.map(center => (
                    <SelectItem key={center.id} value={center.id}>
                      {center.short_name} - {center.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                placeholder="e.g., papers, partnerships, %"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetValue">Target Value *</Label>
              <Input
                id="targetValue"
                type="number"
                value={formData.targetValue}
                onChange={(e) => handleInputChange('targetValue', e.target.value)}
                placeholder="e.g., 100"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Value</Label>
              <Input
                id="currentValue"
                type="number"
                value={formData.currentValue}
                onChange={(e) => handleInputChange('currentValue', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whyItMatters">Why It Matters *</Label>
            <Textarea
              id="whyItMatters"
              value={formData.whyItMatters}
              onChange={(e) => handleInputChange('whyItMatters', e.target.value)}
              placeholder="Explain the importance and impact of this KPI..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="measurement">How It's Measured</Label>
            <Textarea
              id="measurement"
              value={formData.measurement}
              onChange={(e) => handleInputChange('measurement', e.target.value)}
              placeholder="Describe how this KPI is calculated or measured..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || loading}>
              {loading ? 'Creating...' : 'Create KPI'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default KpiCreationModal;
