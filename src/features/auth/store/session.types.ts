/**
 * Server-Side Authentication Types
 *
 * These types are ONLY used on the server side.
 * They contain sensitive information like tokens that should never reach the client.
 */

import type { User, Tenant, LoginMethod, UserId, TenantId } from '@/features/auth/domain/entities';

// =============================================================================
// SERVER-ONLY SESSION TYPES
// =============================================================================

/**
 * Complete server session with sensitive tokens
 * NEVER send this to the client - tokens stored in httpOnly cookies
 */
export interface ServerSession {
  readonly sessionId: string;
  readonly user: User;
  readonly tenant?: Tenant;
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: string; // ISO string
  readonly refreshExpiresAt: string; // ISO string
  readonly loginMethod: LoginMethod;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly createdAt: string; // ISO string
  readonly lastAccessedAt: string; // ISO string
}

/**
 * JWT payload for access tokens
 */
export interface AccessTokenPayload {
  readonly sub: UserId; // Subject (user ID)
  readonly tid?: TenantId; // Tenant ID
  readonly rol: string; // User role
  readonly typ: 'access'; // Token type
  readonly iat: number; // Issued at
  readonly exp: number; // Expires at
  readonly aud: string; // Audience
  readonly iss: string; // Issuer
}

/**
 * JWT payload for refresh tokens
 */
export interface RefreshTokenPayload {
  readonly sub: UserId; // Subject (user ID)
  readonly sid: string; // Session ID
  readonly typ: 'refresh'; // Token type
  readonly iat: number; // Issued at
  readonly exp: number; // Expires at
  readonly aud: string; // Audience
  readonly iss: string; // Issuer
}

/**
 * Session storage record (for database/Redis)
 */
export interface SessionRecord {
  readonly sessionId: string;
  readonly userId: UserId;
  readonly tenantId?: TenantId;
  readonly refreshToken: string;
  readonly expiresAt: string; // ISO string
  readonly isActive: boolean;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly createdAt: string; // ISO string
  readonly lastAccessedAt: string; // ISO string
}

// =============================================================================
// AUTHENTICATION CONTEXT (Middleware)
// =============================================================================

/**
 * Authentication context for API routes and middleware
 */
export interface AuthContext {
  readonly isAuthenticated: boolean;
  readonly user?: User;
  readonly tenant?: Tenant;
  readonly session?: ServerSession;
  readonly permissions: string[];
}

/**
 * Protected route context (when authentication is required)
 */
export interface ProtectedRouteContext {
  readonly user: User;
  readonly tenant?: Tenant;
  readonly session: ServerSession;
  readonly permissions: string[];
}

// =============================================================================
// AUTHENTICATION PROVIDERS
// =============================================================================

export interface AuthProvider {
  readonly name: string;
  readonly clientId: string;
  readonly clientSecret: string;
  readonly redirectUri: string;
  readonly scopes: string[];
}

export interface OAuthUserProfile {
  readonly provider: string;
  readonly providerId: string;
  readonly email?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly avatar?: string;
  readonly isEmailVerified: boolean;
}

// =============================================================================
// SECURITY & AUDIT
// =============================================================================

export interface LoginAttempt {
  readonly id: string;
  readonly identifier: string; // email or phone
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly isSuccessful: boolean;
  readonly failureReason?: string;
  readonly timestamp: string; // ISO string
}

export interface SecurityEvent {
  readonly id: string;
  readonly type: SecurityEventType;
  readonly userId?: UserId;
  readonly tenantId?: TenantId;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly metadata: Record<string, any>;
  readonly timestamp: string; // ISO string
}

export type SecurityEventType =
  | 'login_success'
  | 'login_failure'
  | 'logout'
  | 'password_change'
  | 'email_verification'
  | 'phone_verification'
  | 'account_locked'
  | 'suspicious_activity'
  | 'token_refresh'
  | 'session_expired';

// =============================================================================
// RATE LIMITING
// =============================================================================

export interface RateLimitConfig {
  readonly windowMs: number;
  readonly maxAttempts: number;
  readonly skipSuccessfulRequests: boolean;
  readonly skipFailedRequests: boolean;
}

export interface RateLimitState {
  readonly key: string;
  readonly attempts: number;
  readonly resetTime: string; // ISO string
  readonly isBlocked: boolean;
}
