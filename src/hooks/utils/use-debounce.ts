/**
 * ⏱️ Debounce Hook
 *
 * This hook provides debouncing functionality following SOLID principles:
 * - Single Responsibility: Only handles debouncing logic
 * - Open/Closed: Extensible through options and callbacks
 * - Liskov Substitution: Can be replaced with other debounce implementations
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Depends on abstractions (callbacks)
 *
 * 📋 Features:
 * - Value debouncing with TypeScript generics
 * - Function debouncing with proper typing
 * - Configurable delay and max wait
 * - Immediate execution option
 * - Cleanup on unmount
 * - Cancel and flush methods
 * - Pending state tracking
 *
 * 🔧 Usage:
 * ```tsx
 * const debouncedValue = useDebounce(searchTerm, 500);
 * const debouncedSearch = useDebouncedCallback(handleSearch, 300, { maxWait: 1000 });
 * const [value, setValue, debouncedValue, cancel] = useDebouncedState('', 500);
 * ```
 */

'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// ============================================
// 🎯 TYPE DEFINITIONS
// ============================================

interface DebouncedState<T> {
  value: T;
  pending: boolean;
}

interface UseDebounceOptions {
  immediate?: boolean;
  maxWait?: number;
  leading?: boolean;
  trailing?: boolean;
}

interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
  pending: () => boolean;
}

// ============================================
// ⏱️ CORE DEBOUNCE VALUE HOOK
// ============================================

export function useDebounce<T>(value: T, delay: number, options: UseDebounceOptions = {}): T {
  const { immediate = false } = options;
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (immediate && mountedRef.current) {
      setDebouncedValue(value);
    }

    const handler = setTimeout(
      () => {
        if (mountedRef.current) {
          setDebouncedValue(value);
        }
      },
      immediate ? 0 : delay
    );

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, immediate]);

  return debouncedValue;
}

// ============================================
// ⏱️ ADVANCED DEBOUNCED CALLBACK HOOK
// ============================================

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: UseDebounceOptions = {}
): DebouncedFunction<T> {
  const { immediate = false, maxWait, leading = false, trailing = true } = options;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTimeRef = useRef<number>(0);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const resultRef = useRef<ReturnType<T> | undefined>(null);
  const mountedRef = useRef(true);
  const leadingRef = useRef(false);

  // Track component mount state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current);
    };
  }, []);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
    lastArgsRef.current = null;
    leadingRef.current = false;
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current && lastArgsRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;

      if (mountedRef.current) {
        resultRef.current = callback(...lastArgsRef.current) as ReturnType<T>;
      }
    }

    cancel();
    return resultRef.current;
  }, [callback, cancel]);

  const pending = useCallback(() => {
    return timeoutRef.current !== null;
  }, []);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      lastArgsRef.current = args;
      const now = Date.now();

      // Handle immediate execution
      if (immediate && !timeoutRef.current) {
        if (mountedRef.current) {
          resultRef.current = callback(...args) as ReturnType<T>;
        }
        return;
      }

      // Handle leading edge execution
      if (leading && !timeoutRef.current && !leadingRef.current) {
        leadingRef.current = true;
        if (mountedRef.current) {
          resultRef.current = callback(...args) as ReturnType<T>;
        }
      }

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set max wait timeout if specified
      if (maxWait && !maxTimeoutRef.current) {
        const maxWaitExpired = now - lastCallTimeRef.current >= maxWait;

        if (maxWaitExpired) {
          if (mountedRef.current) {
            resultRef.current = callback(...args) as ReturnType<T>;
          }
          lastCallTimeRef.current = now;
        } else {
          maxTimeoutRef.current = setTimeout(
            () => {
              if (mountedRef.current && lastArgsRef.current) {
                resultRef.current = callback(...lastArgsRef.current) as ReturnType<T>;
              }
              maxTimeoutRef.current = null;
              lastCallTimeRef.current = Date.now();
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
            },
            maxWait - (now - lastCallTimeRef.current)
          );
        }
      }

      // Set debounce timeout
      timeoutRef.current = setTimeout(() => {
        if (trailing && mountedRef.current && lastArgsRef.current) {
          resultRef.current = callback(...lastArgsRef.current) as ReturnType<T>;
        }

        if (maxTimeoutRef.current) {
          clearTimeout(maxTimeoutRef.current);
          maxTimeoutRef.current = null;
        }

        timeoutRef.current = null;
        leadingRef.current = false;
        lastCallTimeRef.current = Date.now();
      }, delay);

      if (!lastCallTimeRef.current) {
        lastCallTimeRef.current = now;
      }
    },
    [callback, delay, maxWait, leading, trailing, immediate]
  );

  // Add methods to the debounced function
  const enhancedCallback = useMemo(() => {
    const fn = debouncedCallback as DebouncedFunction<T>;
    fn.cancel = cancel;
    fn.flush = flush;
    fn.pending = pending;
    return fn;
  }, [debouncedCallback, cancel, flush, pending]);

  return enhancedCallback;
}

// ============================================
// ⏱️ DEBOUNCED STATE HOOK
// ============================================

export function useDebouncedState<T>(
  initialValue: T,
  delay: number,
  options: UseDebounceOptions = {}
): readonly [T, (value: T | ((prev: T) => T)) => void, T, () => void, DebouncedState<T>] {
  const [value, setValue] = useState<T>(initialValue);
  const [isPending, setIsPending] = useState(false);
  const debouncedValue = useDebounce(value, delay, options);

  useEffect(() => {
    setIsPending(true);
    const timer = setTimeout(() => {
      setIsPending(false);
    }, delay);

    return () => {
      clearTimeout(timer);
      setIsPending(false);
    };
  }, [value, delay]);

  const cancel = useCallback(() => {
    setValue(debouncedValue);
    setIsPending(false);
  }, [debouncedValue]);

  const state: DebouncedState<T> = {
    value: debouncedValue,
    pending: isPending,
  };

  return [value, setValue, debouncedValue, cancel, state] as const;
}

// ============================================
// ⏱️ THROTTLE HOOK
// ============================================

export function useThrottle<T>(
  value: T,
  delay: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): T {
  const { leading = true, trailing = true } = options;
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecutedRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastValueRef = useRef<T>(value);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    lastValueRef.current = value;
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecutedRef.current;

    const execute = () => {
      if (mountedRef.current) {
        setThrottledValue(lastValueRef.current);
        lastExecutedRef.current = Date.now();
      }
    };

    if (timeSinceLastExecution >= delay) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (leading) {
        execute();
      }
    } else if (trailing) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        execute();
        timeoutRef.current = null;
      }, delay - timeSinceLastExecution);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, leading, trailing]);

  return throttledValue;
}

// ============================================
// 🎯 EXPORTS
// ============================================

export default useDebounce;
