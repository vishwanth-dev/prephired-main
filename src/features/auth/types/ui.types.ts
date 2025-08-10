/**
 * UI Types for Authentication Feature
 *
 * Client-side state management types, form states, and UI-specific interfaces.
 * These types are used by React components, hooks, and Zustand stores.
 */

import type {
  User,
  Tenant,
  ClientSession,
  AuthDomainError,
  UserId,
  TenantId,
  Email,
  PhoneNumber,
  UserRole,
  LoadingState,
  FieldError,
  FormErrors,
} from './index';

// =============================================================================
// AUTH STORE STATE
// =============================================================================

/**
 * Main authentication state
 */
export interface AuthState {
  // Authentication status
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly isInitialized: boolean;

  // Current user and session data
  readonly user: User | null;
  readonly tenant: Tenant | null;
  readonly session: ClientSession | null;
  readonly permissions: string[];

  // Error state
  readonly error: AuthDomainError | null;
  readonly lastError: string | null;

  // Login attempt tracking
  readonly loginAttempts: number;
  readonly isAccountLocked: boolean;
  readonly lockExpiresAt: string | null; // ISO string

  // UI state
  readonly isLoginModalOpen: boolean;
  readonly isRegisterModalOpen: boolean;
  readonly redirectAfterLogin: string | null;

  // Session management
  readonly sessionWarning: {
    readonly isVisible: boolean;
    readonly minutesRemaining: number;
    readonly severity: 'info' | 'warning' | 'critical';
  };

  // Verification state
  readonly pendingVerification: {
    readonly email: boolean;
    readonly phone: boolean;
  };
}

/**
 * Auth store actions
 */
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
    inviteToken?: string;
  }) => Promise<void>;

  logout: () => Promise<void>;

  // Session management
  refreshSession: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  extendSession: () => Promise<void>;

  // Error handling
  clearError: () => void;
  setError: (error: AuthDomainError | string) => void;

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
    avatar?: string;
  }) => Promise<void>;

  // Email/Phone verification
  verifyEmail: (token: string) => Promise<void>;
  verifyPhone: (code: string) => Promise<void>;
  resendEmailVerification: () => Promise<void>;
  resendPhoneVerification: () => Promise<void>;

  // UI state management
  openLoginModal: (redirectAfterLogin?: string) => void;
  closeLoginModal: () => void;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;

  // Session warnings
  showSessionWarning: (minutesRemaining: number, severity: 'info' | 'warning' | 'critical') => void;
  hideSessionWarning: () => void;

  // Tenant management
  switchTenant: (tenantId: string) => Promise<void>;

  // Account lockout
  setAccountLocked: (unlockTime: string) => void;
  clearAccountLocked: () => void;
}

/**
 * Complete auth store type
 */
export type AuthStore = AuthState & AuthActions;

// =============================================================================
// FORM STATES
// =============================================================================

/**
 * Login form state
 */
export interface LoginFormState {
  readonly emailOrPhone: string;
  readonly password: string;
  readonly rememberMe: boolean;
  readonly isSubmitting: boolean;
  readonly isValid: boolean;
  readonly errors: FormErrors<{
    emailOrPhone: string;
    password: string;
    general: string;
  }>;
  readonly touchedFields: Set<string>;
}

/**
 * Registration form state
 */
export interface RegisterFormState {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly countryCode: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly acceptedTerms: boolean;
  readonly tenantName: string;
  readonly inviteToken: string;
  readonly isSubmitting: boolean;
  readonly isValid: boolean;
  readonly errors: FormErrors<{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    acceptedTerms: string;
    tenantName: string;
    general: string;
  }>;
  readonly touchedFields: Set<string>;
  readonly passwordStrength: {
    readonly score: number;
    readonly level: 'weak' | 'fair' | 'good' | 'strong';
    readonly feedback: string[];
  };
}

/**
 * Forgot password form state
 */
export interface ForgotPasswordFormState {
  readonly emailOrPhone: string;
  readonly isSubmitting: boolean;
  readonly isSuccess: boolean;
  readonly isValid: boolean;
  readonly errors: FormErrors<{
    emailOrPhone: string;
    general: string;
  }>;
  readonly touchedFields: Set<string>;
}

/**
 * Reset password form state
 */
export interface ResetPasswordFormState {
  readonly token: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly isSubmitting: boolean;
  readonly isSuccess: boolean;
  readonly isValid: boolean;
  readonly errors: FormErrors<{
    password: string;
    confirmPassword: string;
    token: string;
    general: string;
  }>;
  readonly touchedFields: Set<string>;
  readonly passwordStrength: {
    readonly score: number;
    readonly level: 'weak' | 'fair' | 'good' | 'strong';
    readonly feedback: string[];
  };
}

/**
 * Change password form state
 */
export interface ChangePasswordFormState {
  readonly currentPassword: string;
  readonly newPassword: string;
  readonly confirmNewPassword: string;
  readonly isSubmitting: boolean;
  readonly isSuccess: boolean;
  readonly isValid: boolean;
  readonly errors: FormErrors<{
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    general: string;
  }>;
  readonly touchedFields: Set<string>;
  readonly passwordStrength: {
    readonly score: number;
    readonly level: 'weak' | 'fair' | 'good' | 'strong';
    readonly feedback: string[];
  };
}

/**
 * Profile update form state
 */
export interface ProfileFormState {
  readonly firstName: string;
  readonly lastName: string;
  readonly phoneNumber: string;
  readonly countryCode: string;
  readonly avatar: string;
  readonly isSubmitting: boolean;
  readonly isSuccess: boolean;
  readonly isValid: boolean;
  readonly errors: FormErrors<{
    firstName: string;
    lastName: string;
    phoneNumber: string;
    avatar: string;
    general: string;
  }>;
  readonly touchedFields: Set<string>;
  readonly hasChanges: boolean;
}

/**
 * Email verification form state
 */
export interface EmailVerificationFormState {
  readonly token: string;
  readonly isSubmitting: boolean;
  readonly isSuccess: boolean;
  readonly isValid: boolean;
  readonly errors: FormErrors<{
    token: string;
    general: string;
  }>;
  readonly canResend: boolean;
  readonly resendCooldown: number; // seconds
}

/**
 * Phone verification form state
 */
export interface PhoneVerificationFormState {
  readonly code: string;
  readonly isSubmitting: boolean;
  readonly isSuccess: boolean;
  readonly isValid: boolean;
  readonly errors: FormErrors<{
    code: string;
    general: string;
  }>;
  readonly canResend: boolean;
  readonly resendCooldown: number; // seconds
}

// =============================================================================
// UI COMPONENT PROPS
// =============================================================================

/**
 * Auth guard component props
 */
export interface AuthGuardProps {
  readonly children: React.ReactNode;
  readonly requireAuth?: boolean;
  readonly requireRoles?: UserRole[];
  readonly requireTenant?: boolean;
  readonly requireVerification?: boolean;
  readonly fallback?: React.ReactNode;
  readonly redirectTo?: string;
}

/**
 * Login form component props
 */
export interface LoginFormProps {
  readonly onSuccess?: (user: User) => void;
  readonly onError?: (error: AuthDomainError) => void;
  readonly redirectAfterLogin?: string;
  readonly showRememberMe?: boolean;
  readonly showForgotPassword?: boolean;
  readonly showSocialLogins?: boolean;
  readonly initialValues?: Partial<{
    emailOrPhone: string;
    rememberMe: boolean;
  }>;
}

/**
 * Registration form component props
 */
export interface RegisterFormProps {
  readonly onSuccess?: (user: User) => void;
  readonly onError?: (error: AuthDomainError) => void;
  readonly inviteToken?: string;
  readonly showTenantCreation?: boolean;
  readonly showSocialLogins?: boolean;
  readonly initialValues?: Partial<RegisterFormState>;
}

/**
 * User avatar component props
 */
export interface UserAvatarProps {
  readonly user: User;
  readonly size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  readonly showOnlineStatus?: boolean;
  readonly onClick?: () => void;
  readonly className?: string;
}

/**
 * Tenant switcher component props
 */
export interface TenantSwitcherProps {
  readonly availableTenants: Tenant[];
  readonly currentTenant?: Tenant;
  readonly onTenantSwitch: (tenant: Tenant) => void;
  readonly showCreateOption?: boolean;
  readonly placement?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Session timeout warning props
 */
export interface SessionTimeoutWarningProps {
  readonly isVisible: boolean;
  readonly minutesRemaining: number;
  readonly severity: 'info' | 'warning' | 'critical';
  readonly onExtendSession: () => void;
  readonly onLogout: () => void;
  readonly onDismiss: () => void;
}

/**
 * Password strength meter props
 */
export interface PasswordStrengthMeterProps {
  readonly password: string;
  readonly showFeedback?: boolean;
  readonly className?: string;
}

// =============================================================================
// PERSISTENCE & CONFIGURATION
// =============================================================================

/**
 * Auth persistence state (localStorage)
 */
export interface AuthPersistState {
  readonly rememberMe: boolean;
  readonly lastLoginEmail: string | null;
  readonly lastLoginPhone: string | null;
  readonly preferredLoginMethod: 'email' | 'phone' | null;
  readonly themePreference: 'light' | 'dark' | 'system';
  readonly languagePreference: string;
}

/**
 * Auth configuration
 */
export interface AuthConfig {
  readonly apiBaseUrl: string;
  readonly tokenRefreshInterval: number;
  readonly maxLoginAttempts: number;
  readonly lockoutDurationMinutes: number;
  readonly sessionTimeoutMinutes: number;
  readonly sessionWarningMinutes: number;
  readonly passwordMinLength: number;
  readonly enableSocialLogins: boolean;
  readonly enablePhoneAuth: boolean;
  readonly enableTenantCreation: boolean;
  readonly defaultCountryCode: string;
  readonly supportedCountries: string[];
  readonly features: {
    readonly emailVerification: boolean;
    readonly phoneVerification: boolean;
    readonly multiTenant: boolean;
    readonly sso: boolean;
    readonly audit: boolean;
    readonly analytics: boolean;
  };
}

// =============================================================================
// NAVIGATION & ROUTING
// =============================================================================

/**
 * Auth route configuration
 */
export interface AuthRoute {
  readonly path: string;
  readonly requireAuth: boolean;
  readonly requireRoles?: UserRole[];
  readonly requireTenant?: boolean;
  readonly requireVerification?: boolean;
  readonly component: React.ComponentType;
  readonly fallback?: React.ComponentType;
}

/**
 * Navigation item for auth-related pages
 */
export interface AuthNavItem {
  readonly key: string;
  readonly label: string;
  readonly path: string;
  readonly icon?: React.ComponentType;
  readonly requireAuth: boolean;
  readonly requireRoles?: UserRole[];
  readonly isVisible: (user: User | null, tenant: Tenant | null) => boolean;
}

// =============================================================================
// NOTIFICATION & TOAST TYPES
// =============================================================================

/**
 * Auth notification types
 */
export type AuthNotificationType =
  | 'login_success'
  | 'login_failed'
  | 'logout_success'
  | 'registration_success'
  | 'password_changed'
  | 'email_verified'
  | 'phone_verified'
  | 'session_expired'
  | 'account_locked'
  | 'verification_sent';

/**
 * Auth notification
 */
export interface AuthNotification {
  readonly id: string;
  readonly type: AuthNotificationType;
  readonly title: string;
  readonly message: string;
  readonly severity: 'success' | 'error' | 'warning' | 'info';
  readonly duration?: number; // milliseconds
  readonly actions?: Array<{
    readonly label: string;
    readonly action: () => void;
  }>;
  readonly createdAt: string;
}

// =============================================================================
// ANALYTICS & TRACKING
// =============================================================================

/**
 * Auth analytics event
 */
export interface AuthAnalyticsEvent {
  readonly eventType: 'page_view' | 'button_click' | 'form_submit' | 'error';
  readonly eventName: string;
  readonly userId?: UserId;
  readonly tenantId?: TenantId;
  readonly properties: Record<string, unknown>;
  readonly timestamp: string;
}

/**
 * Form analytics data
 */
export interface FormAnalytics {
  readonly formName: string;
  readonly timeToComplete: number; // milliseconds
  readonly fieldErrors: Record<string, number>;
  readonly abandonmentPoint?: string;
  readonly isCompleted: boolean;
}

// =============================================================================
// ACCESSIBILITY
// =============================================================================

/**
 * Accessibility configuration
 */
export interface A11yConfig {
  readonly announceStateChanges: boolean;
  readonly reduceMotion: boolean;
  readonly highContrast: boolean;
  readonly screenReaderOptimizations: boolean;
  readonly keyboardNavigationHints: boolean;
}

// =============================================================================
// THEME & STYLING
// =============================================================================

/**
 * Auth theme configuration
 */
export interface AuthTheme {
  readonly primaryColor: string;
  readonly secondaryColor: string;
  readonly errorColor: string;
  readonly successColor: string;
  readonly warningColor: string;
  readonly borderRadius: string;
  readonly fontFamily: string;
  readonly spacing: {
    readonly xs: string;
    readonly sm: string;
    readonly md: string;
    readonly lg: string;
    readonly xl: string;
  };
}

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Form field validation function type
 */
export type FieldValidator<T> = (value: T) => FieldError | null;

/**
 * Form submission handler type
 */
export type FormSubmissionHandler<T> = (data: T) => Promise<void>;

/**
 * Form reset handler type
 */
export type FormResetHandler = () => void;
