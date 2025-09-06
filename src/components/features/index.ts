/**
 * 🎯 Features - Centralized Export Hub
 *
 * This file serves as the centralized export point for all feature components
 * in the PrepAI application. It provides clean, organized access to
 * all feature implementations.
 *
 * 📋 Architecture:
 * - Auth features for authentication flows
 * - Dashboard features for user interface
 * - Admin features for system management
 * - Utility features for common operations
 *
 * 🔧 Usage:
 * ```tsx
 * import { AuthGuard, AuthIllustration } from '@/components/features';
 * ```
 */

// ============================================
// 🔐 AUTHENTICATION FEATURES
// ============================================

export * from './auth';

// ============================================
// 📋 FEATURES INFO
// ============================================

export const FEATURES_INFO = {
  auth: [
    'AuthGuard',
    'PublicRouteGuard',
    'StatusGuard',
    'RegistrationStepGuard',
    'AuthIllustration',
    'PasswordStrength',
    'SocialLogin',
  ],
  features: [
    'Authentication protection',
    'Visual illustrations',
    'Password strength validation',
    'Social authentication',
    'SOLID principles compliance',
    'TypeScript type safety',
    'Accessibility support',
    'Responsive design',
  ],
} as const;

// Default export for convenience
export default FEATURES_INFO;
