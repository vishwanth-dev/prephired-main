// hooks/common/use-sort.ts

/**
 * 📊 Sort Hook
 *
 * Manages sorting with multiple criteria
 */

import { useState, useCallback, useMemo } from 'react';

// ============================================
// TYPE DEFINITIONS
// ============================================

type SortDirection = 'asc' | 'desc';

interface SortCriteria<T> {
  field: keyof T;
  direction: SortDirection;
  priority?: number;
}

interface UseSortOptions<T> {
  data: T[];
  initialSort?: SortCriteria<T>[];
  onSort?: (results: T[], criteria: SortCriteria<T>[]) => void;
}

interface UseSortReturn<T> {
  sortCriteria: SortCriteria<T>[];
  sortedData: T[];
  sortBy: (field: keyof T, direction?: SortDirection) => void;
  toggleSort: (field: keyof T) => void;
  clearSort: () => void;
  addSortCriteria: (criteria: SortCriteria<T>) => void;
  removeSortCriteria: (field: keyof T) => void;
  getSortDirection: (field: keyof T) => SortDirection | null;
  isSorted: (field: keyof T) => boolean;
}

// ============================================
// SORT HOOK
// ============================================

export function useSort<T extends Record<string, any>>(
  options: UseSortOptions<T>
): UseSortReturn<T> {
  const { data, initialSort = [], onSort } = options;

  const [sortCriteria, setSortCriteria] = useState<SortCriteria<T>[]>(initialSort);

  // Compare function for sorting
  const compareValues = useCallback((a: any, b: any, direction: SortDirection): number => {
    // Handle null/undefined
    if (a == null && b == null) return 0;
    if (a == null) return direction === 'asc' ? 1 : -1;
    if (b == null) return direction === 'asc' ? -1 : 1;

    // Handle different types
    if (typeof a === 'string' && typeof b === 'string') {
      const comparison = a.localeCompare(b, undefined, { numeric: true });
      return direction === 'asc' ? comparison : -comparison;
    }

    if (a instanceof Date && b instanceof Date) {
      const comparison = a.getTime() - b.getTime();
      return direction === 'asc' ? comparison : -comparison;
    }

    // Default numeric comparison
    const comparison = a < b ? -1 : a > b ? 1 : 0;
    return direction === 'asc' ? comparison : -comparison;
  }, []);

  // Sort data
  const sortedData = useMemo(() => {
    if (sortCriteria.length === 0) {
      return data;
    }

    const sorted = [...data].sort((a, b) => {
      for (const criteria of sortCriteria) {
        const aValue = a[criteria.field];
        const bValue = b[criteria.field];
        const comparison = compareValues(aValue, bValue, criteria.direction);

        if (comparison !== 0) {
          return comparison;
        }
      }
      return 0;
    });

    onSort?.(sorted, sortCriteria);
    return sorted;
  }, [data, sortCriteria, compareValues, onSort]);

  // Sort by specific field
  const sortBy = useCallback((field: keyof T, direction: SortDirection = 'asc') => {
    setSortCriteria([{ field, direction }]);
  }, []);

  // Toggle sort direction for field
  const toggleSort = useCallback((field: keyof T) => {
    setSortCriteria(prev => {
      const existing = prev.find(s => s.field === field);

      if (!existing) {
        return [{ field, direction: 'asc' }];
      }

      if (existing.direction === 'asc') {
        return [{ field, direction: 'desc' }];
      }

      // Remove sort if it was desc
      return prev.filter(s => s.field !== field);
    });
  }, []);

  // Clear all sorting
  const clearSort = useCallback(() => {
    setSortCriteria([]);
  }, []);

  // Add sort criteria
  const addSortCriteria = useCallback((criteria: SortCriteria<T>) => {
    setSortCriteria(prev => {
      const existing = prev.findIndex(s => s.field === criteria.field);
      if (existing !== -1) {
        return prev.map((s, i) => (i === existing ? criteria : s));
      }
      return [...prev, criteria];
    });
  }, []);

  // Remove sort criteria
  const removeSortCriteria = useCallback((field: keyof T) => {
    setSortCriteria(prev => prev.filter(s => s.field !== field));
  }, []);

  // Get sort direction for field
  const getSortDirection = useCallback(
    (field: keyof T): SortDirection | null => {
      const criteria = sortCriteria.find(s => s.field === field);
      return criteria?.direction || null;
    },
    [sortCriteria]
  );

  // Check if field is sorted
  const isSorted = useCallback(
    (field: keyof T): boolean => {
      return sortCriteria.some(s => s.field === field);
    },
    [sortCriteria]
  );

  return {
    sortCriteria,
    sortedData,
    sortBy,
    toggleSort,
    clearSort,
    addSortCriteria,
    removeSortCriteria,
    getSortDirection,
    isSorted,
  };
}

export default useSort;
