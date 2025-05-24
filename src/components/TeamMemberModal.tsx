
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from "@/hooks/use-toast";
import { Plus, Edit } from 'lucide-react';

interface TeamMember {
  id?: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
}

interface TeamMemberModalProps {
  member?: TeamMember;
  onSave: (member: TeamMember) => void;
  trigger?: React.ReactNode;
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({ member, onSave, trigger }) => {
  const [open, setOpen] = React.useState(false);
  
  const form = useForm({
    defaultValues: {
      name: member?.name || '',
      role: member?.role || '',
      email: member?.email || '',
      phone: member?.phone || ''
    }
  });

  const onSubmit = (data: any) => {
    onSave({
      ...data,
      id: member?.id || Date.now().toString()
    });
    
    toast({
      title: member ? "Team Member Updated" : "Team Member Added",
      description: `${data.name} has been ${member ? 'updated' : 'added'} successfully.`,
    });
    
    setOpen(false);
    if (!member) {
      form.reset();
    }
  };

  const defaultTrigger = member ? (
    <Button variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  ) : (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Add Team Member
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{member ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
          <DialogDescription>
            {member ? 'Update team member information' : 'Add a new member to your center team'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. John Doe" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Center Director">Center Director</SelectItem>
                      <SelectItem value="Research Coordinator">Research Coordinator</SelectItem>
                      <SelectItem value="Industry Liaison">Industry Liaison</SelectItem>
                      <SelectItem value="Project Manager">Project Manager</SelectItem>
                      <SelectItem value="Senior Researcher">Senior Researcher</SelectItem>
                      <SelectItem value="Research Assistant">Research Assistant</SelectItem>
                      <SelectItem value="Administrative Coordinator">Administrative Coordinator</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@bau.edu.tr" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+90 212 123 4567" {...field} />
                  </FormControl>
                  <FormDescription>
                    Contact phone number
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {member ? 'Update' : 'Add'} Member
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberModal;
