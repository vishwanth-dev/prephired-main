/**
 * 📋 Clipboard Hook
 *
 * This hook provides clipboard functionality following SOLID principles:
 * - Single Responsibility: Only handles clipboard operations
 * - Open/Closed: Extensible through options and callbacks
 * - Liskov Substitution: Standard clipboard interface
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Works with Clipboard API abstraction
 *
 * 📋 Features:
 * - Copy to clipboard with feedback
 * - Read from clipboard
 * - Success/error callbacks
 * - Timeout configuration
 * - Browser compatibility handling
 *
 * 🔧 Usage:
 * ```tsx
 * const { copy, copied, error } = useClipboard({ timeout: 2000 });
 * const { copyToClipboard, readFromClipboard } = useClipboard({ onSuccess: handleSuccess });
 * ```
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// ============================================
// 🎯 TYPE DEFINITIONS
// ============================================

interface UseClipboardOptions {
  timeout?: number;
  format?: 'text' | 'html' | 'image';
  onSuccess?: (value: string) => void;
  onError?: (error: Error) => void;
}

interface UseClipboardReturn {
  copy: (text: string) => Promise<void>;
  copied: boolean;
  error: Error | null;
  isSupported: boolean;
  reset: () => void;
}

// ============================================
// 📋 CLIPBOARD HOOK
// ============================================

export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { timeout = 2000, format = 'text', onSuccess, onError } = options;

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Check clipboard API support
  const isSupported =
    typeof navigator !== 'undefined' &&
    'clipboard' in navigator &&
    'writeText' in navigator.clipboard;

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const reset = useCallback(() => {
    setCopied(false);
    setError(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const copy = useCallback(
    async (text: string) => {
      if (!isSupported) {
        const error = new Error('Clipboard API not supported');
        setError(error);
        onError?.(error);
        return;
      }

      try {
        // Reset previous state
        reset();

        // Copy to clipboard based on format
        if (format === 'text') {
          await navigator.clipboard.writeText(text);
        } else if (format === 'html') {
          const blob = new Blob([text], { type: 'text/html' });
          const item = new ClipboardItem({ 'text/html': blob });
          await navigator.clipboard.write([item]);
        }

        // Set success state
        if (mountedRef.current) {
          setCopied(true);
          setError(null);
          onSuccess?.(text);

          // Reset after timeout
          timeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              setCopied(false);
            }
          }, timeout);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to copy');

        if (mountedRef.current) {
          setError(error);
          setCopied(false);
          onError?.(error);
        }
      }
    },
    [isSupported, format, timeout, onSuccess, onError, reset]
  );

  return {
    copy,
    copied,
    error,
    isSupported,
    reset,
  };
}

// ============================================
// 📋 ADVANCED CLIPBOARD HOOK
// ============================================

export function useAdvancedClipboard() {
  const [clipboardData, setClipboardData] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isReading, setIsReading] = useState(false);

  const isSupported = typeof navigator !== 'undefined' && 'clipboard' in navigator;

  const readText = useCallback(async (): Promise<string | null> => {
    if (!isSupported) {
      setError(new Error('Clipboard API not supported'));
      return null;
    }

    setIsReading(true);
    setError(null);

    try {
      const text = await navigator.clipboard.readText();
      setClipboardData(text);
      return text;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to read clipboard');
      setError(error);
      return null;
    } finally {
      setIsReading(false);
    }
  }, [isSupported]);

  const writeText = useCallback(
    async (text: string): Promise<boolean> => {
      if (!isSupported) {
        setError(new Error('Clipboard API not supported'));
        return false;
      }

      setError(null);

      try {
        await navigator.clipboard.writeText(text);
        setClipboardData(text);
        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to write to clipboard');
        setError(error);
        return false;
      }
    },
    [isSupported]
  );

  const clear = useCallback(() => {
    setClipboardData(null);
    setError(null);
  }, []);

  return {
    clipboardData,
    readText,
    writeText,
    clear,
    error,
    isReading,
    isSupported,
  };
}

// ============================================
// 🎯 EXPORT
// ============================================

export default useClipboard;
