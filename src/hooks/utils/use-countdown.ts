/**
 * ⏰ Countdown Hook
 *
 * This hook provides countdown timer functionality following SOLID principles:
 * - Single Responsibility: Only handles countdown logic
 * - Open/Closed: Extensible through options and callbacks
 * - Liskov Substitution: Standard timer interface
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Works with time abstractions
 *
 * 📋 Features:
 * - Countdown timer with pause/resume
 * - Custom intervals
 * - Expiry callbacks
 * - Format helpers
 * - Auto-start option
 *
 * 🔧 Usage:
 * ```tsx
 * const { seconds, minutes, start, pause } = useCountdown(60, { autoStart: true });
 * const timer = useCountdown(300, { onExpire: handleExpire, interval: 100 });
 * ```
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================
// 🎯 TYPE DEFINITIONS
// ============================================

interface CountdownOptions {
  autoStart?: boolean;
  interval?: number;
  onExpire?: () => void;
  onTick?: (timeLeft: number) => void;
  format?: 'seconds' | 'object' | 'formatted';
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  totalSeconds: number;
  formatted: string;
}

interface UseCountdownReturn extends CountdownTime {
  isActive: boolean;
  isExpired: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: (newTime?: number) => void;
  add: (seconds: number) => void;
  subtract: (seconds: number) => void;
}

// ============================================
// 🛠️ HELPER FUNCTIONS
// ============================================

function parseTime(totalSeconds: number): CountdownTime {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor((totalSeconds % 1) * 1000);

  const formatted = [
    days > 0 ? `${days}d` : '',
    hours > 0 ? `${hours.toString().padStart(2, '0')}h` : '',
    minutes > 0 ? `${minutes.toString().padStart(2, '0')}m` : '',
    `${seconds.toString().padStart(2, '0')}s`,
  ]
    .filter(Boolean)
    .join(' ');

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    totalSeconds,
    formatted,
  };
}

// ============================================
// ⏰ COUNTDOWN HOOK
// ============================================

export function useCountdown(
  initialTime: number,
  options: CountdownOptions = {}
): UseCountdownReturn {
  const { autoStart = false, interval = 1000, onExpire, onTick } = options;

  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Handle countdown
  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeLeft <= 0 && isActive) {
        setIsActive(false);
        onExpire?.();
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = Math.max(0, prev - interval / 1000);
        onTick?.(newTime);

        if (newTime <= 0) {
          setIsActive(false);
          onExpire?.();
        }

        return newTime;
      });
    }, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, interval, onExpire, onTick]);

  const start = useCallback(() => {
    setIsActive(true);
    startTimeRef.current = Date.now();
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
    pausedTimeRef.current = Date.now();
  }, []);

  const resume = useCallback(() => {
    setIsActive(true);
  }, []);

  const reset = useCallback(
    (newTime?: number) => {
      setTimeLeft(newTime ?? initialTime);
      setIsActive(false);
      startTimeRef.current = 0;
      pausedTimeRef.current = 0;
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    [initialTime]
  );

  const add = useCallback((seconds: number) => {
    setTimeLeft(prev => prev + seconds);
  }, []);

  const subtract = useCallback((seconds: number) => {
    setTimeLeft(prev => Math.max(0, prev - seconds));
  }, []);

  const time = parseTime(timeLeft);

  return {
    ...time,
    isActive,
    isExpired: timeLeft <= 0,
    start,
    pause,
    resume,
    reset,
    add,
    subtract,
  };
}

// ============================================
// 🎯 EXPORT
// ============================================

export default useCountdown;
