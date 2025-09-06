/**
 * 🔐 Auth Features - Centralized Export
 *
 * This file exports all authentication feature components following
 * the single source of truth principle.
 *
 * 📋 Components:
 * - AuthGuard: Authentication protection wrapper
 * - AuthIllustration: Authentication page illustrations
 * - PasswordStrength: Password strength visualization
 * - SocialLogin: Social authentication options
 *
 * 🔧 Usage:
 * ```tsx
 * import { AuthGuard, AuthIllustration } from '@/components/features/auth';
 * ```
 */

// ============================================
// 🛡️ AUTH GUARD COMPONENTS
// ============================================

export {
  default as AuthGuard,
  PublicRouteGuard,
  StatusGuard,
  RegistrationStepGuard,
} from './auth-guard';

// ============================================
// 🎨 AUTH ILLUSTRATION COMPONENTS
// ============================================

export {
  default as AuthIllustration,
  LoginIllustration,
  RegisterIllustration,
  ForgotPasswordIllustration,
  ResetPasswordIllustration,
  VerifyOTPIllustration,
} from './auth-illustration';

// ============================================
// 🔒 PASSWORD STRENGTH COMPONENTS
// ============================================

export {
  default as PasswordStrength,
  PasswordStrengthIndicator,
  CompactPasswordStrength,
  DetailedPasswordStrength,
} from './password-strength';

// ============================================
// 🌐 SOCIAL LOGIN COMPONENTS
// ============================================

export {
  default as SocialLogin,
  HorizontalSocialLogin,
  VerticalSocialLogin,
  GridSocialLogin,
} from './social-login';

// ============================================
// 🎯 TYPE EXPORTS
// ============================================

export type { SocialProvider } from './social-login';

// ============================================
// 📋 COMPONENT INFO
// ============================================

export const AUTH_FEATURES_INFO = {
  components: [
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
export default AUTH_FEATURES_INFO;
