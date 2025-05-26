
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from './LoginForm';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading, user, profile } = useAuth();

  console.log('AuthGuard - Authentication state:', {
    isAuthenticated,
    loading,
    hasUser: !!user,
    hasProfile: !!profile,
    userEmail: user?.email,
    profileRole: profile?.role
  });

  if (loading) {
    console.log('AuthGuard - Still loading authentication...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-university-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('AuthGuard - User not authenticated, showing login form');
    return <LoginForm />;
  }

  if (!profile) {
    console.log('AuthGuard - User authenticated but no profile found');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-university-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  console.log('AuthGuard - User authenticated and profile loaded, rendering app');
  return <>{children}</>;
};

export default AuthGuard;
