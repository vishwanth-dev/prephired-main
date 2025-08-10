import { z } from 'zod';
import { emailOrPhoneSchema } from './shared';

/**
 * UI Login Form (maps to domain LoginForm)
 */
export const loginFormSchema = z.object({
  emailOrPhone: emailOrPhoneSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(), // rules will coerce to boolean with ?? false
});

export type LoginFormInput = z.infer<typeof loginFormSchema>;
