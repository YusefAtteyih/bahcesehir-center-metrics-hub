
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AuthError {
  message: string;
  code?: string;
  details?: string;
}

interface UserContextType {
  userName: string;
  userRole: 'evaluator' | 'manager' | 'faculty_dean' | 'department_head' | undefined;
  managedCenterId: string | undefined;
  isAuthenticated: boolean;
  loading: boolean;
  error: AuthError | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { profile, isAuthenticated, loading, error } = useAuth();

  const value: UserContextType = {
    userName: profile?.full_name || 'User',
    userRole: profile?.role,
    managedCenterId: profile?.managed_center_id || undefined,
    isAuthenticated,
    loading,
    error
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
