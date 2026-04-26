"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types/auth';
import { authService } from '@/services/auth-service';
import { useRouter } from 'next/navigation';

interface AuthContextType extends AuthState {
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    // W prawdziwej aplikacji tutaj pobralibyśmy też profil użytkownika z API
    
    if (accessToken && refreshToken) {
      setAuthState({
        user: { id: '1', email: 'user@example.com' }, // Placeholder
        accessToken,
        isAuthenticated: true,
      });
    }
    setIsLoading(false);
  }, []);

  const login = (accessToken: string, refreshToken: string, user: User) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setAuthState({
      user,
      accessToken,
      isAuthenticated: true,
    });
    router.push('/dashboard');
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authService.logout({ refreshToken });
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Nawet jeśli API zawiedzie, czyścimy stan lokalny
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setAuthState({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
