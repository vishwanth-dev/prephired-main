/**
 * 🔐 Authentication Services
 *
 * This file exports authentication services and interfaces.
 * All types are imported from the centralized types file to avoid duplication.
 *
 * 🎯 Purpose: Provide authentication service layer
 *
 * 📋 Features:
 * - Service interfaces and implementations
 * - Centralized type imports
 * - No duplicate type definitions
 *
 * 🔧 Usage:
 * ```typescript
 * import { authApiService } from '@/services/auth';
 * import { LoginCredentials, AuthResponse } from '@/types/auth';
 * ```
 */

// Service exports
// TODO: Add authApiService when the service is implemented
// export { authApiService } from './authApi.service';

// Re-export types from centralized location
export type { AuthService, LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';
