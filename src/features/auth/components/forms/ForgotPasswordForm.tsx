'use client';

import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/atoms/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/atoms/form';
import { AuthForm } from '@/features/auth/components/layout/AuthForm';
import { type ForgotPasswordFormInput } from '@/features/auth/schema';
import { Mail, ArrowLeft } from 'lucide-react';
import { EmailInput } from '@/features/auth/components/inputs/EmailInput';

export interface ForgotPasswordFormProps {
  form: UseFormReturn<ForgotPasswordFormInput>;
  onSubmit: (data: ForgotPasswordFormInput) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  resetError: () => void;
  isSuccess: boolean;
  goBackToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  form,
  onSubmit,
  isLoading,
  error,
  resetError,
  isSuccess,
  goBackToLogin,
}) => {
  const handleSubmit = form.handleSubmit(onSubmit);

  // Reset error when form fields change
  useEffect(() => {
    const subscription = form.watch(() => {
      if (error) {
        resetError();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, error, resetError]);

  if (isSuccess) {
    return (
      <AuthForm
        type='verify'
        title='Check Your Email'
        subtitle="We&apos;ve sent a password reset link to your email"
        linkText=''
      >
        <div className='flex flex-col items-center gap-8 w-full'>
          {/* Success Message */}
          <div className='text-center max-w-md'>
            <h3 className='body-large font-semibold text-gray-800 mb-3'>Reset Link Sent!</h3>
            <p className='body-medium text-gray-600 mb-6'>
              We&apos;ve sent a password reset link to your email address. Please check your inbox and
              follow the instructions to reset your password.
            </p>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col gap-4 w-full max-w-md'>
            <Button onClick={goBackToLogin} className='w-full' variant='outline'>
              Back to Login
            </Button>

            <Button onClick={() => window.location.reload()} className='w-full'>
              Send Another Link
            </Button>
          </div>
        </div>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      type='verify'
      title='Forgot Password?'
      subtitle='Enter your email or phone number to reset your password'
      linkText=''
    >
      <div className='flex flex-col items-center gap-8 w-full'>
        {/* Icon */}
        <div className='flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20'>
          <Mail className='w-8 h-8 text-primary' />
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className='flex flex-col items-center gap-6 w-full max-w-md'
          >
            <FormField
              control={form.control}
              name='emailOrPhone'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <EmailInput
                      {...field}
                      label='Email or Phone Number'
                      placeholder='Enter your email or phone'
                      required
                      error={form.formState.errors.emailOrPhone?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error Display */}
            {error && (
              <div className='text-red-600 body-small p-4 bg-red-50 rounded-xl border border-red-200 w-full text-center'>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type='submit'
              className='w-full px-8 py-3'
              disabled={isLoading}
              loading={isLoading}
              size='lg'
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </Form>

        {/* Back to Login Link */}
        <div className='text-center pt-4'>
          <button
            onClick={goBackToLogin}
            className='body-medium text-primary hover:text-primary/80 hover:underline transition-colors flex items-center gap-2 justify-center'
          >
            <ArrowLeft className='w-4 h-4' />
            <span>Back to Login</span>
          </button>
        </div>
      </div>
    </AuthForm>
  );
};
