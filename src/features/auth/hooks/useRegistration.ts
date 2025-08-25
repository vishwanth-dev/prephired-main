'use client';

import { useForm, type SubmitErrorHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback } from 'react';
import { registerSchema, type RegisterFormData } from '@/features/auth/schema';
import { useRouter } from 'next/navigation';
import { AUTH_ROUTES } from '@/constants/routes';

export interface UseRegistrationReturn {
  form: ReturnType<typeof useForm<RegisterFormData>>;
  onSubmit: (data: RegisterFormData) => Promise<void>;
  onError: SubmitErrorHandler<RegisterFormData>;
  isLoading: boolean;
  error: string | null;
  resetError: () => void;
}

export const useRegistration = (): UseRegistrationReturn => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const onSubmit = useCallback(
    async (data: RegisterFormData): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        console.log(data);
        // TODO: Implement actual registration logic
        // await register(data);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // On successful registration, redirect to verify-account page
        router.push(`${AUTH_ROUTES.VERIFY_ACCOUNT}?type=register`);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Registration failed. Please try again.';
        setError(errorMessage);
        console.error('Registration failed:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const onError: SubmitErrorHandler<RegisterFormData> = useCallback(errors => {
    console.log(errors);
    setError('Please fix the form errors and try again.');
  }, []);

  const resetError = useCallback((): void => {
    setError(null);
  }, []);

  return {
    form,
    onSubmit,
    onError,
    isLoading,
    error,
    resetError,
  };
};
