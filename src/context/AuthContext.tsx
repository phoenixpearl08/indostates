import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminApi, AdminUser } from '../services/api/adminApi';
import { apiClient } from '../services/api/apiClient';
import { PermissionType, RoleType, roleHasPermission, getPermissionsForRole } from '../types/rbac';

interface AuthContextType {
  user: AdminUser | null;
  role: RoleType | null;
  permissions: PermissionType[];
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (permission: PermissionType) => boolean;
  hasAnyPermission: (permissions: PermissionType[]) => boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = async () => {
    setIsLoading(true);
    const token = apiClient.getAuthToken();

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      // Authoritatively verify token with server and get canonical user permissions
      const res = await adminApi.getCurrentUser();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        // Token invalid or expired
        apiClient.clearSession();
        setUser(null);
      }
    } catch (e) {
      console.warn('Authentication verification error:', e);
      apiClient.clearSession();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const role: RoleType | null = user?.role || null;
  const permissions: PermissionType[] = user ? (user.permissions || getPermissionsForRole(user.role)) : [];

  const hasPermission = (permission: PermissionType): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return roleHasPermission(user.role, permission) || permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: PermissionType[]): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return requiredPermissions.some((p) => hasPermission(p));
  };

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await adminApi.login(credentials);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, message: res.message || 'Invalid administrative credentials.' };
      }
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, message: err?.message || 'Authentication service unreachable.' };
    }
  };

  const logout = async () => {
    await adminApi.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    await initAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        permissions,
        isAuthenticated: !!user,
        isLoading,
        hasPermission,
        hasAnyPermission,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
