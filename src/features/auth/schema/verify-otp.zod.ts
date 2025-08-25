import { z } from 'zod';
import { emailOrPhoneSchema, otpSchema } from './shared';

/**
 * UI Verify Account with OTP (maps to domain VerifyAccountForm)
 */
export const verifyAccountFormSchema = z.object({
  // emailOrPhone: emailOrPhoneSchema,
  otp: otpSchema,
});

export type VerifyAccountFormInput = z.infer<typeof verifyAccountFormSchema>;
