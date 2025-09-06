/**
 * 🔐 Authentication Types
 *
 * This file contains all authentication-related TypeScript interfaces and types.
 * It serves as the single source of truth for auth data structures and follows
 * the backend API reference.
 *
 * 📋 Based on: BACKEND_API_REFERENCE.md
 *
 * 🔧 Usage:
 * ```typescript
 * import { AuthService, LoginCredentials, AuthResponse } from '@/types/auth';
 * ```
 */

import { IUser, IAuthResponse } from './backend';

// ============================================
// 🔐 AUTHENTICATION SERVICE INTERFACES
// ============================================

/**
 * Authentication Service Interface
 * Defines the contract for authentication services
 */
export interface AuthService {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  verifyAccount: (otp: string) => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  refreshToken: () => Promise<AuthResponse>;
  validateToken: () => Promise<boolean>;
}

/**
 * Login Credentials Interface
 * For user login requests
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Registration Data Interface
 * For user registration requests
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
// 🔄 AUTHENTICATION RESPONSE TYPES
// ============================================

/**
 * Authentication Response Interface
 * Standard response from auth endpoints
 */
export interface AuthResponse {
  user: IUser;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Decoded JWT Token Interface
 * Structure of decoded JWT tokens
 */
export interface DecodedToken {
  userId: string; // User ID from database
  iat: number; // Issued at timestamp
  exp: number; // Expiration timestamp
  sub?: string; // Subject (user ID)
  email?: string; // User email
  role?: string; // User role
}

// ============================================
// 🎯 AUTHENTICATION STATE TYPES
// ============================================

/**
 * Authentication State Interface
 * State management for auth context
 */
export interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  registrationStep: 'register' | 'verify-otp' | 'select-role' | 'complete';
  tempUserId: string | null;
  tempEmail: string | null;
  otpExpiry: Date | null;
  loginAttempts: number;
  isLocked: boolean;
  lockedUntil: Date | null;
}

/**
 * Authentication Context Type
 * Context interface for auth provider
 */
export interface AuthContextType extends AuthState {
  // Authentication methods
  login: (data: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  verifyOTP: (data: { userId: string; otp: string }) => Promise<void>;
  selectRole: (data: { userId: string; role: string }) => Promise<void>;

  // Utility methods
  clearError: () => void;
  refreshUser: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// ============================================
// ❌ AUTHENTICATION ERROR TYPES
// ============================================

/**
 * Authentication Error Interface
 * Structure for auth-related errors
 */
export interface AuthError {
  code: AuthErrorCode;
  message: string;
  field?: string;
  details?: any;
}

/**
 * Authentication Error Codes
 * Standardized error codes for auth operations
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
  | 'FORBIDDEN'
  | 'EMAIL_ALREADY_EXISTS'
  | 'PHONE_ALREADY_EXISTS'
  | 'WEAK_PASSWORD'
  | 'INVALID_EMAIL_FORMAT'
  | 'INVALID_PHONE_FORMAT';

// ============================================
// 🔒 PASSWORD TYPES
// ============================================

/**
 * Password Strength Interface
 * For password strength validation
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
 * Password Requirements Interface
 * Configuration for password validation
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
 * Verification Request Interface
 * For OTP and email verification
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

/**
 * OTP Verification Data Interface
 * For OTP verification requests
 */
export interface OTPVerificationData {
  userId: string;
  otp: string;
  type?: 'registration' | 'reset-password' | 'phone-verification';
}

// ============================================
// 🎣 HOOK RETURN TYPES
// ============================================

/**
 * Authentication Hook Return Interface
 * Return type for useAuth hook
 */
export interface UseAuthReturn {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  verifyOTP: (data: OTPVerificationData) => Promise<void>;
  resendOTP: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

/**
 * Auth Guard Hook Options Interface
 * Options for useAuthGuard hook
 */
export interface UseAuthGuardOptions {
  requireAuth?: boolean;
  requireStatus?: ('pending' | 'active' | 'suspended')[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * Auth Guard Hook Return Interface
 * Return type for useAuthGuard hook
 */
export interface UseAuthGuardReturn {
  isAuthorized: boolean;
  isLoading: boolean;
  user: IUser | null;
  error: string | null;
}

// ============================================
// 🔧 UTILITY TYPES
// ============================================

/**
 * Token Storage Interface
 * For token management utilities
 */
export interface TokenStorage {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isPersistent: boolean;
}

/**
 * Auth Configuration Interface
 * Configuration for authentication system
 */
export interface AuthConfig {
  tokenExpiry: number; // in seconds
  refreshTokenExpiry: number; // in seconds
  maxLoginAttempts: number;
  lockoutDuration: number; // in minutes
  otpExpiry: number; // in minutes
  passwordRequirements: PasswordRequirements;
  enableRememberMe: boolean;
  enableTwoFactor: boolean;
}

// ============================================
// 🎯 EXPORT ALL TYPES
// ============================================

/**
 * Complete auth types object for easy access
 * Note: Types are exported individually above, this is just for documentation
 */
export const AUTH_TYPES_INFO = {
  // Service interfaces
  services: ['AuthService', 'LoginCredentials', 'RegisterData'],

  // Response types
  responses: ['AuthResponse', 'DecodedToken'],

  // State types
  state: ['AuthState', 'AuthContextType'],

  // Error types
  errors: ['AuthError', 'AuthErrorCode'],

  // Password types
  password: ['PasswordStrength', 'PasswordRequirements'],

  // Verification types
  verification: ['VerificationRequest', 'OTPVerificationData'],

  // Hook types
  hooks: ['UseAuthReturn', 'UseAuthGuardOptions', 'UseAuthGuardReturn'],

  // Utility types
  utilities: ['TokenStorage', 'AuthConfig'],
} as const;

// Default export for convenience
export default AUTH_TYPES_INFO;
