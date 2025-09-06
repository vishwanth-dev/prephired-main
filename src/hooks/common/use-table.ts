// hooks/common/use-table.ts

/**
 * 📋 Table Hook
 *
 * Complete table management with pagination, sorting, filtering, and selection
 */

import { useState, useCallback, useMemo } from 'react';
import { usePagination } from './use-pagination';
import { useSort } from './use-sort';
import { useFilter } from './use-filter';
import { useSearch } from './use-search';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface UseTableOptions<T> {
  data: T[];
  pageSize?: number;
  searchKeys?: (keyof T)[];
  selectable?: boolean;
  getRowId?: (row: T) => string | number;
}

interface UseTableReturn<T> {
  // Data
  rows: T[];
  displayedRows: T[];

  // Pagination
  page: number;
  pageSize: number;
  totalPages: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;

  // Sorting
  sortBy: (field: keyof T) => void;
  getSortDirection: (field: keyof T) => 'asc' | 'desc' | null;

  // Filtering
  filters: any[];
  addFilter: (filter: any) => void;
  removeFilter: (index: number) => void;
  clearFilters: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Selection
  selectedRows: Set<string | number>;
  selectRow: (id: string | number) => void;
  selectAllRows: () => void;
  clearSelection: () => void;
  isRowSelected: (id: string | number) => boolean;
  selectedCount: number;
}

// ============================================
// TABLE HOOK
// ============================================

export function useTable<T extends Record<string, any>>(
  options: UseTableOptions<T>
): UseTableReturn<T> {
  const {
    data,
    pageSize: initialPageSize = 10,
    searchKeys = [],
    selectable = false,
    getRowId = (row: T) => (row as any).id,
  } = options;

  // Selection state
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

  // Search
  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    results: searchResults,
  } = useSearch({
    data,
    searchKeys,
    debounceMs: 300,
  });

  // Filter
  const {
    filters,
    results: filterResults,
    addFilter,
    removeFilter,
    clearFilters,
  } = useFilter({
    data: searchResults,
  });

  // Sort
  const { sortedData, toggleSort, getSortDirection } = useSort({
    data: filterResults,
  });

  // Pagination
  const { page, pageSize, totalPages, setPage, nextPage, previousPage, startIndex, endIndex } =
    usePagination({
      initialPageSize,
      total: sortedData.length,
    });

  // Get displayed rows (paginated)
  const displayedRows = useMemo(() => {
    return sortedData.slice(startIndex, endIndex + 1);
  }, [sortedData, startIndex, endIndex]);

  // Selection functions
  const selectRow = useCallback(
    (id: string | number) => {
      if (!selectable) return;

      setSelectedRows(prev => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [selectable]
  );

  const selectAllRows = useCallback(() => {
    if (!selectable) return;

    const allDisplayedIds = displayedRows.map(getRowId);
    const allSelected = allDisplayedIds.every(id => selectedRows.has(id));

    if (allSelected) {
      // Deselect all displayed rows
      setSelectedRows(prev => {
        const next = new Set(prev);
        allDisplayedIds.forEach(id => next.delete(id));
        return next;
      });
    } else {
      // Select all displayed rows
      setSelectedRows(prev => {
        const next = new Set(prev);
        allDisplayedIds.forEach(id => next.add(id));
        return next;
      });
    }
  }, [selectable, displayedRows, selectedRows, getRowId]);

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  const isRowSelected = useCallback(
    (id: string | number) => {
      return selectedRows.has(id);
    },
    [selectedRows]
  );

  return {
    rows: sortedData,
    displayedRows,
    page,
    pageSize,
    totalPages,
    setPage,
    nextPage,
    previousPage,
    sortBy: toggleSort,
    getSortDirection,
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    searchQuery,
    setSearchQuery,
    selectedRows,
    selectRow,
    selectAllRows,
    clearSelection,
    isRowSelected,
    selectedCount: selectedRows.size,
  };
}

export default useTable;
