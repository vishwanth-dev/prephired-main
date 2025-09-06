// services/api/base.service.ts
// Base API service with common functionality

import { IApiResponse } from '@/types/backend';
import {
  api,
  setAuthToken as axiosSetAuthToken,
  removeAuthToken as axiosRemoveAuthToken,
  getAuthToken as axiosGetAuthToken,
} from '@/lib/api/client';

// ============================================
// CONFIGURATION
// ============================================

// ============================================
// ERROR HANDLING
// ============================================

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public override message: string,
    public error?: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================
// BASE API SERVICE CLASS
// ============================================

export class BaseApiService {
  // ============================================
  // TOKEN MANAGEMENT
  // ============================================

  /**
   * Get authentication token from storage
   */
  protected getAuthToken(): string | null {
    return axiosGetAuthToken();
  }

  /**
   * Set authentication token in storage
   */
  setAuthToken(token: string, persistent: boolean = true): void {
    axiosSetAuthToken(token, persistent);
  }

  /**
   * Remove authentication token from storage
   */
  removeAuthToken(): void {
    axiosRemoveAuthToken();
  }

  // ============================================
  // HTTP REQUEST METHODS
  // ============================================

  /**
   * GET request
   */
  async get<T>(url: string, headers?: Record<string, string>): Promise<IApiResponse<T>> {
    try {
      const response = await api.get<IApiResponse<T>>(url, { headers: headers || {} });
      return response.data;
    } catch (error: any) {
      throw this.handleAxiosError(error);
    }
  }

  /**
   * POST request
   */
  async post<T>(
    url: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<IApiResponse<T>> {
    try {
      const response = await api.post<IApiResponse<T>>(url, data, { headers: headers || {} });
      return response.data;
    } catch (error: any) {
      throw this.handleAxiosError(error);
    }
  }

  /**
   * PUT request
   */
  async put<T>(
    url: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<IApiResponse<T>> {
    try {
      const response = await api.put<IApiResponse<T>>(url, data, { headers: headers || {} });
      return response.data;
    } catch (error: any) {
      throw this.handleAxiosError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, headers?: Record<string, string>): Promise<IApiResponse<T>> {
    try {
      const response = await api.delete<IApiResponse<T>>(url, { headers: headers || {} });
      return response.data;
    } catch (error: any) {
      throw this.handleAxiosError(error);
    }
  }

  /**
   * PATCH request
   */
  async patch<T>(
    url: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<IApiResponse<T>> {
    try {
      const response = await api.patch<IApiResponse<T>>(url, data, { headers: headers || {} });
      return response.data;
    } catch (error: any) {
      throw this.handleAxiosError(error);
    }
  }

  // ============================================
  // FILE UPLOAD
  // ============================================

  /**
   * Upload file with progress tracking
   */
  async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<IApiResponse<T>> {
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post<IApiResponse<T>>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error: any) {
      throw this.handleAxiosError(error);
    }
  }

  // ============================================
  // ERROR HANDLING
  // ============================================

  /**
   * Handle axios errors and convert to ApiError
   */
  private handleAxiosError(error: any): ApiError {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      return new ApiError(
        status,
        data?.message || 'Request failed',
        data?.error || 'API_ERROR',
        data?.data
      );
    } else if (error.request) {
      // Request was made but no response received
      return new ApiError(500, 'Network error - no response received', 'NETWORK_ERROR');
    } else {
      // Something else happened
      return new ApiError(500, error.message || 'Unknown error occurred', 'UNKNOWN_ERROR');
    }
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  /**
   * Get current user ID from token (if available)
   */
  getCurrentUserId(): string | null {
    const token = this.getAuthToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      return payload.userId || null;
    } catch {
      return null;
    }
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const apiService = new BaseApiService();
