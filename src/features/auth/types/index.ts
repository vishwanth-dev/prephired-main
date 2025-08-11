/**
 * Authentication Feature Types - Main Export
 * 
 * This file serves as the main entry point for all authentication types.
 * It re-exports domain entities and provides shared utility types.
 */

// =============================================================================
// RE-EXPORT DOMAIN ENTITIES (SINGLE SOURCE OF TRUTH)
// =============================================================================

// Core domain entities
export type {
  User,
  UserProfile,
  Tenant,
  Session,
  AuthState,
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  VerifyEmailForm,
  RegisterUserCommand,
  LoginCredentials,
  AuthResult,
  AuthLoadingState,
  UserRole,
  UserStatus,
  TenantStatus,
  Timestamp,
  Url,
  Metadata,
  UserId,
  TenantId,
  SessionId,
  Email,
  PhoneNumber,
} from '../domain/entities';

// =============================================================================
// RE-EXPORT DOMAIN ERRORS
// =============================================================================

export {
  AuthDomainError,
  ValidationError,
  BusinessRuleError,
  SecurityViolationError,
  InvalidEmailError,
  InvalidPhoneNumberError,
  WeakPasswordError,
  PasswordMismatchError,
  TermsNotAcceptedError,
  PrivacyPolicyNotAcceptedError,
  InvalidNameFormatError,
  UserNotFoundError,
  UserAlreadyExistsError,
  InvalidCredentialsError,
  AccountLockedError,
  EmailNotVerifiedError,
  PhoneNotVerifiedError,
  InvalidVerificationTokenError,
  VerificationTokenExpiredError,
  ResetTokenInvalidError,
  ResetTokenExpiredError,
  ResetTokenAlreadyUsedError,
  OtpInvalidError,
  OtpExpiredError,
  OtpTooManyAttemptsError,
  SessionExpiredError,
  SessionNotFoundError,
  TooManyActiveSessionsError,
  TenantNotFoundError,
  TenantAccessDeniedError,
  InsufficientPermissionsError,
  InvalidRoleError,
  RateLimitExceededError,
  SuspiciousActivityError,
  DatabaseError,
  ExternalServiceError,
  ConfigurationError,
} from '../domain/errors';

// =============================================================================
// RE-EXPORT DOMAIN EVENTS
// =============================================================================

export type {
  BaseEvent,
  UserRegisteredEvent,
  UserLoggedInEvent,
  UserLoggedOutEvent,
  PasswordChangedEvent,
  PasswordResetRequestedEvent,
  PasswordResetCompletedEvent,
  EmailVerifiedEvent,
  PhoneVerifiedEvent,
  SessionCreatedEvent,
  SessionExpiredEvent,
  TenantCreatedEvent,
  TenantContextSwitchedEvent,
  LoginFailedEvent,
  AccountLockedEvent,
  SuspiciousActivityEvent,
  AuthEvent,
  AuthEventType,
} from '../domain/events';

export {
  createAuthEvent,
  isSecurityEvent,
  isUserEvent,
  isSessionEvent,
  isTenantEvent,
} from '../domain/events';

// =============================================================================
// RE-EXPORT DOMAIN RULES AND SELECTORS
// =============================================================================

export type { ValidationResult } from '../domain/rules';

export {
  validateRegistrationForm,
  validateLoginForm,
  validatePassword,
  assessPasswordStrength,
  isValidEmail,
  isValidPhoneNumber,
  normalizePhoneToE164,
  toRegisterUserCommand,
  toLoginCredentials,
  sanitizeEmail,
  sanitizePhone,
  generateDisplayName,
  generateInitials,
} from '../domain/rules';

export {
  selectAuthUser,
  selectUserDisplayName,
  selectUserInitials,
  selectUserEmail,
  selectUserPhone,
  selectUserAvatar,
  selectUserRoles,
  selectUserPermissions,
  selectIsUserVerified,
  selectIsAuthenticated,
  selectAuthLoadingState,
  selectIsLoading,
  selectAuthError,
  selectEmailVerificationRequired,
  selectCurrentSession,
  selectSessionId,
  selectSessionExpiry,
  selectIsSessionExpired,
  selectCurrentTenant,
  selectAvailableTenants,
  selectTenantName,
  selectTenantSlug,
  selectHasMultipleTenants,
  selectCanSwitchTenant,
  selectUserProfile,
  selectAuthSummary,
  selectLastUpdated,
  selectIsStale,
  createSafeSelector,
  createMemoizedSelector,
} from '../domain/selectors';

// =============================================================================
// SHARED UTILITY TYPES
// =============================================================================

/**
 * Generic field error for form validation
 */
export interface FieldError {
  readonly field: string;
  readonly message: string;
  readonly code?: string;
}

/**
 * Collection of field errors
 */
export interface FormErrors {
  readonly [field: string]: FieldError;
}

/**
 * Generic loading state
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly message?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
  readonly hasNext: boolean;
  readonly hasPrev: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  readonly pagination: PaginationMeta;
}

/**
 * Sort configuration
 */
export interface SortConfig {
  readonly field: string;
  readonly direction: 'asc' | 'desc';
}

/**
 * Filter configuration
 */
export interface FilterConfig {
  readonly field: string;
  readonly operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'like' | 'regex';
  readonly value: unknown;
}

/**
 * Query parameters for API calls
 */
export interface QueryParams {
  readonly page?: number;
  readonly limit?: number;
  readonly sort?: SortConfig[];
  readonly filters?: FilterConfig[];
  readonly search?: string;
  readonly include?: string[];
}

/**
 * Generic result wrapper
 */
export type Result<T, E = Error> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

/**
 * Async result wrapper
 */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;
