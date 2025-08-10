import { z } from 'zod';

/** Country code +1..+999 */
export const countryCodeSchema = z.string().regex(/^\+\d{1,3}$/, 'Invalid country code');

/** Raw phone typed by user (we only ensure it looks like a phone; normalization happens in rules) */
export const rawPhoneSchema = z
  .string()
  .trim()
  .regex(/^[0-9()\-\s]{7,}$/, 'Enter a valid phone number');

/** Email (UI) */
export const emailSchema = z.string().trim().email('Enter a valid email');

/** Identifier: email or phone-like; rules will split & normalize */
export const emailOrPhoneSchema = z.string().trim().min(1, 'Enter email or phone');

/** Password policy for UI validation (service/domain may be stricter) */
export const PASSWORD_POLICY = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: false, // keep UI friendly; server can require symbols if needed
};

export const passwordSchema = z
  .string()
  .min(
    PASSWORD_POLICY.minLength,
    `Password must be at least ${PASSWORD_POLICY.minLength} characters`
  )
  .refine(
    v => !PASSWORD_POLICY.requireUppercase || /[A-Z]/.test(v),
    'Add at least one uppercase letter'
  )
  .refine(
    v => !PASSWORD_POLICY.requireLowercase || /[a-z]/.test(v),
    'Add at least one lowercase letter'
  )
  .refine(v => !PASSWORD_POLICY.requireNumbers || /\d/.test(v), 'Add at least one number')
  .refine(v => !PASSWORD_POLICY.requireSymbols || /[^\w\s]/.test(v), 'Add at least one symbol');

/** OTP: allow 4 or 6 digits */
export const otpSchema = z
  .string()
  .trim()
  .regex(/^(\d{4}|\d{6})$/, 'Invalid OTP code');
