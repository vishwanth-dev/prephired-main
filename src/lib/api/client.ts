// lib/api/client.ts

/**
 * 🌐 API Client Configuration
 *
 * Centralized axios configuration for all API communications.
 * Uses centralized API endpoints from @/constants/api-endpoints
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/constants/api-endpoints';
import { API_CONFIG, STORAGE_KEYS } from '@/constants/config';

// ============================================
// TYPES
// ============================================

interface RequestMetadata {
  startTime: Date;
  retryCount?: number;
}

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
  metadata?: RequestMetadata;
}

// Error response type matching backend API structure
interface ErrorResponseData {
  message?: string;
  error?: string;
  statusCode?: number;
  data?: any;
}

// ============================================
// AXIOS INSTANCE CONFIGURATION
// ============================================

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT.DEFAULT,
  withCredentials: true,
});

// ============================================
// TOKEN REFRESH MANAGEMENT
// ============================================

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

// ============================================
// REQUEST INTERCEPTOR
// ============================================

api.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
    // Add auth token if available
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request metadata for debugging and retry tracking
    config.metadata = {
      startTime: new Date(),
      retryCount: config._retryCount || 0,
    };

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================

api.interceptors.response.use(
  response => {
    // Log request duration in development
    if (
      process.env.NODE_ENV === 'development' &&
      (response.config as ExtendedAxiosRequestConfig).metadata
    ) {
      const duration =
        new Date().getTime() -
        (response.config as ExtendedAxiosRequestConfig).metadata!.startTime.getTime();
      console.log(
        `[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`
      );
    }

    return response;
  },
  async (error: AxiosError<ErrorResponseData>) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const refreshToken = getRefreshToken();

          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // Call refresh endpoint
          const response = await axios.post<ErrorResponseData>(
            `${API_BASE_URL}/user/refresh-token`,
            { refreshToken },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          const responseData = response.data as any;
          const { token, refreshToken: newRefreshToken } = responseData.data || {};

          if (!token) {
            throw new Error('No token in refresh response');
          }

          // Update tokens
          setAuthToken(token, true);
          if (newRefreshToken) {
            setRefreshToken(newRefreshToken, true);
          }

          // Notify all subscribers
          onTokenRefreshed(token);

          // Update authorization header for retry
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }

          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear auth and redirect
          clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Token is being refreshed, queue this request
      return new Promise(resolve => {
        subscribeTokenRefresh((token: string) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          resolve(api(originalRequest));
        });
      });
    }

    // Handle other HTTP errors
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 403:
          console.error('Access forbidden:', data?.message || 'Insufficient permissions');
          break;
        case 404:
          console.error('Resource not found:', error.config?.url);
          break;
        case 429:
          console.error('Rate limit exceeded. Please try again later.');
          break;
        case 500:
          console.error('Server error:', data?.message || 'Internal server error');
          break;
        default:
          if (process.env.NODE_ENV === 'development') {
            console.error(`HTTP ${status}:`, data?.message || error.message);
          }
      }
    } else if (error.request) {
      console.error('Network error - no response received:', error.message);

      // Implement retry logic for network errors
      const config = originalRequest;
      const retryCount = config._retryCount || 0;

      if (retryCount < API_CONFIG.RETRY.MAX_ATTEMPTS) {
        config._retryCount = retryCount + 1;

        // Exponential backoff
        const delay =
          API_CONFIG.RETRY.DELAY * Math.pow(API_CONFIG.RETRY.BACKOFF_MULTIPLIER, retryCount);

        await new Promise(resolve => setTimeout(resolve, delay));
        return api(config);
      }
    } else {
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

// ============================================
// TOKEN MANAGEMENT FUNCTIONS
// ============================================

/**
 * Set authentication token
 */
export const setAuthToken = (token: string, persistent: boolean = true): void => {
  if (typeof window === 'undefined') return;

  const storage = persistent ? localStorage : sessionStorage;
  storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

  // Also set in axios default headers
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

/**
 * Remove authentication token
 */
export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);

  // Remove from axios headers
  delete api.defaults.headers.common['Authorization'];
};

/**
 * Get authentication token
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  return (
    localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  );
};

/**
 * Set refresh token
 */
export const setRefreshToken = (token: string, persistent: boolean = true): void => {
  if (typeof window === 'undefined') return;

  const storage = persistent ? localStorage : sessionStorage;
  storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
};

/**
 * Get refresh token
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  return (
    localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ||
    sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  );
};

/**
 * Clear all auth tokens and data
 */
export const clearAuth = (): void => {
  removeAuthToken();

  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create axios instance for multipart/form-data requests
 */
export const createFormDataApi = (): AxiosInstance => {
  const formDataApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: API_CONFIG.TIMEOUT.UPLOAD,
    withCredentials: true,
  });

  // Add auth token to form data requests
  formDataApi.interceptors.request.use(
    config => {
      const token = getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  return formDataApi;
};

/**
 * Initialize auth on app load
 */
export const initializeAuth = (): void => {
  const token = getAuthToken();
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Initialize on module load
if (typeof window !== 'undefined') {
  initializeAuth();
}

// ============================================
// EXPORTS
// ============================================

export default api;
export type { AxiosResponse, AxiosError };
