/**
 * API Types for Authentication Feature
 *
 * All request and response types for communicating with the backend API.
 * These types represent the data that flows over HTTP/JSON.
 */

import type {
  User,
  Tenant,
  ClientSession,
  UserId,
  TenantId,
  Email,
  PhoneNumber,
  UserRole,
  LoginMethod,
  PaginationMeta,
  SortOrder,
} from '@/features/auth/types';

// =============================================================================
// BASE API TYPES
// =============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data: T;
  readonly message?: string;
  readonly timestamp: string;
}

/**
 * Error response from API
 */
export interface ErrorResponse {
  readonly success: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly field?: string;
    readonly details?: Record<string, unknown>;
  };
  readonly timestamp: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  readonly success: true;
  readonly data: T[];
  readonly meta: PaginationMeta;
  readonly timestamp: string;
}

// =============================================================================
// AUTHENTICATION API TYPES
// =============================================================================

/**
 * Login request payload
 */
export interface LoginRequest {
  readonly emailOrPhone: string;
  readonly password: string;
  readonly rememberMe?: boolean;
  readonly deviceInfo?: {
    readonly userAgent: string;
    readonly ipAddress?: string;
    readonly deviceFingerprint?: string;
  };
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly email?: Email;
  readonly phoneNumber?: PhoneNumber;
  readonly countryCode?: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly acceptedTerms: boolean;
  readonly tenantName?: string;
  readonly inviteToken?: string;
  readonly deviceInfo?: {
    readonly userAgent: string;
    readonly ipAddress?: string;
  };
}

/**
 * Forgot password request
 */
export interface ForgotPasswordRequest {
  readonly emailOrPhone: string;
  readonly deviceInfo?: {
    readonly userAgent: string;
    readonly ipAddress?: string;
  };
}

/**
 * Reset password request
 */
export interface ResetPasswordRequest {
  readonly token: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly deviceInfo?: {
    readonly userAgent: string;
    readonly ipAddress?: string;
  };
}

/**
 * Change password request
 */
export interface ChangePasswordRequest {
  readonly currentPassword: string;
  readonly newPassword: string;
  readonly confirmNewPassword: string;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  readonly user: User;
  readonly session: ClientSession;
  readonly tenant?: Tenant;
  readonly permissions: string[];
  readonly isFirstLogin: boolean;
  readonly requiresEmailVerification: boolean;
  readonly requiresPhoneVerification: boolean;
}

/**
 * Session validation response
 */
export interface SessionResponse {
  readonly isValid: boolean;
  readonly user?: User;
  readonly tenant?: Tenant;
  readonly permissions: string[];
  readonly expiresAt?: string;
  readonly timeRemaining?: number; // minutes
}

// =============================================================================
// USER MANAGEMENT API TYPES
// =============================================================================

/**
 * Update profile request
 */
export interface UpdateProfileRequest {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly phoneNumber?: PhoneNumber;
  readonly countryCode?: string;
  readonly avatar?: string;
  readonly preferences?: {
    readonly language?: string;
    readonly timezone?: string;
    readonly notifications?: {
      readonly email: boolean;
      readonly sms: boolean;
      readonly push: boolean;
    };
  };
}

/**
 * User list request (for admin)
 */
export interface UserListRequest {
  readonly page?: number;
  readonly limit?: number;
  readonly search?: string;
  readonly role?: UserRole;
  readonly status?: 'active' | 'inactive' | 'all';
  readonly tenantId?: TenantId;
  readonly sortBy?: 'createdAt' | 'lastLoginAt' | 'firstName' | 'email';
  readonly sortOrder?: SortOrder;
  readonly includeDeleted?: boolean;
}

/**
 * User response (public safe version)
 */
export interface UserResponse {
  readonly id: UserId;
  readonly firstName: string;
  readonly lastName: string;
  readonly email?: Email;
  readonly phoneNumber?: PhoneNumber;
  readonly role: UserRole;
  readonly isActive: boolean;
  readonly emailVerifiedAt: string | null;
  readonly lastLoginAt: string | null;
  readonly createdAt: string;
  readonly avatar?: string;
  readonly tenantId?: TenantId;
}

/**
 * Paginated user list response
 */
export interface UserListResponse extends PaginatedResponse<UserResponse> {}

/**
 * User invitation request
 */
export interface InviteUserRequest {
  readonly email: Email;
  readonly role: UserRole;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly customMessage?: string;
  readonly expiresInDays?: number;
}

/**
 * User invitation response
 */
export interface InviteUserResponse {
  readonly inviteId: string;
  readonly email: Email;
  readonly inviteUrl: string;
  readonly expiresAt: string;
}

// =============================================================================
// TENANT MANAGEMENT API TYPES
// =============================================================================

/**
 * Tenant creation request
 */
export interface CreateTenantRequest {
  readonly name: string;
  readonly slug: string;
  readonly domain?: string;
  readonly logo?: string;
  readonly settings?: {
    readonly allowSSOOnly?: boolean;
    readonly requireEmailVerification?: boolean;
    readonly sessionTimeoutMinutes?: number;
    readonly maxLoginAttempts?: number;
  };
}

/**
 * Tenant update request
 */
export interface UpdateTenantRequest {
  readonly name?: string;
  readonly slug?: string;
  readonly domain?: string;
  readonly logo?: string;
  readonly settings?: {
    readonly allowSSOOnly?: boolean;
    readonly requireEmailVerification?: boolean;
    readonly sessionTimeoutMinutes?: number;
    readonly maxLoginAttempts?: number;
  };
}

/**
 * Tenant list request
 */
export interface TenantListRequest {
  readonly page?: number;
  readonly limit?: number;
  readonly search?: string;
  readonly status?: 'active' | 'inactive' | 'trial' | 'all';
  readonly plan?: 'free' | 'pro' | 'enterprise' | 'all';
  readonly sortBy?: 'createdAt' | 'name' | 'userCount';
  readonly sortOrder?: SortOrder;
}

/**
 * Tenant response
 */
export interface TenantResponse {
  readonly id: TenantId;
  readonly name: string;
  readonly slug: string;
  readonly domain?: string;
  readonly logo?: string;
  readonly subscription: {
    readonly plan: 'free' | 'pro' | 'enterprise';
    readonly status: 'active' | 'inactive' | 'trial';
    readonly expiresAt?: string;
    readonly maxUsers: number;
    readonly maxInterviews: number;
  };
  readonly usage: {
    readonly users: number;
    readonly interviews: number;
  };
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Paginated tenant list response
 */
export interface TenantListResponse extends PaginatedResponse<TenantResponse> {}

// =============================================================================
// VERIFICATION API TYPES
// =============================================================================

/**
 * Email verification request
 */
export interface VerifyEmailRequest {
  readonly token: string;
}

/**
 * Resend verification request
 */
export interface ResendVerificationRequest {
  readonly type: 'email' | 'phone';
  readonly identifier: string; // email or phone
}

/**
 * Phone verification request
 */
export interface VerifyPhoneRequest {
  readonly phoneNumber: PhoneNumber;
  readonly code: string;
}

/**
 * Send phone verification request
 */
export interface SendPhoneVerificationRequest {
  readonly phoneNumber: PhoneNumber;
  readonly countryCode: string;
}

/**
 * Verification response
 */
export interface VerificationResponse {
  readonly success: boolean;
  readonly type: 'email' | 'phone';
  readonly identifier: string;
  readonly verifiedAt: string;
}

// =============================================================================
// ANALYTICS & REPORTING API TYPES
// =============================================================================

/**
 * Analytics request
 */
export interface AnalyticsRequest {
  readonly startDate: string;
  readonly endDate: string;
  readonly metrics: ('users' | 'logins' | 'registrations' | 'sessions' | 'errors')[];
  readonly granularity?: 'hour' | 'day' | 'week' | 'month';
  readonly tenantId?: TenantId;
  readonly filters?: {
    readonly userRole?: UserRole[];
    readonly loginMethod?: LoginMethod[];
  };
}

/**
 * Analytics data point
 */
export interface AnalyticsDataPoint {
  readonly timestamp: string;
  readonly value: number;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Analytics response
 */
export interface AnalyticsResponse {
  readonly metrics: {
    readonly [key: string]: {
      readonly data: AnalyticsDataPoint[];
      readonly total: number;
      readonly change: number; // percentage change from previous period
      readonly changeType: 'increase' | 'decrease' | 'stable';
    };
  };
  readonly period: {
    readonly start: string;
    readonly end: string;
    readonly granularity: string;
  };
}

// =============================================================================
// AUDIT & SECURITY API TYPES
// =============================================================================

/**
 * Audit log request
 */
export interface AuditLogRequest {
  readonly page?: number;
  readonly limit?: number;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly userId?: UserId;
  readonly tenantId?: TenantId;
  readonly eventType?: string;
  readonly severity?: 'low' | 'medium' | 'high' | 'critical';
  readonly ipAddress?: string;
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  readonly id: string;
  readonly eventType: string;
  readonly userId?: UserId;
  readonly tenantId?: TenantId;
  readonly description: string;
  readonly metadata: Record<string, unknown>;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly timestamp: string;
}

/**
 * Audit log response
 */
export interface AuditLogResponse extends PaginatedResponse<AuditLogEntry> {}

/**
 * Security event request
 */
export interface SecurityEventRequest {
  readonly page?: number;
  readonly limit?: number;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly eventType?:
    | 'login_failed'
    | 'account_locked'
    | 'suspicious_activity'
    | 'security_violation';
  readonly severity?: 'low' | 'medium' | 'high' | 'critical';
  readonly resolved?: boolean;
}

/**
 * Security event
 */
export interface SecurityEvent {
  readonly id: string;
  readonly type: 'login_failed' | 'account_locked' | 'suspicious_activity' | 'security_violation';
  readonly userId?: UserId;
  readonly tenantId?: TenantId;
  readonly description: string;
  readonly details: Record<string, unknown>;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly isResolved: boolean;
  readonly resolvedBy?: UserId;
  readonly resolvedAt?: string;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly timestamp: string;
}

/**
 * Security event response
 */
export interface SecurityEventResponse extends PaginatedResponse<SecurityEvent> {}

// =============================================================================
// BATCH OPERATIONS
// =============================================================================

/**
 * Batch user operation request
 */
export interface BatchUserRequest {
  readonly operation: 'activate' | 'deactivate' | 'delete' | 'change_role';
  readonly userIds: UserId[];
  readonly params?: {
    readonly newRole?: UserRole;
    readonly reason?: string;
  };
}

/**
 * Batch operation result
 */
export interface BatchOperationResult {
  readonly total: number;
  readonly successful: number;
  readonly failed: number;
  readonly errors: Array<{
    readonly id: string;
    readonly error: string;
  }>;
}

/**
 * Batch operation response
 */
export interface BatchOperationResponse {
  readonly success: boolean;
  readonly result: BatchOperationResult;
  readonly timestamp: string;
}

// =============================================================================
// WEBHOOKS & INTEGRATIONS
// =============================================================================

/**
 * Webhook configuration
 */
export interface WebhookConfig {
  readonly id: string;
  readonly url: string;
  readonly events: string[];
  readonly isActive: boolean;
  readonly secret: string;
  readonly headers?: Record<string, string>;
  readonly retryConfig: {
    readonly maxRetries: number;
    readonly backoffMultiplier: number;
  };
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Create webhook request
 */
export interface CreateWebhookRequest {
  readonly url: string;
  readonly events: string[];
  readonly secret?: string;
  readonly headers?: Record<string, string>;
}

/**
 * Webhook delivery attempt
 */
export interface WebhookDelivery {
  readonly id: string;
  readonly webhookId: string;
  readonly event: string;
  readonly payload: Record<string, unknown>;
  readonly responseStatus?: number;
  readonly responseBody?: string;
  readonly error?: string;
  readonly attemptCount: number;
  readonly deliveredAt?: string;
  readonly createdAt: string;
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

/**
 * Type guard to check if response is an error
 */
export const isErrorResponse = (response: unknown): response is ErrorResponse => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    response.success === false &&
    'error' in response
  );
};

/**
 * Type guard to check if response is successful
 */
export const isSuccessResponse = <T>(response: unknown): response is ApiResponse<T> => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    response.success === true &&
    'data' in response
  );
};

/**
 * Type guard to check if response is paginated
 */
export const isPaginatedResponse = <T>(response: unknown): response is PaginatedResponse<T> => {
  return (
    isSuccessResponse(response) &&
    Array.isArray(response.data) &&
    'meta' in response &&
    typeof response.meta === 'object' &&
    response.meta !== null
  );
};
