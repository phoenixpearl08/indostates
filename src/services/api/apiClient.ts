/**
 * IndoStates Hospital - Centralized Frontend API Client
 * Connects existing frontend modules to Express + Node.js backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: Array<{ field: string; message: string }>;
  requiredPermission?: string | string[];
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  public getAuthToken(): string | null {
    try {
      return localStorage.getItem('indostates_admin_token');
    } catch {
      return null;
    }
  }

  public setAuthToken(token: string | null): void {
    try {
      if (token) {
        localStorage.setItem('indostates_admin_token', token);
      } else {
        localStorage.removeItem('indostates_admin_token');
      }
    } catch (e) {
      console.warn('Unable to persist auth token:', e);
    }
  }

  public getAdminUser(): any | null {
    try {
      const user = localStorage.getItem('indostates_admin_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  public setAdminUser(user: any | null): void {
    try {
      if (user) {
        localStorage.setItem('indostates_admin_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('indostates_admin_user');
      }
    } catch (e) {
      console.warn('Unable to persist admin user:', e);
    }
  }

  public clearSession(): void {
    this.setAuthToken(null);
    this.setAdminUser(null);
  }

  public async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = this.getAuthToken();

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {})
    };

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      let json: any = {};
      try {
        json = await response.json();
      } catch {
        json = { success: response.ok, message: response.statusText };
      }

      json.statusCode = response.status;

      // Handle 401 Unauthorized globally by clearing stale session
      if (response.status === 401 && endpoint.startsWith('/admin')) {
        this.clearSession();
      }

      return json as ApiResponse<T>;
    } catch (error: any) {
      // Graceful network or server offline handling
      return {
        success: false,
        statusCode: 0,
        message: error?.message || 'Network connection failed or backend unreachable.'
      };
    }
  }

  public async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  public async post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const isFormData = body instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body)
    });
  }

  public async put<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const isFormData = body instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body)
    });
  }

  public async patch<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  }

  public async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
