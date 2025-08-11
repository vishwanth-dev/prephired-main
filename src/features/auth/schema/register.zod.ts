// ===========================================
// Registration Form Schema
// ===========================================
import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .min(2, 'First name must be at least 2 characters'),

    lastName: z
      .string()
      .min(1, 'Last name is required')
      .min(2, 'Last name must be at least 2 characters'),

    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),

    phone: z
      .string()
      .min(10, 'Phone number is required')
      .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),

    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),

    confirmPassword: z.string().min(1, 'Please confirm your password'),

    acceptTerms: z
      .boolean()
      .refine(val => val === true, 'You must accept the terms and conditions'),

    acceptPrivacy: z.boolean().optional(),
    marketingEmails: z.boolean().optional(),
    tenantSlug: z.string().optional(),
    invitationToken: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
