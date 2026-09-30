import { apiClient, ApiResponse } from './apiClient';

export interface CreateAppointmentPayload {
  patientName: string;
  phone: string;
  email?: string;
  departmentId?: string;
  doctorId?: string;
  preferredDate: string;
  preferredTime: string;
  reason: string;
}

export interface AppointmentRecord {
  id: string;
  appointmentNumber: string;
  patientName: string;
  phone: string;
  email?: string;
  departmentId?: string;
  departmentName?: string;
  doctorId?: string;
  doctorName?: string;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  status: 'PENDING' | 'CONFIRMED' | 'RESCHEDULED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  updatedAt?: string;
}

export const appointmentApi = {
  createAppointment: async (payload: CreateAppointmentPayload): Promise<ApiResponse<AppointmentRecord>> => {
    return apiClient.post<AppointmentRecord>('/appointments', payload);
  },

  getAppointments: async (params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<ApiResponse<AppointmentRecord[]>> => {
    return apiClient.get<AppointmentRecord[]>('/admin/appointments', params);
  },

  getAppointmentById: async (id: string): Promise<ApiResponse<AppointmentRecord>> => {
    return apiClient.get<AppointmentRecord>(`/admin/appointments/${id}`);
  },

  updateAppointmentStatus: async (
    id: string,
    status: 'PENDING' | 'CONFIRMED' | 'RESCHEDULED' | 'CANCELLED' | 'COMPLETED',
    adminNotes?: string
  ): Promise<ApiResponse<AppointmentRecord>> => {
    return apiClient.patch<AppointmentRecord>(`/admin/appointments/${id}/status`, { status, adminNotes });
  }
};
