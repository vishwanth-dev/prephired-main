// hooks/use-auth.ts

/**
 * 🔐 Authentication Hook
 *
 * Custom React hook for authentication operations.
 * Provides a simple interface to auth store and common auth operations.
 *
 * Features:
 * - Authentication state management
 * - Login/logout operations
 * - Registration flow management
 * - OTP verification
 * - Role selection
 * - Password reset
 * - Session management
 * - Error handling
 * - Loading states
 */

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, useAuthActions } from '@/store/auth-store';
import {
  ILoginFormData,
  IRegisterFormData,
  IVerifyOTPFormData,
  ISelectRoleFormData,
} from '@/types/backend';
import { AUTH_CONFIG } from '@/constants/config';
import { toast } from 'sonner';

// ============================================
// 🏷️ TYPES & INTERFACES
// ============================================

export interface UseAuthHookOptions {
  /**
   * Auto-initialize auth on mount
   */
  autoInitialize?: boolean;

  /**
   * Auto-refresh token before expiry
   */
  autoRefresh?: boolean;

  /**
   * Session timeout in milliseconds
   */
  sessionTimeout?: number;

  /**
   * Refresh threshold in milliseconds
   */
  refreshThreshold?: number;

  /**
   * Redirect to this path after login
   */
  redirectTo?: string;

  /**
   * Require authentication for this hook
   */
  requireAuth?: boolean;

  /**
   * Required role for authorization
   */
  requiredRole?: string;
}

export interface UseAuthReturn {
  // 🔐 Authentication State
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 📝 Registration Flow
  registrationStep: 'register' | 'verify-otp' | 'select-role' | 'complete';
  tempUserId: string | null;
  tempEmail: string | null;

  // 🔑 Token Management
  token: string | null;
  refreshToken: string | null;

  // ⏰ Session Management
  lastActivity: number;
  sessionExpiry: number;
  rememberMe: boolean;

  // 🔐 Authentication Actions
  login: (credentials: ILoginFormData & { rememberMe?: boolean }) => Promise<void>;
  register: (userData: IRegisterFormData) => Promise<void>;
  logout: () => Promise<void>;

  // 📱 OTP Actions
  verifyOTP: (otpData: IVerifyOTPFormData) => Promise<void>;
  resendOTP: (userId: string) => Promise<void>;

  // 👤 Role Selection
  selectRole: (roleData: ISelectRoleFormData) => Promise<void>;

  // 🔑 Password Actions
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string, confirmPass: string) => Promise<void>;

  // 🔄 Token Management
  refreshAuthToken: () => Promise<boolean>;
  validateToken: () => Promise<boolean>;

  // 🛠️ Utility Actions
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (userData: Partial<any>) => void;
  initialize: () => Promise<any | null>;

  // 🔄 Registration Flow
  setRegistrationStep: (step: 'register' | 'verify-otp' | 'select-role' | 'complete') => void;
  setTempUserId: (userId: string | null) => void;

  // ⏰ Session Management
  updateLastActivity: () => void;
  checkSessionExpiry: () => boolean;

  // 🎯 Computed Properties
  isRegistrationComplete: boolean;
  isRegistrationInProgress: boolean;
  canResendOTP: boolean;
  sessionTimeRemaining: number;
  userFullName: string;
  userRole: string | null;
  userStatus: string | null;

  // 🔧 Helper Methods
  hasRole: (role: string) => boolean;
  isActiveUser: boolean;
  needsRoleSelection: boolean;
  needsOTPVerification: boolean;
}

// ============================================
// 🎣 MAIN HOOK
// ============================================

/**
 * Authentication hook with comprehensive auth operations
 */
export const useAuth = (options: UseAuthHookOptions = {}): UseAuthReturn => {
  const {
    autoInitialize = true,
    autoRefresh = true,
    refreshThreshold = AUTH_CONFIG.REFRESH_THRESHOLD,
    redirectTo = AUTH_CONFIG.AUTH_ROUTES.DASHBOARD,
    requireAuth = false,
    requiredRole,
  } = options;

  const router = useRouter();
  const pathname = usePathname();

  // Get auth state and actions from store
  const authActions = useAuthActions();
  const store = useAuthStore();

  // Refs for interval management
  const refreshIntervalRef = useRef<NodeJS.Timeout>(null);
  const expiryIntervalRef = useRef<NodeJS.Timeout>(null);

  // ============================================
  // 🎯 COMPUTED PROPERTIES
  // ============================================

  const computedValues = useMemo(() => {
    const now = Date.now();
    const timeRemaining = Math.max(0, store.sessionExpiry - now);

    return {
      isRegistrationComplete: store.registrationStep === 'complete',
      isRegistrationInProgress:
        store.registrationStep !== 'register' && store.registrationStep !== 'complete',
      canResendOTP: store.tempUserId !== null && store.registrationStep === 'verify-otp',
      sessionTimeRemaining: timeRemaining,
      userFullName: store.user
        ? `${store.user.firstName || ''} ${store.user.lastName || ''}`.trim()
        : '',
      userRole: store.user?.role || null,
      userStatus: store.user?.status || null,
      hasRole: (role: string) => store.user?.role === role,
      isActiveUser: store.user?.status === 'active',
      needsRoleSelection: store.registrationStep === 'select-role',
      needsOTPVerification: store.registrationStep === 'verify-otp',
    };
  }, [store]);

  // ============================================
  // 🔐 AUTH GUARD
  // ============================================

  useEffect(() => {
    if (!store.isLoading) {
      // Check if authentication is required
      if (requireAuth && !store.isAuthenticated) {
        const returnUrl = encodeURIComponent(pathname);
        router.push(`${AUTH_CONFIG.AUTH_ROUTES.LOGIN}?returnUrl=${returnUrl}`);
      }

      // Check if specific role is required
      if (requireAuth && requiredRole && store.user?.role !== requiredRole) {
        router.push('/unauthorized');
      }
    }
  }, [
    store.isLoading,
    store.isAuthenticated,
    store.user,
    requireAuth,
    requiredRole,
    pathname,
    router,
  ]);

  // ============================================
  // 🔄 AUTO-INITIALIZATION
  // ============================================

  useEffect(() => {
    if (autoInitialize && !store.isAuthenticated && !store.isLoading) {
      authActions.initialize();
    }
  }, [autoInitialize, store.isAuthenticated, store.isLoading, authActions]);

  // ============================================
  // ⏰ AUTO-REFRESH TOKEN
  // ============================================

  useEffect(() => {
    if (!autoRefresh || !store.isAuthenticated || !store.token) {
      return;
    }

    const checkTokenRefresh = () => {
      const now = Date.now();
      const timeUntilExpiry = store.sessionExpiry - now;

      // Refresh token if it's close to expiry
      if (timeUntilExpiry <= refreshThreshold && timeUntilExpiry > 0) {
        authActions.refreshAuthToken().catch(() => {
          toast.error('Session expired. Please login again.');
          router.push(AUTH_CONFIG.AUTH_ROUTES.LOGIN);
        });
      }
    };

    // Check immediately
    checkTokenRefresh();

    // Set up interval to check periodically
    refreshIntervalRef.current = setInterval(checkTokenRefresh, 60000); // Check every minute

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [
    autoRefresh,
    store.isAuthenticated,
    store.token,
    store.sessionExpiry,
    refreshThreshold,
    authActions,
    router,
  ]);

  // ============================================
  // ⏰ SESSION EXPIRY CHECK
  // ============================================

  useEffect(() => {
    if (!store.isAuthenticated) {
      return;
    }

    const checkSessionExpiry = () => {
      const now = Date.now();
      const isExpired = now > store.sessionExpiry;

      if (isExpired) {
        authActions.logout();
        toast.error('Your session has expired. Please login again.');
        router.push(AUTH_CONFIG.AUTH_ROUTES.LOGIN);
      }
    };

    // Check immediately
    checkSessionExpiry();

    // Set up interval to check periodically
    expiryIntervalRef.current = setInterval(checkSessionExpiry, 30000); // Check every 30 seconds

    return () => {
      if (expiryIntervalRef.current) {
        clearInterval(expiryIntervalRef.current);
      }
    };
  }, [store.isAuthenticated, store.sessionExpiry, authActions, router]);

  // ============================================
  // 🎯 ENHANCED ACTIONS WITH TOAST
  // ============================================

  const enhancedLogin = useCallback(
    async (credentials: ILoginFormData & { rememberMe?: boolean }) => {
      try {
        await authActions.login(credentials);
        authActions.updateLastActivity();
        toast.success('Login successful!');

        // Handle redirect
        const params = new URLSearchParams(window.location.search);
        const returnUrl = params.get('returnUrl') || redirectTo;
        router.push(returnUrl);
      } catch (error: any) {
        toast.error(error.message || 'Login failed');
        throw error;
      }
    },
    [authActions, router, redirectTo]
  );

  const enhancedLogout = useCallback(async () => {
    try {
      await authActions.logout();
      toast.success('Logged out successfully');
      router.push(AUTH_CONFIG.AUTH_ROUTES.LOGIN);
    } catch (error) {
      console.warn('Logout failed:', error);
      toast.success('Logged out successfully');
      router.push(AUTH_CONFIG.AUTH_ROUTES.LOGIN);
    }
  }, [authActions, router]);

  const enhancedRegister = useCallback(
    async (userData: IRegisterFormData) => {
      try {
        await authActions.register(userData);
        toast.success('Registration successful! Please verify your email.');
        router.push(AUTH_CONFIG.AUTH_ROUTES.VERIFY_OTP);
      } catch (error: any) {
        toast.error(error.message || 'Registration failed');
        throw error;
      }
    },
    [authActions, router]
  );

  const enhancedVerifyOTP = useCallback(
    async (otpData: IVerifyOTPFormData) => {
      try {
        await authActions.verifyOTP(otpData);
        authActions.updateLastActivity();

        if (store.registrationStep === 'select-role') {
          toast.success('Email verified! Please select your role.');
          router.push('/select-role');
        } else {
          toast.success('Email verified successfully!');
          router.push(redirectTo);
        }
      } catch (error: any) {
        toast.error(error.message || 'OTP verification failed');
        throw error;
      }
    },
    [authActions, store.registrationStep, router, redirectTo]
  );

  const enhancedSelectRole = useCallback(
    async (roleData: ISelectRoleFormData) => {
      try {
        await authActions.selectRole(roleData);
        authActions.updateLastActivity();
        toast.success('Setup complete! Welcome to PrepAI.');
        router.push(redirectTo);
      } catch (error: any) {
        toast.error(error.message || 'Role selection failed');
        throw error;
      }
    },
    [authActions, router, redirectTo]
  );

  const enhancedForgotPassword = useCallback(
    async (email: string) => {
      try {
        await authActions.forgotPassword(email);
        toast.success('Password reset instructions sent to your email');
        router.push(`${AUTH_CONFIG.AUTH_ROUTES.VERIFY_OTP}?type=reset-password`);
      } catch (error: any) {
        toast.error(error.message || 'Failed to send reset email');
        throw error;
      }
    },
    [authActions, router]
  );

  const enhancedResetPassword = useCallback(
    async (token: string, password: string, confirmPass: string) => {
      try {
        await authActions.resetPassword(token, password, confirmPass);
        toast.success('Password reset successfully! Please login with your new password.');
        router.push(AUTH_CONFIG.AUTH_ROUTES.LOGIN);
      } catch (error: any) {
        toast.error(error.message || 'Password reset failed');
        throw error;
      }
    },
    [authActions, router]
  );

  const enhancedResendOTP = useCallback(
    async (userId: string) => {
      try {
        await authActions.resendOTP(userId);
        toast.success('OTP sent successfully!');
      } catch (error: any) {
        toast.error(error.message || 'Failed to resend OTP');
        throw error;
      }
    },
    [authActions]
  );

  // ============================================
  // 🎯 RETURN OBJECT
  // ============================================

  return {
    // Authentication State
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,

    // Registration Flow
    registrationStep: store.registrationStep,
    tempUserId: store.tempUserId,
    tempEmail: store.tempEmail,

    // Token Management
    token: store.token,
    refreshToken: store.refreshToken,

    // Session Management
    lastActivity: store.lastActivity,
    sessionExpiry: store.sessionExpiry,
    rememberMe: store.rememberMe,

    // Enhanced Actions
    login: enhancedLogin,
    register: enhancedRegister,
    logout: enhancedLogout,
    verifyOTP: enhancedVerifyOTP,
    resendOTP: enhancedResendOTP,
    selectRole: enhancedSelectRole,
    forgotPassword: enhancedForgotPassword,
    resetPassword: enhancedResetPassword,

    // Token Management
    refreshAuthToken: authActions.refreshAuthToken,
    validateToken: authActions.validateToken,

    // Utility Actions
    clearError: authActions.clearError,
    setLoading: authActions.setLoading,
    updateUser: authActions.updateUser,
    initialize: authActions.initialize,

    // Registration Flow
    setRegistrationStep: authActions.setRegistrationStep,
    setTempUserId: authActions.setTempUserId,

    // Session Management
    updateLastActivity: authActions.updateLastActivity,
    checkSessionExpiry: authActions.checkSessionExpiry,

    // Computed Properties
    ...computedValues,
  };
};

// ============================================
// 🎣 SPECIALIZED HOOKS
// ============================================

/**
 * Hook for authentication state only (no actions)
 */
export const useAuthStateOnly = () => {
  const store = useAuthStore();

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    registrationStep: store.registrationStep,
    tempUserId: store.tempUserId,
    tempEmail: store.tempEmail,
    token: store.token,
    refreshToken: store.refreshToken,
    lastActivity: store.lastActivity,
    sessionExpiry: store.sessionExpiry,
    rememberMe: store.rememberMe,
  };
};

/**
 * Hook for authentication actions only (no state)
 */
export const useAuthActionsOnly = () => {
  const authActions = useAuthActions();

  return {
    login: authActions.login,
    register: authActions.register,
    logout: authActions.logout,
    verifyOTP: authActions.verifyOTP,
    resendOTP: authActions.resendOTP,
    selectRole: authActions.selectRole,
    forgotPassword: authActions.forgotPassword,
    resetPassword: authActions.resetPassword,
    refreshAuthToken: authActions.refreshAuthToken,
    validateToken: authActions.validateToken,
    clearError: authActions.clearError,
    setLoading: authActions.setLoading,
    updateUser: authActions.updateUser,
    initialize: authActions.initialize,
    setRegistrationStep: authActions.setRegistrationStep,
    setTempUserId: authActions.setTempUserId,
    updateLastActivity: authActions.updateLastActivity,
    checkSessionExpiry: authActions.checkSessionExpiry,
  };
};

/**
 * Hook for user information only
 */
export const useUser = () => {
  const store = useAuthStore();

  return {
    user: store.user,
    userFullName: store.user
      ? `${store.user.firstName || ''} ${store.user.lastName || ''}`.trim()
      : '',
    userRole: store.user?.role || null,
    userStatus: store.user?.status || null,
    userEmail: store.user?.email || null,
    userPhone: store.user?.phoneNumber || null,
    userProfile: store.user?.profile || null,
    isActiveUser: store.user?.status === 'active',
    hasRole: (role: string) => store.user?.role === role,
  };
};

/**
 * Hook for registration flow management
 */
export const useRegistrationFlow = () => {
  const store = useAuthStore();
  const authActions = useAuthActions();

  return {
    registrationStep: store.registrationStep,
    tempUserId: store.tempUserId,
    tempEmail: store.tempEmail,
    isLoading: store.isLoading,
    error: store.error,

    // Actions
    setRegistrationStep: authActions.setRegistrationStep,
    setTempUserId: authActions.setTempUserId,
    clearError: authActions.clearError,

    // Computed
    isRegistrationComplete: store.registrationStep === 'complete',
    isRegistrationInProgress:
      store.registrationStep !== 'register' && store.registrationStep !== 'complete',
    needsOTPVerification: store.registrationStep === 'verify-otp',
    needsRoleSelection: store.registrationStep === 'select-role',
    canResendOTP: store.tempUserId !== null && store.registrationStep === 'verify-otp',
  };
};

/**
 * Hook for session management
 */
export const useSession = () => {
  const store = useAuthStore();
  const authActions = useAuthActions();

  const now = Date.now();
  const timeRemaining = Math.max(0, store.sessionExpiry - now);
  const isExpired = now > store.sessionExpiry;

  return {
    lastActivity: store.lastActivity,
    sessionExpiry: store.sessionExpiry,
    sessionTimeRemaining: timeRemaining,
    isExpired,
    rememberMe: store.rememberMe,

    // Actions
    updateLastActivity: authActions.updateLastActivity,
    checkSessionExpiry: authActions.checkSessionExpiry,
    refreshAuthToken: authActions.refreshAuthToken,
    validateToken: authActions.validateToken,
  };
};

/**
 * Hook for authentication guard
 */
export const useAuthGuard = (requiredRole?: string) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        const returnUrl = encodeURIComponent(pathname);
        router.push(`${AUTH_CONFIG.AUTH_ROUTES.LOGIN}?returnUrl=${returnUrl}`);
      } else if (requiredRole && user?.role !== requiredRole) {
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, user, isLoading, requiredRole, router, pathname]);

  return {
    isAuthorized: isAuthenticated && (!requiredRole || user?.role === requiredRole),
    isLoading,
  };
};

/**
 * Hook for guest-only pages (redirect if authenticated)
 */
export const useGuestOnly = (redirectTo = AUTH_CONFIG.AUTH_ROUTES.DASHBOARD) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isGuest: !isAuthenticated, isLoading };
};

// ============================================
// 📤 EXPORTS
// ============================================

export default useAuth;
