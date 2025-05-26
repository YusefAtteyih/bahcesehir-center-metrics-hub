
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from './LoginForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading, user, profile, error, retryProfileCreation, clearError } = useAuth();

  console.log('AuthGuard - Authentication state:', {
    isAuthenticated,
    loading,
    hasUser: !!user,
    hasProfile: !!profile,
    hasError: !!error,
    userEmail: user?.email,
    profileRole: profile?.role
  });

  // Show loading state
  if (loading) {
    console.log('AuthGuard - Still loading authentication...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-university-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    console.log('AuthGuard - User not authenticated, showing login form');
    return <LoginForm />;
  }

  // Handle authentication errors
  if (error) {
    console.log('AuthGuard - Authentication error detected:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">{error.message}</p>
                {error.details && (
                  <p className="text-sm opacity-80">{error.details}</p>
                )}
              </div>
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-2">
            <Button 
              onClick={retryProfileCreation}
              className="flex-1"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button 
              onClick={clearError}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where user exists but profile is missing
  if (user && !profile) {
    console.log('AuthGuard - User authenticated but profile missing');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-4 text-center">
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Setting up your profile...</p>
                <p className="text-sm">This may take a moment for new accounts.</p>
              </div>
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={retryProfileCreation}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Profile Setup
          </Button>
        </div>
      </div>
    );
  }

  // All good - render the app
  console.log('AuthGuard - User authenticated and profile loaded, rendering app');
  return <>{children}</>;
};

export default AuthGuard;
