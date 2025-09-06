// hooks/common/use-search.ts

/**
 * 🔍 Search Hook
 *
 * Manages search functionality with debouncing and filtering
 */

import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from '../utils/use-debounce';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface UseSearchOptions<T> {
  data: T[];
  searchKeys?: (keyof T)[];
  debounceMs?: number;
  minSearchLength?: number;
  caseSensitive?: boolean;
  fuzzySearch?: boolean;
  onSearch?: (results: T[], query: string) => void;
}

interface UseSearchReturn<T> {
  query: string;
  setQuery: (query: string) => void;
  results: T[];
  isSearching: boolean;
  clearSearch: () => void;
  searchCount: number;
  noResults: boolean;
}

// ============================================
// SEARCH HOOK
// ============================================

export function useSearch<T extends Record<string, any>>(
  options: UseSearchOptions<T>
): UseSearchReturn<T> {
  const {
    data,
    searchKeys = [],
    debounceMs = 300,
    minSearchLength = 1,
    caseSensitive = false,
    fuzzySearch = false,
    onSearch,
  } = options;

  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, debounceMs);

  // Get searchable value from object
  const getSearchableValue = useCallback((item: T, key: keyof T): string => {
    const value = item[key];
    if (value === null || value === undefined) return '';
    return String(value);
  }, []);

  // Fuzzy search implementation
  const fuzzyMatch = useCallback(
    (str: string, pattern: string): boolean => {
      pattern = caseSensitive ? pattern : pattern.toLowerCase();
      str = caseSensitive ? str : str.toLowerCase();

      let patternIdx = 0;
      let strIdx = 0;
      let starIdx = -1;
      let nextIdx = -1;

      while (strIdx < str.length) {
        if (
          patternIdx < pattern.length &&
          (pattern[patternIdx] === str[strIdx] || pattern[patternIdx] === '*')
        ) {
          if (pattern[patternIdx] === '*') {
            starIdx = patternIdx;
            nextIdx = strIdx;
            patternIdx++;
          } else {
            patternIdx++;
            strIdx++;
          }
        } else if (starIdx !== -1) {
          patternIdx = starIdx + 1;
          nextIdx++;
          strIdx = nextIdx;
        } else {
          return false;
        }
      }

      while (patternIdx < pattern.length && pattern[patternIdx] === '*') {
        patternIdx++;
      }

      return patternIdx === pattern.length;
    },
    [caseSensitive]
  );

  // Perform search
  const results = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < minSearchLength) {
      return data;
    }

    setIsSearching(true);

    const searchTerm = caseSensitive ? debouncedQuery : debouncedQuery.toLowerCase();

    const filtered = data.filter(item => {
      // If no search keys specified, search all string properties
      const keysToSearch = searchKeys.length > 0 ? searchKeys : (Object.keys(item) as (keyof T)[]);

      return keysToSearch.some(key => {
        const value = getSearchableValue(item, key);
        const compareValue = caseSensitive ? value : value.toLowerCase();

        if (fuzzySearch) {
          return fuzzyMatch(compareValue, searchTerm);
        } else {
          return compareValue.includes(searchTerm);
        }
      });
    });

    setIsSearching(false);
    onSearch?.(filtered, debouncedQuery);

    return filtered;
  }, [
    data,
    debouncedQuery,
    searchKeys,
    minSearchLength,
    caseSensitive,
    fuzzySearch,
    fuzzyMatch,
    getSearchableValue,
    onSearch,
  ]);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    clearSearch,
    searchCount: results.length,
    noResults: query.length > 0 && results.length === 0,
  };
}

export default useSearch;
