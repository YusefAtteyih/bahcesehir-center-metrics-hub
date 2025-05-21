
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

export type UserRole = 'evaluator' | 'manager';

interface UserContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  managedCenterId?: string; // For manager role
  setManagedCenterId: (id?: string) => void;
  isAuthenticated: boolean; // Track authentication state
  userName: string;
  userEmail: string;
}

// Initial context state
const initialState = {
  userRole: 'evaluator' as UserRole,
  setUserRole: () => {},
  setManagedCenterId: () => {},
  isAuthenticated: true, // Default to true for demo
  userName: 'Demo User',
  userEmail: 'user@bau.edu.tr',
};

export const UserContext = createContext<UserContextType>(initialState);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(initialState.userRole);
  const [managedCenterId, setManagedCenterId] = useState<string | undefined>();
  const [userName] = useState(initialState.userName);
  const [userEmail] = useState(initialState.userEmail);
  const [isAuthenticated] = useState(initialState.isAuthenticated);

  // Show toast notification when role changes
  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    toast({
      title: "Role Changed",
      description: `You are now viewing the system as a ${role === 'evaluator' ? 'University Evaluator' : 'Center Manager'}`,
    });
  };

  // Reset managedCenterId when switching from manager to evaluator
  useEffect(() => {
    if (userRole === 'evaluator' && managedCenterId) {
      setManagedCenterId(undefined);
    }
  }, [userRole, managedCenterId]);

  return (
    <UserContext.Provider value={{ 
      userRole, 
      setUserRole: handleRoleChange, 
      managedCenterId, 
      setManagedCenterId,
      isAuthenticated,
      userName,
      userEmail
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
