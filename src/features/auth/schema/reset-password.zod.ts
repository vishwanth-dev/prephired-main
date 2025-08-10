import { z } from 'zod';
import { passwordSchema } from './shared';

/**
 * UI Reset Password Form (maps to domain ResetPasswordForm)
 */
export const resetPasswordFormSchema = z
  .object({
    token: z.string().trim().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(v => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;
