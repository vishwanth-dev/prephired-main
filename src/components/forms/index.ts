/**
 * 📝 Forms - Centralized Export Hub
 *
 * This file serves as the centralized export point for all form components
 * in the PrepAI application. It provides clean, organized access to
 * all form implementations.
 *
 * 📋 Architecture:
 * - Auth forms for authentication flows
 * - User forms for profile management
 * - Admin forms for system management
 * - Utility forms for common operations
 *
 * 🔧 Usage:
 * ```tsx
 * import { LoginForm, RegistrationForm } from '@/components/forms';
 * ```
 */

// ============================================
// 🔐 AUTHENTICATION FORMS
// ============================================

export * from './auth';

// ============================================
// 📋 FORMS INFO
// ============================================

export const FORMS_INFO = {
  auth: [
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
export default FORMS_INFO;
