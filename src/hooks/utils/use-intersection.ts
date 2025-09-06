/**
 * 👁️ Intersection Observer Hook
 *
 * This hook provides intersection observer functionality following SOLID principles:
 * - Single Responsibility: Only handles intersection observation
 * - Open/Closed: Extensible through options
 * - Liskov Substitution: Standard observer interface
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Works with IntersectionObserver API
 *
 * 📋 Features:
 * - Element visibility detection
 * - Lazy loading support
 * - Multiple thresholds
 * - Root margin configuration
 * - Disconnect cleanup
 *
 * 🔧 Usage:
 * ```tsx
 * const [ref, isIntersecting] = useIntersection({ threshold: 0.5 });
 * const { ref, entry, isVisible } = useIntersection({ rootMargin: '100px' });
 * ```
 */

'use client';

import { useState, useEffect, useRef, useCallback, RefObject } from 'react';

// ============================================
// 🎯 TYPE DEFINITIONS
// ============================================

interface UseIntersectionOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
  onChange?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void;
  disabled?: boolean;
}

interface UseIntersectionReturn<T extends Element = Element> {
  ref: RefObject<T | null>;
  entry: IntersectionObserverEntry | null;
  isIntersecting: boolean;
  isVisible: boolean;
}

// ============================================
// 👁️ INTERSECTION OBSERVER HOOK
// ============================================

export function useIntersection<T extends Element = Element>(
  options: UseIntersectionOptions = {}
): [RefObject<T | null>, boolean, IntersectionObserverEntry | null] {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
    onChange,
    disabled = false,
  } = options;

  const elementRef = useRef<T>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const frozen = useRef(false);

  const updateEntry = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [firstEntry] = entries;

      if (!firstEntry) return;

      if (frozen.current && !firstEntry.isIntersecting) return;

      if (freezeOnceVisible && firstEntry.isIntersecting) {
        frozen.current = true;
      }

      setEntry(firstEntry);
      setIsIntersecting(firstEntry.isIntersecting);
      onChange?.(firstEntry.isIntersecting, firstEntry);
    },
    [freezeOnceVisible, onChange]
  );

  useEffect(() => {
    const element = elementRef.current;

    if (!element || disabled || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(updateEntry, {
      threshold,
      root,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, disabled, updateEntry]);

  return [elementRef, isIntersecting, entry];
}

// ============================================
// 👁️ ADVANCED INTERSECTION HOOK
// ============================================

export function useIntersectionObserver<T extends Element = Element>(
  options: UseIntersectionOptions = {}
): UseIntersectionReturn<T> {
  const [ref, isIntersecting, entry] = useIntersection<T>(options);

  return {
    ref,
    entry,
    isIntersecting,
    isVisible: isIntersecting,
  };
}

// ============================================
// 👁️ LAZY LOAD HOOK
// ============================================

export function useLazyLoad<T extends Element = Element>(
  onVisible?: () => void,
  options: UseIntersectionOptions = {}
) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [ref, isIntersecting] = useIntersection<T>({
    ...options,
    freezeOnceVisible: true,
    onChange: isIntersecting => {
      if (isIntersecting && !hasLoaded) {
        setHasLoaded(true);
        onVisible?.();
      }
    },
  });

  return {
    ref,
    hasLoaded,
    isIntersecting,
  };
}

// ============================================
// 🎯 EXPORT
// ============================================

export default useIntersection;
