import { apiClient, ApiResponse } from './apiClient';
import { PermissionType, RoleType } from '../../types/rbac';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  permissions?: PermissionType[];
  status?: 'ACTIVE' | 'INACTIVE';
  lastLoginAt?: string;
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export interface DashboardMetrics {
  totalDoctors: number;
  totalDepartments: number;
  pendingAppointments: number;
  totalAppointments?: number;
  newEnquiries: number;
  publishedArticles: number;
  upcomingEvents: number;
  activeCareers: number;
  recentAppointments?: any[];
}

export interface AuditLogItem {
  id: string;
  adminUserId: string;
  adminUserName?: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  metadata?: any;
}

export interface SystemSettings {
  hospitalName: string;
  maintenanceMode: boolean;
  appointmentAutoAcknowledge: boolean;
  maxDailyAppointments: number;
  contactNotificationEmail: string;
  sessionTimeoutMinutes: number;
}

export interface ReportsSummary {
  summary: {
    totalAppointments: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    completed: number;
    totalEnquiries: number;
    resolvedEnquiries: number;
  };
  departmentDistribution: Record<string, number>;
  generatedAt: string;
}

export const adminApi = {
  login: async (credentials: { email: string; password: string }): Promise<ApiResponse<LoginResponse>> => {
    const res = await apiClient.post<LoginResponse>('/auth/login', credentials);
    if (res.success && res.data?.token) {
      apiClient.setAuthToken(res.data.token);
      apiClient.setAdminUser(res.data.user);
    }
    return res;
  },

  getCurrentUser: async (): Promise<ApiResponse<AdminUser>> => {
    const res = await apiClient.get<AdminUser>('/auth/me');
    if (res.success && res.data) {
      apiClient.setAdminUser(res.data);
    }
    return res;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore network errors on logout
    } finally {
      apiClient.clearSession();
    }
  },

  getDashboardMetrics: async (): Promise<ApiResponse<DashboardMetrics>> => {
    return apiClient.get<DashboardMetrics>('/admin/dashboard');
  },

  getAuditLogs: async (params?: { page?: number; limit?: number }): Promise<ApiResponse<AuditLogItem[]>> => {
    return apiClient.get<AuditLogItem[]>('/admin/audit-logs', params);
  },

  // Users
  getUsers: async (): Promise<ApiResponse<AdminUser[]>> => {
    return apiClient.get<AdminUser[]>('/admin/users');
  },

  createUser: async (userData: { name: string; email: string; password: string; role: RoleType }): Promise<ApiResponse<AdminUser>> => {
    return apiClient.post<AdminUser>('/admin/users', userData);
  },

  updateUser: async (id: string, userData: Partial<AdminUser>): Promise<ApiResponse<AdminUser>> => {
    return apiClient.put<AdminUser>(`/admin/users/${id}`, userData);
  },

  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/users/${id}`);
  },

  // Roles
  getRoles: async (): Promise<ApiResponse<{ roles: any[]; allPermissions: PermissionType[] }>> => {
    return apiClient.get('/admin/roles');
  },

  assignRole: async (userId: string, role: RoleType): Promise<ApiResponse<any>> => {
    return apiClient.post('/admin/roles/assign', { userId, role });
  },

  // Settings
  getSettings: async (): Promise<ApiResponse<SystemSettings>> => {
    return apiClient.get<SystemSettings>('/admin/settings');
  },

  updateSettings: async (settings: Partial<SystemSettings>): Promise<ApiResponse<SystemSettings>> => {
    return apiClient.put<SystemSettings>('/admin/settings', settings);
  },

  // Reports
  getReports: async (): Promise<ApiResponse<ReportsSummary>> => {
    return apiClient.get<ReportsSummary>('/admin/reports');
  },
};
