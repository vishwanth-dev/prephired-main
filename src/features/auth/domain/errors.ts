/**
 * 🚨 Authentication Domain Errors - Enhanced for prepAI
 *
 * This file contains all domain-specific error types for the authentication system.
 * Enhanced for multi-tenant SaaS architecture with interview platform features.
 * These errors represent business rule violations and validation failures.
 *
 * Key Features:
 * - ✅ Hierarchical error inheritance for easy error handling
 * - ✅ Structured error information (code, field, message)
 * - ✅ Developer-friendly messages (UI layer handles user-facing text)
 * - ✅ Consistent error patterns across all auth operations
 * - ✅ Multi-tenant aware error types
 * - ✅ Enhanced security and audit error coverage
 *
 * @author prepAI Team
 * @version 2.0.0
 * @since 2024
 */

/**
 * 🏗️ Base Authentication Domain Error
 *
 * Root error class for all authentication-related errors.
 * Provides consistent structure and inheritance for specialized error types.
 *
 * @example
 * ```typescript
 * throw new AuthDomainError(
 *   "User account is locked",
 *   "ACCOUNT_LOCKED",
 *   "account"
 * );
 * ```
 */
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

/**
 * ⚠️ Validation Error Base Class
 *
 * Represents errors that occur during form validation.
 * Includes field information for UI error display.
 *
 * @example
 * ```typescript
 * throw new ValidationError("Email is required", "email");
 * ```
 */
export class ValidationError extends AuthDomainError {
  constructor(message: string, field: string, metadata?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', field, metadata);
    this.name = 'ValidationError';
  }
}

/**
 * 🚫 Business Rule Violation Error
 *
 * Represents errors that occur when business rules are violated.
 * These are not validation errors but logical rule failures.
 *
 * @example
 * ```typescript
 * throw new BusinessRuleError(
 *   "User already exists with this email",
 *   "USER_ALREADY_EXISTS"
 * );
 * ```
 */
export class BusinessRuleError extends AuthDomainError {
  constructor(message: string, code: string, metadata?: Record<string, unknown>) {
    super(message, code, undefined, metadata);
    this.name = 'BusinessRuleError';
  }
}

/**
 * 🛡️ Security Violation Error
 *
 * Represents security-related errors and violations.
 * Used for audit logging and security monitoring.
 *
 * @example
 * ```typescript
 * throw new SecurityViolationError(
 *   "Suspicious login pattern detected",
 *   "SUSPICIOUS_ACTIVITY",
 *   { ipAddress: "192.168.1.1", attempts: 5 }
 * );
 * ```
 */
export class SecurityViolationError extends AuthDomainError {
  constructor(message: string, code: string, metadata?: Record<string, unknown>) {
    super(message, code, undefined, metadata);
    this.name = 'SecurityViolationError';
  }
}

/* -----------------------------------------------------------------------------
   📝 Enhanced Registration & Profile Validation Errors
   ----------------------------------------------------------------------------- */

/**
 * 📧 Invalid Email Format Error
 *
 * Thrown when an email address doesn't match the required format.
 * Used during registration and profile updates.
 */
export class InvalidEmailError extends ValidationError {
  constructor() {
    super('Invalid email address format', 'email');
  }
}

/**
 * 📱 Invalid Phone Number Format Error
 *
 * Thrown when a phone number doesn't match the required E.164 format.
 * Used during registration and profile updates.
 */
export class InvalidPhoneNumberError extends ValidationError {
  constructor() {
    super('Invalid phone number format', 'phoneNumber');
  }
}

/**
 * 🔒 Weak Password Error
 *
 * Thrown when a password doesn't meet security requirements.
 * Includes specific requirements that failed validation.
 */
export class WeakPasswordError extends ValidationError {
  constructor(requirements: string[]) {
    super(`Password does not meet requirements: ${requirements.join(', ')}`, 'password');
  }
}

/**
 * 🔑 Password Mismatch Error
 *
 * Thrown when password confirmation doesn't match the original password.
 * Used in registration and password reset flows.
 */
export class PasswordMismatchError extends ValidationError {
  constructor() {
    super('Passwords do not match', 'confirmPassword');
  }
}

/**
 * 📋 Terms Not Accepted Error
 *
 * Thrown when user hasn't accepted terms of service.
 * Required for registration and certain sensitive operations.
 */
export class TermsNotAcceptedError extends ValidationError {
  constructor() {
    super('You must accept the Terms of Service', 'acceptTerms');
  }
}

/**
 * 🔒 Privacy Policy Not Accepted Error
 *
 * Thrown when user hasn't accepted privacy policy.
 * Required for GDPR compliance and data processing consent.
 */
export class PrivacyPolicyNotAcceptedError extends ValidationError {
  constructor() {
    super('You must accept the Privacy Policy', 'acceptPrivacy');
  }
}

/**
 * 👤 Invalid Name Format Error
 *
 * Thrown when first name or last name contains invalid characters.
 * Used during registration and profile updates.
 */
export class InvalidNameFormatError extends ValidationError {
  constructor(field: 'firstName' | 'lastName') {
    super(`Invalid ${field === 'firstName' ? 'first' : 'last'} name format`, field);
  }
}

/**
 * 🌐 Invalid Website URL Error
 *
 * Thrown when a website URL format is invalid.
 * Used during profile updates and organization setup.
 */
export class InvalidWebsiteUrlError extends ValidationError {
  constructor(field = 'website') {
    super('Invalid website URL format', field);
  }
}

/* -----------------------------------------------------------------------------
   🏢 Multi-Tenant & Organization Errors
   ----------------------------------------------------------------------------- */

/**
 * 🏢 Tenant Not Found Error
 *
 * Thrown when attempting to access a non-existent tenant.
 * Used in multi-tenant authentication scenarios.
 */
export class TenantNotFoundError extends BusinessRuleError {
  constructor(identifier: string) {
    super(`Tenant ${identifier} not found`, 'TENANT_NOT_FOUND', { identifier });
  }
}

/**
 * 🚫 Tenant Access Denied Error
 *
 * Thrown when user lacks access to a specific tenant.
 * Used for tenant-level authorization.
 */
export class TenantAccessDeniedError extends BusinessRuleError {
  constructor(tenantId: string, userId: string) {
    super(`Access denied to tenant ${tenantId}`, 'TENANT_ACCESS_DENIED', { tenantId, userId });
  }
}

/**
 * ⏸️ Tenant Suspended Error
 *
 * Thrown when attempting to access a suspended tenant.
 * Used for billing and compliance enforcement.
 */
export class TenantSuspendedError extends BusinessRuleError {
  constructor(tenantId: string, reason?: string) {
    super(`Tenant ${tenantId} is suspended`, 'TENANT_SUSPENDED', { tenantId, reason });
  }
}

/**
 * 📋 Tenant Slug Taken Error
 *
 * Thrown when attempting to use an already taken tenant slug.
 * Used during organization creation and updates.
 */
export class TenantSlugTakenError extends BusinessRuleError {
  constructor(slug: string) {
    super(`Tenant slug '${slug}' is already taken`, 'TENANT_SLUG_TAKEN', { slug });
  }
}

/**
 * 🔄 Tenant Context Switch Error
 *
 * Thrown when failing to switch tenant context.
 * Used in multi-tenant session management.
 */
export class TenantContextSwitchError extends BusinessRuleError {
  constructor(fromTenantId?: string, toTenantId?: string) {
    super('Failed to switch tenant context', 'TENANT_CONTEXT_SWITCH_ERROR', {
      fromTenantId,
      toTenantId,
    });
  }
}

/**
 * 💳 Subscription Limit Exceeded Error
 *
 * Thrown when tenant exceeds subscription limits.
 * Used for feature gating and billing enforcement.
 */
export class SubscriptionLimitExceededError extends BusinessRuleError {
  constructor(limitType: string, currentValue: number, maxAllowed: number) {
    super(
      `${limitType} limit exceeded: ${currentValue}/${maxAllowed}`,
      'SUBSCRIPTION_LIMIT_EXCEEDED',
      {
        limitType,
        currentValue,
        maxAllowed,
      }
    );
  }
}

/* -----------------------------------------------------------------------------
   👤 User Management & Status Errors
   ----------------------------------------------------------------------------- */

/**
 * 👤 User Not Found Error
 *
 * Thrown when attempting to access a non-existent user.
 * Used in user lookup and authentication operations.
 */
export class UserNotFoundError extends BusinessRuleError {
  constructor(identifier: string) {
    super(`User ${identifier} not found`, 'USER_NOT_FOUND', { identifier });
  }
}

/**
 * 👥 User Already Exists Error
 *
 * Thrown when attempting to create a user with an existing identifier.
 * Prevents duplicate accounts in the system.
 */
export class UserAlreadyExistsError extends BusinessRuleError {
  constructor(identifier: string, type: 'email' | 'phone') {
    super(`User with ${type} ${identifier} already exists`, 'USER_ALREADY_EXISTS', {
      identifier,
      type,
    });
  }
}

/**
 * ⏸️ User Account Suspended Error
 *
 * Thrown when attempting to access a suspended user account.
 * Used for account moderation and compliance.
 */
export class UserAccountSuspendedError extends BusinessRuleError {
  constructor(userId: string, reason?: string) {
    super(`User account ${userId} is suspended`, 'USER_ACCOUNT_SUSPENDED', { userId, reason });
  }
}

/**
 * 🚫 User Account Inactive Error
 *
 * Thrown when attempting to access an inactive user account.
 * Used for account lifecycle management.
 */
export class UserAccountInactiveError extends BusinessRuleError {
  constructor(userId: string) {
    super(`User account ${userId} is inactive`, 'USER_ACCOUNT_INACTIVE', { userId });
  }
}

/**
 * ⏳ User Account Pending Error
 *
 * Thrown when attempting to access a pending user account.
 * Used for approval-based registration workflows.
 */
export class UserAccountPendingError extends BusinessRuleError {
  constructor(userId: string) {
    super(`User account ${userId} is pending approval`, 'USER_ACCOUNT_PENDING', { userId });
  }
}

/* -----------------------------------------------------------------------------
   🔐 Authentication & Credentials Errors
   ----------------------------------------------------------------------------- */

/**
 * 📝 Invalid Email or Phone Error
 *
 * Thrown when the login identifier doesn't match email or phone format.
 * Used in unified login forms that accept both types.
 */
export class InvalidEmailOrPhoneError extends ValidationError {
  constructor() {
    super('Please enter a valid email address or phone number', 'emailOrPhone');
  }
}

/**
 * 🔐 Invalid Credentials Error
 *
 * Thrown when login credentials (email/phone + password) are incorrect.
 * Generic error to prevent user enumeration attacks.
 */
export class InvalidCredentialsError extends BusinessRuleError {
  constructor() {
    super('Invalid credentials provided', 'INVALID_CREDENTIALS');
  }
}

/**
 * 🔒 Account Locked Error
 *
 * Thrown when an account is temporarily locked due to security measures.
 * Includes lock duration information for user guidance.
 */
export class AccountLockedError extends BusinessRuleError {
  constructor(untilIso: string, attempts?: number) {
    super(`Account is locked until ${untilIso}`, 'ACCOUNT_LOCKED', { untilIso, attempts });
  }
}

/**
 * 🔄 Password Reuse Error
 *
 * Thrown when user attempts to reuse a recent password.
 * Used for password history enforcement.
 */
export class PasswordReuseError extends BusinessRuleError {
  constructor(lastUsedCount: number) {
    super(`Cannot reuse any of your last ${lastUsedCount} passwords`, 'PASSWORD_REUSE_ERROR', {
      lastUsedCount,
    });
  }
}

/**
 * ⏰ Password Expired Error
 *
 * Thrown when user's password has expired and must be changed.
 * Used for password aging policies.
 */
export class PasswordExpiredError extends BusinessRuleError {
  constructor(expiredAt: string) {
    super(`Password expired on ${expiredAt}`, 'PASSWORD_EXPIRED', { expiredAt });
  }
}

/* -----------------------------------------------------------------------------
   📧🔍 Verification & Email/Phone Errors
   ----------------------------------------------------------------------------- */

/**
 * 📧 Email Not Verified Error
 *
 * Thrown when attempting to use an unverified email address.
 * Ensures email verification before allowing certain operations.
 */
export class EmailNotVerifiedError extends BusinessRuleError {
  constructor(email: string) {
    super(`Email address ${email} has not been verified`, 'EMAIL_NOT_VERIFIED', { email });
  }
}

/**
 * 📱 Phone Not Verified Error
 *
 * Thrown when attempting to use an unverified phone number.
 * Ensures phone verification before allowing certain operations.
 */
export class PhoneNotVerifiedError extends BusinessRuleError {
  constructor(phone: string) {
    super(`Phone number ${phone} has not been verified`, 'PHONE_NOT_VERIFIED', { phone });
  }
}

/**
 * ✅ Account Already Verified Error
 *
 * Thrown when attempting to verify an already verified account.
 * Prevents duplicate verification operations.
 */
export class AccountAlreadyVerifiedError extends BusinessRuleError {
  constructor() {
    super('This account is already verified', 'ACCOUNT_ALREADY_VERIFIED');
  }
}

/**
 * 📧 Email Already Verified Error
 *
 * Thrown when attempting to verify an already verified email.
 * Prevents duplicate email verification operations.
 */
export class EmailAlreadyVerifiedError extends BusinessRuleError {
  constructor(email: string) {
    super(`Email address ${email} is already verified`, 'EMAIL_ALREADY_VERIFIED', { email });
  }
}

/**
 * 📱 Phone Already Verified Error
 *
 * Thrown when attempting to verify an already verified phone.
 * Prevents duplicate phone verification operations.
 */
export class PhoneAlreadyVerifiedError extends BusinessRuleError {
  constructor(phone: string) {
    super(`Phone number ${phone} is already verified`, 'PHONE_ALREADY_VERIFIED', { phone });
  }
}

/**
 * 🔑 Invalid Verification Token Error
 *
 * Thrown when a verification token is malformed or invalid.
 * Used in email and phone verification flows.
 */
export class InvalidVerificationTokenError extends BusinessRuleError {
  constructor(tokenType: 'email' | 'phone' = 'email') {
    super(`The ${tokenType} verification token is invalid`, 'INVALID_VERIFICATION_TOKEN', {
      tokenType,
    });
  }
}

/**
 * ⏰ Verification Token Expired Error
 *
 * Thrown when a verification token has expired.
 * Used to enforce token time limits for security.
 */
export class VerificationTokenExpiredError extends BusinessRuleError {
  constructor(tokenType: 'email' | 'phone' = 'email') {
    super(`The ${tokenType} verification token has expired`, 'VERIFICATION_TOKEN_EXPIRED', {
      tokenType,
    });
  }
}

/* -----------------------------------------------------------------------------
   🔒 Password Reset Errors
   ----------------------------------------------------------------------------- */

/**
 * 🔑 Reset Token Invalid Error
 *
 * Thrown when a password reset token is malformed or corrupted.
 * Used in password reset flow validation.
 */
export class ResetTokenInvalidError extends BusinessRuleError {
  constructor() {
    super('The reset token is invalid', 'RESET_TOKEN_INVALID');
  }
}

/**
 * ⏰ Reset Token Expired Error
 *
 * Thrown when a password reset token has expired.
 * Used to enforce token time limits for security.
 */
export class ResetTokenExpiredError extends BusinessRuleError {
  constructor() {
    super('The reset token has expired', 'RESET_TOKEN_EXPIRED');
  }
}

/**
 * 🔄 Reset Token Already Used Error
 *
 * Thrown when attempting to use an already used reset token.
 * Prevents token replay attacks.
 */
export class ResetTokenAlreadyUsedError extends BusinessRuleError {
  constructor() {
    super('The reset token has already been used', 'RESET_TOKEN_ALREADY_USED');
  }
}

/* -----------------------------------------------------------------------------
   🔢 OTP & Multi-Factor Authentication Errors
   ----------------------------------------------------------------------------- */

/**
 * 🔢 Invalid OTP Error
 *
 * Thrown when an OTP code doesn't match the expected format.
 * Used in account verification and MFA flows.
 */
export class OtpInvalidError extends ValidationError {
  constructor() {
    super('The OTP you entered is invalid', 'otp');
  }
}

/**
 * ⏰ OTP Expired Error
 *
 * Thrown when an OTP code has expired and can no longer be used.
 * Used to enforce OTP time limits for security.
 */
export class OtpExpiredError extends BusinessRuleError {
  constructor() {
    super('The OTP has expired', 'OTP_EXPIRED');
  }
}

/**
 * 🚫 OTP Too Many Attempts Error
 *
 * Thrown when too many incorrect OTP attempts are made.
 * Used to prevent brute force attacks on OTP codes.
 */
export class OtpTooManyAttemptsError extends BusinessRuleError {
  constructor(maxAttempts: number) {
    super(`Too many incorrect OTP attempts. Please request a new OTP.`, 'OTP_TOO_MANY_ATTEMPTS', {
      maxAttempts,
    });
  }
}

/**
 * 🔐 MFA Required Error
 *
 * Thrown when MFA is required but not provided.
 * Used to enforce MFA policies.
 */
export class MfaRequiredError extends BusinessRuleError {
  constructor(challengeId: string, methods: string[]) {
    super('Multi-factor authentication is required', 'MFA_REQUIRED', { challengeId, methods });
  }
}

/**
 * 🚫 MFA Challenge Not Found Error
 *
 * Thrown when attempting to verify a non-existent MFA challenge.
 * Used in MFA verification flows.
 */
export class MfaChallengeNotFoundError extends BusinessRuleError {
  constructor(challengeId: string) {
    super(`MFA challenge ${challengeId} not found`, 'MFA_CHALLENGE_NOT_FOUND', { challengeId });
  }
}

/**
 * ⏰ MFA Challenge Expired Error
 *
 * Thrown when an MFA challenge has expired.
 * Used to enforce challenge time limits.
 */
export class MfaChallengeExpiredError extends BusinessRuleError {
  constructor(challengeId: string) {
    super(`MFA challenge ${challengeId} has expired`, 'MFA_CHALLENGE_EXPIRED', { challengeId });
  }
}

/**
 * 🔐 MFA Already Enabled Error
 *
 * Thrown when attempting to enable MFA that's already enabled.
 * Prevents duplicate MFA setup.
 */
export class MfaAlreadyEnabledError extends BusinessRuleError {
  constructor(method: string) {
    super(`MFA method ${method} is already enabled`, 'MFA_ALREADY_ENABLED', { method });
  }
}

/**
 * 🚫 MFA Not Enabled Error
 *
 * Thrown when attempting MFA operations on accounts without MFA.
 * Used in MFA management flows.
 */
export class MfaNotEnabledError extends BusinessRuleError {
  constructor() {
    super('Multi-factor authentication is not enabled', 'MFA_NOT_ENABLED');
  }
}

/**
 * 🔑 Invalid Backup Code Error
 *
 * Thrown when an MFA backup code is invalid or already used.
 * Used in backup code verification.
 */
export class InvalidBackupCodeError extends BusinessRuleError {
  constructor() {
    super('Invalid or already used backup code', 'INVALID_BACKUP_CODE');
  }
}

/* -----------------------------------------------------------------------------
   📱 Session Management Errors
   ----------------------------------------------------------------------------- */

/**
 * ⏰ Session Expired Error
 *
 * Thrown when a user session has expired and needs renewal.
 * Used to force re-authentication for security.
 */
export class SessionExpiredError extends BusinessRuleError {
  constructor(sessionId?: string) {
    super('Your session has expired. Please log in again.', 'SESSION_EXPIRED', { sessionId });
  }
}

/**
 * 🚫 Session Not Found Error
 *
 * Thrown when attempting to access a non-existent session.
 * Used in session management operations.
 */
export class SessionNotFoundError extends BusinessRuleError {
  constructor(sessionId: string) {
    super(`Session ${sessionId} not found`, 'SESSION_NOT_FOUND', { sessionId });
  }
}

/**
 * 🔒 Session Invalid Error
 *
 * Thrown when a session is corrupted or tampered with.
 * Used for session integrity validation.
 */
export class SessionInvalidError extends BusinessRuleError {
  constructor(sessionId: string, reason?: string) {
    super(`Session ${sessionId} is invalid`, 'SESSION_INVALID', { sessionId, reason });
  }
}

/**
 * 📱 Too Many Active Sessions Error
 *
 * Thrown when user exceeds maximum allowed concurrent sessions.
 * Used for session limit enforcement.
 */
export class TooManyActiveSessionsError extends BusinessRuleError {
  constructor(maxSessions: number, currentSessions: number) {
    super(
      `Too many active sessions: ${currentSessions}/${maxSessions}`,
      'TOO_MANY_ACTIVE_SESSIONS',
      {
        maxSessions,
        currentSessions,
      }
    );
  }
}

/* -----------------------------------------------------------------------------
   🔗 OAuth & External Authentication Errors
   ----------------------------------------------------------------------------- */

/**
 * 🔗 OAuth Provider Error
 *
 * Thrown when OAuth authentication fails at the provider level.
 * Used in OAuth integration flows.
 */
export class OAuthProviderError extends BusinessRuleError {
  constructor(provider: string, error: string) {
    super(`OAuth authentication failed with ${provider}: ${error}`, 'OAUTH_PROVIDER_ERROR', {
      provider,
      error,
    });
  }
}

/**
 * 🚫 OAuth Provider Not Enabled Error
 *
 * Thrown when attempting to use a disabled OAuth provider.
 * Used for tenant-specific OAuth configuration.
 */
export class OAuthProviderNotEnabledError extends BusinessRuleError {
  constructor(provider: string, tenantId?: string) {
    super(`OAuth provider ${provider} is not enabled`, 'OAUTH_PROVIDER_NOT_ENABLED', {
      provider,
      tenantId,
    });
  }
}

/**
 * 🔗 OAuth Account Already Linked Error
 *
 * Thrown when attempting to link an already linked OAuth account.
 * Prevents duplicate OAuth connections.
 */
export class OAuthAccountAlreadyLinkedError extends BusinessRuleError {
  constructor(provider: string, email: string) {
    super(
      `${provider} account with email ${email} is already linked`,
      'OAUTH_ACCOUNT_ALREADY_LINKED',
      {
        provider,
        email,
      }
    );
  }
}

/**
 * 🚫 OAuth Account Not Found Error
 *
 * Thrown when attempting to access a non-existent OAuth account link.
 * Used in OAuth management operations.
 */
export class OAuthAccountNotFoundError extends BusinessRuleError {
  constructor(provider: string, userId: string) {
    super(`No ${provider} account linked for user ${userId}`, 'OAUTH_ACCOUNT_NOT_FOUND', {
      provider,
      userId,
    });
  }
}

/* -----------------------------------------------------------------------------
   📨 Invitation & Team Management Errors
   ----------------------------------------------------------------------------- */

/**
 * 💌 Invalid Invitation Token Error
 *
 * Thrown when an invitation token is malformed or invalid.
 * Used in team invitation flows.
 */
export class InvalidInvitationTokenError extends BusinessRuleError {
  constructor() {
    super('The invitation token is invalid', 'INVALID_INVITATION_TOKEN');
  }
}

/**
 * ⏰ Invitation Expired Error
 *
 * Thrown when an invitation has expired.
 * Used to enforce invitation time limits.
 */
export class InvitationExpiredError extends BusinessRuleError {
  constructor() {
    super('The invitation has expired', 'INVITATION_EXPIRED');
  }
}

/**
 * ✅ Invitation Already Used Error
 *
 * Thrown when attempting to use an already used invitation.
 * Prevents invitation replay attacks.
 */
export class InvitationAlreadyUsedError extends BusinessRuleError {
  constructor() {
    super('The invitation has already been used', 'INVITATION_ALREADY_USED');
  }
}

/**
 * 🚫 Invitation Not Found Error
 *
 * Thrown when attempting to access a non-existent invitation.
 * Used in invitation management operations.
 */
export class InvitationNotFoundError extends BusinessRuleError {
  constructor(invitationId: string) {
    super(`Invitation ${invitationId} not found`, 'INVITATION_NOT_FOUND', { invitationId });
  }
}

/* -----------------------------------------------------------------------------
   🔒 Authorization & Permissions Errors
   ----------------------------------------------------------------------------- */

/**
 * 🚫 Insufficient Permissions Error
 *
 * Thrown when a user lacks required permissions for an action.
 * Used for role-based access control enforcement.
 */
export class InsufficientPermissionsError extends BusinessRuleError {
  constructor(action: string, requiredPermissions?: string[]) {
    super(`You don't have permission to ${action}`, 'INSUFFICIENT_PERMISSIONS', {
      action,
      requiredPermissions,
    });
  }
}

/**
 * 🚫 Invalid Role Error
 *
 * Thrown when attempting to assign an invalid or non-existent role.
 * Used in role management operations.
 */
export class InvalidRoleError extends BusinessRuleError {
  constructor(role: string, availableRoles?: string[]) {
    super(`Invalid role: ${role}`, 'INVALID_ROLE', { role, availableRoles });
  }
}

/**
 * 🔒 Role Assignment Error
 *
 * Thrown when role assignment fails due to business rules.
 * Used in role management with hierarchy enforcement.
 */
export class RoleAssignmentError extends BusinessRuleError {
  constructor(reason: string, role: string, userId: string) {
    super(`Cannot assign role ${role} to user ${userId}: ${reason}`, 'ROLE_ASSIGNMENT_ERROR', {
      reason,
      role,
      userId,
    });
  }
}

/* -----------------------------------------------------------------------------
   🛡️ Security & Audit Errors
   ----------------------------------------------------------------------------- */

/**
 * 🚨 Suspicious Activity Error
 *
 * Thrown when suspicious activity patterns are detected.
 * Used for fraud prevention and security monitoring.
 */
export class SuspiciousActivityError extends SecurityViolationError {
  constructor(activityType: string, details: Record<string, unknown>) {
    super(`Suspicious activity detected: ${activityType}`, 'SUSPICIOUS_ACTIVITY', {
      activityType,
      ...details,
    });
  }
}

/**
 * 🌍 Geographic Restriction Error
 *
 * Thrown when access is restricted from certain geographic locations.
 * Used for compliance and security enforcement.
 */
export class GeographicRestrictionError extends SecurityViolationError {
  constructor(country: string, allowedCountries?: string[]) {
    super(`Access denied from ${country}`, 'GEOGRAPHIC_RESTRICTION', { country, allowedCountries });
  }
}

/**
 * 🕒 Time Restriction Error
 *
 * Thrown when access is attempted outside allowed time windows.
 * Used for business hours enforcement.
 */
export class TimeRestrictionError extends SecurityViolationError {
  constructor(currentTime: string, allowedWindow?: string) {
    super(`Access denied at ${currentTime}`, 'TIME_RESTRICTION', { currentTime, allowedWindow });
  }
}

/**
 * 🔒 Device Not Recognized Error
 *
 * Thrown when login is attempted from an unrecognized device.
 * Used for device-based security policies.
 */
export class DeviceNotRecognizedError extends SecurityViolationError {
  constructor(deviceFingerprint: string) {
    super('Device not recognized. Additional verification required.', 'DEVICE_NOT_RECOGNIZED', {
      deviceFingerprint,
    });
  }
}

/**
 * 🚫 IP Address Blocked Error
 *
 * Thrown when access is attempted from a blocked IP address.
 * Used for IP-based security filtering.
 */
export class IpAddressBlockedError extends SecurityViolationError {
  constructor(ipAddress: string, reason?: string) {
    super(`Access denied from IP ${ipAddress}`, 'IP_ADDRESS_BLOCKED', { ipAddress, reason });
  }
}

/* -----------------------------------------------------------------------------
   ⚡ Rate Limiting & Throttling Errors
   ----------------------------------------------------------------------------- */

/**
 * 🚦 Rate Limit Exceeded Error
 *
 * Thrown when rate limits are exceeded for various operations.
 * Used for API protection and abuse prevention.
 */
export class RateLimitExceededError extends SecurityViolationError {
  constructor(operation: string, limit: number, resetTime: string) {
    super(`Rate limit exceeded for ${operation}: ${limit} requests`, 'RATE_LIMIT_EXCEEDED', {
      operation,
      limit,
      resetTime,
    });
  }
}

/**
 * 📧 Email Send Limit Exceeded Error
 *
 * Thrown when email sending limits are exceeded.
 * Used for email service protection.
 */
export class EmailSendLimitExceededError extends BusinessRuleError {
  constructor(emailType: string, limit: number, resetTime: string) {
    super(`${emailType} email send limit exceeded: ${limit}`, 'EMAIL_SEND_LIMIT_EXCEEDED', {
      emailType,
      limit,
      resetTime,
    });
  }
}

/**
 * 📱 SMS Send Limit Exceeded Error
 *
 * Thrown when SMS sending limits are exceeded.
 * Used for SMS service protection.
 */
export class SmsSendLimitExceededError extends BusinessRuleError {
  constructor(limit: number, resetTime: string) {
    super(`SMS send limit exceeded: ${limit}`, 'SMS_SEND_LIMIT_EXCEEDED', { limit, resetTime });
  }
}

/* -----------------------------------------------------------------------------
   🔧 Integration & External Service Errors
   ----------------------------------------------------------------------------- */

/**
 * 📧 Email Service Error
 *
 * Thrown when email service operations fail.
 * Used for email delivery error handling.
 */
export class EmailServiceError extends BusinessRuleError {
  constructor(operation: string, error: string) {
    super(`Email service error during ${operation}: ${error}`, 'EMAIL_SERVICE_ERROR', {
      operation,
      error,
    });
  }
}

/**
 * 📱 SMS Service Error
 *
 * Thrown when SMS service operations fail.
 * Used for SMS delivery error handling.
 */
export class SmsServiceError extends BusinessRuleError {
  constructor(operation: string, error: string) {
    super(`SMS service error during ${operation}: ${error}`, 'SMS_SERVICE_ERROR', {
      operation,
      error,
    });
  }
}

/**
 * 🔐 Encryption Service Error
 *
 * Thrown when encryption/decryption operations fail.
 * Used for security service error handling.
 */
export class EncryptionServiceError extends BusinessRuleError {
  constructor(operation: string, error: string) {
    super(`Encryption service error during ${operation}: ${error}`, 'ENCRYPTION_SERVICE_ERROR', {
      operation,
      error,
    });
  }
}

/* -----------------------------------------------------------------------------
   💳 Billing & Subscription Errors
   ----------------------------------------------------------------------------- */

/**
 * 💳 Payment Method Required Error
 *
 * Thrown when a payment method is required but not provided.
 * Used for subscription and billing enforcement.
 */
export class PaymentMethodRequiredError extends BusinessRuleError {
  constructor(operation: string) {
    super(`Payment method required for ${operation}`, 'PAYMENT_METHOD_REQUIRED', { operation });
  }
}

/**
 * 💳 Payment Failed Error
 *
 * Thrown when payment processing fails.
 * Used for billing error handling.
 */
export class PaymentFailedError extends BusinessRuleError {
  constructor(reason: string, paymentId?: string) {
    super(`Payment failed: ${reason}`, 'PAYMENT_FAILED', { reason, paymentId });
  }
}

/**
 * 🔒 Feature Not Available Error
 *
 * Thrown when attempting to use features not available in current plan.
 * Used for subscription tier enforcement.
 */
export class FeatureNotAvailableError extends BusinessRuleError {
  constructor(feature: string, requiredPlan: string, currentPlan: string) {
    super(`Feature ${feature} requires ${requiredPlan} plan`, 'FEATURE_NOT_AVAILABLE', {
      feature,
      requiredPlan,
      currentPlan,
    });
  }
}

/* -----------------------------------------------------------------------------
   🔧 System & Infrastructure Errors
   ----------------------------------------------------------------------------- */

/**
 * 🗄️ Database Error
 *
 * Thrown when database operations fail.
 * Used for infrastructure error handling.
 */
export class DatabaseError extends BusinessRuleError {
  constructor(operation: string, error: string) {
    super(`Database error during ${operation}: ${error}`, 'DATABASE_ERROR', { operation, error });
  }
}

/**
 * 🌐 External Service Error
 *
 * Thrown when external service calls fail.
 * Used for third-party integration error handling.
 */
export class ExternalServiceError extends BusinessRuleError {
  constructor(service: string, operation: string, error: string) {
    super(`${service} service error during ${operation}: ${error}`, 'EXTERNAL_SERVICE_ERROR', {
      service,
      operation,
      error,
    });
  }
}

/**
 * ⚙️ Configuration Error
 *
 * Thrown when system configuration is invalid or missing.
 * Used for deployment and setup validation.
 */
export class ConfigurationError extends BusinessRuleError {
  constructor(configKey: string, issue: string) {
    super(`Configuration error for ${configKey}: ${issue}`, 'CONFIGURATION_ERROR', {
      configKey,
      issue,
    });
  }
}
