// hooks/use-api.ts

/**
 * 🌐 API Hook
 *
 * Generic hook for API calls with caching and state management
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AxiosError, AxiosRequestConfig } from 'axios';
import api from '@/lib/api/client';
import { useAuth } from './use-auth';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface UseApiOptions<T> {
  immediate?: boolean;
  cache?: boolean;
  cacheTime?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError) => void;
  retry?: number;
  retryDelay?: number;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
  execute: (config?: AxiosRequestConfig) => Promise<T | null>;
  mutate: (data: T) => void;
  reset: () => void;
  refetch: () => Promise<T | null>;
}

// Cache store
const cache = new Map<string, { data: any; timestamp: number }>();

// ============================================
// API HOOK
// ============================================

export function useApi<T = any>(
  url: string,
  config?: AxiosRequestConfig,
  options?: UseApiOptions<T>
): UseApiReturn<T> {
  const {
    immediate = false,
    cache: enableCache = false,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    onSuccess,
    onError,
    retry = 0,
    retryDelay = 1000,
  } = options || {};

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const retryCountRef = useRef(0);
  const mountedRef = useRef(true);
  const { isAuthenticated } = useAuth();

  // Generate cache key
  const getCacheKey = useCallback(() => {
    return `${url}-${JSON.stringify(config?.params || {})}`;
  }, [url, config?.params]);

  // Check cache
  const checkCache = useCallback(() => {
    if (!enableCache) return null;

    const cacheKey = getCacheKey();
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < cacheTime) {
      return cached.data;
    }

    return null;
  }, [enableCache, getCacheKey, cacheTime]);

  // Execute API call
  const execute = useCallback(
    async (overrideConfig?: AxiosRequestConfig): Promise<T | null> => {
      // Check cache first
      const cachedData = checkCache();
      if (cachedData) {
        setData(cachedData);
        return cachedData;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.request<T>({
          url,
          method: 'GET',
          ...config,
          ...overrideConfig,
        });

        const responseData = response.data;

        if (mountedRef.current) {
          setData(responseData);
          onSuccess?.(responseData);

          // Update cache
          if (enableCache) {
            const cacheKey = getCacheKey();
            cache.set(cacheKey, {
              data: responseData,
              timestamp: Date.now(),
            });
          }

          retryCountRef.current = 0;
        }

        return responseData;
      } catch (err) {
        const axiosError = err as AxiosError;

        if (mountedRef.current) {
          // Retry logic
          if (retryCountRef.current < retry) {
            retryCountRef.current++;
            setTimeout(() => {
              if (mountedRef.current) {
                execute(overrideConfig);
              }
            }, retryDelay * retryCountRef.current);
          } else {
            setError(axiosError);
            onError?.(axiosError);
          }
        }

        return null;
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [url, config, checkCache, getCacheKey, enableCache, onSuccess, onError, retry, retryDelay]
  );

  // Mutate data locally
  const mutate = useCallback(
    (newData: T) => {
      setData(newData);

      // Update cache
      if (enableCache) {
        const cacheKey = getCacheKey();
        cache.set(cacheKey, {
          data: newData,
          timestamp: Date.now(),
        });
      }
    },
    [enableCache, getCacheKey]
  );

  // Reset state
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    retryCountRef.current = 0;
  }, []);

  // Refetch data
  const refetch = useCallback(async (): Promise<T | null> => {
    // Clear cache for this request
    if (enableCache) {
      const cacheKey = getCacheKey();
      cache.delete(cacheKey);
    }

    return execute();
  }, [execute, enableCache, getCacheKey]);

  // Execute on mount if immediate
  useEffect(() => {
    if (immediate && isAuthenticated) {
      execute();
    }
  }, [immediate, isAuthenticated]);

  // Cleanup
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    mutate,
    reset,
    refetch,
  };
}

// ============================================
// MUTATION HOOK
// ============================================

export function useMutation<TData = any, TVariables = any>(
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const mutate = useCallback(
    async (variables: TVariables, config?: AxiosRequestConfig): Promise<TData | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.request<TData>({
          url,
          method,
          data: variables,
          ...config,
        });

        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError);
        throw axiosError;
      } finally {
        setLoading(false);
      }
    },
    [url, method]
  );

  return {
    mutate,
    loading,
    error,
  };
}

export default useApi;
