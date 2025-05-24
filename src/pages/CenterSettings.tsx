import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { toast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TeamMemberModal from '@/components/TeamMemberModal';
import { Trash2 } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
}

const CenterSettings: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: "Dr. Ahmet Yılmaz", role: "Center Director", email: "ahmet.yilmaz@bau.edu.tr", phone: "+90 212 123 4567" },
    { id: '2', name: "Dr. Ayşe Kaya", role: "Research Coordinator", email: "ayse.kaya@bau.edu.tr" },
    { id: '3', name: "Mehmet Demir", role: "Industry Liaison", email: "mehmet.demir@bau.edu.tr" },
    { id: '4', name: "Zeynep Özturk", role: "Project Manager", email: "zeynep.ozturk@bau.edu.tr" }
  ]);

  const profileForm = useForm({
    defaultValues: {
      name: 'Business Analytics and Insights Center',
      shortName: 'BAUBUS',
      description: 'Conducting research and providing services in business analytics and insights.',
      mission: 'To lead the field of business analytics through innovative research and industry partnerships.',
      website: 'https://baubus.bau.edu.tr',
      email: 'baubus@bau.edu.tr',
      phone: '+90 212 123 4567',
    }
  });
  
  const kpiForm = useForm({
    defaultValues: {}
  });
  
  const onSaveProfile = (data: any) => {
    console.log(data);
    toast({
      title: "Profile Updated",
      description: "Your center profile has been successfully updated.",
    });
  };
  
  const onSaveKpi = (data: any) => {
    console.log(data);
    toast({
      title: "KPI Values Updated",
      description: "Your center KPI values have been successfully updated.",
    });
  };

  const handleSaveTeamMember = (member: TeamMember) => {
    setTeamMembers(prev => {
      const existing = prev.find(m => m.id === member.id);
      if (existing) {
        return prev.map(m => m.id === member.id ? member : m);
      } else {
        return [...prev, member];
      }
    });
  };

  const handleDeleteTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    toast({
      title: "Team Member Removed",
      description: "The team member has been removed successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-university-blue">Center Settings</h1>
        <p className="text-gray-600 mt-1">Manage your center's profile and KPI values</p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Center Profile</TabsTrigger>
          <TabsTrigger value="kpis">KPI Management</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Center Profile Information</CardTitle>
              <CardDescription>
                Update your center's basic information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Center Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Full name of your research center
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="shortName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Short Name/Abbreviation</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Short name or code used to identify your center
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={profileForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Center Description</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-32" {...field} />
                        </FormControl>
                        <FormDescription>
                          Brief description of your center's focus and activities
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="mission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mission Statement</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="kpis">
          
          <Card>
            <CardHeader>
              <CardTitle>KPI Management</CardTitle>
              <CardDescription>
                Update your center's KPI values and view progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...kpiForm}>
                <form onSubmit={kpiForm.handleSubmit(onSaveKpi)} className="space-y-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">KPI Name</TableHead>
                        <TableHead>Current Value</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Progress</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { name: "Research Publications", current: 24, target: 30 },
                        { name: "Industry Partnerships", current: 8, target: 10 },
                        { name: "Student Engagement", current: 450, target: 500 },
                        { name: "Funding Secured (TL)", current: 350000, target: 400000 },
                        { name: "Events Organized", current: 15, target: 15 }
                      ].map((kpi, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{kpi.name}</TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              defaultValue={kpi.current} 
                              className="w-24 h-8"
                            />
                          </TableCell>
                          <TableCell>{kpi.target}</TableCell>
                          <TableCell>{Math.round(kpi.current/kpi.target*100)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="flex justify-end pt-4">
                    <Button type="submit">Update KPI Values</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage your center's team</CardDescription>
                </div>
                <TeamMemberModal onSave={handleSaveTeamMember} />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.phone || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <TeamMemberModal member={member} onSave={handleSaveTeamMember} />
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteTeamMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CenterSettings;
