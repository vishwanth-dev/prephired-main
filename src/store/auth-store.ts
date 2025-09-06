// store/auth-store.ts

/**
 * 🔐 Authentication Store
 *
 * Zustand-based state management for authentication.
 * Provides centralized auth state, actions, and persistence.
 *
 * Features:
 * - User authentication state
 * - Token management
 * - Registration flow state
 * - Error handling
 * - Persistence with localStorage
 * - Type-safe actions
 */

import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { authService } from '@/services/api/auth.service';
import {
  IUser,
  IRegisterFormData,
  ILoginFormData,
  IVerifyOTPFormData,
  ISelectRoleFormData,
} from '@/types/backend';
import { AUTH_CONFIG } from '@/constants/config';

// ============================================
// 🏷️ TYPES & INTERFACES
// ============================================

export interface AuthState {
  // 🔐 Authentication State
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 📝 Registration Flow State
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
}

export interface AuthActions {
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
  updateUser: (user: Partial<IUser>) => void;
  initialize: () => Promise<IUser | null>;

  // 🔄 Registration Flow
  setRegistrationStep: (step: AuthState['registrationStep']) => void;
  setTempUserId: (userId: string | null) => void;

  // ⏰ Session Management
  updateLastActivity: () => void;
  checkSessionExpiry: () => boolean;
}

export type AuthStore = AuthState & AuthActions;

// ============================================
// 🎯 INITIAL STATE
// ============================================

const initialState: AuthState = {
  // Authentication State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Registration Flow
  registrationStep: 'register',
  tempUserId: null,
  tempEmail: null,

  // Token Management
  token: null,
  refreshToken: null,

  // Session Management
  lastActivity: Date.now(),
  sessionExpiry: Date.now() + AUTH_CONFIG.SESSION_TIMEOUT,
  rememberMe: false,
};

// ============================================
// 🛠️ HELPER FUNCTIONS
// ============================================

/**
 * Map backend error codes to user-friendly messages
 */
const mapBackendError = (error: any): string => {
  const errorCode = error?.response?.data?.error;
  const message = error?.response?.data?.message;

  switch (errorCode) {
    case 'UR01':
      return 'Email already exists';
    case 'UR02':
      return 'Invalid email or password';
    case 'UR03':
      return 'User not found';
    case 'UR04':
      return 'Invalid or expired OTP';
    case 'UR05':
      return 'Account locked or suspended';
    default:
      return message || error.message || 'An error occurred';
  }
};

// ============================================
// 🏪 ZUSTAND STORE
// ============================================

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // ============================================
        // 🔐 AUTHENTICATION ACTIONS
        // ============================================

        /**
         * Login user with credentials
         */
        login: async (credentials: ILoginFormData & { rememberMe?: boolean }) => {
          set(state => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const response = await authService.login({
              email: credentials.email,
              password: credentials.password,
            });

            // Store tokens in service
            if (response.data?.token) {
              authService.storeTokens(
                response.data.token,
                response.data.refreshToken,
                credentials.rememberMe || false
              );

              // Store user data
              if (response.data.user) {
                authService.storeUserData(response.data.user, credentials.rememberMe || false);
              }
            }

            set(state => {
              state.user = response.data?.user || null;
              state.token = response.data?.token || null;
              state.refreshToken = response.data?.refreshToken || null;
              state.isAuthenticated = true;
              state.isLoading = false;
              state.rememberMe = credentials.rememberMe || false;
              state.lastActivity = Date.now();
              state.sessionExpiry = Date.now() + AUTH_CONFIG.SESSION_TIMEOUT;
            });
          } catch (error: any) {
            const errorMessage = mapBackendError(error);
            set(state => {
              state.error = errorMessage;
              state.isLoading = false;
              state.isAuthenticated = false;
            });
            throw new Error(errorMessage);
          }
        },

        /**
         * Register new user
         */
        register: async (userData: IRegisterFormData) => {
          set(state => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const response = await authService.register(userData);

            // Extract userId from response data
            const userId = response.data?.user?.userId || response.data?.user?._id || null;

            set(state => {
              state.tempUserId = userId;
              state.tempEmail = userData.email;
              state.registrationStep = 'verify-otp';
              state.isLoading = false;
            });
          } catch (error: any) {
            const errorMessage = mapBackendError(error);
            set(state => {
              state.error = errorMessage;
              state.isLoading = false;
            });
            throw new Error(errorMessage);
          }
        },

        /**
         * Logout user
         */
        logout: async () => {
          set(state => {
            state.isLoading = true;
          });

          try {
            await authService.logout();
          } catch (error) {
            console.warn('Logout API call failed:', error);
          } finally {
            authService.clearAuth();
            set(() => ({
              ...initialState,
              isLoading: false,
            }));
          }
        },

        // ============================================
        // 📱 OTP ACTIONS
        // ============================================

        /**
         * Verify OTP code
         */
        verifyOTP: async (otpData: IVerifyOTPFormData) => {
          set(state => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const response = await authService.verifyOTP(otpData);

            // Store tokens if available
            if (response.data?.token) {
              authService.storeTokens(
                response.data.token,
                response.data.refreshToken,
                get().rememberMe
              );

              if (response.data.user) {
                authService.storeUserData(response.data.user, get().rememberMe);
              }
            }

            set(state => {
              if (response.data?.user) {
                state.user = response.data.user;
                state.token = response.data?.token || null;
                state.refreshToken = response.data?.refreshToken || null;
                state.isAuthenticated = response.data.user.status === 'active';
                state.registrationStep = response.data.user.role ? 'complete' : 'select-role';
              }
              state.isLoading = false;
              state.lastActivity = Date.now();
              state.sessionExpiry = Date.now() + AUTH_CONFIG.SESSION_TIMEOUT;
            });
          } catch (error: any) {
            const errorMessage = mapBackendError(error);
            set(state => {
              state.error = errorMessage;
              state.isLoading = false;
            });
            throw new Error(errorMessage);
          }
        },

        /**
         * Resend OTP code
         */
        resendOTP: async (userId: string) => {
          set(state => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            await authService.resendOTP(userId);

            set(state => {
              state.isLoading = false;
            });
          } catch (error: any) {
            const errorMessage = mapBackendError(error);
            set(state => {
              state.error = errorMessage;
              state.isLoading = false;
            });
            throw new Error(errorMessage);
          }
        },

        // ============================================
        // 👤 ROLE SELECTION
        // ============================================

        /**
         * Select user role
         */
        selectRole: async (roleData: ISelectRoleFormData) => {
          set(state => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const response = await authService.selectRole(roleData);

            // Store tokens if available
            if (response.data?.token) {
              authService.storeTokens(
                response.data.token,
                response.data.refreshToken,
                get().rememberMe
              );

              if (response.data.user) {
                authService.storeUserData(response.data.user, get().rememberMe);
              }
            }

            set(state => {
              if (response.data?.user) {
                state.user = response.data.user;
                state.token = response.data?.token || null;
                state.refreshToken = response.data?.refreshToken || null;
                state.isAuthenticated = true;
                state.registrationStep = 'complete';
              }
              state.isLoading = false;
              state.lastActivity = Date.now();
              state.sessionExpiry = Date.now() + AUTH_CONFIG.SESSION_TIMEOUT;
            });
          } catch (error: any) {
            const errorMessage = mapBackendError(error);
            set(state => {
              state.error = errorMessage;
              state.isLoading = false;
            });
            throw new Error(errorMessage);
          }
        },

        // ============================================
        // 🔑 PASSWORD ACTIONS
        // ============================================

        /**
         * Request password reset
         */
        forgotPassword: async (email: string) => {
          set(state => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            await authService.forgotPassword(email);

            set(state => {
              state.tempEmail = email;
              state.isLoading = false;
            });
          } catch (error: any) {
            const errorMessage = mapBackendError(error);
            set(state => {
              state.error = errorMessage;
              state.isLoading = false;
            });
            throw new Error(errorMessage);
          }
        },

        /**
         * Reset password with token
         */
        resetPassword: async (token: string, password: string, confirmPass: string) => {
          set(state => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            await authService.resetPassword(token, password, confirmPass);

            set(state => {
              state.tempEmail = null;
              state.isLoading = false;
            });
          } catch (error: any) {
            const errorMessage = mapBackendError(error);
            set(state => {
              state.error = errorMessage;
              state.isLoading = false;
            });
            throw new Error(errorMessage);
          }
        },

        // ============================================
        // 🔄 TOKEN MANAGEMENT
        // ============================================

        /**
         * Refresh authentication token
         */
        refreshAuthToken: async () => {
          const { refreshToken } = get();

          if (!refreshToken) {
            return false;
          }

          try {
            const response = await authService.refreshToken(refreshToken);

            set(state => {
              state.token = response.data?.token || null;
              state.refreshToken = response.data?.refreshToken || null;
              state.lastActivity = Date.now();
              state.sessionExpiry = Date.now() + AUTH_CONFIG.SESSION_TIMEOUT;
            });

            return true;
          } catch (error) {
            await get().logout();
            return false;
          }
        },

        /**
         * Validate current token
         */
        validateToken: async () => {
          const { token } = get();

          if (!token) {
            return false;
          }

          try {
            const isValid = await authService.checkTokenValidity();

            if (!isValid) {
              await get().logout();
              return false;
            }

            set(state => {
              state.lastActivity = Date.now();
              state.sessionExpiry = Date.now() + AUTH_CONFIG.SESSION_TIMEOUT;
            });

            return true;
          } catch (error) {
            await get().logout();
            return false;
          }
        },

        // ============================================
        // 🛠️ UTILITY ACTIONS
        // ============================================

        /**
         * Clear error message
         */
        clearError: () => {
          set(state => {
            state.error = null;
          });
        },

        /**
         * Set loading state
         */
        setLoading: (loading: boolean) => {
          set(state => {
            state.isLoading = loading;
          });
        },

        /**
         * Update user data
         */
        updateUser: (userData: Partial<IUser>) => {
          set(state => {
            if (state.user) {
              state.user = { ...state.user, ...userData };
            }
          });
        },

        /**
         * Initialize auth store on app start
         */
        initialize: async () => {
          set(state => {
            state.isLoading = true;
          });

          try {
            const user = await authService.initialize();

            set(state => {
              if (user) {
                state.user = user;
                state.isAuthenticated = true;
                // Get tokens from stored data
                const storedToken = authService.getCurrentUser()
                  ? localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
                  : null;
                const storedRefreshToken = authService.getCurrentUser()
                  ? localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token')
                  : null;

                state.token = storedToken;
                state.refreshToken = storedRefreshToken;
                state.lastActivity = Date.now();
                state.sessionExpiry = Date.now() + AUTH_CONFIG.SESSION_TIMEOUT;
              } else {
                state.user = null;
                state.isAuthenticated = false;
                state.token = null;
                state.refreshToken = null;
              }
              state.isLoading = false;
            });

            return user;
          } catch (error) {
            set(state => {
              state.user = null;
              state.isAuthenticated = false;
              state.token = null;
              state.refreshToken = null;
              state.isLoading = false;
            });
            return null;
          }
        },

        // ============================================
        // 🔄 REGISTRATION FLOW
        // ============================================

        /**
         * Set registration step
         */
        setRegistrationStep: (step: AuthState['registrationStep']) => {
          set(state => {
            state.registrationStep = step;
          });
        },

        /**
         * Set temporary user ID
         */
        setTempUserId: (userId: string | null) => {
          set(state => {
            state.tempUserId = userId;
          });
        },

        // ============================================
        // ⏰ SESSION MANAGEMENT
        // ============================================

        /**
         * Update last activity timestamp
         */
        updateLastActivity: () => {
          set(state => {
            state.lastActivity = Date.now();
            state.sessionExpiry = Date.now() + AUTH_CONFIG.SESSION_TIMEOUT;
          });
        },

        /**
         * Check if session has expired
         */
        checkSessionExpiry: () => {
          const { sessionExpiry } = get();
          const now = Date.now();
          const isExpired = now > sessionExpiry;

          if (isExpired) {
            get().logout();
          }

          return !isExpired;
        },
      })),
      {
        name: 'auth-store',
        storage: createJSONStorage(() => localStorage),
        partialize: state => ({
          // Only persist essential auth data
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
          registrationStep: state.registrationStep,
          tempUserId: state.tempUserId,
          tempEmail: state.tempEmail,
          lastActivity: state.lastActivity,
          sessionExpiry: state.sessionExpiry,
          rememberMe: state.rememberMe,
        }),
        // Rehydrate state on app start
        onRehydrateStorage: () => state => {
          if (state) {
            // Validate token on rehydration
            state.validateToken();
          }
        },
      }
    ),
    {
      name: 'AuthStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// ============================================
// 🎣 CONVENIENCE HOOKS
// ============================================

/**
 * Hook to get authentication state
 */
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    registrationStep: store.registrationStep,
    tempUserId: store.tempUserId,
    tempEmail: store.tempEmail,
  };
};

/**
 * Hook to get authentication actions
 */
export const useAuthActions = () => {
  const store = useAuthStore();
  return {
    login: store.login,
    register: store.register,
    logout: store.logout,
    verifyOTP: store.verifyOTP,
    resendOTP: store.resendOTP,
    selectRole: store.selectRole,
    forgotPassword: store.forgotPassword,
    resetPassword: store.resetPassword,
    refreshAuthToken: store.refreshAuthToken,
    validateToken: store.validateToken,
    clearError: store.clearError,
    setLoading: store.setLoading,
    updateUser: store.updateUser,
    initialize: store.initialize,
    setRegistrationStep: store.setRegistrationStep,
    setTempUserId: store.setTempUserId,
    updateLastActivity: store.updateLastActivity,
    checkSessionExpiry: store.checkSessionExpiry,
  };
};

/**
 * Hook to get complete auth store
 */
export const useAuthStoreComplete = () => useAuthStore();

// ============================================
// 🔧 UTILITY FUNCTIONS
// ============================================

/**
 * Check if user has specific role
 */
export const hasRole = (role: string): boolean => {
  const { user } = useAuthStore.getState();
  return user?.role === role;
};

/**
 * Get user's full name
 */
export const getUserFullName = (): string => {
  const { user } = useAuthStore.getState();
  if (!user) return '';
  return `${user.firstName || ''} ${user.lastName || ''}`.trim();
};

/**
 * Check if registration is complete
 */
export const isRegistrationComplete = (): boolean => {
  const { registrationStep } = useAuthStore.getState();
  return registrationStep === 'complete';
};

// ============================================
// 📤 EXPORTS
// ============================================

export default useAuthStore;
