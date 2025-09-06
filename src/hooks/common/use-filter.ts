// hooks/common/use-filter.ts

/**
 * 🎯 Filter Hook
 *
 * Advanced filtering with multiple criteria
 */

import { useState, useCallback, useMemo } from 'react';

// ============================================
// TYPE DEFINITIONS
// ============================================

type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'nin'
  | 'contains'
  | 'regex';

interface FilterCriteria<T> {
  field: keyof T;
  operator: FilterOperator;
  value: any;
  enabled?: boolean;
}

interface FilterGroup<T> {
  operator: 'AND' | 'OR';
  filters: (FilterCriteria<T> | FilterGroup<T>)[];
}

interface UseFilterOptions<T> {
  data: T[];
  initialFilters?: FilterCriteria<T>[];
  initialGroups?: FilterGroup<T>[];
  onFilter?: (results: T[], filters: FilterCriteria<T>[], groups: FilterGroup<T>[]) => void;
}

interface UseFilterReturn<T> {
  filters: FilterCriteria<T>[];
  groups: FilterGroup<T>[];
  results: T[];
  addFilter: (filter: FilterCriteria<T>) => void;
  removeFilter: (index: number) => void;
  updateFilter: (index: number, filter: FilterCriteria<T>) => void;
  clearFilters: () => void;
  setFilters: (filters: FilterCriteria<T>[]) => void;
  toggleFilter: (index: number) => void;
  addGroup: (group: FilterGroup<T>) => void;
  removeGroup: (index: number) => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
}

// ============================================
// FILTER HOOK
// ============================================

export function useFilter<T extends Record<string, any>>(
  options: UseFilterOptions<T>
): UseFilterReturn<T> {
  const { data, initialFilters = [], initialGroups = [], onFilter } = options;

  const [filters, setFilters] = useState<FilterCriteria<T>[]>(initialFilters);
  const [groups, setGroups] = useState<FilterGroup<T>[]>(initialGroups);

  // Apply filter operation
  const applyOperator = useCallback(
    (value: any, operator: FilterOperator, filterValue: any): boolean => {
      switch (operator) {
        case 'eq':
          return value === filterValue;
        case 'neq':
          return value !== filterValue;
        case 'gt':
          return value > filterValue;
        case 'gte':
          return value >= filterValue;
        case 'lt':
          return value < filterValue;
        case 'lte':
          return value <= filterValue;
        case 'in':
          return Array.isArray(filterValue) ? filterValue.includes(value) : false;
        case 'nin':
          return Array.isArray(filterValue) ? !filterValue.includes(value) : true;
        case 'contains':
          return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
        case 'regex':
          try {
            const regex = new RegExp(filterValue, 'i');
            return regex.test(String(value));
          } catch {
            return false;
          }
        default:
          return true;
      }
    },
    []
  );

  // Apply filters to data
  const results = useMemo(() => {
    const activeFilters = filters.filter(f => f.enabled !== false);

    if (activeFilters.length === 0 && groups.length === 0) {
      return data;
    }

    const filtered = data.filter(item => {
      // Apply individual filters
      const passesFilters = activeFilters.every(filter => {
        const value = item[filter.field];
        return applyOperator(value, filter.operator, filter.value);
      });

      // Apply filter groups
      const passesGroups = groups.every(group => {
        const groupResults = group.filters.map(filterOrGroup => {
          if ('operator' in filterOrGroup) {
            // It's a nested group - recursively apply filters
            return (filterOrGroup as FilterGroup<T>).filters.every(nestedFilterOrGroup => {
              if ('operator' in nestedFilterOrGroup) {
                // Nested group within group - for now, just return true
                return true;
              } else {
                // It's a filter criteria
                const nestedFilter = nestedFilterOrGroup as FilterCriteria<T>;
                const value = item[nestedFilter.field];
                return applyOperator(value, nestedFilter.operator, nestedFilter.value);
              }
            });
          } else {
            // It's a filter criteria
            const filter = filterOrGroup as FilterCriteria<T>;
            const value = item[filter.field];
            return applyOperator(value, filter.operator, filter.value);
          }
        });

        return group.operator === 'AND'
          ? groupResults.every(result => result)
          : groupResults.some(result => result);
      });

      return passesFilters && passesGroups;
    });

    onFilter?.(filtered, activeFilters, groups);
    return filtered;
  }, [data, filters, groups, applyOperator, onFilter]);

  // Filter management functions
  const addFilter = useCallback((filter: FilterCriteria<T>) => {
    setFilters(prev => [...prev, { ...filter, enabled: filter.enabled ?? true }]);
  }, []);

  const removeFilter = useCallback((index: number) => {
    setFilters(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateFilter = useCallback((index: number, filter: FilterCriteria<T>) => {
    setFilters(prev => prev.map((f, i) => (i === index ? filter : f)));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  const toggleFilter = useCallback((index: number) => {
    setFilters(prev => prev.map((f, i) => (i === index ? { ...f, enabled: !f.enabled } : f)));
  }, []);

  const addGroup = useCallback((group: FilterGroup<T>) => {
    setGroups(prev => [...prev, group]);
  }, []);

  const removeGroup = useCallback((index: number) => {
    setGroups(prev => prev.filter((_, i) => i !== index));
  }, []);

  const activeFiltersCount = filters.filter(f => f.enabled !== false).length;

  return {
    filters,
    groups,
    results,
    addFilter,
    removeFilter,
    updateFilter,
    clearFilters,
    setFilters,
    toggleFilter,
    addGroup,
    removeGroup,
    activeFiltersCount,
    hasActiveFilters: activeFiltersCount > 0 || groups.length > 0,
  };
}

export default useFilter;
