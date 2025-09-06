/**
 * 💾 Local Storage Hook
 *
 * This hook provides localStorage functionality following SOLID principles:
 * - Single Responsibility: Only handles localStorage operations
 * - Open/Closed: Extensible through serializers and event syncing
 * - Liskov Substitution: Compatible with standard state hooks
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Depends on Storage abstraction
 *
 * 📋 Features:
 * - Type-safe storage operations
 * - Custom serialization/deserialization
 * - Cross-tab synchronization
 * - Error handling
 * - SSR compatibility
 *
 * 🔧 Usage:
 * ```tsx
 * const [user, setUser, removeUser] = useLocalStorage('user', defaultUser);
 * const [theme, setTheme] = useLocalStorage('theme', 'light', { syncTabs: true });
 * ```
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================
// 🎯 INTERFACE DEFINITIONS
// ============================================

interface UseLocalStorageOptions<T> {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  syncTabs?: boolean;
  onError?: (error: Error) => void;
}

interface StorageEvent extends Event {
  key: string | null;
  newValue: string | null;
  oldValue: string | null;
  storageArea: Storage | null;
  url?: string;
}

// ============================================
// 🛠️ HELPER FUNCTIONS
// ============================================

const isSSR = typeof window === 'undefined';

const defaultSerializer = <T>(value: T): string => {
  return JSON.stringify(value);
};

const defaultDeserializer = <T>(value: string): T => {
  return JSON.parse(value);
};

// ============================================
// 💾 LOCAL STORAGE HOOK
// ============================================

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
): readonly [T, (value: T | ((val: T) => T)) => void, () => void] => {
  const {
    serializer = defaultSerializer,
    deserializer = defaultDeserializer,
    syncTabs = false,
    onError,
  } = options;

  // Use ref to store the current value for sync purposes
  const valueRef = useRef<T>(initialValue);

  // Initialize state with stored value or initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (isSSR) return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      const value = item ? deserializer(item) : initialValue;
      valueRef.current = value;
      return value;
    } catch (error) {
      onError?.(error as Error);
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Set value in state and localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(valueRef.current) : value;

        setStoredValue(valueToStore);
        valueRef.current = valueToStore;

        if (!isSSR) {
          window.localStorage.setItem(key, serializer(valueToStore));

          // Dispatch custom event for cross-component sync
          window.dispatchEvent(
            new CustomEvent('local-storage', {
              detail: { key, value: valueToStore },
            })
          );
        }
      } catch (error) {
        onError?.(error as Error);
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, serializer, onError]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      valueRef.current = initialValue;

      if (!isSSR) {
        window.localStorage.removeItem(key);

        // Dispatch custom event for cross-component sync
        window.dispatchEvent(
          new CustomEvent('local-storage', {
            detail: { key, value: null },
          })
        );
      }
    } catch (error) {
      onError?.(error as Error);
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue, onError]);

  // Handle storage events for cross-tab sync
  useEffect(() => {
    if (isSSR || !syncTabs) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = deserializer(e.newValue);
          setStoredValue(newValue);
          valueRef.current = newValue;
        } catch (error) {
          onError?.(error as Error);
        }
      }
    };

    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value ?? initialValue);
        valueRef.current = e.detail.value ?? initialValue;
      }
    };

    window.addEventListener('storage', handleStorageChange as EventListener);
    window.addEventListener('local-storage', handleCustomStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('local-storage', handleCustomStorageChange as EventListener);
    };
  }, [key, syncTabs, deserializer, initialValue, onError]);

  return [storedValue, setValue, removeValue] as const;
};

// ============================================
// 💾 SESSION STORAGE HOOK
// ============================================

export const useSessionStorage = <T>(
  key: string,
  initialValue: T,
  options: Omit<UseLocalStorageOptions<T>, 'syncTabs'> = {}
): readonly [T, (value: T | ((val: T) => T)) => void, () => void] => {
  const { serializer = defaultSerializer, deserializer = defaultDeserializer, onError } = options;

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (isSSR) return initialValue;

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? deserializer(item) : initialValue;
    } catch (error) {
      onError?.(error as Error);
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (!isSSR) {
          window.sessionStorage.setItem(key, serializer(valueToStore));
        }
      } catch (error) {
        onError?.(error as Error);
        console.warn(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue, serializer, onError]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);

      if (!isSSR) {
        window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      onError?.(error as Error);
      console.warn(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue, onError]);

  return [storedValue, setValue, removeValue] as const;
};

// ============================================
// 🎯 EXPORT
// ============================================

export default useLocalStorage;
