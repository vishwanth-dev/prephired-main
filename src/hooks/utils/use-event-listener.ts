/**
 * 🎯 Event Listener Hook
 *
 * This hook provides event listener management following SOLID principles:
 * - Single Responsibility: Only manages event listeners
 * - Open/Closed: Extensible through generic types
 * - Liskov Substitution: Works with any event target
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Works with EventTarget abstraction
 *
 * 📋 Features:
 * - Type-safe event handling
 * - Automatic cleanup
 * - Support for window, document, and element events
 * - Passive and capture options
 * - Conditional attachment
 *
 * 🔧 Usage:
 * ```tsx
 * useEventListener('resize', handleResize);
 * useEventListener('click', handleClick, elementRef);
 * useEventListener('scroll', handleScroll, { passive: true });
 * ```
 */

'use client';

import { useEffect, useRef } from 'react';

// ============================================
// 🎯 TYPE DEFINITIONS
// ============================================

type EventMap = WindowEventMap & DocumentEventMap & HTMLElementEventMap;

type EventTarget = Window | Document | HTMLElement | null;

interface UseEventListenerOptions extends AddEventListenerOptions {
  enabled?: boolean;
}

// ============================================
// 🎯 EVENT LISTENER HOOK
// ============================================

export const useEventListener = <K extends keyof EventMap>(
  eventName: K,
  handler: (event: EventMap[K]) => void,
  targetOrOptions?: EventTarget | React.RefObject<EventTarget> | UseEventListenerOptions,
  options?: UseEventListenerOptions
): void => {
  // Parse arguments
  const isOptionsOnly =
    targetOrOptions &&
    !('current' in targetOrOptions) &&
    typeof targetOrOptions === 'object' &&
    !('addEventListener' in targetOrOptions);

  const target = isOptionsOnly ? window : targetOrOptions;
  const eventOptions = isOptionsOnly ? targetOrOptions : options;

  // Store handler in ref to avoid re-attaching
  const savedHandler = useRef(handler);

  // Update handler ref on change
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Check if listener should be attached
    const { enabled = true, ...listenerOptions } = eventOptions || {};
    if (!enabled) return;

    // Get the target element
    const targetElement = (() => {
      if (!target) return window;
      if ('current' in target) return target.current || window;
      return target;
    })();

    // Skip if target doesn't support events
    if (!targetElement || !('addEventListener' in targetElement)) return;

    // Create event handler that calls saved handler
    const eventListener = (event: Event) => {
      savedHandler.current(event as EventMap[K]);
    };

    // Add event listener
    targetElement.addEventListener(eventName, eventListener, listenerOptions);

    // Cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener, listenerOptions);
    };
  }, [eventName, target, eventOptions]);
};

// ============================================
// 🎯 SPECIALIZED EVENT HOOKS
// ============================================

export const useWindowEvent = <K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: UseEventListenerOptions
): void => {
  useEventListener(eventName, handler, window, options);
};

export const useDocumentEvent = <K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: UseEventListenerOptions
): void => {
  useEventListener(eventName, handler, typeof document !== 'undefined' ? document : null, options);
};

// ============================================
// 🎯 EXPORT
// ============================================

export default useEventListener;
