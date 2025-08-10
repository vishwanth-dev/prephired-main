/**
 * Public Type Exports for Authentication Feature
 *
 * This is the main type entry point that other modules/features should import from.
 * Re-exports all public types from domain, UI, and API layers.
 */

// =============================================================================
// DOMAIN TYPES (Public API)
// =============================================================================

// Core entities and value objects
export type {
  User,
  Tenant,
  ClientSession,
  TenantSettings,
  TenantSubscription,
  PasswordPolicy,
} from '../domain/entities';

// Type aliases for safety
export type { UserId, TenantId, Email, PhoneNumber } from '../domain/entities';

// Enums and union types
export type { UserRole, LoginMethod } from '../domain/entities';

// Domain commands (inputs)
export type {
  RegisterUserCommand,
  LoginCredentials,
  NormalizedLoginCredentials,
  ResetPasswordCommand,
  ChangePasswordCommand,
  UpdateProfileCommand,
  ForgotPasswordCommand,
  VerifyEmailCommand,
  ResendVerificationCommand,
} from '../domain/entities';

// Domain events (outputs)
export type {
  DomainEvent,
  UserRegisteredEvent,
  UserLoggedInEvent,
  UserLoggedOutEvent,
  PasswordChangedEvent,
  EmailVerifiedEvent,
  PhoneVerifiedEvent,
} from '../domain/entities';

// Extended domain events
export type {
  ExtendedDomainEvent,
  UserCreatedEvent,
  UserUpdatedEvent,
  UserDeletedEvent,
  LoginAttemptedEvent,
  LoginFailedEvent,
  SessionCreatedEvent,
  SessionExpiredEvent,
  TenantCreatedEvent,
  SuspiciousActivityDetectedEvent,
  SecurityViolationEvent,
} from '../domain/events';

// Domain errors (for error handling)
export {
  AuthDomainError,
  ValidationError,
  BusinessRuleError,
  InvalidCredentialsError,
  SessionExpiredError,
  UserAlreadyExistsError,
  WeakPasswordError,
  PasswordMismatchError,
  InvalidEmailError,
  InvalidPhoneNumberError,
  AccountLockedError,
  TenantNotFoundError,
  InsufficientPermissionsError,
} from '../domain/errors';

// =============================================================================
// UI TYPES (Client-side state and forms)
// =============================================================================

export type {
  AuthState,
  AuthActions,
  AuthStore,
  LoginFormState,
  RegisterFormState,
  ForgotPasswordFormState,
  ResetPasswordFormState,
  AuthPersistState,
  AuthConfig,
} from '@/features/auth/types/ui.types';

// =============================================================================
// API TYPES (Server communication)
// =============================================================================

export type {
  // Request types
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,

  // Response types
  AuthResponse,
  SessionResponse,
  UserResponse,
  TenantResponse,
  ErrorResponse,

  // Pagination and filtering
  UserListRequest,
  UserListResponse,
  TenantListRequest,
  TenantListResponse,

  // Analytics and reporting
  AnalyticsRequest,
  AnalyticsResponse,

  // Audit and security
  AuditLogRequest,
  AuditLogResponse,
  SecurityEventRequest,
  SecurityEventResponse,
} from './api.types';

// =============================================================================
// SERVER TYPES (Server-side only - imported from session.types.ts)
// =============================================================================

export type {
  ServerSession,
  AccessTokenPayload,
  RefreshTokenPayload,
  SessionRecord,
  AuthContext,
  ProtectedRouteContext,
  AuthProvider,
  OAuthUserProfile,
  LoginAttempt,
  SecurityEvent,
  SecurityEventType,
  RateLimitConfig,
  RateLimitState,
} from '@/features/auth/store/session.types';

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Extract the payload type from an API response
 */
export type ApiPayload<T> = T extends { data: infer P } ? P : never;

/**
 * Make all properties optional except specified keys
 */
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/**
 * Make all properties required except specified keys
 */
export type RequiredExcept<T, K extends keyof T> = Required<T> & Partial<Pick<T, K>>;

/**
 * Extract non-undefined keys from a type
 */
export type NonUndefined<T> = {
  [K in keyof T]-?: T[K] extends undefined ? never : K;
}[keyof T];

/**
 * Create a type with only the non-undefined properties
 */
export type DefinedProperties<T> = Pick<T, NonUndefined<T>>;

/**
 * Form field error type
 */
export type FieldError = {
  message: string;
  type?: string;
};

/**
 * Form errors object
 */
export type FormErrors<T> = Partial<Record<keyof T, FieldError>>;

/**
 * API loading state
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Pagination metadata
 */
export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

/**
 * Sort order
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Sort configuration
 */
export type SortConfig<T> = {
  field: keyof T;
  order: SortOrder;
};

/**
 * Filter configuration
 */
export type FilterConfig<T> = Partial<{
  [K in keyof T]: T[K] | T[K][] | { min?: T[K]; max?: T[K] };
}>;

/**
 * Search and filter parameters
 */
export type SearchParams<T> = {
  query?: string;
  filters?: FilterConfig<T>;
  sort?: SortConfig<T>;
  pagination?: {
    page: number;
    limit: number;
  };
};

// =============================================================================
// CONSTANTS AND DEFAULTS
// =============================================================================

/**
 * Default pagination settings
 */
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
} as const;

/**
 * Maximum pagination limit
 */
export const MAX_PAGINATION_LIMIT = 100 as const;

/**
 * Default sort order
 */
export const DEFAULT_SORT_ORDER: SortOrder = 'desc' as const;

/**
 * Common date formats
 */
export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  DATE_ONLY: 'YYYY-MM-DD',
  TIME_ONLY: 'HH:mm:ss',
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
} as const;

/**
 * HTTP status codes commonly used in auth
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Auth-related localStorage keys
 */
export const STORAGE_KEYS = {
  REMEMBER_ME: 'auth.rememberMe',
  LAST_LOGIN_EMAIL: 'auth.lastLoginEmail',
  LAST_LOGIN_PHONE: 'auth.lastLoginPhone',
  THEME_PREFERENCE: 'auth.themePreference',
  LANGUAGE_PREFERENCE: 'auth.languagePreference',
} as const;

/**
 * Session timeout warning thresholds (in minutes)
 */
export const SESSION_WARNING_THRESHOLDS = {
  CRITICAL: 5,
  WARNING: 15,
  INFO: 30,
} as const;

/**
 * Password strength levels
 */
export const PASSWORD_STRENGTH_LEVELS = {
  WEAK: 'weak',
  FAIR: 'fair',
  GOOD: 'good',
  STRONG: 'strong',
} as const;

/**
 * Login attempt limits
 */
export const LOGIN_LIMITS = {
  MAX_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 30,
  RATE_LIMIT_WINDOW_MINUTES: 15,
} as const;
