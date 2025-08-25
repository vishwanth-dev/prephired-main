'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyAccountFormSchema, type VerifyAccountFormInput } from '@/features/auth/schema';
import { AUTH_ROUTES } from '@/constants/routes';

export const useVerifyAccount = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [verificationType, setVerificationType] = useState<
    'register' | 'login' | 'forgot-password'
  >('register');

  // Get verification type from URL params
  useEffect(() => {
    const type = searchParams.get('type') as 'register' | 'login' | 'forgot-password';
    if (type && ['register', 'login', 'forgot-password'].includes(type)) {
      setVerificationType(type);
    }
  }, [searchParams]);

  // Initialize form
  const form = useForm<VerifyAccountFormInput>({
    resolver: zodResolver(verifyAccountFormSchema),
    defaultValues: {
      //   emailOrPhone: 'vishuwanth@gmail.com',
      otp: '',
    },
  });

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [resendCountdown]);

  // Handle OTP verification
  const onSubmit = async (data: VerifyAccountFormInput) => {
    try {
      debugger;
      setIsLoading(true);
      setError(null);

      console.log(data);

      // Simulate API call - replace with actual verification logic
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Handle different verification types
      switch (verificationType) {
        case 'register':
          router.push('/select-role');
          break;
        case 'login':
          router.push('/dashboard');
          break;
        case 'forgot-password':
          router.push(AUTH_ROUTES.RESET_PASSWORD);
          break;
        default:
          router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call - replace with actual resend logic
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Start countdown
      setResendCountdown(60);
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
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

  return {
    form,
    onSubmit,
    isLoading,
    error,
    resetError,
    verificationType,
    resendCountdown,
    handleResendOTP,
  };
};
