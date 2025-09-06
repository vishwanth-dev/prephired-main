/**
 * 🚀 Services - Centralized Export Hub
 *
 * This file serves as the centralized export point for all services
 * in the PrepAI application. It provides clean, organized access to
 * all service implementations and interfaces.
 *
 * 📋 Architecture:
 * - API services for backend communication
 * - Authentication services
 * - Business logic services
 * - Utility services
 *
 * 🔧 Usage:
 * ```typescript
 * import { AuthService, UserService, api } from '@/services';
 * ```
 */

// ============================================
// 🌐 API SERVICES
// ============================================

// Base API client
export { api, createFormDataApi, setAuthToken, removeAuthToken, getAuthToken } from '@/lib/api';

// API Service Classes
export { AuthService } from './api/auth.service';
export { UserService } from './api/user.service';
export { GroupService } from './api/group.service';
export { RoleService } from './api/role.service';
export { TenantService } from './api/tenant.service';
export { ResumeService } from './api/resume.service';

// ============================================
// 🔐 AUTHENTICATION SERVICES
// ============================================

// Re-export auth types and interfaces
export type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types';

// ============================================
// 🛠️ UTILITY SERVICES
// ============================================

// Error handling
export {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  handleError,
  errorResponse,
} from '@/lib/errors';

// Environment validation
export { env } from '@/lib/env';

// AI services
export { aiClient } from '@/lib/ai/openai';
export type { AIResponse, JobDescriptionParams, ResumeAnalysisParams } from '@/lib/ai/openai';

// ============================================
// 📦 SERVICE COLLECTIONS
// ============================================

/**
 * Services information for documentation
 */
export const SERVICES_INFO = {
  api: [
    'AuthService',
    'UserService',
    'GroupService',
    'RoleService',
    'TenantService',
    'ResumeService',
  ],
  utility: [
    'api',
    'createFormDataApi',
    'setAuthToken',
    'removeAuthToken',
    'getAuthToken',
    'aiClient',
    'env',
  ],
  errors: [
    'AppError',
    'ValidationError',
    'AuthenticationError',
    'AuthorizationError',
    'NotFoundError',
    'ConflictError',
    'RateLimitError',
    'handleError',
    'errorResponse',
  ],
} as const;

// Default export for convenience
export default SERVICES_INFO;
