/**
 * 🎯 Click Outside Hook
 *
 * This hook detects clicks outside an element following SOLID principles:
 * - Single Responsibility: Only handles outside click detection
 * - Open/Closed: Extensible through options
 * - Liskov Substitution: Standard click handler interface
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Works with event abstractions
 *
 * 📋 Features:
 * - Outside click detection
 * - Multiple refs support
 * - Event type configuration
 * - Conditional activation
 * - Touch support
 *
 * 🔧 Usage:
 * ```tsx
 * const ref = useClickOutside(handleClose);
 * useClickOutside(ref, handleOutsideClick, { events: ['mousedown', 'touchstart'] });
 * ```
 */

'use client';

import { useRef, useEffect, RefObject } from 'react';

// ============================================
// 🎯 TYPE DEFINITIONS
// ============================================

type EventType = 'mousedown' | 'mouseup' | 'touchstart' | 'touchend' | 'click';

interface UseClickOutsideOptions {
  events?: EventType[];
  enabled?: boolean;
  detectIframe?: boolean;
}

type Handler = (event: MouseEvent | TouchEvent) => void;

// ============================================
// 🎯 CLICK OUTSIDE HOOK
// ============================================

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: Handler,
  options: UseClickOutsideOptions = {}
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useClickOutsideWithRef(ref as RefObject<T>, handler, options);

  return ref;
}

export function useClickOutsideWithRef<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T> | RefObject<T>[],
  handler: Handler,
  options: UseClickOutsideOptions = {}
): void {
  const { events = ['mousedown', 'touchstart'], enabled = true, detectIframe = true } = options;

  const savedHandler = useRef(handler);

  // Update handler ref on change
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const refs = Array.isArray(ref) ? ref : [ref];

      // Check if click is inside any of the refs
      const isInside = refs.some(r => {
        if (!r.current) return false;
        return r.current.contains(event.target as Node);
      });

      if (!isInside) {
        savedHandler.current(event);
      }
    };

    // Handle iframe clicks if enabled
    const handleIframeClick = () => {
      if (detectIframe) {
        savedHandler.current(new MouseEvent('click'));
      }
    };

    // Add event listeners
    events.forEach(eventType => {
      document.addEventListener(eventType, listener as EventListener);
    });

    if (detectIframe) {
      window.addEventListener('blur', handleIframeClick);
    }

    return () => {
      events.forEach(eventType => {
        document.removeEventListener(eventType, listener as EventListener);
      });

      if (detectIframe) {
        window.removeEventListener('blur', handleIframeClick);
      }
    };
  }, [ref, events, enabled, detectIframe]);
}

// ============================================
// 🎯 ADVANCED CLICK OUTSIDE HOOK
// ============================================

export function useClickAway<T extends HTMLElement = HTMLElement>(
  onClickAway: (event: MouseEvent | TouchEvent) => void,
  refs: RefObject<T>[],
  options: UseClickOutsideOptions = {}
): void {
  useClickOutsideWithRef(refs, onClickAway, options);
}

// ============================================
// 🎯 EXPORT
// ============================================

export default useClickOutside;
