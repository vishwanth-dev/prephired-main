/**
 * 📦 Previous Value Hook
 *
 * This hook tracks previous values following SOLID principles:
 * - Single Responsibility: Only tracks previous values
 * - Open/Closed: Works with any value type
 * - Liskov Substitution: Standard React hook interface
 * - Interface Segregation: Minimal, focused interface
 * - Dependency Inversion: Works with any data type
 *
 * 📋 Features:
 * - Track previous render values
 * - History tracking
 * - Type-safe generics
 * - Comparison functions
 * - Reset capability
 *
 * 🔧 Usage:
 * ```tsx
 * const previousCount = usePrevious(count);
 * const [history, previousValue] = usePreviousHistory(value, 5);
 * ```
 */

'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

// ============================================
// 📦 BASIC PREVIOUS VALUE HOOK
// ============================================

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// ============================================
// 📦 ADVANCED PREVIOUS VALUE HOOK
// ============================================

export function usePreviousDistinct<T>(
  value: T,
  compare?: (prev: T, curr: T) => boolean
): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  const previousValue = ref.current;

  const isEqual = compare || ((a, b) => a === b);

  useEffect(() => {
    if (!previousValue || !isEqual(previousValue, value)) {
      ref.current = value;
    }
  }, [value, previousValue, isEqual]);

  return previousValue;
}

// ============================================
// 📦 PREVIOUS VALUE WITH HISTORY HOOK
// ============================================

export function usePreviousHistory<T>(
  value: T,
  maxHistory: number = 10
): {
  history: T[];
  previous: T | undefined;
  reset: () => void;
  getPrevious: (stepsBack?: number) => T | undefined;
} {
  const [history, setHistory] = useState<T[]>([]);

  useEffect(() => {
    setHistory(prev => {
      const newHistory = [value, ...prev];
      return newHistory.slice(0, maxHistory);
    });
  }, [value, maxHistory]);

  const reset = useCallback(() => {
    setHistory([]);
  }, []);

  const getPrevious = useCallback(
    (stepsBack: number = 1): T | undefined => {
      return history[stepsBack];
    },
    [history]
  );

  return {
    history,
    previous: history[0],
    reset,
    getPrevious,
  };
}

// ============================================
// 📦 CHANGED DETECTION HOOK
// ============================================

export function useHasChanged<T>(value: T, compare?: (prev: T, curr: T) => boolean): boolean {
  const previousValue = usePrevious(value);

  if (previousValue === undefined) return false;

  const isEqual = compare || ((a, b) => a === b);
  return !isEqual(previousValue, value);
}

// ============================================
// 📦 COMPARE VALUES HOOK
// ============================================

export function useCompare<T>(value: T): {
  current: T;
  previous: T | undefined;
  hasChanged: boolean;
  isInitial: boolean;
  changes: Partial<T> | null;
} {
  const previous = usePrevious(value);
  const isInitial = previous === undefined;
  const hasChanged = !isInitial && previous !== value;

  const changes = useCallback(() => {
    if (!hasChanged || typeof value !== 'object' || value === null || previous === undefined) {
      return null;
    }

    const diff: Partial<T> = {};

    for (const key in value) {
      if (value[key] !== (previous as any)[key]) {
        diff[key] = value[key];
      }
    }

    return diff;
  }, [value, previous, hasChanged]);

  return {
    current: value,
    previous,
    hasChanged,
    isInitial,
    changes: changes(),
  };
}

// ============================================
// 🎯 EXPORT
// ============================================

export default usePrevious;
