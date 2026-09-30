import { apiClient, ApiResponse } from './apiClient';
import { HealthEvent } from '../../types';

export const eventApi = {
  getEvents: async (params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<HealthEvent[]>> => {
    return apiClient.get<HealthEvent[]>('/events', params);
  },

  getEventBySlug: async (slug: string): Promise<ApiResponse<HealthEvent>> => {
    return apiClient.get<HealthEvent>(`/events/${slug}`);
  },

  createEvent: async (data: any): Promise<ApiResponse<HealthEvent>> => {
    return apiClient.post<HealthEvent>('/admin/events', data);
  },

  updateEvent: async (id: string, data: any): Promise<ApiResponse<HealthEvent>> => {
    return apiClient.put<HealthEvent>(`/admin/events/${id}`, data);
  },

  deleteEvent: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/events/${id}`);
  }
};
