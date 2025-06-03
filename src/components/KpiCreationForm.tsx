
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCenters } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const kpiSchema = z.object({
  center_id: z.string().min(1, 'Center is required'),
  name: z.string().min(1, 'KPI name is required'),
  target_value: z.number().min(0, 'Target value must be positive'),
  current_value: z.number().min(0, 'Current value must be positive'),
  unit: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  measurement: z.string().optional(),
  why_it_matters: z.string().optional(),
});

type KpiFormData = z.infer<typeof kpiSchema>;

interface KpiCreationFormProps {
  onSuccess?: () => void;
  initialData?: Partial<KpiFormData>;
  isEditing?: boolean;
  kpiId?: string;
}

const KPI_CATEGORIES = [
  'Research',
  'Education',
  'Innovation',
  'Quality',
  'Finance',
  'Collaboration',
  'Service',
  'Development',
  'Impact',
  'Success'
];

const KpiCreationForm: React.FC<KpiCreationFormProps> = ({ 
  onSuccess, 
  initialData, 
  isEditing = false,
  kpiId 
}) => {
  const { data: centers = [], isLoading: centersLoading } = useCenters();
  
  const form = useForm<KpiFormData>({
    resolver: zodResolver(kpiSchema),
    defaultValues: {
      center_id: initialData?.center_id || '',
      name: initialData?.name || '',
      target_value: initialData?.target_value || 0,
      current_value: initialData?.current_value || 0,
      unit: initialData?.unit || '',
      category: initialData?.category || '',
      measurement: initialData?.measurement || '',
      why_it_matters: initialData?.why_it_matters || '',
    },
  });

  const onSubmit = async (data: KpiFormData) => {
    try {
      if (isEditing && kpiId) {
        const { error } = await supabase
          .from('kpis')
          .update(data)
          .eq('id', kpiId);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "KPI updated successfully.",
        });
      } else {
        // Fix: Pass data directly, not as an array, and ensure all required fields are present
        const insertData = {
          center_id: data.center_id,
          name: data.name,
          target_value: data.target_value,
          current_value: data.current_value,
          unit: data.unit || null,
          category: data.category,
          measurement: data.measurement || null,
          why_it_matters: data.why_it_matters || null,
        };

        const { error } = await supabase
          .from('kpis')
          .insert(insertData);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "KPI created successfully.",
        });
      }
      
      onSuccess?.();
      form.reset();
    } catch (error) {
      console.error('Error saving KPI:', error);
      toast({
        title: "Error",
        description: "Failed to save KPI. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (centersLoading) {
    return <div>Loading centers...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit KPI' : 'Create New KPI'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Update the KPI details below' : 'Define a new key performance indicator for tracking'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="center_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Research Center</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a center" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {centers.map((center) => (
                          <SelectItem key={center.id} value={center.id}>
                            {center.name} ({center.short_name})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {KPI_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KPI Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Research Publications" {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear, descriptive name for this KPI
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="current_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="target_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="100"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., papers, %, €" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional unit of measurement
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="measurement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How it's Measured</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe how this KPI is measured and calculated"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="why_it_matters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why it Matters</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explain the importance and impact of this KPI"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                {isEditing ? 'Update KPI' : 'Create KPI'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default KpiCreationForm;
