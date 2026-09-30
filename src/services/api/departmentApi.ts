import { apiClient, ApiResponse } from './apiClient';
import { Department } from '../../types';

export const departmentApi = {
  getDepartments: async (params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<Department[]>> => {
    return apiClient.get<Department[]>('/departments', params);
  },

  getDepartmentBySlug: async (slug: string): Promise<ApiResponse<Department>> => {
    return apiClient.get<Department>(`/departments/${slug}`);
  },

  createDepartment: async (data: any): Promise<ApiResponse<Department>> => {
    return apiClient.post<Department>('/admin/departments', data);
  },

  updateDepartment: async (id: string, data: any): Promise<ApiResponse<Department>> => {
    return apiClient.put<Department>(`/admin/departments/${id}`, data);
  },

  deleteDepartment: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/departments/${id}`);
  }
};
