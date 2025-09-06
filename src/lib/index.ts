/**
 * 🛠️ Library - Centralized Export Hub
 *
 * This file serves as the centralized export point for all library utilities
 * and helpers in the PrepAI application. It provides clean, organized access
 * to all utility functions, validations, and configurations.
 *
 * 📋 Architecture:
 * - API client and utilities
 * - Validation schemas and helpers
 * - Error handling utilities
 * - Environment configuration
 * - AI integration utilities
 * - General utility functions
 *
 * 🔧 Usage:
 * ```typescript
 * import { api, registerSchema, validatePassword, cn } from '@/lib';
 * ```
 */

// ============================================
// 🌐 API CLIENT & UTILITIES
// ============================================

export {
  api,
  createFormDataApi,
  setAuthToken,
  removeAuthToken,
  getAuthToken,
  setRefreshToken,
  getRefreshToken,
  clearAuth,
  initializeAuth,
} from './api/client';
export type { AxiosResponse, AxiosError } from 'axios';

// ============================================
// ✅ VALIDATION SCHEMAS & HELPERS
// ============================================

export {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  otpSchema,
  updateProfileSchema,
  changePasswordSchema,
  validatePassword,
  getPasswordStrength,
} from './validations/auth';

export type {
  RegisterFormData,
  LoginFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  OTPFormData,
  UpdateProfileFormData,
  ChangePasswordFormData,
} from './validations/auth';

// ============================================
// 🚨 ERROR HANDLING
// ============================================

export {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  isAppError,
  getErrorMessage as getErrorFromError,
  getErrorStatusCode,
  handleApiError,
} from './errors';

// ============================================
// 🌍 ENVIRONMENT CONFIGURATION
// ============================================

export { env } from './env';

// ============================================
// 🤖 AI INTEGRATION
// ============================================

export { aiClient } from './ai/openai';
export type { AIResponse, JobDescriptionParams, ResumeAnalysisParams } from './ai/openai';

// ============================================
// 🛠️ UTILITY FUNCTIONS
// ============================================

export {
  // UI utilities
  cn,
  capitalize,
  truncate,
  getInitials,

  // Form validation
  isValidEmail,
  isValidPhone,

  // Formatting
  formatPhoneNumber,
  formatCurrency,
  formatDate,
  formatRelativeTime,

  // Privacy
  maskEmail,
  maskPhone,

  // Performance
  debounce,
  throttle,

  // Browser utilities
  isBrowser,
  copyToClipboard,
  getFromLocalStorage,
  setToLocalStorage,

  // Error handling
  getErrorMessage,

  // URL utilities
  getQueryParams,
  buildQueryString,

  // Async utilities
  sleep,
  retry,

  // Array utilities
  removeDuplicates,
  isEmpty,

  // Number utilities
  clamp,
  randomBetween,
} from './utils';

// ============================================
// 📦 LIBRARY COLLECTIONS
// ============================================

/**
 * Library information for documentation
 */
export const LIB_INFO = {
  validation: [
    'registerSchema',
    'loginSchema',
    'forgotPasswordSchema',
    'resetPasswordSchema',
    'otpSchema',
    'updateProfileSchema',
    'changePasswordSchema',
    'validatePassword',
    'getPasswordStrength',
  ],
  utilities: [
    'cn',
    'capitalize',
    'truncate',
    'getInitials',
    'isValidEmail',
    'isValidPhone',
    'formatPhoneNumber',
    'formatCurrency',
    'formatDate',
    'formatRelativeTime',
    'maskEmail',
    'maskPhone',
    'debounce',
    'throttle',
    'isBrowser',
    'copyToClipboard',
    'getFromLocalStorage',
    'setToLocalStorage',
    'getErrorMessage',
    'getQueryParams',
    'buildQueryString',
    'sleep',
    'retry',
    'removeDuplicates',
    'isEmpty',
    'clamp',
    'randomBetween',
  ],
  api: [
    'api',
    'createFormDataApi',
    'setAuthToken',
    'removeAuthToken',
    'getAuthToken',
    'setRefreshToken',
    'getRefreshToken',
    'clearAuth',
    'initializeAuth',
  ],
  errors: [
    'AppError',
    'ValidationError',
    'AuthenticationError',
    'AuthorizationError',
    'NotFoundError',
    'ConflictError',
    'isAppError',
    'getErrorFromError',
    'getErrorStatusCode',
    'handleApiError',
  ],
  ai: ['aiClient'],
  env: ['env'],
} as const;

// Default export for convenience
export default LIB_INFO;
