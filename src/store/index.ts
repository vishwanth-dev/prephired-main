// store/index.ts

/**
 * 🏪 Store Index
 *
 * Centralized exports for all Zustand stores.
 * Provides easy access to state management across the application.
 */

import useAuthStore from './auth-store';

// ============================================
// 🔐 AUTHENTICATION STORE
// ============================================

export {
  default as useAuthStore,
  useAuth,
  useAuthActions,
  useAuthStoreComplete,
  hasRole,
  getUserFullName,
  isRegistrationComplete,
} from './auth-store';

export type { AuthState, AuthActions, AuthStore } from './auth-store';

// ============================================
// 📋 STORE INFORMATION
// ============================================

/**
 * Available stores in the application
 */
export const STORE_INFO = {
  // Authentication
  auth: {
    name: 'Authentication Store',
    description: 'Manages user authentication, registration flow, and session state',
    features: [
      'User login/logout',
      'Registration flow management',
      'OTP verification',
      'Role selection',
      'Token management',
      'Session persistence',
      'Error handling',
    ],
    hooks: ['useAuthStore', 'useAuth', 'useAuthActions', 'useAuthStoreComplete'],
    utilities: ['hasRole', 'getUserFullName', 'isRegistrationComplete'],
  },
} as const;

// ============================================
// 🎯 CONVENIENCE EXPORTS
// ============================================

/**
 * Get all available stores
 */
export const getAllStores = () => ({
  auth: useAuthStore,
});

/**
 * Store configuration
 */
export const STORE_CONFIG = {
  // Persistence settings
  persistence: {
    auth: {
      name: 'auth-store',
      storage: 'localStorage',
      partialize: true, // Only persist essential data - Zustand terminology
    },
  },

  // Development settings
  devtools: process.env.NODE_ENV === 'development',

  // Store initialization
  autoInitialize: true,
} as const;

// Default export for convenience
export default {
  auth: useAuthStore,
};
