/**
 * 🏗️ Centralized Type Definitions
 *
 * This file serves as the single source of truth for all TypeScript types
 * in the PrepAI application. It provides a clean, organized structure for
 * all type definitions used across the application.
 *
 * 📋 Architecture:
 * - Core types for entities and data structures
 * - API request/response types
 * - Form validation types
 * - Utility and helper types
 *
 * 🔧 Usage:
 * ```typescript
 * import { User, AuthResponse, RegisterFormData } from '@/types';
 * ```
 */

// ============================================
// 🏗️ CORE ENTITY TYPES
// ============================================

/**
 * Base entity interface for all database entities
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User entity interface
 */
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: UserRole;
  status: UserStatus;
}

/**
 * User role enumeration
 */
export type UserRole =
  | 'user'
  | 'admin'
  | 'moderator'
  | 'super_admin'
  | 'tenant_admin'
  | 'group_admin'
  | 'guest';

/**
 * User status enumeration
 */
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'deleted' | 'pending';

/**
 * Tenant entity interface
 */
export interface Tenant extends BaseEntity {
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  webLink: string;
  subdomain: string;
  accountStatus: TenantStatus;
  tenantLogo?: string;
  subscriptionPlan?: string;
}

/**
 * Tenant status enumeration
 */
export type TenantStatus = 'active' | 'in-active' | 'suspended';

// ============================================
// 🔐 AUTHENTICATION TYPES
// ============================================

/**
 * Authentication response interface
 */
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Decoded JWT token interface
 */
export interface DecodedToken {
  sub: string; // user id
  email: string;
  role: UserRole;
  iat: number; // issued at
  exp: number; // expires at
  jti?: string; // JWT ID
}

/**
 * Authentication state interface
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  tempEmail: string | null;
  otpExpiry: Date | null;
  loginAttempts: number;
  isLocked: boolean;
  lockedUntil: Date | null;
}

/**
 * Authentication error interface
 */
export interface AuthError {
  code: AuthErrorCode;
  message: string;
  field?: string;
  details?: any;
}

/**
 * Authentication error codes
 */
export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'EMAIL_NOT_VERIFIED'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_SUSPENDED'
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'OTP_INVALID'
  | 'OTP_EXPIRED'
  | 'TOO_MANY_ATTEMPTS'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN';

// ============================================
// 📝 FORM DATA TYPES
// ============================================

/**
 * Registration form data interface
 */
export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

/**
 * Login form data interface
 */
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Forgot password form data interface
 */
export interface ForgotPasswordFormData {
  email: string;
}

/**
 * Reset password form data interface
 */
export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
  token?: string;
}

/**
 * OTP verification form data interface
 */
export interface VerifyOTPFormData {
  otp: string;
  email?: string;
  type?: 'registration' | 'reset-password' | 'phone-verification';
}

/**
 * Profile update form data interface
 */
export interface UpdateProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
}

/**
 * Change password form data interface
 */
export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================
// 🌐 API TYPES
// ============================================

/**
 * Generic API response interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * API error interface
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string;
}

/**
 * Validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// ============================================
// 🔧 SERVICE INTERFACES
// ============================================

/**
 * Authentication service interface
 */
export interface AuthService {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  verifyAccount: (otp: string) => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Registration data interface
 */
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  country: string;
  code: string;
  consent: boolean;
}

// ============================================
// 🔒 PASSWORD TYPES
// ============================================

/**
 * Password strength interface
 */
export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4; // 0 = very weak, 4 = very strong
  feedback: {
    warning?: string;
    suggestions: string[];
  };
  crackTime: string;
  isStrong: boolean;
}

/**
 * Password requirements interface
 */
export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventCommonPasswords: boolean;
}

// ============================================
// 🔄 VERIFICATION TYPES
// ============================================

/**
 * Verification request interface
 */
export interface VerificationRequest {
  id: string;
  type: 'email' | 'phone' | 'two-factor';
  target: string; // email or phone number
  code: string;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
  verified: boolean;
  createdAt: Date;
}

// ============================================
// 🎣 HOOK RETURN TYPES
// ============================================

/**
 * Authentication hook return interface
 */
export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  resendOTP: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

// ============================================
// 📊 UTILITY TYPES
// ============================================

/**
 * Generic entity with tenant context
 */
export interface TenantEntity extends BaseEntity {
  tenantId: string;
}

/**
 * Search parameters interface
 */
export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  pagination?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
}

/**
 * File upload response interface
 */
export interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

// ============================================
// 🎯 EXPORT ALL TYPES
// ============================================

/**
 * Complete types object for easy access
 * Note: Types are exported individually above, this is just for documentation
 */
export const TYPES_INFO = {
  // Core entities
  core: ['User', 'Tenant', 'BaseEntity', 'TenantEntity'],

  // Authentication
  auth: ['AuthResponse', 'AuthState', 'AuthError', 'DecodedToken'],

  // Forms
  forms: [
    'RegisterFormData',
    'LoginFormData',
    'ForgotPasswordFormData',
    'ResetPasswordFormData',
    'VerifyOTPFormData',
    'UpdateProfileFormData',
    'ChangePasswordFormData',
  ],

  // API
  api: ['ApiResponse', 'PaginatedResponse', 'ApiError', 'ValidationError'],

  // Services
  services: ['AuthService', 'LoginCredentials', 'RegisterData'],

  // Utilities
  utilities: [
    'PasswordStrength',
    'PasswordRequirements',
    'VerificationRequest',
    'UseAuthReturn',
    'SearchParams',
    'FileUploadResponse',
  ],
} as const;

// Default export for convenience
export default TYPES_INFO;
