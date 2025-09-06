/**
 * 🔄 Forgot Password Form Component
 *
 * This component handles password reset requests following SOLID principles:
 * - Single Responsibility: Only handles forgot password form logic
 * - Open/Closed: Extensible through props and callbacks
 * - Liskov Substitution: Can be replaced with other form components
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Depends on abstractions (hooks, services)
 *
 * 📋 Features:
 * - Email validation
 * - Loading states and error handling
 * - Success state handling
 * - Accessibility support
 * - Form validation with Zod
 *
 * 🔧 Usage:
 * ```tsx
 * <ForgotPasswordForm
 *   onSubmit={handleForgotPassword}
 *   isLoading={isLoading}
 *   error={error}
 *   success={success}
 *   onBackToLogin={handleBackToLogin}
 * />
 * ```
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth';
import { cn } from '@/lib/utils';

// ============================================
// 🎯 INTERFACE DEFINITIONS
// ============================================

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  success?: boolean;
  onBackToLogin?: () => void;
  className?: string;
}

// ============================================
// 🔄 FORGOT PASSWORD FORM COMPONENT
// ============================================

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
  success = false,
  onBackToLogin,
  className,
}) => {
  // ============================================
  // 🎣 HOOKS
  // ============================================

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // ============================================
  // 🎯 EVENT HANDLERS
  // ============================================

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handling is done by parent component
      console.error('Forgot password form submission error:', error);
    }
  };

  const handleBackToLoginClick = () => {
    onBackToLogin?.();
  };

  // ============================================
  // 🎨 RENDER
  // ============================================

  // Success State
  if (success) {
    return (
      <div className={cn('w-full max-w-md mx-auto', className)}>
        <div className='text-center space-y-6'>
          {/* Success Icon */}
          <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100'>
            <svg
              className='h-6 w-6 text-green-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>

          {/* Success Message */}
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Check your email</h1>
            <p className='mt-2 text-sm text-gray-600'>
              We've sent a password reset link to your email address. Please check your inbox and
              follow the instructions to reset your password.
            </p>
          </div>

          {/* Additional Info */}
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
                <h3 className='text-sm font-medium text-blue-800'>Didn't receive the email?</h3>
                <div className='mt-2 text-sm text-blue-700'>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>Check your spam or junk folder</li>
                    <li>Make sure you entered the correct email address</li>
                    <li>Wait a few minutes and try again</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Login Button */}
          {onBackToLogin && (
            <Button
              type='button'
              variant='outline'
              onClick={handleBackToLoginClick}
              className='w-full'
            >
              Back to login
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Form State
  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
          {/* Header */}
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-900'>Forgot your password?</h1>
            <p className='mt-2 text-sm text-gray-600'>
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>
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
                  <h3 className='text-sm font-medium text-red-800'>Reset failed</h3>
                  <div className='mt-2 text-sm text-red-700'>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email Field */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='email'
                    placeholder='Enter your email address'
                    disabled={isLoading}
                    autoComplete='email'
                    className='w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type='submit' className='w-full' disabled={isLoading} loading={isLoading}>
            {isLoading ? 'Sending reset link...' : 'Send reset link'}
          </Button>

          {/* Back to Login Link */}
          {onBackToLogin && (
            <div className='text-center'>
              <p className='text-sm text-gray-600'>
                Remember your password?{' '}
                <button
                  type='button'
                  onClick={handleBackToLoginClick}
                  disabled={isLoading}
                  className='text-blue-600 hover:text-blue-500 disabled:opacity-50'
                >
                  Back to login
                </button>
              </p>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

// ============================================
// 🎯 EXPORT
// ============================================

export default ForgotPasswordForm;
