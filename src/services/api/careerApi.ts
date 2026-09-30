import { apiClient, ApiResponse } from './apiClient';
import { CareerPosition } from '../../types';

export interface JobApplicationPayload {
  careerId?: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  resumeUrl?: string;
}

export const careerApi = {
  getCareers: async (params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<CareerPosition[]>> => {
    return apiClient.get<CareerPosition[]>('/careers', params);
  },

  getCareerBySlug: async (slug: string): Promise<ApiResponse<CareerPosition>> => {
    return apiClient.get<CareerPosition>(`/careers/${slug}`);
  },

  applyForJob: async (careerId: string, data: FormData | JobApplicationPayload): Promise<ApiResponse<any>> => {
    return apiClient.post(`/careers/${careerId}/apply`, data);
  },

  createCareer: async (data: any): Promise<ApiResponse<CareerPosition>> => {
    return apiClient.post<CareerPosition>('/admin/careers', data);
  },

  updateCareer: async (id: string, data: any): Promise<ApiResponse<CareerPosition>> => {
    return apiClient.put<CareerPosition>(`/admin/careers/${id}`, data);
  },

  deleteCareer: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/careers/${id}`);
  }
};
