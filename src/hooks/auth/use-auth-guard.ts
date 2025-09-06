/**
 * 🔐 Auth Guard Hook
 *
 * Route protection and role-based access control
 */

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../use-auth';
import { AUTH_CONFIG } from '@/constants/config';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface UseAuthGuardOptions {
  requireAuth?: boolean;
  requireRoles?: string[];
  requirePermissions?: string[];
  redirectTo?: string;
  fallbackPath?: string;
}

interface UseAuthGuardReturn {
  isAuthorized: boolean;
  isLoading: boolean;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
}

// ============================================
// AUTH GUARD HOOK
// ============================================

export function useAuthGuard(options: UseAuthGuardOptions = {}): UseAuthGuardReturn {
  const {
    requireAuth = true,
    requireRoles = [],
    requirePermissions = [],
    redirectTo = AUTH_CONFIG.AUTH_ROUTES.LOGIN,
    fallbackPath = '/unauthorized',
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Role checking functions
  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user?.role) return false;
    return roles.includes(user.role);
  };

  const hasAllRoles = (roles: string[]): boolean => {
    if (!user?.role) return false;
    // For single role system, user can only have all roles if checking for one role
    return roles.length === 1 && roles[0] === user.role;
  };

  const hasPermission = (permission: string): boolean => {
    // Implement permission checking based on your permission system
    if (!user?.permissions) return false;
    return user.permissions.includes(permission);
  };

  // Calculate authorization
  const isAuthorized = (() => {
    if (isLoading) return false;
    if (!requireAuth) return true;
    if (!isAuthenticated) return false;

    // Check roles
    if (requireRoles.length > 0 && !hasAnyRole(requireRoles)) {
      return false;
    }

    // Check permissions
    if (requirePermissions.length > 0) {
      const hasAllPermissions = requirePermissions.every(hasPermission);
      if (!hasAllPermissions) return false;
    }

    return true;
  })();

  // Handle redirects
  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname);
      router.push(`${redirectTo}?returnUrl=${returnUrl}`);
    } else if (isAuthenticated && requireRoles.length > 0 && !hasAnyRole(requireRoles)) {
      router.push(fallbackPath);
    }
  }, [
    isLoading,
    isAuthenticated,
    requireAuth,
    requireRoles,
    pathname,
    redirectTo,
    fallbackPath,
    router,
  ]);

  return {
    isAuthorized,
    isLoading,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAllRoles,
  };
}

// Specialized guard hooks
export const useRequireAuth = (redirectTo?: string) =>
  useAuthGuard({ requireAuth: true, ...(redirectTo && { redirectTo }) });

export const useRequireRole = (role: string, fallbackPath?: string) =>
  useAuthGuard({ requireRoles: [role], ...(fallbackPath && { fallbackPath }) });

export const useRequireAnyRole = (roles: string[], fallbackPath?: string) =>
  useAuthGuard({ requireRoles: roles, ...(fallbackPath && { fallbackPath }) });

export default useAuthGuard;
