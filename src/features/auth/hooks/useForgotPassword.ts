'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordFormSchema, type ForgotPasswordFormInput } from '@/features/auth/schema';
import { AUTH_ROUTES } from '@/constants/routes';

export const useForgotPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize form
  const form = useForm<ForgotPasswordFormInput>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      emailOrPhone: '',
    },
  });

  // Handle forgot password submission
  const onSubmit = async (data: ForgotPasswordFormInput) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call - replace with actual forgot password logic
      console.log(data);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success state
      setIsSuccess(true);

      // Redirect to verify account page after a short delay
      setTimeout(() => {
        router.push(`${AUTH_ROUTES.VERIFY_ACCOUNT}?type=forgot-password`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset error when form changes
  const resetError = () => {
    if (error) {
      setError(null);
    }
  };

  // Go back to login
  const goBackToLogin = () => {
    router.push(AUTH_ROUTES.LOGIN);
  };

  return {
    form,
    onSubmit,
    isLoading,
    error,
    resetError,
    isSuccess,
    goBackToLogin,
  };
};
