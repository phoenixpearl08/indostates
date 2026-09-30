import { apiClient, ApiResponse } from './apiClient';

export interface ContactEnquiryPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactEnquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  updatedAt?: string;
}

export const contactApi = {
  submitContact: async (payload: ContactEnquiryPayload): Promise<ApiResponse<ContactEnquiryRecord>> => {
    return apiClient.post<ContactEnquiryRecord>('/contact', payload);
  },

  getEnquiries: async (params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<ApiResponse<ContactEnquiryRecord[]>> => {
    return apiClient.get<ContactEnquiryRecord[]>('/admin/enquiries', params);
  },

  updateEnquiryStatus: async (id: string, status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED'): Promise<ApiResponse<ContactEnquiryRecord>> => {
    return apiClient.patch<ContactEnquiryRecord>(`/admin/enquiries/${id}/status`, { status });
  }
};
