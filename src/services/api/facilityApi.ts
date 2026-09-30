import { apiClient, ApiResponse } from './apiClient';
import { Facility } from '../../types';

export const facilityApi = {
  getFacilities: async (params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<Facility[]>> => {
    return apiClient.get<Facility[]>('/facilities', params);
  },

  createFacility: async (data: any): Promise<ApiResponse<Facility>> => {
    return apiClient.post<Facility>('/admin/facilities', data);
  },

  updateFacility: async (id: string, data: any): Promise<ApiResponse<Facility>> => {
    return apiClient.put<Facility>(`/admin/facilities/${id}`, data);
  },

  deleteFacility: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/facilities/${id}`);
  }
};
