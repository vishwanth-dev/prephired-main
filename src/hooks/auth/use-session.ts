/**
 * ⏰ Session Management Hook
 *
 * Manages user session, timeout, and activity tracking
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../use-auth';
import { AUTH_CONFIG } from '@/constants/config';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface UseSessionOptions {
  timeout?: number;
  warningTime?: number;
  onTimeout?: () => void;
  onWarning?: () => void;
  onActivity?: () => void;
  trackActivity?: boolean;
}

interface UseSessionReturn {
  isActive: boolean;
  timeRemaining: number;
  lastActivity: Date;
  extendSession: () => void;
  endSession: () => void;
  isWarning: boolean;
  percentRemaining: number;
}

// ============================================
// SESSION HOOK
// ============================================

export function useSession(options: UseSessionOptions = {}): UseSessionReturn {
  const {
    timeout = AUTH_CONFIG.SESSION_TIMEOUT,
    warningTime = 5 * 60 * 1000, // 5 minutes
    onTimeout,
    onWarning,
    onActivity,
    trackActivity = true,
  } = options;

  const { isAuthenticated, logout, updateLastActivity } = useAuth();
  const [lastActivity, setLastActivity] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useState(timeout);
  const [isWarning, setIsWarning] = useState(false);

  const warningTriggeredRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Calculate time remaining
  const calculateTimeRemaining = useCallback(() => {
    const elapsed = Date.now() - lastActivity.getTime();
    const remaining = Math.max(0, timeout - elapsed);
    setTimeRemaining(remaining);

    // Trigger warning
    if (remaining <= warningTime && remaining > 0 && !warningTriggeredRef.current) {
      setIsWarning(true);
      warningTriggeredRef.current = true;
      onWarning?.();
    }

    // Handle timeout
    if (remaining === 0 && isAuthenticated) {
      onTimeout?.();
      logout();
    }

    return remaining;
  }, [lastActivity, timeout, warningTime, isAuthenticated, onTimeout, onWarning, logout]);

  // Track user activity
  const handleActivity = useCallback(() => {
    if (!trackActivity || !isAuthenticated) return;

    const now = new Date();
    setLastActivity(now);
    setIsWarning(false);
    warningTriggeredRef.current = false;
    updateLastActivity();
    onActivity?.();
  }, [trackActivity, isAuthenticated, updateLastActivity, onActivity]);

  // Extend session
  const extendSession = useCallback(() => {
    handleActivity();
  }, [handleActivity]);

  // End session
  const endSession = useCallback(async () => {
    await logout();
  }, [logout]);

  // Setup activity tracking
  useEffect(() => {
    if (!trackActivity || !isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const throttledActivity = (() => {
      let lastCall = 0;
      return () => {
        const now = Date.now();
        if (now - lastCall >= 10000) {
          // Throttle to once per 10 seconds
          lastCall = now;
          handleActivity();
        }
      };
    })();

    events.forEach(event => {
      document.addEventListener(event, throttledActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, throttledActivity);
      });
    };
  }, [trackActivity, isAuthenticated, handleActivity]);

  // Setup session timer
  useEffect(() => {
    if (!isAuthenticated) return;

    // Update time remaining every second
    intervalRef.current = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isAuthenticated, calculateTimeRemaining]);

  const percentRemaining = (timeRemaining / timeout) * 100;

  return {
    isActive: isAuthenticated && timeRemaining > 0,
    timeRemaining,
    lastActivity,
    extendSession,
    endSession,
    isWarning,
    percentRemaining,
  };
}

export default useSession;
