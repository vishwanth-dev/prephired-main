/**
 * 🔐 Authentication Domain Entities - Simplified for prepAI
 * 
 * Core entities for basic authentication functionality.
 * Removed over engineered features to focus on essential auth flow.
 */

// =============================================================================
// VALUE OBJECTS
// =============================================================================

export type Email = string;
export type PhoneNumber = string;
export type UserId = string;
export type TenantId = string;
export type SessionId = string;
export type Timestamp = string;
export type Url = string;
export type Metadata = Record<string, unknown>;

// =============================================================================
// ENUMS
// =============================================================================

export type UserRole =
  | 'admin'
  | 'user'
  | 'candidate'
  | 'student'
  | 'employee'
  | 'university'
  | 'company';
export type UserStatus = 'active' | 'inactive' | 'pending';
export type TenantStatus = 'active' | 'inactive';
export type AuthLoadingState = 'idle' | 'loading' | 'success' | 'error';
export type LoginMethod = 'email' | 'phone' | 'oauth' | 'sso';

// =============================================================================
// ROLE SELECTION ENTITIES
// =============================================================================

export interface RoleOption {
  readonly id: UserRole;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly category: 'individual' | 'institutional' | 'enterprise';
}

export interface RoleSelectionCommand {
  readonly selectedRole: UserRole;
  readonly userId?: UserId;
  readonly sessionId?: SessionId;
}

export interface RoleSelectionResult {
  readonly success: boolean;
  readonly selectedRole: UserRole;
  readonly redirectTo?: string;
  readonly error?: {
    readonly code: string;
    readonly message: string;
  };
}

// =============================================================================
// CORE ENTITIES
// =============================================================================

export interface User {
  readonly id: UserId;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: Email;
  readonly phone?: PhoneNumber;
  readonly avatarUrl?: Url;
  readonly emailVerified: boolean;
  readonly phoneVerified: boolean;
  readonly status: UserStatus;
  readonly roles: readonly UserRole[];
  readonly permissions: readonly string[];
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
  readonly metadata: Metadata;
}

export interface UserProfile
  extends Omit<User, 'passwordHash' | 'mfaBackupCodes' | 'failedLoginAttempts' | 'lockedUntil'> {
  readonly displayName: string;
  readonly initials: string;
}

export interface Tenant {
  readonly id: TenantId;
  readonly name: string;
  readonly slug: string;
  readonly description?: string;
  readonly website?: Url;
  readonly logoUrl?: Url;
  readonly status: TenantStatus;
  readonly country: string;
  readonly timezone: string;
  readonly language: string;
  readonly currency: string;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

export interface Session {
  readonly id: SessionId;
  readonly userId: UserId;
  readonly tenantId?: TenantId;
  readonly expiresAt: Timestamp;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly createdAt: Timestamp;
  readonly lastActivity: Timestamp;
  readonly metadata: Metadata;
}

// =============================================================================
// FORM INTERFACES
// =============================================================================

export interface LoginForm {
  readonly email: Email;
  readonly password: string;
  readonly rememberMe?: boolean;
}

export interface RegisterForm {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: Email;
  readonly phone?: PhoneNumber;
  readonly password: string;
  readonly confirmPassword: string;
  readonly acceptTerms: boolean;
  readonly acceptPrivacy: boolean;
}

export interface ForgotPasswordForm {
  readonly email: Email;
}

export interface ResetPasswordForm {
  readonly token: string;
  readonly password: string;
  readonly confirmPassword: string;
}

export interface VerifyEmailForm {
  readonly token: string;
}

// =============================================================================
// AUTH STATE
// =============================================================================

export interface AuthState {
  readonly user: UserProfile | null;
  readonly session: Session | null;
  readonly currentTenant: Tenant | null;
  readonly availableTenants: readonly Tenant[];
  readonly loading: AuthLoadingState;
  readonly error: string | null;
  readonly isAuthenticated: boolean;
  readonly emailVerificationRequired: boolean;
  readonly lastUpdated: Timestamp;
}

// =============================================================================
// COMMANDS AND RESULTS
// =============================================================================

export interface RegisterUserCommand extends Omit<RegisterForm, 'confirmPassword'> {
  readonly email: Email;
  readonly phone?: PhoneNumber;
  readonly password: string;
}

export interface LoginCredentials {
  readonly email: Email;
  readonly password: string;
  readonly rememberMe: boolean;
}

export interface AuthResult<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: {
    readonly code: string;
    readonly message: string;
    readonly field?: string;
  };
  readonly redirectTo?: string;
}
