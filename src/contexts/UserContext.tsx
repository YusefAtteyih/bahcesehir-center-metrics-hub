
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type UserRole = 'evaluator' | 'manager';

interface UserContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('evaluator');

  return (
    <UserContext.Provider value={{ userRole, setUserRole }}>
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
