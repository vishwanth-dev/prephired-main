import { z } from 'zod';
import { emailOrPhoneSchema } from './shared';

/**
 * UI Forgot Password Form (maps to domain ForgotPasswordForm)
 */
export const forgotPasswordFormSchema = z.object({
  emailOrPhone: emailOrPhoneSchema,
});

export type ForgotPasswordFormInput = z.infer<typeof forgotPasswordFormSchema>;
