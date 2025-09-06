/**
 * 🌐 Online Status Hook
 *
 * This hook provides network status monitoring following SOLID principles:
 * - Single Responsibility: Only monitors network status
 * - Open/Closed: Extensible through callbacks
 * - Liskov Substitution: Standard network status interface
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Works with Navigator API
 *
 * 📋 Features:
 * - Real-time online/offline detection
 * - Connection type information
 * - Network speed estimation
 * - Reconnection callbacks
 * - Data saver detection
 *
 * 🔧 Usage:
 * ```tsx
 * const { isOnline, isOffline, connection } = useOnlineStatus();
 * const status = useOnlineStatus({ onOnline: handleReconnect });
 * ```
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

// ============================================
// 🎯 TYPE DEFINITIONS
// ============================================

interface NetworkInformation {
  downlink?: number;
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  rtt?: number;
  saveData?: boolean;
  type?: 'bluetooth' | 'cellular' | 'ethernet' | 'mixed' | 'none' | 'other' | 'unknown' | 'wifi';
}

interface UseOnlineStatusOptions {
  onOnline?: () => void;
  onOffline?: () => void;
  onChange?: (isOnline: boolean) => void;
  pollingInterval?: number;
}

interface UseOnlineStatusReturn {
  isOnline: boolean;
  isOffline: boolean;
  connection: NetworkInformation | null;
  lastOnline: Date | null;
  lastOffline: Date | null;
  checkConnection: () => Promise<boolean>;
}

// ============================================
// 🌐 ONLINE STATUS HOOK
// ============================================

export function useOnlineStatus(options: UseOnlineStatusOptions = {}): UseOnlineStatusReturn {
  const { onOnline, onOffline, onChange, pollingInterval } = options;

  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator === 'undefined') return true;
    return navigator.onLine;
  });

  const [connection, setConnection] = useState<NetworkInformation | null>(() => {
    if (typeof navigator === 'undefined') return null;
    return (navigator as any).connection || null;
  });

  const [lastOnline, setLastOnline] = useState<Date | null>(null);
  const [lastOffline, setLastOffline] = useState<Date | null>(null);

  const updateOnlineStatus = useCallback(
    (online: boolean) => {
      setIsOnline(online);

      if (online) {
        setLastOnline(new Date());
        onOnline?.();
      } else {
        setLastOffline(new Date());
        onOffline?.();
      }

      onChange?.(online);
    },
    [onOnline, onOffline, onChange]
  );

  const checkConnection = useCallback(async (): Promise<boolean> => {
    if (typeof navigator === 'undefined') return true;

    // First check navigator.onLine
    if (!navigator.onLine) {
      updateOnlineStatus(false);
      return false;
    }

    // Try to fetch a small resource to verify actual connectivity
    try {
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-cache',
      });
      const online = response.ok;
      updateOnlineStatus(online);
      return online;
    } catch {
      updateOnlineStatus(false);
      return false;
    }
  }, [updateOnlineStatus]);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;

    const handleOnline = () => updateOnlineStatus(true);
    const handleOffline = () => updateOnlineStatus(false);

    const handleConnectionChange = () => {
      setConnection((navigator as any).connection || null);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for connection changes if supported
    const conn = (navigator as any).connection;
    if (conn) {
      conn.addEventListener('change', handleConnectionChange);
    }

    // Set up polling if requested
    let intervalId: NodeJS.Timeout | null = null;
    if (pollingInterval) {
      intervalId = setInterval(checkConnection, pollingInterval);
    }

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      if (conn) {
        conn.removeEventListener('change', handleConnectionChange);
      }

      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [checkConnection, pollingInterval, updateOnlineStatus]);

  return {
    isOnline,
    isOffline: !isOnline,
    connection,
    lastOnline,
    lastOffline,
    checkConnection,
  };
}

// ============================================
// 🌐 NETWORK QUALITY HOOK
// ============================================

export function useNetworkQuality() {
  const [quality, setQuality] = useState<'high' | 'medium' | 'low' | 'unknown'>('unknown');
  const [metrics, setMetrics] = useState({
    downlink: 0,
    rtt: 0,
    effectiveType: 'unknown' as string,
  });

  useEffect(() => {
    if (typeof navigator === 'undefined' || !(navigator as any).connection) {
      return;
    }

    const connection = (navigator as any).connection;

    const updateQuality = () => {
      const { downlink = 0, rtt = 0, effectiveType = 'unknown' } = connection;

      setMetrics({ downlink, rtt, effectiveType });

      // Determine quality based on metrics
      if (effectiveType === '4g' && downlink > 5) {
        setQuality('high');
      } else if (effectiveType === '3g' || (effectiveType === '4g' && downlink <= 5)) {
        setQuality('medium');
      } else if (effectiveType === '2g' || effectiveType === 'slow-2g') {
        setQuality('low');
      } else {
        setQuality('unknown');
      }
    };

    updateQuality();
    connection.addEventListener('change', updateQuality);

    return () => {
      connection.removeEventListener('change', updateQuality);
    };
  }, []);

  return {
    quality,
    metrics,
    isHighQuality: quality === 'high',
    isMediumQuality: quality === 'medium',
    isLowQuality: quality === 'low',
  };
}

// ============================================
// 🎯 EXPORT
// ============================================

export default useOnlineStatus;
