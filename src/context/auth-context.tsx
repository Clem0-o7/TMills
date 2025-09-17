"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { UserDefinition, UserRole } from '@/types';
import { users as userDefinitions } from '@/lib/data';

interface AuthContextType {
  user: UserDefinition | null;
  users: UserDefinition[];
  setUser: (user: UserDefinition) => void;
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserDefinition | null>(null);

  useEffect(() => {
    // Set default user on initial load
    if (userDefinitions.length > 0) {
      setUserState(userDefinitions[0]);
    }
  }, []);

  const setUser = (user: UserDefinition) => {
    setUserState(user);
  };
  
  const switchUser = (userId: string) => {
      const newUser = userDefinitions.find(u => u.id === userId);
      if(newUser) {
          setUserState(newUser);
      }
  }

  const value = useMemo(() => ({ user, users: userDefinitions, setUser, switchUser }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
