import { apiClient, ApiResponse } from './apiClient';

export interface SearchResults {
  query: string;
  doctors: any[];
  departments: any[];
  services: any[];
  articles: any[];
  events: any[];
}

export const searchApi = {
  search: async (query: string): Promise<ApiResponse<SearchResults>> => {
    return apiClient.get<SearchResults>('/search', { q: query });
  }
};
