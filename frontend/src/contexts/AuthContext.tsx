import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  profilePicUrl: string | null;
  settings: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Normally you'd have an endpoint like /auth/me to fetch current user
          // For now, if the token is valid, we'll try to keep session alive
          // If we need user info immediately on load, we should add a /api/auth/me endpoint in backend.
          // Since the backend might not have it yet, we just assume authenticated if token exists.
          
          // Let's assume we can fetch the user profile or just trust the token for now
          // In a real app we'd fetch user details here.
          // const response = await api.get('/auth/me');
          // setUser(response.data.user);
          
          // Temporary placeholder until /auth/me is built (if it isn't):
          // We will just set a dummy user or keep it null but authenticated.
          // Actually, let's just attempt a request to a protected route to verify token, or add /auth/me later.
        } catch (error) {
          console.error('Failed to restore session', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (accessToken: string, refreshToken: string, userData: User) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken }).catch(() => {});
      }
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      // Let api interceptor or router handle the redirect, or do it here
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user || !!localStorage.getItem('accessToken'), isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
