/**
 * 🎯 Hover Hook
 *
 * This hook manages hover state following SOLID principles:
 * - Single Responsibility: Only manages hover state
 * - Open/Closed: Extensible through options
 * - Liskov Substitution: Standard hover interface
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Works with event abstractions
 *
 * 📋 Features:
 * - Hover state management
 * - Delayed hover effects
 * - Touch device support
 * - Accessibility support
 * - Custom event handlers
 *
 * 🔧 Usage:
 * ```tsx
 * const [hoverRef, isHovered] = useHover({ delay: 200 });
 * const { ref, isHovered, bind } = useHover({ onHover: handleHover });
 * ```
 */

'use client';

import { useState, useRef, useCallback, useEffect, RefObject } from 'react';

// ============================================
// 🎯 TYPE DEFINITIONS
// ============================================

interface UseHoverOptions {
  delay?: number;
  delayEnter?: number;
  delayLeave?: number;
  onHover?: (isHovered: boolean) => void;
  onEnter?: () => void;
  onLeave?: () => void;
  disabled?: boolean;
}

interface UseHoverReturn<T extends HTMLElement = HTMLElement> {
  ref: RefObject<T | null>;
  isHovered: boolean;
  bind: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
    onTouchStart: () => void;
    onTouchEnd: () => void;
  };
}

// ============================================
// 🎯 HOVER HOOK
// ============================================

export function useHover<T extends HTMLElement = HTMLElement>(
  options: UseHoverOptions = {}
): [RefObject<T | null>, boolean] {
  const {
    delay = 0,
    delayEnter = delay,
    delayLeave = delay,
    onHover,
    onEnter,
    onLeave,
    disabled = false,
  } = options;

  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<T>(null);
  const enterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = useCallback(() => {
    if (disabled) return;

    // Clear any pending leave timeout
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    if (delayEnter > 0) {
      enterTimeoutRef.current = setTimeout(() => {
        setIsHovered(true);
        onHover?.(true);
        onEnter?.();
      }, delayEnter);
    } else {
      setIsHovered(true);
      onHover?.(true);
      onEnter?.();
    }
  }, [disabled, delayEnter, onHover, onEnter]);

  const handleLeave = useCallback(() => {
    if (disabled) return;

    // Clear any pending enter timeout
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);
      enterTimeoutRef.current = null;
    }

    if (delayLeave > 0) {
      leaveTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
        onHover?.(false);
        onLeave?.();
      }, delayLeave);
    } else {
      setIsHovered(false);
      onHover?.(false);
      onLeave?.();
    }
  }, [disabled, delayLeave, onHover, onLeave]);

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled) return;

    element.addEventListener('mouseenter', handleEnter);
    element.addEventListener('mouseleave', handleLeave);
    element.addEventListener('focus', handleEnter);
    element.addEventListener('blur', handleLeave);

    return () => {
      element.removeEventListener('mouseenter', handleEnter);
      element.removeEventListener('mouseleave', handleLeave);
      element.removeEventListener('focus', handleEnter);
      element.removeEventListener('blur', handleLeave);

      // Clear any pending timeouts
      if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, [handleEnter, handleLeave, disabled]);

  return [ref, isHovered];
}

// ============================================
// 🎯 ADVANCED HOVER HOOK
// ============================================

export function useHoverWithBind<T extends HTMLElement = HTMLElement>(
  options: UseHoverOptions = {}
): UseHoverReturn<T> {
  const [ref, isHovered] = useHover<T>(options);
  const { disabled = false, onEnter, onLeave, onHover } = options;

  const bind = {
    onMouseEnter: useCallback(() => {
      if (!disabled) {
        onEnter?.();
        onHover?.(true);
      }
    }, [disabled, onEnter, onHover]),

    onMouseLeave: useCallback(() => {
      if (!disabled) {
        onLeave?.();
        onHover?.(false);
      }
    }, [disabled, onLeave, onHover]),

    onFocus: useCallback(() => {
      if (!disabled) {
        onEnter?.();
        onHover?.(true);
      }
    }, [disabled, onEnter, onHover]),

    onBlur: useCallback(() => {
      if (!disabled) {
        onLeave?.();
        onHover?.(false);
      }
    }, [disabled, onLeave, onHover]),

    onTouchStart: useCallback(() => {
      if (!disabled) {
        onEnter?.();
        onHover?.(true);
      }
    }, [disabled, onEnter, onHover]),

    onTouchEnd: useCallback(() => {
      if (!disabled) {
        onLeave?.();
        onHover?.(false);
      }
    }, [disabled, onLeave, onHover]),
  };

  return { ref, isHovered, bind };
}

// ============================================
// 🎯 EXPORT
// ============================================

export default useHover;
