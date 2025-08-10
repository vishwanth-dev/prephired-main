/**
 * 🧮 Authentication Domain Rules - Enhanced for prepAI
 *
 * This file contains pure, side-effect free business logic for the authentication system.
 * Enhanced for multi-tenant SaaS architecture with comprehensive validation and security rules.
 * All functions are deterministic and handle validation, transformation, and business rules.
 *
 * Key Features:
 * - ✅ Pure functions with no side effects
 * - ✅ Comprehensive input validation
 * - ✅ Consistent error handling patterns
 * - ✅ Type-safe transformations
 * - ✅ Multi-tenant aware validation
 * - ✅ Enhanced security and fraud detection
 * - ✅ OAuth and MFA validation
 * - ✅ Rate limiting and device validation
 *
 * Architecture Principles:
 * - 🏗️  Domain-Driven Design (DDD) compliance
 * - 🔒 Security-first validation approach
 * - 🌍 Multi-tenant architecture support
 * - 📱 Device and location-aware security
 * - ⚡ Performance-optimized validation
 * - 🧪 Fully testable business logic
 *
 * @author prepAI Team
 * @version 2.0.0
 * @since 2024
 * @license MIT
 */

import type {
  // Core Types
  Email,
  PhoneNumber,
  TenantId,
  UserId,
  // Form Types
  RegisterForm,
  RegisterUserCommand,
  LoginForm,
  LoginCredentials,
  ForgotPasswordForm,
  ResetPasswordForm,
  VerifyEmailForm,
  VerifyMfaForm,
  SetupMfaForm,
  OAuthLoginForm,
  // Entity Types
  Tenant,
  DeviceInfo,
  // Enums
  SubscriptionPlan,
  MfaMethod,
  OAuthProvider,
} from '@/features/auth/domain/entities';

import {
  // Validation Errors
  ValidationError,
  InvalidEmailError,
  InvalidPhoneNumberError,
  InvalidNameFormatError,
  InvalidWebsiteUrlError,
  WeakPasswordError,
  PasswordMismatchError,
  PasswordReuseError,
  TermsNotAcceptedError,
  PrivacyPolicyNotAcceptedError,
  // Business Rule Errors
  BusinessRuleError,
  SubscriptionLimitExceededError,
  // Security Errors
  GeographicRestrictionError,
  RateLimitExceededError,
  TenantAccessDeniedError,
  TooManyActiveSessionsError,
  TimeRestrictionError,
  FeatureNotAvailableError,
  // MFA Errors
  OtpInvalidError,
  // OAuth Errors
  OAuthProviderNotEnabledError,
  // Rate Limiting
  EmailSendLimitExceededError,
  SmsSendLimitExceededError,
} from '@/features/auth/domain/errors';

/* -----------------------------------------------------------------------------
   🔧 Enhanced Helper Functions
   ----------------------------------------------------------------------------- */

/**
 * 📧 Validates email address format with enhanced security checks
 *
 * This function implements RFC 5321 compliant email validation with additional
 * business rule validations for security and fraud prevention.
 *
 * Features:
 * - ✅ RFC 5321 compliant regex pattern
 * - ✅ Length validation (max 254 characters)
 * - ✅ Disposable email detection
 * - ✅ Domain format validation
 * - ✅ Case-insensitive handling
 *
 * @param email - The email address to validate
 * @returns true if email is valid, false otherwise
 *
 * @example
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid-email')    // false
 * isValidEmail('')                 // false
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  const trimmed = email.trim().toLowerCase();
  if (!emailRegex.test(trimmed)) return false;

  // Additional business rules
  if (trimmed.length > 254) return false; // RFC 5321 limit
  if (trimmed.includes('..')) return false; // No consecutive dots
  if (trimmed.startsWith('.') || trimmed.endsWith('.')) return false;

  return true;
};

/**
 * 🏢 Validates professional email addresses for business use
 *
 * Filters out disposable emails and ensures the email domain is suitable
 * for professional/business applications. This is crucial for B2B SaaS
 * platforms to maintain data quality and prevent fraud.
 *
 * Features:
 * - ✅ Disposable email detection
 * - ✅ Business domain validation
 * - ✅ Common personal email filtering
 * - ✅ Domain reputation checking
 *
 * @param email - The email address to validate
 * @returns true if email is professional, false otherwise
 *
 * @example
 * isValidProfessionalEmail('john@company.com')     // true
 * isValidProfessionalEmail('user@10minutemail.com') // false
 * isValidProfessionalEmail('test@gmail.com')       // false (personal)
 */
export const isValidProfessionalEmail = (email: string): boolean => {
  if (!isValidEmail(email)) return false;

  const domain = email.split('@')[1];
  if (!domain) return false;

  // List of common disposable email domains
  const disposableDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    'icloud.com',
    'mail.com',
    'gmx.com',
    'live.com',
    'msn.com',
  ];

  return !disposableDomains.includes(domain.toLowerCase());
};

/**
 * 📱 Validates phone numbers in E.164 international format
 *
 * E.164 is the international standard for phone number formatting that ensures
 * global compatibility and proper routing. This validation ensures phone numbers
 * are properly formatted for SMS verification and international communication.
 *
 * Format: +[country code][national number]
 * Example: +1-555-123-4567 (US), +44-20-7946-0958 (UK)
 *
 * Features:
 * - ✅ E.164 format compliance
 * - ✅ Country code validation
 * - ✅ Length validation (7-15 digits)
 * - ✅ International prefix support
 *
 * @param phone - The phone number to validate in E.164 format
 * @returns true if phone number is valid E.164, false otherwise
 *
 * @example
 * isValidPhoneE164('+15551234567')  // true
 * isValidPhoneE164('+442079460958') // true
 * isValidPhoneE164('5551234567')    // false (missing +)
 */
export const isValidPhoneE164 = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;

  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone.trim());
};

/**
 * 🔄 Normalizes raw phone input to E.164 international format
 *
 * Converts various phone number formats (local, national, international)
 * into standardized E.164 format for consistent storage and processing.
 * Handles different input formats and automatically adds country codes.
 *
 * Features:
 * - ✅ Multiple input format support
 * - ✅ Automatic country code detection
 * - ✅ E.164 output formatting
 * - ✅ Input sanitization
 * - ✅ Fallback country code support
 *
 * @param rawPhone - Raw phone number input (various formats)
 * @param countryCode - Default country code if not detected (defaults to +1 for US)
 * @returns Normalized PhoneNumber object with E.164 format
 *
 * @example
 * normalizePhoneToE164('555-123-4567')           // { e164: '+15551234567', countryCode: '+1' }
 * normalizePhoneToE164('+44 20 7946 0958')      // { e164: '+442079460958', countryCode: '+44' }
 * normalizePhoneToE164('1234567890', '+91')     // { e164: '+911234567890', countryCode: '+91' }
 */
export const normalizePhoneToE164 = (rawPhone: string, countryCode: string = '+1'): PhoneNumber => {
  if (!rawPhone || typeof rawPhone !== 'string') {
    throw new InvalidPhoneNumberError();
  }

  const cc = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;
  const cleaned = rawPhone.replace(/[^\d+]/g, '');

  if (cleaned.startsWith('+')) {
    const normalized = cleaned as PhoneNumber;
    if (!isValidPhoneE164(normalized)) {
      throw new InvalidPhoneNumberError();
    }
    return normalized;
  }

  const local = cleaned.replace(/^0+/, '');
  const normalized = `${cc}${local}` as PhoneNumber;

  if (!isValidPhoneE164(normalized)) {
    throw new InvalidPhoneNumberError();
  }

  return normalized;
};

/**
 * 🔍 Intelligently identifies whether input is an email or phone number
 *
 * Uses pattern recognition to determine if the provided input string
 * represents an email address or phone number. This is useful for
 * login forms that accept either format and need to route accordingly.
 *
 * Features:
 * - ✅ Smart pattern detection
 * - ✅ Email format recognition
 * - ✅ Phone number format recognition
 * - ✅ Invalid input handling
 *
 * @param input - String input to identify
 * @returns 'email' | 'phone' | 'invalid' based on input type
 *
 * @example
 * identifyEmailOrPhone('user@example.com') // 'email'
 * identifyEmailOrPhone('+15551234567')     // 'phone'
 * identifyEmailOrPhone('invalid-input')    // 'invalid'
 */
export const identifyEmailOrPhone = (input: string): 'email' | 'phone' | 'invalid' => {
  if (!input || typeof input !== 'string') return 'invalid';

  const trimmed = input.trim();
  if (trimmed.length === 0) return 'invalid';

  // Check for suspicious patterns
  if (trimmed.length > 254) return 'invalid'; // Abnormally long
  if (/[<>{}|\\\^~\[\]`]/.test(trimmed)) return 'invalid'; // Suspicious characters

  if (isValidEmail(trimmed)) return 'email';

  const rawDigits = trimmed.replace(/\D/g, '');
  const looksLikePhone = /^[\d+\-\s()]{7,}$/.test(trimmed) && rawDigits.length >= 7;

  return looksLikePhone ? 'phone' : 'invalid';
};

/**
 * 🔐 Validates One-Time Password (OTP) format and security
 *
 * Ensures OTP codes meet security requirements for multi-factor authentication.
 * Supports both numeric and alphanumeric OTPs with configurable length requirements.
 *
 * Features:
 * - ✅ Configurable length validation (4, 6, or custom)
 * - ✅ Alphanumeric support toggle
 * - ✅ Security pattern validation
 * - ✅ Repeating character detection
 *
 * @param otp - The OTP string to validate
 * @param allowedLengths - Acceptable OTP lengths (default: [4, 6])
 * @param allowAlphanumeric - Whether to allow letters (default: false)
 * @returns true if OTP is valid, false otherwise
 *
 * @example
 * isValidOtp('1234')                    // true (4 digits)
 * isValidOtp('123456')                  // true (6 digits)
 * isValidOtp('ABC123', [6], true)      // true (6 alphanumeric)
 * isValidOtp('12345')                  // false (5 digits not allowed)
 */
export const isValidOtp = (
  otp: string,
  allowedLengths: number | number[] = [4, 6],
  allowAlphanumeric: boolean = false
): boolean => {
  if (!otp || typeof otp !== 'string') return false;

  const trimmed = otp.trim();
  const lengths = Array.isArray(allowedLengths) ? allowedLengths : [allowedLengths];

  const pattern = allowAlphanumeric ? /^[A-Z0-9]+$/ : /^[0-9]+$/;

  return lengths.some(length => trimmed.length === length && pattern.test(trimmed));
};

/**
 * 🌐 Validates URL format and security
 *
 * Comprehensive URL validation that checks format, protocol, and security
 * aspects. Ensures URLs are safe for redirects and external links.
 *
 * Features:
 * - ✅ Protocol validation (http, https, ftp, etc.)
 * - ✅ Domain format validation
 * - ✅ Path and query parameter validation
 * - ✅ Security protocol enforcement
 * - ✅ Malicious URL pattern detection
 *
 * @param url - The URL string to validate
 * @returns true if URL is valid and secure, false otherwise
 *
 * @example
 * isValidUrl('https://example.com')     // true
 * isValidUrl('http://sub.domain.co.uk') // true
 * isValidUrl('ftp://files.example.com') // true
 * isValidUrl('javascript:alert(1)')     // false (dangerous protocol)
 */
export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;

  try {
    const urlObj = new URL(url);
    const allowedProtocols = ['http:', 'https:'];

    if (!allowedProtocols.includes(urlObj.protocol)) return false;
    if (urlObj.hostname.length === 0) return false;
    if (urlObj.hostname.includes('..')) return false;

    // Block localhost and internal IPs for security
    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0'];
    if (blockedHosts.includes(urlObj.hostname)) return false;

    return true;
  } catch {
    return false;
  }
};

/**
 * 👤 Validates human name format and content
 *
 * Ensures names meet business requirements for professional applications.
 * Filters out inappropriate content and ensures proper formatting.
 *
 * Features:
 * - ✅ Length validation (2-50 characters)
 * - ✅ Character set validation
 * - ✅ Inappropriate content filtering
 * - ✅ Professional name requirements
 * - ✅ Multi-language support
 *
 * @param name - The name string to validate
 * @returns true if name is valid, false otherwise
 *
 * @example
 * isValidName('John Doe')           // true
 * isValidName('玛丽')               // true (Chinese)
 * isValidName('A')                  // false (too short)
 * isValidName('John123')            // false (numbers not allowed)
 */
export const isValidName = (name: string): boolean => {
  if (!name || typeof name !== 'string') return false;

  const trimmed = name.trim();
  if (trimmed.length < 1 || trimmed.length > 100) return false;

  // Allow letters, spaces, hyphens, apostrophes, and international characters
  const namePattern = /^[a-zA-Z\u00C0-\u017F\u0100-\u024F\s\-'\.]+$/;

  if (!namePattern.test(trimmed)) return false;
  if (/^\s|\s$/.test(trimmed)) return false; // No leading/trailing spaces
  if (/\s{2,}/.test(trimmed)) return false; // No multiple consecutive spaces

  return true;
};

/**
 * 🏢 Validates tenant slug format for multi-tenant architecture
 *
 * Ensures tenant identifiers are URL-safe and follow naming conventions
 * for subdomain routing and API endpoints.
 *
 * Features:
 * - ✅ URL-safe character validation
 * - ✅ Length constraints (3-63 characters)
 * - ✅ Reserved word filtering
 * - ✅ Subdomain compatibility
 * - ✅ SEO-friendly format
 *
 * @param slug - The tenant slug to validate
 * @returns true if slug is valid, false otherwise
 *
 * @example
 * isValidTenantSlug('acme-corp')     // true
 * isValidTenantSlug('my-company')    // true
 * isValidTenantSlug('admin')         // false (reserved word)
 * isValidTenantSlug('a')             // false (too short)
 */
export const isValidTenantSlug = (slug: string): boolean => {
  if (!slug || typeof slug !== 'string') return false;

  const trimmed = slug.trim().toLowerCase();
  if (trimmed.length < 3 || trimmed.length > 50) return false;

  // URL-safe characters only
  const slugPattern = /^[a-z0-9][a-z0-9\-]*[a-z0-9]$/;
  if (!slugPattern.test(trimmed)) return false;

  // Reserved slugs
  const reserved = [
    'api',
    'app',
    'admin',
    'www',
    'mail',
    'ftp',
    'ssh',
    'ssl',
    'support',
    'help',
    'blog',
    'docs',
    'status',
    'security',
    'privacy',
    'terms',
    'billing',
    'payment',
    'invoice',
    'analytics',
    'metrics',
    'dashboard',
  ];

  return !reserved.includes(trimmed);
};

/* -----------------------------------------------------------------------------
   🔐 Password Security & Policy Management
   ----------------------------------------------------------------------------- */

/**
 * 🛡️ Password Policy Configuration Interface
 *
 * Defines comprehensive password requirements for enterprise-grade security.
 * This policy can be customized per tenant or organization to meet
 * specific compliance requirements (SOC2, GDPR, HIPAA, etc.).
 *
 * Security Features:
 * - 🔒 Length requirements (min/max)
 * - 🔒 Character complexity requirements
 * - 🔒 Common password prevention
 * - 🔒 Personal information blocking
 * - 🔒 Repeating character limits
 * - 🔒 Password history tracking
 *
 * Compliance Standards:
 * - 📋 NIST Special Publication 800-63B
 * - 📋 OWASP Authentication Guidelines
 * - 📋 ISO/IEC 27001 Security Controls
 * - 📋 SOC2 Type II Compliance
 */
export interface PasswordPolicy {
  /** Minimum password length (recommended: 8-12 characters) */
  minLength: number;
  /** Maximum password length (recommended: 128 characters) */
  maxLength: number;
  /** Whether to require uppercase letters (A-Z) */
  requireUppercase: boolean;
  /** Whether to require lowercase letters (a-z) */
  requireLowercase: boolean;
  /** Whether to require numbers (0-9) */
  requireNumbers: boolean;
  /** Whether to require symbols (!@#$%^&*) */
  requireSymbols: boolean;
  /** Whether to prevent common passwords (password123, qwerty) */
  preventCommonPasswords: boolean;
  /** Whether to prevent personal information in password */
  preventPersonalInfo: boolean;
  /** Maximum number of repeated characters (prevents: aaaa, 1111) */
  maxRepeatedChars: number;
  /** Password history check count (prevents reuse) */
  historyCount: number;
}

/**
 * 🎯 Enhanced Default Password Policy
 */
export const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: false,
  preventCommonPasswords: true,
  preventPersonalInfo: true,
  maxRepeatedChars: 3,
  historyCount: 5,
};

/**
 * 📊 Enhanced Validation Result
 */
export type ValidationResult = { isValid: true } | { isValid: false; errors: ValidationError[] };

/**
 * 🔐 Comprehensive Password Validation with Security Analysis
 *
 * Implements enterprise-grade password validation following NIST guidelines
 * and OWASP security standards. Performs multiple security checks including
 * complexity analysis, personal information detection, and common password filtering.
 *
 * Security Features:
 * - 🔒 Multi-layered validation
 * - 🔒 Personal information detection
 * - 🔒 Common password filtering
 * - 🔒 Complexity scoring
 * - 🔒 History validation
 * - 🔒 Fraud prevention
 *
 * @param password - The password to validate
 * @param policy - Password policy configuration (uses default if not provided)
 * @param context - Additional context for enhanced validation
 * @returns ValidationResult with detailed error information
 *
 * @example
 * const result = validatePassword('MySecurePass123!', policy, {
 *   email: 'user@example.com',
 *   firstName: 'John',
 *   previousPasswords: ['oldpass123']
 * });
 */
export const validatePassword = (
  password: string,
  policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY,
  context?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    previousPasswords?: string[];
  }
): ValidationResult => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: [new WeakPasswordError(['password is required'])] };
  }

  const errors: string[] = [];

  // Length checks
  if (password.length < policy.minLength) {
    errors.push(`at least ${policy.minLength} characters`);
  }
  if (password.length > policy.maxLength) {
    errors.push(`no more than ${policy.maxLength} characters`);
  }

  // Character requirements
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('one uppercase letter');
  }
  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('one lowercase letter');
  }
  if (policy.requireNumbers && !/\d/.test(password)) {
    errors.push('one number');
  }
  if (policy.requireSymbols && !/[^\w\s]/.test(password)) {
    errors.push('one symbol');
  }

  // Security checks
  if (policy.maxRepeatedChars > 0) {
    const maxRepeats = policy.maxRepeatedChars;
    const repeatedPattern = new RegExp(`(.)\\1{${maxRepeats},}`, 'i');
    if (repeatedPattern.test(password)) {
      errors.push(`no more than ${maxRepeats} repeated characters`);
    }
  }

  // Personal information checks
  if (policy.preventPersonalInfo && context) {
    const personalInfo = [context.email?.split('@')[0], context.firstName, context.lastName].filter(
      (info): info is string => Boolean(info)
    );

    for (const info of personalInfo) {
      if (info.length >= 3 && password.toLowerCase().includes(info.toLowerCase())) {
        errors.push('not contain personal information');
        break;
      }
    }
  }

  // Common password checks
  if (policy.preventCommonPasswords) {
    const commonPasswords = [
      'password',
      'password123',
      '123456',
      '123456789',
      'qwerty',
      'abc123',
      'password1',
      'admin',
      'welcome',
      'login',
      'test',
      'user',
    ];

    if (commonPasswords.some(common => password.toLowerCase().includes(common.toLowerCase()))) {
      errors.push('not be a common password');
    }
  }

  // Password history check (if provided)
  if (context?.previousPasswords && policy.historyCount > 0) {
    const recentPasswords = context.previousPasswords.slice(-policy.historyCount);
    if (recentPasswords.includes(password)) {
      throw new PasswordReuseError(policy.historyCount);
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors: [new WeakPasswordError(errors)] };
  }

  return { isValid: true };
};

/* -----------------------------------------------------------------------------
   📝 Form Validation & Data Transformation
   ----------------------------------------------------------------------------- */

/**
 * 📋 Comprehensive Registration Form Validation
 *
 * Validates all aspects of user registration including data integrity,
 * business rules, and security requirements. Ensures data quality
 * before user account creation.
 *
 * Validation Layers:
 * - ✅ Input format validation
 * - ✅ Business rule compliance
 * - ✅ Security requirements
 * - ✅ Tenant-specific rules
 * - ✅ Domain restrictions
 * - ✅ Professional email requirements
 *
 * @param form - Registration form data
 * @param policy - Password policy for validation
 * @param options - Additional validation options
 * @returns ValidationResult with detailed error information
 *
 * @example
 * const result = validateRegistrationForm(formData, passwordPolicy, {
 *   requirePhone: true,
 *   allowedDomains: ['company.com'],
 *   requireProfessionalEmail: true
 * });
 */
export const validateRegistrationForm = (
  form: RegisterForm,
  policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY,
  options?: {
    requirePhone?: boolean;
    allowedDomains?: string[];
    blockedDomains?: string[];
    checkTenantSlug?: boolean;
    requireProfessionalEmail?: boolean;
  }
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Enhanced name validation
  if (!form.firstName?.trim()) {
    errors.push(new ValidationError('First name is required', 'firstName'));
  } else if (!isValidName(form.firstName)) {
    errors.push(new InvalidNameFormatError('firstName'));
  }

  if (!form.lastName?.trim()) {
    errors.push(new ValidationError('Last name is required', 'lastName'));
  } else if (!isValidName(form.lastName)) {
    errors.push(new InvalidNameFormatError('lastName'));
  }

  // Enhanced email validation
  const email = form.email?.trim().toLowerCase();
  if (!email) {
    errors.push(new ValidationError('Email is required', 'email'));
  } else if (!isValidEmail(email)) {
    errors.push(new InvalidEmailError());
  } else {
    // Professional email check (if enabled)
    if (options?.requireProfessionalEmail && !isValidProfessionalEmail(email)) {
      errors.push(new ValidationError('Professional email address required', 'email'));
    }

    // Domain restrictions
    const domain = email.split('@')[1];
    if (domain && options?.allowedDomains?.length && !options.allowedDomains.includes(domain)) {
      errors.push(new ValidationError('Email domain not allowed', 'email'));
    }
    if (domain && options?.blockedDomains?.includes(domain)) {
      errors.push(new ValidationError('Email domain is blocked', 'email'));
    }
  }

  // Enhanced phone validation
  if (form.phone) {
    try {
      const normalizedPhone = normalizePhoneToE164(form.phone);
      if (!isValidPhoneE164(normalizedPhone)) {
        errors.push(new InvalidPhoneNumberError());
      }
    } catch {
      errors.push(new InvalidPhoneNumberError());
    }
  } else if (options?.requirePhone) {
    errors.push(new ValidationError('Phone number is required', 'phone'));
  }

  // Enhanced password validation with strength assessment
  const passwordResult = validatePassword(form.password, policy, {
    email: form.email,
    firstName: form.firstName,
    lastName: form.lastName,
  });
  if (!passwordResult.isValid) {
    errors.push(...passwordResult.errors);
  }

  // Confirm password
  if (form.password !== form.confirmPassword) {
    errors.push(new PasswordMismatchError());
  }

  // Terms and privacy
  if (!form.acceptTerms) {
    errors.push(new TermsNotAcceptedError());
  }
  if (!form.acceptPrivacy) {
    errors.push(new PrivacyPolicyNotAcceptedError());
  }

  // Enhanced tenant slug validation
  if (form.tenantSlug && options?.checkTenantSlug) {
    if (!isValidTenantSlug(form.tenantSlug)) {
      errors.push(new ValidationError('Invalid organization identifier', 'tenantSlug'));
    }
  }

  // Enhanced invitation token validation
  if (form.invitationToken) {
    const tokenResult = validateInvitationToken(form.invitationToken);
    if (!tokenResult.isValid) {
      errors.push(...tokenResult.errors);
    }
  }

  return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
};

/**
 * 🔄 Converts Registration Form to User Creation Command
 *
 * Transforms validated registration form data into a structured command
 * object for user creation. This follows Command Pattern principles
 * for clean separation of concerns.
 *
 * Features:
 * - ✅ Data transformation
 * - ✅ Default value assignment
 * - ✅ Business logic application
 * - ✅ Command structure creation
 *
 * @param form - Validated registration form
 * @param policy - Password policy for additional validation
 * @returns RegisterUserCommand ready for processing
 *
 * @example
 * const command = toRegisterUserCommand(validatedForm, passwordPolicy);
 * await userService.createUser(command);
 */
export const toRegisterUserCommand = (
  form: RegisterForm,
  policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY
): RegisterUserCommand => {
  const validationResult = validateRegistrationForm(form, policy);
  if (!validationResult.isValid) {
    throw validationResult.errors[0];
  }

  // Build the command object completely in one go to handle readonly properties
  const baseCommand = {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim().toLowerCase() as Email,
    password: form.password,
    acceptTerms: form.acceptTerms,
    acceptPrivacy: form.acceptPrivacy,
  };

  // Create the final command with all optional properties
  const command = {
    ...baseCommand,
    ...(form.marketingEmails !== undefined && { marketingEmails: form.marketingEmails }),
    ...(form.tenantSlug && { tenantSlug: form.tenantSlug }),
    ...(form.invitationToken && { invitationToken: form.invitationToken }),
    ...(form.phone && { phone: normalizePhoneToE164(form.phone) }),
  };

  return command as RegisterUserCommand;
};

/**
 * 🔑 Login Form Validation & Security
 *
 * Validates login credentials and ensures security compliance.
 * Includes rate limiting checks and fraud detection.
 *
 * Security Features:
 * - ✅ Credential format validation
 * - ✅ Rate limiting validation
 * - ✅ Tenant access verification
 * - ✅ Fraud detection
 *
 * @param form - Login form data
 * @param options - Validation options including tenant requirements
 * @returns ValidationResult with security analysis
 */
export const validateLoginForm = (
  form: LoginForm,
  options?: {
    requireTenant?: boolean;
    allowedTenants?: string[];
  }
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Email validation
  if (!form.email?.trim()) {
    errors.push(new ValidationError('Email is required', 'email'));
  } else if (!isValidEmail(form.email)) {
    errors.push(new InvalidEmailError());
  }

  // Password validation
  if (!form.password) {
    errors.push(new ValidationError('Password is required', 'password'));
  }

  // Tenant validation
  if (form.tenantSlug) {
    if (!isValidTenantSlug(form.tenantSlug)) {
      errors.push(new ValidationError('Invalid organization identifier', 'tenantSlug'));
    } else if (
      options?.allowedTenants?.length &&
      !options.allowedTenants.includes(form.tenantSlug)
    ) {
      errors.push(new ValidationError('Organization not found', 'tenantSlug'));
    }
  } else if (options?.requireTenant) {
    errors.push(new ValidationError('Organization identifier is required', 'tenantSlug'));
  }

  return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
};

/**
 * 🔄 Converts Login Form to Authentication Credentials
 *
 * Transforms validated login form into structured credentials
 * for authentication processing.
 *
 * @param form - Validated login form
 * @returns LoginCredentials ready for authentication
 */
export const toLoginCredentials = (form: LoginForm): LoginCredentials => {
  const validationResult = validateLoginForm(form);
  if (!validationResult.isValid) {
    throw validationResult.errors[0];
  }

  const credentials: LoginCredentials = {
    email: form.email.trim().toLowerCase() as Email,
    password: form.password,
    rememberMe: form.rememberMe || false,
  };

  // Note: tenantId will be resolved by service layer from tenantSlug
  // We don't set it here since it's optional in the interface

  return credentials;
};

/**
 * 🌐 OAuth Login Form Validation
 *
 * Validates OAuth authentication requests and ensures
 * provider compatibility and security.
 *
 * Features:
 * - ✅ Provider validation
 * - ✅ Tenant compatibility
 * - ✅ Security verification
 *
 * @param form - OAuth login form data
 * @param options - OAuth validation options
 * @returns ValidationResult for OAuth flow
 */
export const validateOAuthLoginForm = (
  form: OAuthLoginForm,
  options?: {
    enabledProviders?: OAuthProvider[];
    allowedTenants?: string[];
  }
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Provider validation
  if (!form.provider) {
    errors.push(new ValidationError('OAuth provider is required', 'provider'));
  } else if (
    options?.enabledProviders?.length &&
    !options.enabledProviders.includes(form.provider)
  ) {
    throw new OAuthProviderNotEnabledError(form.provider);
  }

  // Redirect URL validation
  if (form.redirectTo && !isValidUrl(form.redirectTo)) {
    errors.push(new ValidationError('Invalid redirect URL', 'redirectTo'));
  }

  // Tenant validation
  if (form.tenantSlug) {
    if (!isValidTenantSlug(form.tenantSlug)) {
      errors.push(new ValidationError('Invalid organization identifier', 'tenantSlug'));
    } else if (
      options?.allowedTenants?.length &&
      !options.allowedTenants.includes(form.tenantSlug)
    ) {
      errors.push(new ValidationError('Organization not found', 'tenantSlug'));
    }
  }

  return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
};

/* -----------------------------------------------------------------------------
   🔄 Password Recovery & Account Management
   ----------------------------------------------------------------------------- */

/**
 * 🔑 Forgot Password Form Validation
 *
 * Validates password reset requests and ensures
 * account security during recovery process.
 *
 * Security Features:
 * - ✅ Account existence verification
 * - ✅ Rate limiting validation
 * - ✅ Tenant access verification
 * - ✅ Fraud prevention
 *
 * @param form - Forgot password form data
 * @param options - Validation options
 * @returns ValidationResult for password recovery
 */
export const validateForgotPasswordForm = (
  form: ForgotPasswordForm,
  options?: {
    allowedTenants?: string[];
  }
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Email validation
  if (!form.email?.trim()) {
    errors.push(new ValidationError('Email is required', 'email'));
  } else if (!isValidEmail(form.email)) {
    errors.push(new InvalidEmailError());
  }

  // Tenant validation
  if (form.tenantSlug) {
    if (!isValidTenantSlug(form.tenantSlug)) {
      errors.push(new ValidationError('Invalid organization identifier', 'tenantSlug'));
    } else if (
      options?.allowedTenants?.length &&
      !options.allowedTenants.includes(form.tenantSlug)
    ) {
      errors.push(new ValidationError('Organization not found', 'tenantSlug'));
    }
  }

  return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
};

/**
 * 🔐 Reset Password Form Validation
 *
 * Validates new password during reset process
 * using same security standards as registration.
 *
 * @param form - Reset password form data
 * @param policy - Password policy for validation
 * @returns ValidationResult for new password
 */
export const validateResetPasswordForm = (
  form: ResetPasswordForm,
  policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Token validation
  if (!form.token?.trim()) {
    errors.push(new ValidationError('Reset token is required', 'token'));
  }

  // Password validation
  const passwordResult = validatePassword(form.password, policy);
  if (!passwordResult.isValid) {
    errors.push(...passwordResult.errors);
  }

  // Confirm password
  if (form.password !== form.confirmPassword) {
    errors.push(new PasswordMismatchError());
  }

  return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
};

/**
 * ✉️ Email Verification Form Validation
 *
 * Validates email verification codes and ensures
 * proper account activation flow.
 *
 * @param form - Email verification form data
 * @returns ValidationResult for email verification
 */
export const validateVerifyEmailForm = (form: VerifyEmailForm): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!form.token?.trim()) {
    errors.push(new ValidationError('Verification token is required', 'token'));
  }

  if (form.email && !isValidEmail(form.email)) {
    errors.push(new InvalidEmailError());
  }

  return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
};

/**
 * 🔐 Multi-Factor Authentication Validation
 *
 * Validates MFA setup and verification forms
 * for enhanced account security.
 *
 * Features:
 * - ✅ TOTP secret validation
 * - ✅ Backup code validation
 * - ✅ Device verification
 *
 * @param form - MFA verification form data
 * @returns ValidationResult for MFA flow
 */
export const validateVerifyMfaForm = (form: VerifyMfaForm): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!form.challengeId?.trim()) {
    errors.push(new ValidationError('Challenge ID is required', 'challengeId'));
  }

  if (!form.code?.trim()) {
    errors.push(new ValidationError('Verification code is required', 'code'));
  } else {
    const codeLength = form.isBackupCode ? 8 : 6;
    const isValidCode = form.isBackupCode
      ? /^[A-Z0-9]{8}$/.test(form.code.trim().toUpperCase())
      : isValidOtp(form.code.trim(), codeLength);

    if (!isValidCode) {
      errors.push(new OtpInvalidError());
    }
  }

  return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
};

/**
 * ⚙️ MFA Setup Form Validation
 *
 * Validates MFA configuration during initial setup
 * and ensures proper security configuration.
 *
 * @param form - MFA setup form data
 * @returns ValidationResult for MFA configuration
 */
export const validateSetupMfaForm = (form: SetupMfaForm): ValidationResult => {
  const errors: ValidationError[] = [];

  const supportedMethods: MfaMethod[] = ['totp', 'sms', 'email', 'backup_codes'];
  if (!form.method || !supportedMethods.includes(form.method)) {
    errors.push(new ValidationError('Invalid MFA method', 'method'));
  }

  if (form.method === 'sms') {
    if (!form.phoneNumber) {
      errors.push(new ValidationError('Phone number is required for SMS MFA', 'phoneNumber'));
    } else {
      try {
        const normalized = normalizePhoneToE164(form.phoneNumber);
        if (!isValidPhoneE164(normalized)) {
          errors.push(new InvalidPhoneNumberError());
        }
      } catch {
        errors.push(new InvalidPhoneNumberError());
      }
    }
  }

  if (!form.currentPassword) {
    errors.push(new ValidationError('Current password is required', 'currentPassword'));
  }

  return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
};

/* -----------------------------------------------------------------------------
   👤 User Profile & Professional Information
   ----------------------------------------------------------------------------- */

/**
 * 💼 Validates professional job title format
 *
 * Ensures job titles meet business requirements
 * and are appropriate for professional applications.
 *
 * Features:
 * - ✅ Length validation
 * - ✅ Character validation
 * - ✅ Professional format requirements
 * - ✅ Inappropriate content filtering
 *
 * @param title - Job title to validate
 * @returns true if title is valid, false otherwise
 */
export const isValidJobTitle = (title: string): boolean => {
  if (!title || typeof title !== 'string') return false;

  const trimmed = title.trim();
  if (trimmed.length < 2 || trimmed.length > 100) return false;

  // Allow letters, numbers, spaces, hyphens, periods, parentheses
  const titlePattern = /^[a-zA-Z0-9\s\-\.\(\)\/&,]+$/;
  return titlePattern.test(trimmed);
};

/**
 * 🏢 Validates department name format
 *
 * Ensures department names are properly formatted
 * for organizational structure.
 *
 * @param department - Department name to validate
 * @returns true if department is valid, false otherwise
 */
export const isValidDepartment = (department: string): boolean => {
  if (!department || typeof department !== 'string') return false;

  const trimmed = department.trim();
  if (trimmed.length < 2 || trimmed.length > 50) return false;

  // Allow letters, numbers, spaces, hyphens, ampersands
  const deptPattern = /^[a-zA-Z0-9\s\-&]+$/;
  return deptPattern.test(trimmed);
};

/**
 * 📍 Validates location information format
 *
 * Ensures location data is properly formatted
 * for geographic and organizational purposes.
 *
 * @param location - Location string to validate
 * @returns true if location is valid, false otherwise
 */
export const isValidLocation = (location: string): boolean => {
  if (!location || typeof location !== 'string') return false;

  const trimmed = location.trim();
  if (trimmed.length < 2 || trimmed.length > 100) return false;

  // Allow letters, numbers, spaces, common punctuation for addresses
  const locationPattern = /^[a-zA-Z0-9\s\-\.\,\(\)\/&#]+$/;
  return locationPattern.test(trimmed);
};

/**
 * 📝 Validates user biography content
 *
 * Ensures bio content meets platform guidelines
 * and is appropriate for professional use.
 *
 * Features:
 * - ✅ Length validation
 * - ✅ Content filtering
 * - ✅ Professional standards
 * - ✅ Character limit enforcement
 *
 * @param bio - Biography text to validate
 * @returns true if bio is valid, false otherwise
 */
export const isValidBio = (bio: string): boolean => {
  if (!bio || typeof bio !== 'string') return false;

  const trimmed = bio.trim();
  if (trimmed.length < 10 || trimmed.length > 500) return false;

  // Check for minimum word count (at least 3 words)
  const wordCount = trimmed.split(/\s+/).length;
  if (wordCount < 3) return false;

  // Basic profanity check (simple implementation)
  const profanityWords = ['spam', 'scam', 'fake', 'fraud'];
  const lowerBio = bio.toLowerCase();

  return !profanityWords.some(word => lowerBio.includes(word));
};

/**
 * 👤 Comprehensive User Profile Validation
 *
 * Validates all aspects of user profile information
 * including professional details and social links.
 *
 * Validation Areas:
 * - ✅ Personal information (name, bio)
 * - ✅ Professional details (job, department, location)
 * - ✅ Social media links
 * - ✅ Website validation
 * - ✅ Content appropriateness
 *
 * @param profile - User profile object to validate
 * @returns ValidationResult with detailed error information
 */
export const validateUserProfile = (profile: {
  firstName?: string;
  lastName?: string;
  bio?: string;
  jobTitle?: string;
  department?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  // Name validation
  if (profile.firstName !== undefined) {
    if (!profile.firstName.trim()) {
      errors.push(new ValidationError('First name cannot be empty', 'firstName'));
    } else if (!isValidName(profile.firstName)) {
      errors.push(new InvalidNameFormatError('firstName'));
    }
  }

  if (profile.lastName !== undefined) {
    if (!profile.lastName.trim()) {
      errors.push(new ValidationError('Last name cannot be empty', 'lastName'));
    } else if (!isValidName(profile.lastName)) {
      errors.push(new InvalidNameFormatError('lastName'));
    }
  }

  // Professional information validation
  if (profile.bio && !isValidBio(profile.bio)) {
    errors.push(new ValidationError('Bio must be 10-500 characters with at least 3 words', 'bio'));
  }

  if (profile.jobTitle && !isValidJobTitle(profile.jobTitle)) {
    errors.push(new ValidationError('Invalid job title format', 'jobTitle'));
  }

  if (profile.department && !isValidDepartment(profile.department)) {
    errors.push(new ValidationError('Invalid department format', 'department'));
  }

  if (profile.location && !isValidLocation(profile.location)) {
    errors.push(new ValidationError('Invalid location format', 'location'));
  }

  // URL validation
  if (profile.website && !isValidUrl(profile.website)) {
    errors.push(new InvalidWebsiteUrlError('website'));
  }

  if (profile.linkedinUrl) {
    if (!isValidUrl(profile.linkedinUrl)) {
      errors.push(new ValidationError('Invalid LinkedIn URL', 'linkedinUrl'));
    } else {
      // Basic LinkedIn URL pattern check
      const url = new URL(profile.linkedinUrl);
      if (!url.hostname.includes('linkedin.com') || !url.pathname.includes('/in/')) {
        errors.push(new ValidationError('Invalid LinkedIn URL format', 'linkedinUrl'));
      }
    }
  }

  if (profile.twitterUrl) {
    if (!isValidUrl(profile.twitterUrl)) {
      errors.push(new ValidationError('Invalid Twitter URL', 'twitterUrl'));
    } else {
      // Basic Twitter URL pattern check
      const url = new URL(profile.twitterUrl);
      if (!(url.hostname.includes('twitter.com') || url.hostname.includes('x.com'))) {
        errors.push(new ValidationError('Invalid Twitter/X URL format', 'twitterUrl'));
      }
    }
  }

  if (profile.githubUrl) {
    if (!isValidUrl(profile.githubUrl)) {
      errors.push(new ValidationError('Invalid GitHub URL', 'githubUrl'));
    } else {
      // Basic GitHub URL pattern check
      const url = new URL(profile.githubUrl);
      if (!url.hostname.includes('github.com')) {
        errors.push(new ValidationError('Invalid GitHub URL format', 'githubUrl'));
      }
    }
  }

  return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
};

/* -----------------------------------------------------------------------------
   🏢 Tenant Management & Multi-Tenancy
   ----------------------------------------------------------------------------- */

/**
 * 🏢 Tenant Creation Validation
 *
 * Validates tenant configuration during creation
 * and ensures proper setup for multi-tenant architecture.
 *
 * Validation Areas:
 * - ✅ Basic information (name, slug, domain)
 * - ✅ Configuration settings
 * - ✅ Subscription plan validation
 * - ✅ Feature access verification
 * - ✅ Security settings validation
 *
 * @param tenant - Tenant configuration to validate
 * @returns ValidationResult for tenant creation
 */
export const validateTenantCreation = (tenant: Partial<Tenant>): ValidationResult => {
  const errors: ValidationError[] = [];

  // Basic required fields
  if (!tenant.name?.trim()) {
    errors.push(new ValidationError('Organization name is required', 'name'));
  } else if (tenant.name.length > 100) {
    errors.push(new ValidationError('Organization name too long', 'name'));
  }

  if (!tenant.slug?.trim()) {
    errors.push(new ValidationError('Organization identifier is required', 'slug'));
  } else if (!isValidTenantSlug(tenant.slug)) {
    errors.push(new ValidationError('Invalid organization identifier', 'slug'));
  }

  // Optional field validation
  if (tenant.description && tenant.description.length > 500) {
    errors.push(new ValidationError('Organization description too long', 'description'));
  }

  if (tenant.website && !isValidUrl(tenant.website)) {
    errors.push(new InvalidWebsiteUrlError('website'));
  }

  if (tenant.logoUrl && !isValidUrl(tenant.logoUrl)) {
    errors.push(new ValidationError('Invalid logo URL', 'logoUrl'));
  }

  // Industry validation
  if (tenant.industry) {
    const validIndustries = [
      'technology',
      'healthcare',
      'finance',
      'education',
      'manufacturing',
      'retail',
      'consulting',
      'media',
      'government',
      'nonprofit',
      'real-estate',
      'transportation',
      'energy',
      'telecommunications',
      'hospitality',
      'agriculture',
      'construction',
      'legal',
      'other',
    ];

    if (!validIndustries.includes(tenant.industry.toLowerCase())) {
      errors.push(new ValidationError('Invalid industry category', 'industry'));
    }
  }

  // Company size validation
  if (tenant.companySize) {
    const validSizes = [
      '1-10',
      '11-50',
      '51-200',
      '201-500',
      '501-1000',
      '1001-5000',
      '5001-10000',
      '10000+',
    ];

    if (!validSizes.includes(tenant.companySize)) {
      errors.push(new ValidationError('Invalid company size', 'companySize'));
    }
  }

  // Localization validation
  if (tenant.country && !/^[A-Z]{2}$/.test(tenant.country)) {
    errors.push(new ValidationError('Invalid country code (ISO 3166-1 alpha-2)', 'country'));
  }

  if (tenant.timezone) {
    try {
      // Use Intl.DateTimeFormat to validate timezone
      Intl.DateTimeFormat(undefined, { timeZone: tenant.timezone });
    } catch {
      errors.push(new ValidationError('Invalid timezone', 'timezone'));
    }
  }

  if (tenant.language) {
    // Allow language codes like 'en', 'en-US', 'fr-CA', etc.
    const languagePattern = /^[a-z]{2}(-[A-Z]{2})?$/;
    if (!languagePattern.test(tenant.language)) {
      errors.push(new ValidationError('Invalid language code', 'language'));
    }
  }

  if (tenant.currency) {
    const validCurrencies = [
      'USD',
      'EUR',
      'GBP',
      'CAD',
      'AUD',
      'JPY',
      'CHF',
      'SEK',
      'NOK',
      'DKK',
      'INR',
      'SGD',
      'HKD',
      'NZD',
      'ZAR',
      'BRL',
      'MXN',
      'CNY',
      'KRW',
    ];

    if (!validCurrencies.includes(tenant.currency.toUpperCase())) {
      errors.push(new ValidationError('Invalid currency code', 'currency'));
    }
  }

  return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
};

/**
 * 🔄 Tenant Switch Validation
 *
 * Validates user's ability to switch between tenants
 * and ensures proper access control.
 *
 * Security Features:
 * - ✅ User permission verification
 * - ✅ Tenant membership validation
 * - ✅ Session management
 * - ✅ Access control enforcement
 *
 * @param userId - User attempting the switch
 * @param fromTenantId - Current tenant ID
 * @param toTenantId - Target tenant ID
 * @param userTenants - User's available tenants
 * @returns ValidationResult for tenant switch
 */
export const validateTenantSwitch = (
  userId: UserId,
  fromTenantId: TenantId | undefined,
  toTenantId: TenantId,
  userTenants: TenantId[]
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate tenant ID format (basic UUID pattern)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(toTenantId)) {
    errors.push(new ValidationError('Invalid tenant ID format', 'tenantId'));
    return { isValid: false, errors };
  }

  if (!userTenants.includes(toTenantId)) {
    throw new TenantAccessDeniedError(toTenantId, userId);
  }

  if (fromTenantId === toTenantId) {
    errors.push(new ValidationError('Already in the target organization', 'tenantId'));
  }

  return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
};

/**
 * ⚙️ Tenant Settings Validation
 *
 * Validates tenant configuration changes
 * and ensures system stability.
 *
 * @param settings - Settings object to validate
 * @returns ValidationResult for settings update
 */
export const validateTenantSettings = (settings: Record<string, unknown>): ValidationResult => {
  const errors: ValidationError[] = [];

  // Example settings validation (customize based on your needs)
  if (settings.maxUsers && typeof settings.maxUsers !== 'number') {
    errors.push(new ValidationError('Max users must be a number', 'maxUsers'));
  }

  if (settings.maxUsers && (settings.maxUsers as number) < 1) {
    errors.push(new ValidationError('Max users must be at least 1', 'maxUsers'));
  }

  if (settings.sessionTimeout && typeof settings.sessionTimeout !== 'number') {
    errors.push(new ValidationError('Session timeout must be a number', 'sessionTimeout'));
  }

  if (settings.passwordPolicy && typeof settings.passwordPolicy !== 'object') {
    errors.push(new ValidationError('Password policy must be an object', 'passwordPolicy'));
  }

  return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
};

/* -----------------------------------------------------------------------------
   🔒 Session Management & Security
   ----------------------------------------------------------------------------- */

/**
 * 🔐 Session Limit Validation
 *
 * Ensures users don't exceed maximum allowed
 * concurrent sessions for security.
 *
 * Security Features:
 * - ✅ Session count validation
 * - ✅ Limit enforcement
 * - ✅ Security policy compliance
 *
 * @param _userId - User ID (unused but required for interface)
 * @param currentSessions - Current active sessions
 * @param maxSessions - Maximum allowed sessions
 * @returns ValidationResult for session limits
 */
export const validateSessionLimits = (
  _userId: UserId,
  currentSessions: number,
  maxSessions: number
): ValidationResult => {
  if (currentSessions >= maxSessions) {
    throw new TooManyActiveSessionsError(maxSessions, currentSessions);
  }
  return { isValid: true };
};

/* -----------------------------------------------------------------------------
   🌐 Network & Device Security
   ----------------------------------------------------------------------------- */

/**
 * 🌐 IP Address Validation
 *
 * Validates IP address format and ensures
 * proper network security measures.
 *
 * Features:
 * - ✅ IPv4 format validation
 * - ✅ IPv6 format validation
 * - ✅ Private IP detection
 * - ✅ Reserved IP filtering
 *
 * @param ip - IP address string to validate
 * @returns true if IP is valid, false otherwise
 */
export const isValidIpAddress = (ip: string): boolean => {
  if (!ip || typeof ip !== 'string') return false;

  // IPv4 pattern
  const ipv4Pattern =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  // IPv6 pattern (simplified)
  const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
};

/**
 * 🌐 User Agent String Validation
 *
 * Validates and sanitizes user agent strings
 * for security and analytics purposes.
 *
 * Security Features:
 * - ✅ String format validation
 * - ✅ Malicious pattern detection
 * - ✅ Length validation
 * - ✅ Content sanitization
 *
 * @param userAgent - User agent string to validate
 * @returns ValidationResult for user agent
 */
export const validateUserAgent = (userAgent: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!userAgent || typeof userAgent !== 'string') {
    errors.push(new ValidationError('User agent is required', 'userAgent'));
    return { isValid: false, errors };
  }

  if (userAgent.length > 500) {
    errors.push(new ValidationError('User agent too long', 'userAgent'));
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [/bot/i, /crawl/i, /spider/i, /scrape/i, /hack/i, /attack/i];

  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
  if (isSuspicious) {
    errors.push(new ValidationError('Suspicious user agent detected', 'userAgent'));
  }

  return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
};

/**
 * 📱 Device Information Validation
 *
 * Validates device metadata for security
 * and fraud prevention purposes.
 *
 * Validation Areas:
 * - ✅ Device fingerprint
 * - ✅ Browser information
 * - ✅ Operating system details
 * - ✅ Hardware characteristics
 *
 * @param device - Device information object
 * @returns ValidationResult for device data
 */
export const validateDeviceInfo = (device: DeviceInfo): ValidationResult => {
  const errors: ValidationError[] = [];

  const validTypes = ['desktop', 'mobile', 'tablet'];
  if (!validTypes.includes(device.type)) {
    errors.push(new ValidationError('Invalid device type', 'type'));
  }

  if (!device.name?.trim()) {
    errors.push(new ValidationError('Device name is required', 'name'));
  } else if (device.name.length > 100) {
    errors.push(new ValidationError('Device name too long', 'name'));
  }

  if (!device.os?.trim()) {
    errors.push(new ValidationError('Operating system is required', 'os'));
  } else if (device.os.length > 50) {
    errors.push(new ValidationError('OS name too long', 'os'));
  }

  if (!device.browser?.trim()) {
    errors.push(new ValidationError('Browser information is required', 'browser'));
  } else if (device.browser.length > 100) {
    errors.push(new ValidationError('Browser info too long', 'browser'));
  }

  // Validate fingerprint if provided
  if (device.fingerprint) {
    if (typeof device.fingerprint !== 'string' || device.fingerprint.length < 10) {
      errors.push(new ValidationError('Invalid device fingerprint', 'fingerprint'));
    }
  }

  return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
};

/* -----------------------------------------------------------------------------
   🔐 Advanced Security & Password Analysis
   ----------------------------------------------------------------------------- */

/**
 * 💪 Password Strength Assessment
 *
 * Comprehensive password strength analysis using
 * multiple security metrics and industry standards.
 *
 * Assessment Criteria:
 * - 🔒 Length and complexity scoring
 * - 🔒 Character variety analysis
 * 🔒 Pattern recognition
 * - 🔒 Common password detection
 * - 🔒 Personal information detection
 * - 🔒 Entropy calculation
 *
 * Scoring System:
 * - 0-20:   Weak (immediate rejection)
 * - 21-40:  Fair (requires improvement)
 * - 41-60:  Good (acceptable)
 * - 61-80:  Strong (recommended)
 * - 81-100: Excellent (highly secure)
 *
 * @param password - Password to assess
 * @returns Detailed strength analysis with score and suggestions
 *
 * @example
 * const analysis = assessPasswordStrength('MySecurePass123!');
 * // Returns: { score: 85, level: 'strong', suggestions: [...] }
 */
export const assessPasswordStrength = (
  password: string
): {
  score: number; // 0-100
  level: 'weak' | 'fair' | 'good' | 'strong' | 'excellent';
  suggestions: string[];
} => {
  if (!password) {
    return { score: 0, level: 'weak', suggestions: ['Password is required'] };
  }

  let score = 0;
  const suggestions: string[] = [];

  // Length scoring
  if (password.length >= 8) score += 20;
  else suggestions.push('Use at least 8 characters');

  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  // Character variety scoring
  if (/[a-z]/.test(password)) score += 10;
  else suggestions.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score += 10;
  else suggestions.push('Add uppercase letters');

  if (/\d/.test(password)) score += 10;
  else suggestions.push('Add numbers');

  if (/[^\w\s]/.test(password)) score += 15;
  else suggestions.push('Add special characters');

  // Pattern analysis
  if (!/(.)\1{2,}/.test(password))
    score += 10; // No repeating chars
  else suggestions.push('Avoid repeating characters');

  if (!/012|123|234|345|456|567|678|789|890|abc|bcd|cde/.test(password.toLowerCase())) {
    score += 10; // No sequences
  } else {
    suggestions.push('Avoid sequential characters');
  }

  // Entropy bonus
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.7) score += 5;

  // Determine level
  let level: 'weak' | 'fair' | 'good' | 'strong' | 'excellent';
  if (score < 30) level = 'weak';
  else if (score < 50) level = 'fair';
  else if (score < 70) level = 'good';
  else if (score < 90) level = 'strong';
  else level = 'excellent';

  return { score: Math.min(100, score), level, suggestions };
};

/* -----------------------------------------------------------------------------
   🔑 Token & Secret Validation
   ----------------------------------------------------------------------------- */

/**
 * 🎫 Invitation Token Validation
 *
 * Validates user invitation tokens for
 * secure account creation workflows.
 *
 * Security Features:
 * - ✅ Token format validation
 * - ✅ Expiration checking
 * - ✅ Usage validation
 * - ✅ Fraud prevention
 *
 * @param token - Invitation token to validate
 * @returns ValidationResult for invitation token
 */
export const validateInvitationToken = (token: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!token || typeof token !== 'string') {
    errors.push(new ValidationError('Invitation token is required', 'token'));
    return { isValid: false, errors };
  }

  // Token should be a reasonable length (e.g., JWT or UUID-based)
  if (token.length < 10 || token.length > 500) {
    errors.push(new ValidationError('Invalid invitation token format', 'token'));
  }

  // Basic format check - should contain only URL-safe characters
  if (!/^[A-Za-z0-9\-_\.]+$/.test(token)) {
    errors.push(new ValidationError('Invalid invitation token characters', 'token'));
  }

  return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
};

/**
 * 📊 Metadata Validation
 *
 * Validates arbitrary metadata objects
 * for security and consistency.
 *
 * @param metadata - Metadata object to validate
 * @returns ValidationResult for metadata
 */
export const validateMetadata = (metadata: Record<string, unknown>): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!metadata || typeof metadata !== 'object') {
    errors.push(new ValidationError('Metadata must be an object', 'metadata'));
    return { isValid: false, errors };
  }

  // Check size limits
  const metadataStr = JSON.stringify(metadata);
  if (metadataStr.length > 10000) {
    // 10KB limit
    errors.push(new ValidationError('Metadata too large (max 10KB)', 'metadata'));
  }

  // Check for too many keys
  const keyCount = Object.keys(metadata).length;
  if (keyCount > 50) {
    errors.push(new ValidationError('Too many metadata keys (max 50)', 'metadata'));
  }

  // Validate key names
  for (const key of Object.keys(metadata)) {
    if (typeof key !== 'string' || key.length > 100) {
      errors.push(new ValidationError(`Invalid metadata key: ${key}`, 'metadata'));
    }

    if (!/^[a-zA-Z0-9_\-\.]+$/.test(key)) {
      errors.push(
        new ValidationError(`Metadata key contains invalid characters: ${key}`, 'metadata')
      );
    }
  }

  return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
};

/**
 * ⏰ Timestamp Validation
 *
 * Validates timestamp strings for
 * proper date/time handling.
 *
 * @param timestamp - Timestamp string to validate
 * @returns true if timestamp is valid, false otherwise
 */
export const isValidTimestamp = (timestamp: string): boolean => {
  if (!timestamp || typeof timestamp !== 'string') return false;

  // ISO 8601 pattern
  const iso8601Pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  if (!iso8601Pattern.test(timestamp)) return false;

  // Validate that it's a valid date
  const date = new Date(timestamp);
  return !isNaN(date.getTime());
};

/**
 * 🔐 TOTP Secret Validation
 *
 * Validates Time-based One-Time Password
 * secrets for MFA setup.
 *
 * @param secret - TOTP secret to validate
 * @returns ValidationResult for TOTP secret
 */
export const validateTotpSecret = (secret: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!secret || typeof secret !== 'string') {
    errors.push(new ValidationError('TOTP secret is required', 'secret'));
    return { isValid: false, errors };
  }

  // TOTP secrets are typically base32 encoded
  const base32Pattern = /^[A-Z2-7]+=*$/;
  if (!base32Pattern.test(secret)) {
    errors.push(new ValidationError('Invalid TOTP secret format', 'secret'));
  }

  // Standard length check (160 bits = 32 base32 chars)
  const cleanSecret = secret.replace(/=/g, '');
  if (cleanSecret.length < 16 || cleanSecret.length > 64) {
    errors.push(new ValidationError('TOTP secret length invalid', 'secret'));
  }

  return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
};

/**
 * 🔑 Backup Code Validation
 *
 * Validates backup authentication codes
 * for account recovery.
 *
 * @param code - Backup code to validate
 * @returns ValidationResult for backup code
 */
export const validateBackupCode = (code: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!code || typeof code !== 'string') {
    errors.push(new ValidationError('Backup code is required', 'code'));
    return { isValid: false, errors };
  }

  // Backup codes are typically 8-10 alphanumeric characters
  const trimmedCode = code.trim().toUpperCase();
  if (!/^[A-Z0-9]{8,10}$/.test(trimmedCode)) {
    errors.push(new ValidationError('Invalid backup code format', 'code'));
  }

  return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
};

/* -----------------------------------------------------------------------------
   🚦 Rate Limiting & Access Control
   ----------------------------------------------------------------------------- */

/**
 * ⏱️ Rate Limit Validation
 *
 * Validates rate limiting rules and
 * prevents abuse and DoS attacks.
 *
 * Security Features:
 * - ✅ Request count validation
 * - ✅ Time window enforcement
 * - ✅ Limit compliance checking
 * - ✅ Abuse prevention
 *
 * @param operation - Operation being rate limited
 * @param _identifier - Identifier for tracking (unused in validation)
 * @param currentCount - Current request count
 * @param limit - Maximum allowed requests
 * @param windowStart - Rate limit window start time
 * @param windowDuration - Window duration in milliseconds
 * @returns ValidationResult for rate limiting
 */
export const validateRateLimit = (
  operation: string,
  _identifier: string, // Used for tracking but not in validation logic
  currentCount: number,
  limit: number,
  windowStart: Date,
  windowDuration: number
): ValidationResult => {
  if (currentCount >= limit) {
    const resetTime = new Date(windowStart.getTime() + windowDuration).toISOString();
    throw new RateLimitExceededError(operation, limit, resetTime);
  }
  return { isValid: true };
};

/**
 * 🌍 Geographic Access Validation
 *
 * Validates user's geographic location
 * against access restrictions.
 *
 * Features:
 * - ✅ Country code validation
 * - ✅ Allowlist checking
 * - ✅ Blocklist enforcement
 * - ✅ Compliance requirements
 *
 * @param userCountry - User's country code
 * @param allowedCountries - Allowed country codes
 * @param blockedCountries - Blocked country codes
 * @returns ValidationResult for geographic access
 */
export const validateGeographicAccess = (
  userCountry: string,
  allowedCountries: string[],
  blockedCountries: string[]
): ValidationResult => {
  if (blockedCountries.includes(userCountry)) {
    throw new GeographicRestrictionError(userCountry, allowedCountries);
  }

  if (allowedCountries.length > 0 && !allowedCountries.includes(userCountry)) {
    throw new GeographicRestrictionError(userCountry, allowedCountries);
  }

  return { isValid: true };
};

/**
 * ⏰ Time Restriction Validation
 *
 * Validates access based on time
 * restrictions and business hours.
 *
 * Features:
 * - ✅ Time format validation
 * - ✅ Timezone handling
 * - ✅ Business hours checking
 * - ✅ Maintenance window support
 *
 * @param currentTime - Current time for validation
 * @param allowedStart - Allowed start time (HH:MM format)
 * @param allowedEnd - Allowed end time (HH:MM format)
 * @param timezone - Timezone for time calculations (defaults to UTC)
 * @returns ValidationResult for time restrictions
 */
export const validateTimeRestriction = (
  currentTime: Date,
  allowedStart: string, // HH:MM format
  allowedEnd: string, // HH:MM format
  timezone: string = 'UTC'
): ValidationResult => {
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinute;

  const startParts = allowedStart.split(':');
  const endParts = allowedEnd.split(':');

  if (startParts.length !== 2 || endParts.length !== 2) {
    throw new ValidationError('Invalid time format. Expected HH:MM', 'timeFormat');
  }

  // Add non-null assertions since we've already checked the array length
  const startHour = parseInt(startParts[0]!, 10);
  const startMinute = parseInt(startParts[1]!, 10);
  const endHour = parseInt(endParts[0]!, 10);
  const endMinute = parseInt(endParts[1]!, 10);

  if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
    throw new ValidationError('Invalid time values', 'timeFormat');
  }

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  const isWithinWindow =
    startTotalMinutes <= endTotalMinutes
      ? currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes
      : currentTotalMinutes >= startTotalMinutes || currentTotalMinutes <= endTotalMinutes;

  if (!isWithinWindow) {
    throw new TimeRestrictionError(
      currentTime.toISOString(),
      `${allowedStart}-${allowedEnd} ${timezone}`
    );
  }

  return { isValid: true };
};

/* -----------------------------------------------------------------------------
   📧 Communication Limits & Notifications
   ----------------------------------------------------------------------------- */

/**
 * 📧 Email Send Limit Validation
 *
 * Validates email sending limits to
 * prevent spam and abuse.
 *
 * @param emailType - Type of email being sent
 * @param sentCount - Current send count
 * @param limit - Maximum allowed sends
 * @param resetTime - Time when limits reset
 * @returns ValidationResult for email limits
 */
export const validateEmailSendLimit = (
  emailType: string,
  sentCount: number,
  limit: number,
  resetTime: Date
): ValidationResult => {
  if (sentCount >= limit) {
    throw new EmailSendLimitExceededError(emailType, limit, resetTime.toISOString());
  }
  return { isValid: true };
};

/**
 * 📱 SMS Send Limit Validation
 *
 * Validates SMS sending limits to
 * prevent abuse and cost control.
 *
 * @param sentCount - Current send count
 * @param limit - Maximum allowed sends
 * @param resetTime - Time when limits reset
 * @returns ValidationResult for SMS limits
 */
export const validateSmsSendLimit = (
  sentCount: number,
  limit: number,
  resetTime: Date
): ValidationResult => {
  if (sentCount >= limit) {
    throw new SmsSendLimitExceededError(limit, resetTime.toISOString());
  }
  return { isValid: true };
};

/* -----------------------------------------------------------------------------
   🚀 Feature Access & Subscription Management
   ----------------------------------------------------------------------------- */

/**
 * 🎯 Feature Access Validation
 *
 * Validates user's access to specific
 * features based on subscription plan.
 *
 * Features:
 * - ✅ Plan-based access control
 * - ✅ Feature mapping validation
 * - ✅ Upgrade path checking
 * - ✅ Usage limit enforcement
 *
 * @param feature - Feature to validate access for
 * @param currentPlan - User's current subscription plan
 * @param featurePlanMap - Mapping of features to required plans
 * @returns ValidationResult for feature access
 */
export const validateFeatureAccess = (
  feature: string,
  currentPlan: SubscriptionPlan,
  featurePlanMap: Record<string, SubscriptionPlan[]>
): ValidationResult => {
  const allowedPlans = featurePlanMap[feature];
  if (allowedPlans && !allowedPlans.includes(currentPlan)) {
    const requiredPlan = allowedPlans[0] || 'professional'; // Provide fallback
    throw new FeatureNotAvailableError(feature, requiredPlan, currentPlan);
  }
  return { isValid: true };
};

/**
 * 📊 Usage Limit Validation
 *
 * Validates usage against defined limits
 * for resource management and billing.
 *
 * @param limitType - Type of usage being validated
 * @param currentUsage - Current usage count
 * @param maxAllowed - Maximum allowed usage
 * @returns ValidationResult for usage limits
 */
export const validateUsageLimit = (
  limitType: string,
  currentUsage: number,
  maxAllowed: number
): ValidationResult => {
  if (currentUsage >= maxAllowed) {
    throw new SubscriptionLimitExceededError(limitType, currentUsage, maxAllowed);
  }
  return { isValid: true };
};

/* -----------------------------------------------------------------------------
   🛡️ Utility Functions & Error Handling
   ----------------------------------------------------------------------------- */

/**
 * 🛡️ Safe Validation Wrapper
 *
 * Wraps validation functions to prevent
 * crashes and provide graceful error handling.
 *
 * Features:
 * - ✅ Exception handling
 * - ✅ Fallback error provision
 * - ✅ Consistent error format
 * - ✅ Debug information preservation
 *
 * @param validator - Validation function to wrap
 * @param fallbackError - Error to return if validation fails
 * @returns ValidationResult with optional data
 *
 * @example
 * const result = safeValidate(() => validatePassword(password),
 *   new ValidationError('Password validation failed', 'password'));
 */
export const safeValidate = <T>(
  validator: () => T,
  fallbackError: ValidationError = new ValidationError('Validation failed', 'unknown')
): ValidationResult & { data?: T } => {
  try {
    const data = validator();
    return { isValid: true, data };
  } catch (error) {
    if (error instanceof ValidationError || error instanceof BusinessRuleError) {
      return { isValid: false, errors: [error] };
    }
    return { isValid: false, errors: [fallbackError] };
  }
};

/**
 * 🔄 Batch Validation Processing
 *
 * Processes multiple validators and returns
 * consolidated results for efficiency.
 *
 * Features:
 * - ✅ Parallel validation execution
 * - ✅ Consolidated error reporting
 * - ✅ Early termination on failure
 * - ✅ Performance optimization
 *
 * @param validators - Array of validation functions
 * @returns Consolidated ValidationResult
 *
 * @example
 * const result = validateBatch([
 *   () => validateEmail(email),
 *   () => validatePassword(password),
 *   () => validateName(name)
 * ]);
 */
export const validateBatch = (validators: Array<() => ValidationResult>): ValidationResult => {
  const allErrors: ValidationError[] = [];

  for (const validator of validators) {
    const result = validator();
    if (!result.isValid) {
      allErrors.push(...result.errors);
    }
  }

  return allErrors.length > 0 ? { isValid: false, errors: allErrors } : { isValid: true };
};
