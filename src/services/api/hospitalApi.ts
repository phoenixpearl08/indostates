import { apiClient, ApiResponse } from './apiClient';

export interface HospitalProfile {
  id: string;
  name: string;
  logo: string | null;
  tagline: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  website: string;
  workingHours: string;
  googleMapsUrl: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  updatedAt?: string;
}

export const hospitalApi = {
  getHospital: async (): Promise<ApiResponse<HospitalProfile>> => {
    return apiClient.get<HospitalProfile>('/hospital');
  },

  updateHospital: async (data: Partial<HospitalProfile>): Promise<ApiResponse<HospitalProfile>> => {
    return apiClient.put<HospitalProfile>('/admin/hospital', data);
  }
};
