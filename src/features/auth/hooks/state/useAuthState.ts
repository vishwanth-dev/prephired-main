'use client';

import { useAuthStore } from '@/features/auth/store/authStore';

export const useAuthState = () => {
  const {
    user,
    session,
    currentTenant,
    availableTenants,
    loading,
    error,
    isAuthenticated,
    emailVerificationRequired,
    lastUpdated,
  } = useAuthStore();

  return {
    // User state
    user,
    session,
    currentTenant,
    availableTenants,
    // Loading and error states
    loading,
    error,
    lastUpdated,
    // Authentication status
    isAuthenticated,
    emailVerificationRequired,
    // Computed values
    hasMultipleTenants: availableTenants.length > 1,
    isUserVerified: user?.emailVerified ?? false,
  };
};
