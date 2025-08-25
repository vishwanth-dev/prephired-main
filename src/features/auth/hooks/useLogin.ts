'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback } from 'react';
import { loginFormSchema, type LoginFormInput } from '@/features/auth/schema';
import { useRouter } from 'next/navigation';
import { AUTH_ROUTES } from '@/constants/routes';

export interface UseLoginReturn {
  form: ReturnType<typeof useForm<LoginFormInput>>;
  onSubmit: (data: LoginFormInput) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  resetError: () => void;
}

export const useLogin = (): UseLoginReturn => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormInput>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      emailOrPhone: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = useCallback(
    async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate login API call - replace with actual login logic
        await new Promise(resolve => setTimeout(resolve, 1500));

        // On successful login, redirect to verify-account page
        router.push(`${AUTH_ROUTES.VERIFY_ACCOUNT}?type=login`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
        setError(errorMessage);
        console.error('Login failed:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const resetError = useCallback((): void => {
    setError(null);
  }, []);

  return {
    form,
    onSubmit,
    isLoading,
    error,
    resetError,
  };
};
