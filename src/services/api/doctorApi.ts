import { apiClient, ApiResponse } from './apiClient';
import { Doctor } from '../../types';

export const doctorApi = {
  getDoctors: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
  }): Promise<ApiResponse<Doctor[]>> => {
    return apiClient.get<Doctor[]>('/doctors', params);
  },

  getDoctorBySlug: async (slug: string): Promise<ApiResponse<Doctor>> => {
    return apiClient.get<Doctor>(`/doctors/${slug}`);
  },

  createDoctor: async (data: any): Promise<ApiResponse<Doctor>> => {
    return apiClient.post<Doctor>('/admin/doctors', data);
  },

  updateDoctor: async (id: string, data: any): Promise<ApiResponse<Doctor>> => {
    return apiClient.put<Doctor>(`/admin/doctors/${id}`, data);
  },

  deleteDoctor: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/doctors/${id}`);
  }
};
