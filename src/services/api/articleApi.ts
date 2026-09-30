import { apiClient, ApiResponse } from './apiClient';
import { HealthArticle } from '../../types';

export const articleApi = {
  getArticles: async (params?: { page?: number; limit?: number; search?: string; category?: string }): Promise<ApiResponse<HealthArticle[]>> => {
    return apiClient.get<HealthArticle[]>('/articles', params);
  },

  getArticleBySlug: async (slug: string): Promise<ApiResponse<HealthArticle>> => {
    return apiClient.get<HealthArticle>(`/articles/${slug}`);
  },

  createArticle: async (data: any): Promise<ApiResponse<HealthArticle>> => {
    return apiClient.post<HealthArticle>('/admin/articles', data);
  },

  updateArticle: async (id: string, data: any): Promise<ApiResponse<HealthArticle>> => {
    return apiClient.put<HealthArticle>(`/admin/articles/${id}`, data);
  },

  deleteArticle: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/articles/${id}`);
  }
};
