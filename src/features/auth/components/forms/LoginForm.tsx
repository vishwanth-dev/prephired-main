'use client';

import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/atoms/button';
import { Label } from '@/components/atoms/label';
import { EmailInput } from '@/features/auth/components/inputs/EmailInput';
import { PasswordInput } from '@/features/auth/components/inputs/PasswordInput';
import { AuthForm } from '@/features/auth/components/layout/AuthForm';
import { type LoginFormInput } from '@/features/auth/schema';
import { Form, FormControl, FormField, FormItem } from '@/components/atoms/form';

export interface LoginFormProps {
  form: UseFormReturn<LoginFormInput>;
  onSubmit: (data: LoginFormInput) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  resetError: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  form,
  onSubmit,
  isLoading,
  error,
  resetError,
}) => {
  const handleSubmit = form.handleSubmit(onSubmit);

  useEffect(() => {
    const subscription = form.watch(() => {
      if (error) {
        resetError();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, error, resetError]);

  return (
    <AuthForm
      type='login'
      title='Welcome back'
      subtitle="Don't have an account,"
      linkText='Create new account'
    >
      <Form {...form}>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <FormField
            control={form.control}
            name='emailOrPhone'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <EmailInput
                    {...field}
                    label='Email'
                    placeholder='Enter your email'
                    required
                    error={form.formState.errors.emailOrPhone?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    {...field}
                    label='Password'
                    placeholder='Enter your password'
                    required
                    error={form.formState.errors.password?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0'>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='rememberMe'
                {...form.register('rememberMe')}
                className='rounded border-gray-300'
              />
              <Label htmlFor='rememberMe' className='body-small'>
                Remember me
              </Label>
            </div>

            {/* Forgot Password Link */}
            <a
              href='/forgot-password'
              className='body-small text-primary hover:text-primary/80 hover:underline transition-colors self-start sm:self-auto'
            >
              Forgot Password?
            </a>
          </div>

          {error && (
            <div className='text-red-600 body-small p-3 bg-red-50 rounded-md border border-red-200'>
              {error}
            </div>
          )}

          <Button
            type='submit'
            className='w-full sm:w-full md:w-fit mx-auto'
            disabled={isLoading}
            loading={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
};
