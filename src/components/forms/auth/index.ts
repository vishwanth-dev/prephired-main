/**
 * 📝 Auth Forms - Centralized Export
 *
 * This file exports all authentication form components following
 * the single source of truth principle.
 *
 * 📋 Components:
 * - LoginForm: User login functionality
 * - RegistrationForm: User registration functionality
 * - ForgotPasswordForm: Password reset request
 * - ResetPasswordForm: Password reset with new password
 * - VerifyOTPForm: OTP verification for various flows
 *
 * 🔧 Usage:
 * ```tsx
 * import { LoginForm, RegistrationForm } from '@/components/forms/auth';
 * ```
 */

// ============================================
// 📝 FORM COMPONENTS
// ============================================

export { default as LoginForm } from './login-form';
export { default as RegistrationForm } from './register-form';
export { default as ForgotPasswordForm } from './forgot-password-form';
export { default as ResetPasswordForm } from './reset-password-form';
export { default as VerifyOTPForm } from './verify-otp-form';

// ============================================
// 🎯 TYPE EXPORTS
// ============================================

export type { LoginFormData } from '@/lib/validations/auth';
export type { RegisterFormData } from '@/lib/validations/auth';
export type { ForgotPasswordFormData } from '@/lib/validations/auth';
export type { ResetPasswordFormData } from '@/lib/validations/auth';
export type { OTPFormData } from '@/lib/validations/auth';

// ============================================
// 📋 COMPONENT INFO
// ============================================

export const AUTH_FORMS_INFO = {
  components: [
    'LoginForm',
    'RegistrationForm',
    'ForgotPasswordForm',
    'ResetPasswordForm',
    'VerifyOTPForm',
  ],
  features: [
    'Form validation with Zod',
    'Loading states and error handling',
    'Accessibility support',
    'SOLID principles compliance',
    'TypeScript type safety',
    'Responsive design',
  ],
} as const;

// Default export for convenience
export default AUTH_FORMS_INFO;
