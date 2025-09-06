/**
 * 📱 OTP Verification Form Component
 *
 * This component handles OTP verification following SOLID principles:
 * - Single Responsibility: Only handles OTP verification form logic
 * - Open/Closed: Extensible through props and callbacks
 * - Liskov Substitution: Can be replaced with other form components
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Depends on abstractions (hooks, services)
 *
 * 📋 Features:
 * - 6-digit OTP input
 * - Auto-focus and auto-submit
 * - Resend OTP functionality
 * - Countdown timer
 * - Loading states and error handling
 * - Accessibility support
 * - Form validation with Zod
 *
 * 🔧 Usage:
 * ```tsx
 * <VerifyOTPForm
 *   onSubmit={handleVerifyOTP}
 *   isLoading={isLoading}
 *   error={error}
 *   onResendOTP={handleResendOTP}
 *   email={userEmail}
 *   type="registration"
 * />
 * ```
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { OTPInputField } from '@/components/ui/otp-input-field';
import { otpSchema, type OTPFormData } from '@/lib/validations/auth';
import { cn } from '@/lib/utils';

// ============================================
// 🎯 INTERFACE DEFINITIONS
// ============================================

interface VerifyOTPFormProps {
  onSubmit: (data: OTPFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  onResendOTP?: () => Promise<void>;
  email?: string;
  type?: 'registration' | 'reset-password' | 'phone-verification';
  className?: string;
  resendCooldown?: number; // in seconds
}

// ============================================
// 📱 OTP VERIFICATION FORM COMPONENT
// ============================================

export const VerifyOTPForm: React.FC<VerifyOTPFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
  onResendOTP,
  email,
  type = 'registration',
  className,
  resendCooldown = 60,
}) => {
  // ============================================
  // 🎣 HOOKS & STATE
  // ============================================

  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
      email: email || '',
      type: type || 'registration',
    },
    mode: 'onChange' as const,
  });

  // ============================================
  // 🎯 EFFECTS
  // ============================================

  // Resend timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [resendTimer]);

  // ============================================
  // 🎯 EVENT HANDLERS
  // ============================================

  const handleSubmit = async (data: OTPFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handling is done by parent component
      console.error('OTP verification form submission error:', error);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0 || isResending) return;

    try {
      setIsResending(true);
      await onResendOTP?.();
      setResendTimer(resendCooldown);
    } catch (error) {
      console.error('Resend OTP error:', error);
    } finally {
      setIsResending(false);
    }
  };

  const handleOTPChange = (value: string) => {
    form.setValue('otp', value);

    // Auto-submit when OTP is complete
    if (value.length === 6) {
      form.handleSubmit(handleSubmit)();
    }
  };

  // ============================================
  // 🎨 RENDER HELPERS
  // ============================================

  const getFormTitle = () => {
    switch (type) {
      case 'registration':
        return 'Verify your email';
      case 'reset-password':
        return 'Verify your email';
      case 'phone-verification':
        return 'Verify your phone';
      default:
        return 'Verify your code';
    }
  };

  const getFormDescription = () => {
    switch (type) {
      case 'registration':
        return 'We sent a 6-digit code to your email address. Enter it below to complete your registration.';
      case 'reset-password':
        return 'We sent a 6-digit code to your email address. Enter it below to reset your password.';
      case 'phone-verification':
        return 'We sent a 6-digit code to your phone number. Enter it below to verify your phone.';
      default:
        return 'Enter the 6-digit code we sent to you.';
    }
  };

  const getResendText = () => {
    if (resendTimer > 0) {
      return `Resend code in ${resendTimer}s`;
    }
    if (isResending) {
      return 'Sending code...';
    }
    return 'Resend code';
  };

  // ============================================
  // 🎨 RENDER
  // ============================================

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
          {/* Header */}
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-900'>{getFormTitle()}</h1>
            <p className='mt-2 text-sm text-gray-600'>{getFormDescription()}</p>
            {email && <p className='mt-1 text-sm font-medium text-gray-900'>{email}</p>}
          </div>

          {/* Error Display */}
          {error && (
            <div className='rounded-md bg-red-50 p-4'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <h3 className='text-sm font-medium text-red-800'>Verification failed</h3>
                  <div className='mt-2 text-sm text-red-700'>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OTP Input Field */}
          <FormField
            control={form.control}
            name='otp'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification code</FormLabel>
                <FormControl>
                  <OTPInputField
                    value={field.value}
                    onChange={handleOTPChange}
                    disabled={isLoading}
                    error={!!error}
                    length={6}
                    className='justify-center'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type='submit'
            className='w-full'
            disabled={isLoading || form.watch('otp').length !== 6}
            loading={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify code'}
          </Button>

          {/* Resend OTP */}
          {onResendOTP && (
            <div className='text-center'>
              <p className='text-sm text-gray-600'>
                Didn't receive the code?{' '}
                <button
                  type='button'
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || isResending || isLoading}
                  className='text-blue-600 hover:text-blue-500 disabled:opacity-50'
                >
                  {getResendText()}
                </button>
              </p>
            </div>
          )}

          {/* Help Text */}
          <div className='bg-blue-50 rounded-md p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg className='h-5 w-5 text-blue-400' viewBox='0 0 20 20' fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-blue-800'>Having trouble?</h3>
                <div className='mt-2 text-sm text-blue-700'>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>Check your spam or junk folder</li>
                    <li>Make sure you entered the correct email address</li>
                    <li>The code expires after 10 minutes</li>
                    <li>You can request a new code if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

// ============================================
// 🎯 EXPORT
// ============================================

export default VerifyOTPForm;
