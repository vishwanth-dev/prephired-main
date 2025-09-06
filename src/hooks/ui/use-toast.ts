/**
 * 🍞 Toast Hook
 *
 * This hook manages toast notifications following SOLID principles:
 * - Single Responsibility: Only handles toast notifications
 * - Open/Closed: Extensible through custom renderers
 * - Liskov Substitution: Standard notification interface
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Works with notification abstractions
 *
 * 📋 Features:
 * - Multiple toast types
 * - Auto-dismiss
 * - Queue management
 * - Custom actions
 * - Position control
 *
 * 🔧 Usage:
 * ```tsx
 * const toast = useToast();
 * toast.success('Operation completed!');
 * toast.error('Something went wrong', { duration: 5000 });
 * ```
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// ============================================
// 🎯 TYPE DEFINITIONS
// ============================================

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';
type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: ToastAction;
  createdAt: Date;
}

interface ToastOptions {
  duration?: number;
  title?: string;
  action?: ToastAction;
  pauseOnHover?: boolean;
}

interface UseToastOptions {
  position?: ToastPosition;
  maxToasts?: number;
  defaultDuration?: number;
  pauseOnHover?: boolean;
}

interface UseToastReturn {
  toasts: Toast[];
  position: ToastPosition;
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  loading: (message: string, options?: ToastOptions) => string;
  custom: (toast: Omit<Toast, 'id' | 'createdAt'>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  update: (id: string, updates: Partial<Toast>) => void;
  handleMouseEnter: (id: string) => void;
  handleMouseLeave: (id: string) => void;
}

// ============================================
// 🍞 TOAST HOOK
// ============================================

let toastId = 0;

export function useToast(options: UseToastOptions = {}): UseToastReturn {
  const {
    position = 'bottom-right',
    maxToasts = 5,
    defaultDuration = 3000,
    pauseOnHover = true,
  } = options;

  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const pausedToasts = useRef<Set<string>>(new Set());

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Auto-dismiss toasts
  const scheduleDismiss = useCallback((id: string, duration: number) => {
    // Clear existing timeout if any
    const existingTimeout = timeoutRefs.current.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Schedule new timeout
    const timeout = setTimeout(() => {
      if (!pausedToasts.current.has(id)) {
        dismiss(id);
      } else {
        // Reschedule if paused
        scheduleDismiss(id, 1000);
      }
    }, duration);

    timeoutRefs.current.set(id, timeout);
  }, []);

  // Handle pause on hover
  const handleMouseEnter = useCallback(
    (id: string) => {
      if (pauseOnHover) {
        pausedToasts.current.add(id);
      }
    },
    [pauseOnHover]
  );

  const handleMouseLeave = useCallback(
    (id: string) => {
      if (pauseOnHover) {
        pausedToasts.current.delete(id);
      }
    },
    [pauseOnHover]
  );

  // Create toast
  const createToast = useCallback(
    (type: ToastType, message: string, options?: ToastOptions): string => {
      const id = `toast-${++toastId}`;
      const duration = options?.duration ?? defaultDuration;

      const newToast: Toast = {
        id,
        type,
        message,
        ...(options?.title && { title: options.title }),
        duration,
        ...(options?.action && { action: options.action }),
        createdAt: new Date(),
      };

      setToasts(prev => {
        // Limit number of toasts
        const updated = [newToast, ...prev].slice(0, maxToasts);
        return updated;
      });

      // Schedule auto-dismiss if duration is set
      if (duration && duration > 0 && type !== 'loading') {
        scheduleDismiss(id, duration);
      }

      return id;
    },
    [defaultDuration, maxToasts, scheduleDismiss]
  );

  // Dismiss toast
  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));

    // Clear timeout
    const timeout = timeoutRefs.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutRefs.current.delete(id);
    }

    pausedToasts.current.delete(id);
  }, []);

  // Dismiss all toasts
  const dismissAll = useCallback(() => {
    setToasts([]);

    // Clear all timeouts
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current.clear();
    pausedToasts.current.clear();
  }, []);

  // Update toast
  const update = useCallback(
    (id: string, updates: Partial<Toast>) => {
      setToasts(prev => prev.map(toast => (toast.id === id ? { ...toast, ...updates } : toast)));

      // Reschedule dismiss if duration changed
      if (updates.duration) {
        scheduleDismiss(id, updates.duration);
      }
    },
    [scheduleDismiss]
  );

  // Toast methods
  const success = useCallback(
    (message: string, options?: ToastOptions) => createToast('success', message, options),
    [createToast]
  );

  const error = useCallback(
    (message: string, options?: ToastOptions) =>
      createToast('error', message, { duration: 5000, ...options }),
    [createToast]
  );

  const warning = useCallback(
    (message: string, options?: ToastOptions) => createToast('warning', message, options),
    [createToast]
  );

  const info = useCallback(
    (message: string, options?: ToastOptions) => createToast('info', message, options),
    [createToast]
  );

  const loading = useCallback(
    (message: string, options?: ToastOptions) =>
      createToast('loading', message, { duration: 0, ...options }),
    [createToast]
  );

  const custom = useCallback(
    (toast: Omit<Toast, 'id' | 'createdAt'>) => {
      const id = `toast-${++toastId}`;
      const newToast: Toast = {
        ...toast,
        id,
        createdAt: new Date(),
      };

      setToasts(prev => [newToast, ...prev].slice(0, maxToasts));

      if (toast.duration && toast.duration > 0) {
        scheduleDismiss(id, toast.duration);
      }

      return id;
    },
    [maxToasts, scheduleDismiss]
  );

  return {
    toasts,
    position,
    success,
    error,
    warning,
    info,
    loading,
    custom,
    dismiss,
    dismissAll,
    update,
    handleMouseEnter,
    handleMouseLeave,
  };
}

// ============================================
// 🎯 EXPORT
// ============================================

export default useToast;
