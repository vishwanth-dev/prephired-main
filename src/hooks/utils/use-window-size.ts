/**
 * 📐 Window Size Hook
 *
 * This hook provides window dimensions tracking following SOLID principles:
 * - Single Responsibility: Only tracks window dimensions
 * - Open/Closed: Extensible through options
 * - Liskov Substitution: Standard dimensions interface
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Depends on window abstraction
 *
 * 📋 Features:
 * - Real-time window dimension tracking
 * - Debounced resize events
 * - SSR compatibility
 * - Breakpoint detection
 * - Orientation tracking
 *
 * 🔧 Usage:
 * ```tsx
 * const { width, height, isDesktop, isMobile } = useWindowSize();
 * const dimensions = useWindowSize({ debounceMs: 200 });
 * ```
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { UI_CONFIG } from '@/constants/config';
import useDebounce from './use-debounce';

// ============================================
// 🎯 INTERFACE DEFINITIONS
// ============================================

interface WindowSize {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  outerWidth: number;
  outerHeight: number;
}

interface UseWindowSizeOptions {
  debounceMs?: number;
  initialWidth?: number;
  initialHeight?: number;
}

interface UseWindowSizeReturn extends WindowSize {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  orientation: 'portrait' | 'landscape';
  breakpoint: 'mobile' | 'tablet' | 'desktop' | 'largeDesktop';
}

// ============================================
// 📐 WINDOW SIZE HOOK
// ============================================

export const useWindowSize = (options: UseWindowSizeOptions = {}): UseWindowSizeReturn => {
  const { debounceMs = 150, initialWidth = 1200, initialHeight = 800 } = options;

  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (typeof window === 'undefined') {
      return {
        width: initialWidth,
        height: initialHeight,
        innerWidth: initialWidth,
        innerHeight: initialHeight,
        outerWidth: initialWidth,
        outerHeight: initialHeight,
      };
    }

    return {
      width: window.innerWidth,
      height: window.innerHeight,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
    };
  });

  const handleResize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
    });
  }, []);

  const debouncedSize = useDebounce(windowSize, debounceMs);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // Calculate breakpoints and orientation
  const breakpoints = UI_CONFIG.BREAKPOINTS;
  const width = debouncedSize.width;

  const isMobile = width < breakpoints.MD;
  const isTablet = width >= breakpoints.MD && width < breakpoints.LG;
  const isDesktop = width >= breakpoints.LG && width < breakpoints.XL;
  const isLargeDesktop = width >= breakpoints.XL;

  const orientation = debouncedSize.width > debouncedSize.height ? 'landscape' : 'portrait';

  const breakpoint = isMobile
    ? 'mobile'
    : isTablet
      ? 'tablet'
      : isDesktop
        ? 'desktop'
        : 'largeDesktop';

  return {
    ...debouncedSize,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    orientation,
    breakpoint,
  };
};

// ============================================
// 📐 MEDIA QUERY HOOK
// ============================================

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
};

// ============================================
// 🎯 EXPORT
// ============================================

export default useWindowSize;
