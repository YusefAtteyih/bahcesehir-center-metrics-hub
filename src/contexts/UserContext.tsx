// This file is deprecated - authentication is now handled by Supabase
// The useAuth hook should be used instead

import React, { createContext, useContext, ReactNode } from 'react';

// Keep minimal interface for backward compatibility during transition
interface UserContextType {
  userRole: 'evaluator' | 'manager';
  setUserRole: (role: 'evaluator' | 'manager') => void;
  managedCenterId?: string;
  setManagedCenterId: (id?: string) => void;
  isAuthenticated: boolean;
  userName: string;
  userEmail: string;
}

const UserContext = createContext<UserContextType>({
  userRole: 'evaluator',
  setUserRole: () => {},
  setManagedCenterId: () => {},
  isAuthenticated: false,
  userName: '',
  userEmail: '',
});

export function UserProvider({ children }: { children: ReactNode }) {
  // This is now a stub - real authentication state comes from useAuth hook
  return (
    <UserContext.Provider value={{
      userRole: 'evaluator',
      setUserRole: () => {},
      managedCenterId: undefined,
      setManagedCenterId: () => {},
      isAuthenticated: false,
      userName: '',
      userEmail: '',
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  console.warn('useUser is deprecated. Use useAuth hook instead.');
  return useContext(UserContext);
}
