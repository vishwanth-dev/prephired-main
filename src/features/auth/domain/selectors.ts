/**
 * 🔍 Authentication Domain Selectors - Simplified for prepAI
 *
 * Core selector functions that transform raw AuthState into UI-ready data.
 * Removed over engineered selectors to focus on essential auth functionality.
 */

import type {
  UserProfile,
  Tenant,
  Session,
  AuthState,
  AuthLoadingState,
  UserRole,
} from '@/features/auth/domain/entities';

// =============================================================================
// USER SELECTORS
// =============================================================================

export const selectAuthUser = (state: AuthState): UserProfile | null => {
  return state.user;
};

export const selectUserDisplayName = (state: AuthState): string => {
  return state.user?.displayName || 'Unknown User';
};

export const selectUserInitials = (state: AuthState): string => {
  return state.user?.initials || 'UU';
};

export const selectUserEmail = (state: AuthState): string | null => {
  return state.user?.email || null;
};

export const selectUserPhone = (state: AuthState): string | null => {
  return state.user?.phone || null;
};

export const selectUserAvatar = (state: AuthState): string | null => {
  return state.user?.avatarUrl || null;
};

export const selectUserRoles = (state: AuthState): readonly UserRole[] => {
  return state.user?.roles || [];
};

export const selectUserPermissions = (state: AuthState): readonly string[] => {
  return state.user?.permissions || [];
};

export const selectIsUserVerified = (state: AuthState): boolean => {
  return state.user?.emailVerified || false;
};

// =============================================================================
// AUTHENTICATION SELECTORS
// =============================================================================

export const selectIsAuthenticated = (state: AuthState): boolean => {
  return state.isAuthenticated;
};

export const selectAuthLoadingState = (state: AuthState): AuthLoadingState => {
  return state.loading;
};

export const selectIsLoading = (state: AuthState): boolean => {
  return state.loading === 'loading';
};

export const selectAuthError = (state: AuthState): string | null => {
  return state.error;
};

export const selectEmailVerificationRequired = (state: AuthState): boolean => {
  return state.emailVerificationRequired;
};

// =============================================================================
// SESSION SELECTORS
// =============================================================================

export const selectCurrentSession = (state: AuthState): Session | null => {
  return state.session;
};

export const selectSessionId = (state: AuthState): string | null => {
  return state.session?.id || null;
};

export const selectSessionExpiry = (state: AuthState): string | null => {
  return state.session?.expiresAt || null;
};

export const selectIsSessionExpired = (state: AuthState): boolean => {
  if (!state.session?.expiresAt) return true;
  return new Date(state.session.expiresAt) < new Date();
};

// =============================================================================
// TENANT SELECTORS
// =============================================================================

export const selectCurrentTenant = (state: AuthState): Tenant | null => {
  return state.currentTenant;
};

export const selectAvailableTenants = (state: AuthState): readonly Tenant[] => {
  return state.availableTenants;
};

export const selectTenantName = (state: AuthState): string | null => {
  return state.currentTenant?.name || null;
};

export const selectTenantSlug = (state: AuthState): string | null => {
  return state.currentTenant?.slug || null;
};

export const selectHasMultipleTenants = (state: AuthState): boolean => {
  return state.availableTenants.length > 1;
};

export const selectCanSwitchTenant = (state: AuthState): boolean => {
  return state.availableTenants.length > 1 && state.isAuthenticated;
};

// =============================================================================
// COMPUTED SELECTORS
// =============================================================================

export const selectUserProfile = (state: AuthState) => {
  if (!state.user) return null;

  return {
    displayName: state.user.displayName,
    initials: state.user.initials,
    email: state.user.email,
    phone: state.user.phone,
    avatarUrl: state.user.avatarUrl,
    roles: state.user.roles,
    permissions: state.user.permissions,
    isVerified: state.user.emailVerified,
  };
};

export const selectAuthSummary = (state: AuthState) => {
  return {
    isAuthenticated: state.isAuthenticated,
    isLoading: state.loading === 'loading',
    hasError: !!state.error,
    error: state.error,
    user: state.user
      ? {
          name: state.user.displayName,
          email: state.user.email,
          isVerified: state.user.emailVerified,
        }
      : null,
    tenant: state.currentTenant
      ? {
          name: state.currentTenant.name,
          slug: state.currentTenant.slug,
        }
      : null,
    canSwitchTenant: state.availableTenants.length > 1,
  };
};

// =============================================================================
// UTILITY SELECTORS
// =============================================================================

export const selectLastUpdated = (state: AuthState): string => {
  return state.lastUpdated;
};

export const selectIsStale = (state: AuthState, maxAgeMs: number = 5 * 60 * 1000): boolean => {
  const lastUpdated = new Date(state.lastUpdated);
  const now = new Date();
  return now.getTime() - lastUpdated.getTime() > maxAgeMs;
};

// =============================================================================
// SELECTOR FACTORIES
// =============================================================================

export const createSafeSelector = <T, R>(selector: (state: T) => R, fallback: R) => {
  return (state: T): R => {
    try {
      return selector(state);
    } catch {
      return fallback;
    }
  };
};

export const createMemoizedSelector = <T, R>(
  selector: (state: T) => R,
  dependencies: (state: T) => unknown[]
) => {
  let lastDeps: unknown[] = [];
  let lastResult: R;

  return (state: T): R => {
    const currentDeps = dependencies(state);

    // Check if dependencies changed
    if (
      lastDeps.length !== currentDeps.length ||
      lastDeps.some((dep, i) => dep !== currentDeps[i])
    ) {
      lastResult = selector(state);
      lastDeps = currentDeps;
    }

    return lastResult;
  };
};
