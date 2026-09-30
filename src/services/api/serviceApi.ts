import { apiClient, ApiResponse } from './apiClient';
import { MedicalService } from '../../types';

export const serviceApi = {
  getServices: async (params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<MedicalService[]>> => {
    return apiClient.get<MedicalService[]>('/services', params);
  },

  getServiceBySlug: async (slug: string): Promise<ApiResponse<MedicalService>> => {
    return apiClient.get<MedicalService>(`/services/${slug}`);
  },

  createService: async (data: any): Promise<ApiResponse<MedicalService>> => {
    return apiClient.post<MedicalService>('/admin/services', data);
  },

  updateService: async (id: string, data: any): Promise<ApiResponse<MedicalService>> => {
    return apiClient.put<MedicalService>(`/admin/services/${id}`, data);
  },

  deleteService: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/services/${id}`);
  }
};
