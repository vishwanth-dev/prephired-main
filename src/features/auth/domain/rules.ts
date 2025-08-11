/**
 * 🧮 Authentication Domain Rules - Simplified for prepAI
 *
 * Core business logic for basic authentication functionality.
 * Removed over engineered validation to focus on essential auth flow.
 */

import type {
  RegisterForm,
  RegisterUserCommand,
  LoginForm,
  LoginCredentials,
  ForgotPasswordForm,
  ResetPasswordForm,
  VerifyEmailForm,
  RoleSelectionCommand,
  UserRole,
} from './entities';

import {
  InvalidEmailError,
  InvalidPhoneNumberError,
  WeakPasswordError,
  PasswordMismatchError,
  TermsNotAcceptedError,
  PrivacyPolicyNotAcceptedError,
  InvalidNameFormatError,
} from './errors';

// =============================================================================
// VALIDATION RESULTS
// =============================================================================

export type ValidationResult = { isValid: true } | { isValid: false; errors: Error[] };

// =============================================================================
// PASSWORD POLICY
// =============================================================================

export interface PasswordPolicy {
  readonly minLength: number;
  readonly requireUppercase: boolean;
  readonly requireLowercase: boolean;
  readonly requireNumbers: boolean;
  readonly requireSpecialChars: boolean;
  readonly maxLength: number;
}

export const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
  maxLength: 128,
};

// =============================================================================
// EMAIL VALIDATION
// =============================================================================

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateEmail = (email: string): void => {
  if (!email || !isValidEmail(email)) {
    throw new InvalidEmailError();
  }
};

// =============================================================================
// PHONE VALIDATION
// =============================================================================

export const isValidPhoneNumber = (phone: string): boolean => {
  // Basic E.164 format validation
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

export const validatePhoneNumber = (phone: string): void => {
  if (phone && !isValidPhoneNumber(phone)) {
    throw new InvalidPhoneNumberError();
  }
};

export const normalizePhoneToE164 = (phone: string, countryCode: string = '+1'): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // If it starts with 0, remove it
  const cleanDigits = digits.startsWith('0') ? digits.slice(1) : digits;

  // Add country code if not present
  if (!phone.startsWith('+')) {
    return `${countryCode}${cleanDigits}`;
  }

  return phone;
};

// =============================================================================
// PASSWORD VALIDATION
// =============================================================================

export const assessPasswordStrength = (
  password: string,
  policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY
): {
  score: number;
  level: 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= policy.minLength) {
    score += 1;
  } else {
    feedback.push(`Password must be at least ${policy.minLength} characters long`);
  }

  if (password.length <= policy.maxLength) {
    score += 1;
  } else {
    feedback.push(`Password must be no more than ${policy.maxLength} characters long`);
  }

  // Character type checks
  if (policy.requireUppercase && /[A-Z]/.test(password)) {
    score += 1;
  } else if (policy.requireUppercase) {
    feedback.push('Password must contain at least one uppercase letter');
  }

  if (policy.requireLowercase && /[a-z]/.test(password)) {
    score += 1;
  } else if (policy.requireLowercase) {
    feedback.push('Password must contain at least one lowercase letter');
  }

  if (policy.requireNumbers && /\d/.test(password)) {
    score += 1;
  } else if (policy.requireNumbers) {
    feedback.push('Password must contain at least one number');
  }

  if (policy.requireSpecialChars && /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else if (policy.requireSpecialChars) {
    feedback.push('Password must contain at least one special character');
  }

  // Determine level
  let level: 'weak' | 'fair' | 'good' | 'strong';
  if (score <= 2) level = 'weak';
  else if (score <= 4) level = 'fair';
  else if (score <= 5) level = 'good';
  else level = 'strong';

  return { score, level, feedback };
};

export const validatePassword = (
  password: string,
  policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY
): void => {
  const { feedback } = assessPasswordStrength(password, policy);

  if (feedback.length > 0) {
    throw new WeakPasswordError(feedback);
  }
};

// =============================================================================
// NAME VALIDATION
// =============================================================================

export const isValidName = (name: string): boolean => {
  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(name) && name.trim().length >= 2;
};

export const validateName = (name: string, field: 'firstName' | 'lastName'): void => {
  if (!name || !isValidName(name)) {
    throw new InvalidNameFormatError(field);
  }
};

// =============================================================================
// FORM VALIDATION
// =============================================================================

export const validateRegistrationForm = (
  form: RegisterForm,
  passwordPolicy: PasswordPolicy = DEFAULT_PASSWORD_POLICY
): ValidationResult => {
  const errors: Error[] = [];

  try {
    // Validate names
    validateName(form.firstName, 'firstName');
    validateName(form.lastName, 'lastName');

    // Validate email
    validateEmail(form.email);

    // Validate phone (optional)
    if (form.phone) {
      validatePhoneNumber(form.phone);
    }

    // Validate password
    validatePassword(form.password, passwordPolicy);

    // Validate password confirmation
    if (form.password !== form.confirmPassword) {
      throw new PasswordMismatchError();
    }

    // Validate terms acceptance
    if (!form.acceptTerms) {
      throw new TermsNotAcceptedError();
    }

    if (!form.acceptPrivacy) {
      throw new PrivacyPolicyNotAcceptedError();
    }

    return { isValid: true };
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error);
    }
    return { isValid: false, errors };
  }
};

export const validateLoginForm = (form: LoginForm): ValidationResult => {
  const errors: Error[] = [];

  try {
    // Validate email
    validateEmail(form.email);

    // Validate password (basic check)
    if (!form.password || form.password.length < 1) {
      errors.push(new Error('Password is required'));
    }

    return { isValid: true };
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error);
    }
    return { isValid: false, errors };
  }
};

export const validateForgotPasswordForm = (form: ForgotPasswordForm): ValidationResult => {
  const errors: Error[] = [];

  try {
    // Validate email
    validateEmail(form.email);

    return { isValid: true };
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error);
    }
    return { isValid: false, errors };
  }
};

export const validateResetPasswordForm = (
  form: ResetPasswordForm,
  passwordPolicy: PasswordPolicy = DEFAULT_PASSWORD_POLICY
): ValidationResult => {
  const errors: Error[] = [];

  try {
    // Validate token
    if (!form.token || form.token.length < 1) {
      errors.push(new Error('Reset token is required'));
    }

    // Validate password
    validatePassword(form.password, passwordPolicy);

    // Validate password confirmation
    if (form.password !== form.confirmPassword) {
      throw new PasswordMismatchError();
    }

    return { isValid: true };
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error);
    }
    return { isValid: false, errors };
  }
};

export const validateVerifyEmailForm = (form: VerifyEmailForm): ValidationResult => {
  const errors: Error[] = [];

  try {
    // Validate token
    if (!form.token || form.token.length < 1) {
      errors.push(new Error('Verification token is required'));
    }

    return { isValid: true };
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error);
    }
    return { isValid: false, errors };
  }
};

// =============================================================================
// TRANSFORMATION FUNCTIONS
// =============================================================================

export const toRegisterUserCommand = (form: RegisterForm): RegisterUserCommand => {
  return {
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    password: form.password,
    acceptTerms: form.acceptTerms,
    acceptPrivacy: form.acceptPrivacy,
    ...(form.phone && { phone: form.phone }),
  };
};

export const toLoginCredentials = (form: LoginForm): LoginCredentials => {
  return {
    email: form.email,
    password: form.password,
    rememberMe: form.rememberMe || false,
  };
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const sanitizePhone = (phone: string): string => {
  return phone.replace(/\s+/g, '').trim();
};

export const generateDisplayName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

export const generateInitials = (firstName: string, lastName: string): string => {
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName.charAt(0).toUpperCase();
  return `${first}${last}`;
};

// =============================================================================
// ROLE SELECTION RULES
// =============================================================================

export const VALID_USER_ROLES: readonly UserRole[] = [
  'student',
  'employee',
  'university',
  'company',
] as const;

export const isValidUserRole = (role: string): role is UserRole => {
  return VALID_USER_ROLES.includes(role as UserRole);
};

export const validateRoleSelection = (command: RoleSelectionCommand): ValidationResult => {
  const errors: Error[] = [];

  try {
    if (!command.selectedRole) {
      errors.push(new Error('Role selection is required'));
    } else if (!isValidUserRole(command.selectedRole)) {
      errors.push(new Error('Invalid role selected'));
    }

    return errors.length === 0 ? { isValid: true } : { isValid: false, errors };
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error);
    }
    return { isValid: false, errors };
  }
};

export const getRoleCategory = (role: UserRole): 'individual' | 'institutional' | 'enterprise' => {
  switch (role) {
    case 'student':
    case 'employee':
      return 'individual';
    case 'university':
      return 'institutional';
    case 'company':
      return 'enterprise';
    default:
      return 'individual';
  }
};

export const getRoleRedirectPath = (role: UserRole): string => {
  switch (role) {
    case 'student':
      return '/dashboard/student';
    case 'employee':
      return '/dashboard/employee';
    case 'university':
      return '/dashboard/university';
    case 'company':
      return '/dashboard/company';
    default:
      return '/dashboard';
  }
};
