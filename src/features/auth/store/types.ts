/**
 * Store Types for Authentication State Management
 *
 * This is where we define the CLIENT-SIDE application state.
 * Uses the domain entities but adds UI-specific state.
 */

import type { User } from '../domain/entities';
import type { AuthDomainError } from '../domain/errors';

// =============================================================================
// AUTH STORE STATE
// =============================================================================

export interface AuthState {
  // Authentication status
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly isInitialized: boolean;

  // Current user and session data
  readonly user: User | null;
  readonly tenant: { id: string; name: string } | null;
  readonly session: { id: string; expiresAt: string; createdAt: string } | null;

  // Error state
  readonly error: AuthDomainError | null;

  // Login attempt tracking
  readonly loginAttempts: number;
  readonly isAccountLocked: boolean;
  readonly lockExpiresAt: string | null; // ISO string

  // UI state
  readonly isLoginModalOpen: boolean;
  readonly isRegisterModalOpen: boolean;
  readonly redirectAfterLogin: string | null;
  readonly preferences?: {
    theme?: 'light' | 'dark' | 'system';
    reducedMotion?: boolean;
    language?: string;
  };
  readonly loginCount?: number | null;
}

// =============================================================================
// FORM STATES (UI-specific)
// =============================================================================

export interface LoginFormState {
  readonly emailOrPhone: string;
  readonly password: string;
  readonly rememberMe: boolean;
  readonly isSubmitting: boolean;
  readonly errors: Record<string, string>;
}

export interface RegisterFormState {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly countryCode: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly acceptedTerms: boolean;
  readonly isSubmitting: boolean;
  readonly errors: Record<string, string>;
}

export interface ForgotPasswordFormState {
  readonly emailOrPhone: string;
  readonly isSubmitting: boolean;
  readonly isSuccess: boolean;
  readonly errors: Record<string, string>;
}

export interface ResetPasswordFormState {
  readonly password: string;
  readonly confirmPassword: string;
  readonly isSubmitting: boolean;
  readonly errors: Record<string, string>;
}

// =============================================================================
// ACTION TYPES (for Zustand actions)
// =============================================================================

export interface AuthActions {
  // Authentication flow
  login: (credentials: {
    emailOrPhone: string;
    password: string;
    rememberMe?: boolean;
  }) => Promise<void>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    countryCode?: string;
    password: string;
    confirmPassword: string;
    acceptedTerms: boolean;
    tenantName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;

  // Session management
  refreshSession: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;

  // Password management
  forgotPassword: (emailOrPhone: string) => Promise<void>;
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;

  // Profile management
  updateProfile: (updates: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    countryCode?: string;
  }) => Promise<void>;

  // Email/Phone verification
  verifyEmail: (token: string) => Promise<void>;
  resendEmailVerification: () => Promise<void>;

  // UI state management
  openLoginModal: (redirectAfterLogin?: string) => void;
  closeLoginModal: () => void;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;

  // Tenant management
  switchTenant: (tenantId: string) => Promise<void>;
}

// =============================================================================
// COMPLETE AUTH STORE TYPE
// =============================================================================

export type AuthStore = AuthState & AuthActions;

// =============================================================================
// HELPER TYPES
// =============================================================================

export interface AuthPersistState {
  readonly rememberMe: boolean;
  readonly lastLoginEmail: string | null;
  readonly lastLoginPhone: string | null;
}

export interface AuthConfig {
  readonly apiBaseUrl: string;
  readonly tokenRefreshInterval: number;
  readonly maxLoginAttempts: number;
  readonly lockoutDurationMinutes: number;
  readonly sessionTimeoutWarningMinutes: number;
}
