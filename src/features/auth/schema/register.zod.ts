import { z } from 'zod';
import { countryCodeSchema, rawPhoneSchema, emailSchema, passwordSchema } from './shared';

/**
 * UI Registration Form (maps to domain RegisterForm)
 */
export const registerFormSchema = z
  .object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    countryCode: countryCodeSchema, // "+91" etc.
    phoneNumber: rawPhoneSchema, // raw; normalized in rules
    email: emailSchema, // lowercasing happens in rules
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptedTerms: z.boolean().refine(v => v === true, 'You must accept the Terms'),
  })
  .refine(v => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type RegisterFormInput = z.infer<typeof registerFormSchema>;
