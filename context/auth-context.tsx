'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Role, Permission, ROLE_PERMISSIONS, hasPermission as checkPermission, canAccessRoute } from '@/lib/rbac';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: any;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
          setProfile(data.profile);
          setPermissions(data.permissions || []);
        } else {
          setUser(null);
          setProfile(null);
          setPermissions([]);
        }
      } else {
        setUser(null);
        setProfile(null);
        setPermissions([]);
      }
    } catch (err) {
      console.error('Session check failed:', err);
      setUser(null);
      setProfile(null);
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Authentication Failed',
          message: data.message || 'Invalid email or password. Please try again.',
        };
      }

      setUser(data.user);
      setProfile(data.profile);
      setPermissions(ROLE_PERMISSIONS[data.user.role as Role] || []);

      return { success: true, message: data.message };
    } catch (error: any) {
      return {
        success: false,
        error: 'Network Error',
        message: 'Could not reach the school authentication service.',
      };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      setProfile(null);
      setPermissions([]);
      router.push('/login');
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return checkPermission(user.role, permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        isLoading,
        permissions,
        hasPermission,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
