/**
 * 🔐 Authentication Domain Errors - Simplified for prepAI
 * 
 * Core error classes for basic authentication functionality.
 * Removed overengineered error types to focus on essential auth flow.
 */

// =============================================================================
// BASE ERROR CLASSES
// =============================================================================

export class AuthDomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly field?: string,
    public readonly metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AuthDomainError';
  }
}

export class ValidationError extends AuthDomainError {
  constructor(message: string, field: string, metadata?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', field, metadata);
    this.name = 'ValidationError';
  }
}

export class BusinessRuleError extends AuthDomainError {
  constructor(message: string, code: string, metadata?: Record<string, unknown>) {
    super(message, code, undefined, metadata);
    this.name = 'BusinessRuleError';
  }
}

export class SecurityViolationError extends AuthDomainError {
  constructor(message: string, code: string, metadata?: Record<string, unknown>) {
    super(message, code, undefined, metadata);
    this.name = 'SecurityViolationError';
  }
}

// =============================================================================
// VALIDATION ERRORS
// =============================================================================

export class InvalidEmailError extends ValidationError {
  constructor() {
    super('Invalid email format', 'email');
  }
}

export class InvalidPhoneNumberError extends ValidationError {
  constructor() {
    super('Invalid phone number format', 'phone');
  }
}

export class WeakPasswordError extends ValidationError {
  constructor(requirements: string[]) {
    super(`Password does not meet requirements: ${requirements.join(', ')}`, 'password');
  }
}

export class PasswordMismatchError extends ValidationError {
  constructor() {
    super('Passwords do not match', 'confirmPassword');
  }
}

export class TermsNotAcceptedError extends ValidationError {
  constructor() {
    super('Terms of service must be accepted', 'acceptTerms');
  }
}

export class PrivacyPolicyNotAcceptedError extends ValidationError {
  constructor() {
    super('Privacy policy must be accepted', 'acceptPrivacy');
  }
}

export class InvalidNameFormatError extends ValidationError {
  constructor(field: 'firstName' | 'lastName') {
    super(`Invalid ${field} format`, field);
  }
}

// =============================================================================
// BUSINESS RULE ERRORS
// =============================================================================

export class UserNotFoundError extends BusinessRuleError {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`, 'USER_NOT_FOUND');
  }
}

export class UserAlreadyExistsError extends BusinessRuleError {
  constructor(identifier: string, type: 'email' | 'phone') {
    super(`User already exists with this ${type}: ${identifier}`, 'USER_ALREADY_EXISTS');
  }
}

export class InvalidCredentialsError extends BusinessRuleError {
  constructor() {
    super('Invalid email or password', 'INVALID_CREDENTIALS');
  }
}

export class AccountLockedError extends BusinessRuleError {
  constructor(untilIso: string, attempts?: number) {
    super(`Account is locked until ${untilIso}`, 'ACCOUNT_LOCKED');
  }
}

export class EmailNotVerifiedError extends BusinessRuleError {
  constructor(email: string) {
    super(`Email not verified: ${email}`, 'EMAIL_NOT_VERIFIED');
  }
}

export class PhoneNotVerifiedError extends BusinessRuleError {
  constructor(phone: string) {
    super(`Phone not verified: ${phone}`, 'PHONE_NOT_VERIFIED');
  }
}

export class InvalidVerificationTokenError extends BusinessRuleError {
  constructor(tokenType: 'email' | 'phone' = 'email') {
    super(`Invalid ${tokenType} verification token`, 'INVALID_VERIFICATION_TOKEN');
  }
}

export class VerificationTokenExpiredError extends BusinessRuleError {
  constructor(tokenType: 'email' | 'phone' = 'email') {
    super(`${tokenType} verification token has expired`, 'VERIFICATION_TOKEN_EXPIRED');
  }
}

export class ResetTokenInvalidError extends BusinessRuleError {
  constructor() {
    super('Invalid password reset token', 'INVALID_RESET_TOKEN');
  }
}

export class ResetTokenExpiredError extends BusinessRuleError {
  constructor() {
    super('Password reset token has expired', 'RESET_TOKEN_EXPIRED');
  }
}

export class ResetTokenAlreadyUsedError extends BusinessRuleError {
  constructor() {
    super('Password reset token has already been used', 'RESET_TOKEN_ALREADY_USED');
  }
}

export class OtpInvalidError extends ValidationError {
  constructor() {
    super('Invalid OTP code', 'otp');
  }
}

export class OtpExpiredError extends BusinessRuleError {
  constructor() {
    super('OTP code has expired', 'OTP_EXPIRED');
  }
}

export class OtpTooManyAttemptsError extends BusinessRuleError {
  constructor(maxAttempts: number) {
    super(`Too many OTP attempts. Maximum allowed: ${maxAttempts}`, 'OTP_TOO_MANY_ATTEMPTS');
  }
}

export class SessionExpiredError extends BusinessRuleError {
  constructor(sessionId?: string) {
    super(`Session has expired${sessionId ? `: ${sessionId}` : ''}`, 'SESSION_EXPIRED');
  }
}

export class SessionNotFoundError extends BusinessRuleError {
  constructor(sessionId: string) {
    super(`Session not found: ${sessionId}`, 'SESSION_NOT_FOUND');
  }
}

export class TooManyActiveSessionsError extends BusinessRuleError {
  constructor(maxSessions: number, currentSessions: number) {
    super(
      `Too many active sessions. Current: ${currentSessions}, Maximum: ${maxSessions}`,
      'TOO_MANY_ACTIVE_SESSIONS'
    );
  }
}

export class TenantNotFoundError extends BusinessRuleError {
  constructor(identifier: string) {
    super(`Tenant not found: ${identifier}`, 'TENANT_NOT_FOUND');
  }
}

export class TenantAccessDeniedError extends BusinessRuleError {
  constructor(tenantId: string, userId: string) {
    super(`Access denied to tenant: ${tenantId} `, 'TENANT_ACCESS_DENIED');
  }
}

export class InsufficientPermissionsError extends BusinessRuleError {
  constructor(action: string, requiredPermissions?: string[]) {
    super(`Insufficient permissions for: ${action}`, 'INSUFFICIENT_PERMISSIONS');
  }
}

export class InvalidRoleError extends BusinessRuleError {
  constructor(role: string, availableRoles?: string[]) {
    super(`Invalid role: ${role}`, 'INVALID_ROLE');
  }
}

export class RateLimitExceededError extends SecurityViolationError {
  constructor(operation: string, limit: number, resetTime: string) {
    super(
      `Rate limit exceeded for ${operation}. Limit: ${limit}, Reset: ${resetTime}`,
      'RATE_LIMIT_EXCEEDED'
    );
  }
}

export class SuspiciousActivityError extends SecurityViolationError {
  constructor(activityType: string, details: Record<string, unknown>) {
    super(`Suspicious activity detected: ${activityType}`, 'SUSPICIOUS_ACTIVITY', details);
  }
}

export class DatabaseError extends BusinessRuleError {
  constructor(operation: string, error: string) {
    super(`Database error during ${operation}: ${error}`, 'DATABASE_ERROR');
  }
}

export class ExternalServiceError extends BusinessRuleError {
  constructor(service: string, operation: string, error: string) {
    super(
      `External service error (${service}) during ${operation}: ${error}`,
      'EXTERNAL_SERVICE_ERROR'
    );
  }
}

export class ConfigurationError extends BusinessRuleError {
  constructor(configKey: string, issue: string) {
    super(`Configuration error for ${configKey}: ${issue}`, 'CONFIGURATION_ERROR');
  }
}
