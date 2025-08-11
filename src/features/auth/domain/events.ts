/**
 * 🔐 Authentication Domain Events - Simplified for prepAI
 * 
 * Core events for basic authentication functionality.
 * Removed over engineered event system to focus on essential auth flow.
 */

// =============================================================================
// BASE EVENT INTERFACE
// =============================================================================

export interface BaseEvent {
  readonly id: string;
  readonly type: string;
  readonly userId?: string;
  readonly tenantId?: string;
  readonly timestamp: string;
  readonly metadata?: Record<string, unknown>;
}

// =============================================================================
// AUTHENTICATION EVENTS
// =============================================================================

export interface UserRegisteredEvent extends BaseEvent {
  readonly type: 'user_registered';
  readonly userId: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
}

export interface UserLoggedInEvent extends BaseEvent {
  readonly type: 'user_logged_in';
  readonly userId: string;
  readonly email: string;
  readonly ipAddress?: string;
  readonly userAgent?: string;
}

export interface UserLoggedOutEvent extends BaseEvent {
  readonly type: 'user_logged_out';
  readonly userId: string;
  readonly sessionId?: string;
}

export interface PasswordChangedEvent extends BaseEvent {
  readonly type: 'password_changed';
  readonly userId: string;
}

export interface PasswordResetRequestedEvent extends BaseEvent {
  readonly type: 'password_reset_requested';
  readonly email: string;
  readonly ipAddress?: string;
}

export interface PasswordResetCompletedEvent extends BaseEvent {
  readonly type: 'password_reset_completed';
  readonly userId: string;
}

// =============================================================================
// VERIFICATION EVENTS
// =============================================================================

export interface EmailVerifiedEvent extends BaseEvent {
  readonly type: 'email_verified';
  readonly userId: string;
  readonly email: string;
}

export interface PhoneVerifiedEvent extends BaseEvent {
  readonly type: 'phone_verified';
  readonly userId: string;
  readonly phone: string;
}

// =============================================================================
// SESSION EVENTS
// =============================================================================

export interface SessionCreatedEvent extends BaseEvent {
  readonly type: 'session_created';
  readonly userId: string;
  readonly sessionId: string;
  readonly ipAddress?: string;
  readonly userAgent?: string;
}

export interface SessionExpiredEvent extends BaseEvent {
  readonly type: 'session_expired';
  readonly userId: string;
  readonly sessionId: string;
}

// =============================================================================
// TENANT EVENTS
// =============================================================================

export interface TenantCreatedEvent extends BaseEvent {
  readonly type: 'tenant_created';
  readonly tenantId: string;
  readonly name: string;
  readonly createdBy: string;
}

export interface TenantContextSwitchedEvent extends BaseEvent {
  readonly type: 'tenant_context_switched';
  readonly userId: string;
  readonly fromTenantId?: string;
  readonly toTenantId: string;
}

// =============================================================================
// SECURITY EVENTS
// =============================================================================

export interface LoginFailedEvent extends BaseEvent {
  readonly type: 'login_failed';
  readonly email: string;
  readonly ipAddress?: string;
  readonly userAgent?: string;
  readonly reason?: string;
}

export interface AccountLockedEvent extends BaseEvent {
  readonly type: 'account_locked';
  readonly userId: string;
  readonly reason: string;
  readonly lockedUntil: string;
}

export interface SuspiciousActivityEvent extends BaseEvent {
  readonly type: 'suspicious_activity';
  readonly userId?: string;
  readonly activityType: string;
  readonly ipAddress?: string;
  readonly userAgent?: string;
  readonly details: Record<string, unknown>;
}

// =============================================================================
// EVENT TYPES
// =============================================================================

export type AuthEvent =
  | UserRegisteredEvent
  | UserLoggedInEvent
  | UserLoggedOutEvent
  | PasswordChangedEvent
  | PasswordResetRequestedEvent
  | PasswordResetCompletedEvent
  | EmailVerifiedEvent
  | PhoneVerifiedEvent
  | SessionCreatedEvent
  | SessionExpiredEvent
  | TenantCreatedEvent
  | TenantContextSwitchedEvent
  | LoginFailedEvent
  | AccountLockedEvent
  | SuspiciousActivityEvent;

export type AuthEventType = AuthEvent['type'];

// =============================================================================
// EVENT UTILITIES
// =============================================================================

export const createAuthEvent = <T extends AuthEvent>(
  type: T['type'],
  data: Omit<T, 'id' | 'type' | 'timestamp'>
): T =>
  ({
    id: crypto.randomUUID(),
    type,
    timestamp: new Date().toISOString(),
    ...data,
  }) as T;

export const isSecurityEvent = (event: AuthEvent): boolean => {
  return ['login_failed', 'account_locked', 'suspicious_activity'].includes(event.type);
};

export const isUserEvent = (event: AuthEvent): boolean => {
  return [
    'user_registered',
    'user_logged_in',
    'user_logged_out',
    'password_changed',
    'password_reset_requested',
    'password_reset_completed',
    'email_verified',
    'phone_verified',
  ].includes(event.type);
};

export const isSessionEvent = (event: AuthEvent): boolean => {
  return ['session_created', 'session_expired'].includes(event.type);
};

export const isTenantEvent = (event: AuthEvent): boolean => {
  return ['tenant_created', 'tenant_context_switched'].includes(event.type);
};
