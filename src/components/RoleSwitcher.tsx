
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import Logo from './Logo';
import { LayoutDashboard, Settings } from 'lucide-react';

const RoleSwitcher: React.FC = () => {
  const { userRole } = useUser();
  const navigate = useNavigate();
  
  const handleContinue = () => {
    if (userRole === 'evaluator') {
      navigate('/dashboard');
    } else {
      navigate('/dashboard');
    }
  };
  
  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-university-lightGray">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-university-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your role...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-university-lightGray">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-2xl">Welcome!</CardTitle>
          <CardDescription>Your role has been assigned</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`w-full h-20 text-lg justify-start px-4 border-2 rounded-lg flex items-center ${
            userRole === 'evaluator' 
              ? 'border-university-blue bg-university-blue/5' 
              : 'border-university-orange bg-university-orange/5'
          }`}>
            {userRole === 'evaluator' ? (
              <LayoutDashboard className="mr-4 h-6 w-6 text-university-blue" />
            ) : (
              <Settings className="mr-4 h-6 w-6 text-university-orange" />
            )}
            <div className="flex flex-col items-start">
              <span className="font-bold">
                {userRole === 'evaluator' ? 'Evaluator' : 'Center Manager'}
              </span>
              <span className="text-sm text-muted-foreground">
                {userRole === 'evaluator' 
                  ? 'Monitor and evaluate all centers' 
                  : 'Monitor your center and submit reports'
                }
              </span>
            </div>
          </div>
          
          <Button 
            onClick={handleContinue}
            className="w-full"
          >
            Continue to Dashboard
          </Button>
        </CardContent>
        <CardFooter className="text-sm text-center text-muted-foreground block">
          <p>Your role is determined by your account settings</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RoleSwitcher;
