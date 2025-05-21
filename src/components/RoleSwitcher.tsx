
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import Logo from './Logo';

const RoleSwitcher: React.FC = () => {
  const { setUserRole } = useUser();
  const navigate = useNavigate();
  
  const handleRoleSelection = (role: 'evaluator' | 'manager') => {
    setUserRole(role);
    navigate('/centers');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-university-lightGray">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-2xl">Select Your Role</CardTitle>
          <CardDescription>Choose your role to access the appropriate interface</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full h-20 text-lg justify-start px-4 border-2 hover:border-university-blue hover:text-university-blue"
            onClick={() => handleRoleSelection('evaluator')}
          >
            <div className="flex flex-col items-start">
              <span className="font-bold">Evaluator</span>
              <span className="text-sm text-muted-foreground">Monitor and evaluate all centers</span>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-20 text-lg justify-start px-4 border-2 hover:border-university-orange hover:text-university-orange"
            onClick={() => handleRoleSelection('manager')}
          >
            <div className="flex flex-col items-start">
              <span className="font-bold">Center Manager</span>
              <span className="text-sm text-muted-foreground">Monitor your center and submit reports</span>
            </div>
          </Button>
        </CardContent>
        <CardFooter className="text-sm text-center text-muted-foreground block">
          <p>You can change your role later from the settings menu</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RoleSwitcher;
