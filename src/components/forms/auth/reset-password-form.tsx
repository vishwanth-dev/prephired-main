/**
 * 🔐 Reset Password Form Component
 *
 * This component handles password reset functionality following SOLID principles:
 * - Single Responsibility: Only handles password reset form logic
 * - Open/Closed: Extensible through props and callbacks
 * - Liskov Substitution: Can be replaced with other form components
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Depends on abstractions (hooks, services)
 *
 * 📋 Features:
 * - Password strength validation
 * - Password confirmation matching
 * - Token validation
 * - Loading states and error handling
 * - Accessibility support
 * - Form validation with Zod
 *
 * 🔧 Usage:
 * ```tsx
 * <ResetPasswordForm
 *   onSubmit={handleResetPassword}
 *   isLoading={isLoading}
 *   error={error}
 *   token={resetToken}
 *   onBackToLogin={handleBackToLogin}
 * />
 * ```
 */

'use client';

import React, { useState } from 'react';
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
import { PasswordInput } from '@/components/ui/password-input';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth';
import { cn } from '@/lib/utils';

// ============================================
// 🎯 INTERFACE DEFINITIONS
// ============================================

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  token?: string;
  onBackToLogin?: () => void;
  className?: string;
}

// ============================================
// 🔐 RESET PASSWORD FORM COMPONENT
// ============================================

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
  token,
  onBackToLogin,
  className,
}) => {
  // ============================================
  // 🎣 HOOKS & STATE
  // ============================================

  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      token: token || '',
    },
  });

  // ============================================
  // 🎯 EVENT HANDLERS
  // ============================================

  const handleSubmit = async (data: ResetPasswordFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handling is done by parent component
      console.error('Reset password form submission error:', error);
    }
  };

  const handleBackToLoginClick = () => {
    onBackToLogin?.();
  };

  const handlePasswordFocus = () => {
    setShowPasswordStrength(true);
  };

  const handlePasswordBlur = () => {
    setShowPasswordStrength(false);
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
            <h1 className='text-2xl font-bold text-gray-900'>Reset your password</h1>
            <p className='mt-2 text-sm text-gray-600'>
              Enter your new password below. Make sure it's strong and secure.
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

          {/* Password Requirements Info */}
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
                <h3 className='text-sm font-medium text-blue-800'>Password requirements</h3>
                <div className='mt-2 text-sm text-blue-700'>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>At least 8 characters long</li>
                    <li>Contains uppercase and lowercase letters</li>
                    <li>Contains at least one number</li>
                    <li>Contains at least one special character</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* New Password Field */}
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder='Enter your new password'
                    disabled={isLoading}
                    autoComplete='new-password'
                    className='w-full'
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                    showStrength={showPasswordStrength}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder='Confirm your new password'
                    disabled={isLoading}
                    autoComplete='new-password'
                    className='w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hidden Token Field */}
          {token && (
            <FormField
              control={form.control}
              name='token'
              render={({ field }) => (
                <FormControl>
                  <input type='hidden' {...field} />
                </FormControl>
              )}
            />
          )}

          {/* Submit Button */}
          <Button type='submit' className='w-full' disabled={isLoading} loading={isLoading}>
            {isLoading ? 'Resetting password...' : 'Reset password'}
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

export default ResetPasswordForm;
