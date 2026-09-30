import { apiClient, ApiResponse } from './apiClient';
import { GalleryItem } from '../../types';

export const galleryApi = {
  getGallery: async (params?: { page?: number; limit?: number; category?: string }): Promise<ApiResponse<GalleryItem[]>> => {
    return apiClient.get<GalleryItem[]>('/gallery', params);
  },

  createGalleryItem: async (data: any): Promise<ApiResponse<GalleryItem>> => {
    return apiClient.post<GalleryItem>('/admin/gallery', data);
  },

  deleteGalleryItem: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/gallery/${id}`);
  }
};
