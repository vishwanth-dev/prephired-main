/**
 * 🔐 Authentication Validation Schemas
 *
 * This file contains comprehensive validation schemas for all authentication-related
 * forms in the PrepAI application. It provides robust validation using Zod with
 * detailed error messages and custom validation rules.
 *
 * 📋 Features:
 * - Registration form validation
 * - Login form validation
 * - Password reset validation
 * - OTP verification validation
 * - Profile update validation
 * - Password strength calculation
 * - Custom validation helpers
 *
 * 🔧 Usage:
 * ```typescript
 * import { registerSchema, validatePassword } from '@/lib/validations/auth';
 *
 * // Validate form data
 * const result = registerSchema.safeParse(formData);
 * if (!result.success) {
 *   console.log(result.error.issues);
 * }
 * ```
 *
 * 📝 Maintenance:
 * - Update validation rules as requirements change
 * - Add new validation schemas for new forms
 * - Keep error messages user-friendly and clear
 * - Test validation rules thoroughly
 */

import { z } from 'zod';
import { AUTH_CONFIG } from '@/constants/config';

// Extract password requirements for easier access
const PASSWORD_REQUIREMENTS = AUTH_CONFIG.PASSWORD_REQUIREMENTS;

// ============================================
// 🔧 CUSTOM VALIDATION RULES
// ============================================

/**
 * Phone number validation regex
 * Supports international formats with optional country codes
 */
const phoneRegex = /^\+?[\d\s\-\(\)]+$/;

/**
 * Name validation regex
 * Allows letters, spaces, hyphens, and apostrophes
 */
const nameRegex = /^[a-zA-Z\s\-']+$/;

/**
 * Password validation schema with detailed requirements
 *
 * 🎯 Purpose: Validate passwords against security requirements
 *
 * 📋 Features:
 * - Minimum length validation
 * - Character type requirements
 * - Custom error messages
 * - Configurable requirements
 */
const passwordSchema = z
  .string()
  .min(
    PASSWORD_REQUIREMENTS.MIN_LENGTH,
    `Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters`
  )
  .refine(
    val => !PASSWORD_REQUIREMENTS.REQUIRE_UPPERCASE || /[A-Z]/.test(val),
    'Password must contain at least one uppercase letter'
  )
  .refine(
    val => !PASSWORD_REQUIREMENTS.REQUIRE_LOWERCASE || /[a-z]/.test(val),
    'Password must contain at least one lowercase letter'
  )
  .refine(
    val => !PASSWORD_REQUIREMENTS.REQUIRE_NUMBERS || /\d/.test(val),
    'Password must contain at least one number'
  )
  .refine(
    val => !PASSWORD_REQUIREMENTS.REQUIRE_SYMBOLS || /[@$!%*?&#]/.test(val),
    'Password must contain at least one special character (@$!%*?&#)'
  );

// ============================================
// 📝 REGISTRATION SCHEMA
// ============================================

/**
 * Registration form validation schema
 *
 * 🎯 Purpose: Validate user registration data
 *
 * 📋 Features:
 * - Name validation with regex
 * - Email validation and normalization
 * - Phone number validation and formatting
 * - Password confirmation matching
 * - Terms acceptance requirement
 */
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .regex(nameRegex, 'First name can only contain letters, spaces, hyphens, and apostrophes')
      .transform(val => val.trim()),

    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .regex(nameRegex, 'Last name can only contain letters, spaces, hyphens, and apostrophes')
      .transform(val => val.trim()),

    email: z
      .string()
      .email('Please enter a valid email address')
      .toLowerCase()
      .transform(val => val.trim()),

    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .regex(phoneRegex, 'Please enter a valid phone number')
      .transform(val => val.replace(/\D/g, '')), // Remove non-digits

    password: passwordSchema,

    confirmPassword: z.string(),

    acceptTerms: z.boolean().refine(val => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// ============================================
// 🔑 LOGIN SCHEMA
// ============================================

/**
 * Login form validation schema
 *
 * 🎯 Purpose: Validate user login credentials
 *
 * 📋 Features:
 * - Email validation and normalization
 * - Password requirement validation
 * - Optional remember me checkbox
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .transform(val => val.trim()),

  password: z.string().min(1, 'Password is required'),

  rememberMe: z.boolean().optional().default(false),
});

// ============================================
// 🔄 FORGOT PASSWORD SCHEMA
// ============================================

/**
 * Forgot password form validation schema
 *
 * 🎯 Purpose: Validate email for password reset request
 *
 * 📋 Features:
 * - Email validation and normalization
 * - Required field validation
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .transform(val => val.trim()),
});

// ============================================
// 🔐 RESET PASSWORD SCHEMA
// ============================================

/**
 * Reset password form validation schema
 *
 * 🎯 Purpose: Validate new password for reset
 *
 * 📋 Features:
 * - Password validation with requirements
 * - Password confirmation matching
 * - Optional token validation
 */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
    token: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// ============================================
// 📱 OTP VERIFICATION SCHEMA
// ============================================

/**
 * OTP verification form validation schema
 *
 * 🎯 Purpose: Validate OTP codes for verification
 *
 * 📋 Features:
 * - 6-digit OTP validation
 * - Numeric-only validation
 * - Optional email and type validation
 */
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),

  email: z.string().email('Invalid email address').optional(),

  type: z
    .enum(['registration', 'reset-password', 'phone-verification'])
    .optional()
    .default('registration'),
});

// ============================================
// 👤 PROFILE UPDATE SCHEMA
// ============================================

/**
 * Profile update form validation schema
 *
 * 🎯 Purpose: Validate profile update data
 *
 * 📋 Features:
 * - Name validation with regex
 * - Phone number validation and formatting
 * - Optional field handling
 */
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(nameRegex, 'First name can only contain letters, spaces, hyphens, and apostrophes')
    .transform(val => val.trim()),

  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(nameRegex, 'Last name can only contain letters, spaces, hyphens, and apostrophes')
    .transform(val => val.trim()),

  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(phoneRegex, 'Please enter a valid phone number')
    .transform(val => val.replace(/\D/g, '')),
});

// ============================================
// 🔄 CHANGE PASSWORD SCHEMA
// ============================================

/**
 * Change password form validation schema
 *
 * 🎯 Purpose: Validate password change data
 *
 * 📋 Features:
 * - Current password validation
 * - New password validation with requirements
 * - Password confirmation matching
 * - Different password requirement
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),

    newPassword: passwordSchema,

    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword !== data.currentPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// ============================================
// 📦 TYPE EXPORTS
// ============================================

/**
 * TypeScript type exports for form data
 *
 * 🎯 Purpose: Provide type-safe form data interfaces
 *
 * 📋 Features:
 * - Inferred types from Zod schemas
 * - Type safety for form handling
 * - IntelliSense support
 */
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// ============================================
// 🛠️ VALIDATION HELPERS
// ============================================

/**
 * Validate password against requirements
 *
 * 🎯 Purpose: Check password strength and provide detailed feedback
 *
 * @param password - Password to validate
 * @returns Validation result with errors
 */
export const validatePassword = (
  password: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
    errors.push(`Must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters`);
  }

  if (PASSWORD_REQUIREMENTS.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Must contain an uppercase letter');
  }

  if (PASSWORD_REQUIREMENTS.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Must contain a lowercase letter');
  }

  if (PASSWORD_REQUIREMENTS.REQUIRE_NUMBERS && !/\d/.test(password)) {
    errors.push('Must contain a number');
  }

  if (PASSWORD_REQUIREMENTS.REQUIRE_SYMBOLS && !/[@$!%*?&#]/.test(password)) {
    errors.push('Must contain a special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Calculate password strength score
 *
 * 🎯 Purpose: Provide visual feedback on password strength
 *
 * @param password - Password to analyze
 * @returns Strength score with label and color
 */
export const getPasswordStrength = (
  password: string
): {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
} => {
  if (!password) return { score: 0, label: 'Enter password', color: 'gray' };

  let score = 0;

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character variety
  if (/[a-z]/.test(password)) score += 0.5;
  if (/[A-Z]/.test(password)) score += 0.5;
  if (/\d/.test(password)) score += 0.5;
  if (/[@$!%*?&#]/.test(password)) score += 0.5;

  const roundedScore = Math.min(4, Math.floor(score)) as 0 | 1 | 2 | 3 | 4;

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['red', 'orange', 'yellow', 'blue', 'green'];

  return {
    score: roundedScore,
    label: labels[roundedScore] || 'Unknown',
    color: colors[roundedScore] || 'gray',
  };
};
