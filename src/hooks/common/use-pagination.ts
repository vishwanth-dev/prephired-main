// hooks/common/use-pagination.ts

/**
 * 📄 Pagination Hook
 *
 * Manages pagination state and logic
 */

import { useState, useCallback, useMemo } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  total?: number;
}

interface UsePaginationReturn {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  startIndex: number;
  endIndex: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotal: (total: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  canGo: (page: number) => boolean;
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const { initialPage = 1, initialPageSize = 10, total: initialTotal = 0 } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(initialTotal);

  const totalPages = useMemo(() => Math.ceil(total / pageSize) || 1, [total, pageSize]);

  const hasNext = page < totalPages;
  const hasPrevious = page > 1;
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize - 1, total - 1);

  const nextPage = useCallback(() => {
    if (hasNext) setPage(page + 1);
  }, [hasNext, page]);

  const previousPage = useCallback(() => {
    if (hasPrevious) setPage(page - 1);
  }, [hasPrevious, page]);

  const firstPage = useCallback(() => setPage(1), []);
  const lastPage = useCallback(() => setPage(totalPages), [totalPages]);

  const canGo = useCallback(
    (targetPage: number) => targetPage >= 1 && targetPage <= totalPages,
    [totalPages]
  );

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext,
    hasPrevious,
    startIndex,
    endIndex,
    setPage,
    setPageSize,
    setTotal,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    canGo,
  };
}

export default usePagination;
