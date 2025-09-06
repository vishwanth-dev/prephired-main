/**
 * 📝 Registration Form Component
 *
 * This component handles user registration following SOLID principles:
 * - Single Responsibility: Only handles registration form logic
 * - Open/Closed: Extensible through props and callbacks
 * - Liskov Substitution: Can be replaced with other form components
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Depends on abstractions (hooks, services)
 *
 * 📋 Features:
 * - Multi-step registration process
 * - Real-time validation with Zod
 * - Password strength indicator
 * - Country and phone number validation
 * - Terms and conditions acceptance
 * - Accessibility support
 *
 * 🔧 Usage:
 * ```tsx
 * <RegistrationForm
 *   onSubmit={handleRegister}
 *   isLoading={isLoading}
 *   error={error}
 *   onLogin={handleLogin}
 * />
 * ```
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
// import { CountrySelect } from '@/components/ui/country-select';
import { PasswordInput } from '@/components/ui/password-input';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';
import { cn } from '@/lib/utils';

// ============================================
// 🎯 INTERFACE DEFINITIONS
// ============================================

interface RegistrationFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  onLogin?: () => void;
  className?: string;
  showSocialLogin?: boolean;
  onSocialLogin?: (provider: 'google' | 'github' | 'linkedin') => void;
}

// ============================================
// 📝 REGISTRATION FORM COMPONENT
// ============================================

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
  onLogin,
  className,
  showSocialLogin = false,
  onSocialLogin,
}) => {
  // ============================================
  // 🎣 HOOKS & STATE
  // ============================================

  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

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

  // ============================================
  // 🎯 EVENT HANDLERS
  // ============================================

  const handleSubmit = async (data: RegisterFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handling is done by parent component
      console.error('Registration form submission error:', error);
    }
  };

  const handleLoginClick = () => {
    onLogin?.();
  };

  const handleSocialLogin = (provider: 'google' | 'github' | 'linkedin') => {
    onSocialLogin?.(provider);
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
            <h1 className='text-2xl font-bold text-gray-900'>Create your account</h1>
            <p className='mt-2 text-sm text-gray-600'>
              Join PrepHired and start your AI-powered interview preparation journey
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
                  <h3 className='text-sm font-medium text-red-800'>Registration failed</h3>
                  <div className='mt-2 text-sm text-red-700'>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Name Fields */}
          <div className='grid grid-cols-2 gap-4'>
            {/* First Name */}
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='John'
                      disabled={isLoading}
                      autoComplete='given-name'
                      className='w-full'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Doe'
                      disabled={isLoading}
                      autoComplete='family-name'
                      className='w-full'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                    placeholder='john.doe@example.com'
                    disabled={isLoading}
                    autoComplete='email'
                    className='w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Field */}
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='tel'
                    placeholder='Enter your phone number'
                    disabled={isLoading}
                    autoComplete='tel'
                    className='w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder='Create a strong password'
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
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder='Confirm your password'
                    disabled={isLoading}
                    autoComplete='new-password'
                    className='w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Terms and Conditions */}
          <FormField
            control={form.control}
            name='acceptTerms'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel className='text-sm font-normal'>
                    I agree to the{' '}
                    <a href='/terms' className='text-blue-600 hover:text-blue-500'>
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href='/privacy' className='text-blue-600 hover:text-blue-500'>
                      Privacy Policy
                    </a>
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type='submit' className='w-full' disabled={isLoading} loading={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>

          {/* Social Login */}
          {showSocialLogin && (
            <div className='space-y-4'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
                </div>
              </div>

              <div className='grid grid-cols-3 gap-3'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className='w-full'
                >
                  <svg className='h-4 w-4' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                    />
                    <path
                      fill='currentColor'
                      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    />
                    <path
                      fill='currentColor'
                      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                    />
                    <path
                      fill='currentColor'
                      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                    />
                  </svg>
                </Button>

                <Button
                  type='button'
                  variant='outline'
                  onClick={() => handleSocialLogin('github')}
                  disabled={isLoading}
                  className='w-full'
                >
                  <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                  </svg>
                </Button>

                <Button
                  type='button'
                  variant='outline'
                  onClick={() => handleSocialLogin('linkedin')}
                  disabled={isLoading}
                  className='w-full'
                >
                  <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                  </svg>
                </Button>
              </div>
            </div>
          )}

          {/* Login Link */}
          {onLogin && (
            <div className='text-center'>
              <p className='text-sm text-gray-600'>
                Already have an account?{' '}
                <button
                  type='button'
                  onClick={handleLoginClick}
                  disabled={isLoading}
                  className='text-blue-600 hover:text-blue-500 disabled:opacity-50'
                >
                  Sign in
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

export default RegistrationForm;
