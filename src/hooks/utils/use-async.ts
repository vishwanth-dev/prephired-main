/**
 * 🔄 Async Hook
 *
 * This hook manages async operations following SOLID principles:
 * - Single Responsibility: Only handles async state
 * - Open/Closed: Extensible through options
 * - Liskov Substitution: Standard async interface
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Works with any async function
 *
 * 📋 Features:
 * - Loading states
 * - Error handling
 * - Success/error callbacks
 * - Retry capability
 * - Cancellation support
 *
 * 🔧 Usage:
 * ```tsx
 * const { execute, data, loading, error } = useAsync(fetchUser);
 * const request = useAsync(apiCall, { immediate: true });
 * ```
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// ============================================
// 🎯 TYPE DEFINITIONS
// ============================================

interface UseAsyncOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  retryCount?: number;
  retryDelay?: number;
}

interface UseAsyncReturn<T, P extends any[] = any[]> {
  execute: (...params: P) => Promise<T | null>;
  data: T | null;
  error: Error | null;
  loading: boolean;
  reset: () => void;
  cancel: () => void;
  retry: () => Promise<T | null>;
}

// ============================================
// 🔄 ASYNC HOOK
// ============================================

export function useAsync<T, P extends any[] = any[]>(
  asyncFunction: (...params: P) => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T, P> {
  const { immediate = false, onSuccess, onError, retryCount = 0, retryDelay = 1000 } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastParamsRef = useRef<P>(null);
  const retryCountRef = useRef(0);

  // Track mounted state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const execute = useCallback(
    async (...params: P): Promise<T | null> => {
      // Cancel previous request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      lastParamsRef.current = params;
      setLoading(true);
      setError(null);

      try {
        const result = await asyncFunction(...params);

        if (mountedRef.current) {
          setData(result);
          onSuccess?.(result);
          retryCountRef.current = 0;
        }

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');

        if (mountedRef.current && error.name !== 'AbortError') {
          setError(error);
          onError?.(error);

          // Automatic retry
          if (retryCountRef.current < retryCount) {
            retryCountRef.current++;
            setTimeout(() => {
              if (mountedRef.current) {
                execute(...params);
              }
            }, retryDelay);
          }
        }

        return null;
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [asyncFunction, onSuccess, onError, retryCount, retryDelay]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    retryCountRef.current = 0;
  }, []);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setLoading(false);
  }, []);

  const retry = useCallback(async (): Promise<T | null> => {
    if (lastParamsRef.current) {
      return execute(...lastParamsRef.current);
    }
    return null;
  }, [execute]);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute(...([] as unknown as P));
    }
  }, []);

  return {
    execute,
    data,
    error,
    loading,
    reset,
    cancel,
    retry,
  };
}

// ============================================
// 🎯 EXPORT
// ============================================

export default useAsync;
