
"use client";

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserDefinition } from '@/types';
import { users as userDefinitions } from '@/lib/data';

interface AuthContextType {
  user: UserDefinition | null;
  users: UserDefinition[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDefinition | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      const loggedInUser = userDefinitions.find(u => u.id === storedUserId);
      if (loggedInUser) {
        setUser(loggedInUser);
      }
    } else {
        router.push('/login');
    }
  }, [router]);

  const login = (email: string, password: string): boolean => {
    const userToLogin = userDefinitions.find(u => u.email === email && u.password === password);
    if (userToLogin) {
      setUser(userToLogin);
      localStorage.setItem('userId', userToLogin.id);
      router.push('/dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
    router.push('/login');
  };

  const value = useMemo(() => ({
    user,
    users: userDefinitions,
    login,
    logout,
  }), [user]);

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
