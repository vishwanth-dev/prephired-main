'use client';

import React from 'react';
import { useForm, type SubmitErrorHandler } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import { Button } from '@/components/atoms/button';
import { PasswordInput } from '@/features/auth/components/inputs/PasswordInput';
import { PasswordStrengthMeter } from '@/features/auth/components/display/PasswordStrengthMeter';
import { type RegisterFormData } from '@/features/auth/schema';
import { MailIcon, User } from 'lucide-react';
import { PhoneInput } from '@/components/atoms';
import { AuthForm } from '@/features/auth/components/layout/AuthForm';

export interface RegistrationFormProps {
  form: ReturnType<typeof useForm<RegisterFormData>>;
  onSubmit: (data: RegisterFormData) => Promise<void>;
  onError: SubmitErrorHandler<RegisterFormData>;
  isLoading: boolean;
  error: string | null;
  resetError: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  form,
  onSubmit,
  onError,
  isLoading,
  error,
  resetError,
}) => {
  const handleSubmit = form.handleSubmit(onSubmit, onError);

  // Reset error when form fields change
  React.useEffect(() => {
    const subscription = form.watch(() => {
      if (error) {
        resetError();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, error, resetError]);

  return (
    <AuthForm
      type='register'
      title='Registration'
      subtitle='If you already have an account,'
      linkText='Login here'
    >
      <Form {...form}>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col items-center gap-4 sm:gap-5 md:gap-6 w-full'
        >
          {/* Name fields - Single column on mobile, 2 columns on tablet+ */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='Enter your first name'
                      {...field}
                      label='First Name'
                      required
                      suffixIcon={<User className='w-5 h-5 sm:w-6 sm:h-6 text-[#989898]' />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='Enter your last name'
                      {...field}
                      label='Last Name'
                      required
                      suffixIcon={<User className='w-5 h-5 sm:w-6 sm:h-6 text-[#989898]' />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Contact fields - Single column on mobile, 2 columns on tablet+ */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'>
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PhoneInput
                      label='Phone Number'
                      placeholder='9876543210'
                      defaultCountry='+91'
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='Enter your email'
                      {...field}
                      label='Email'
                      suffixIcon={<MailIcon className='w-5 h-5 sm:w-6 sm:h-6 text-[#989898]' />}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Password fields - Single column on mobile, 2 columns on tablet+ */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => {
                const [showTooltip, setShowTooltip] = React.useState(false);

                return (
                  <FormItem className='relative'>
                    <FormControl>
                      <PasswordInput
                        label='Password'
                        placeholder='Enter your password'
                        {...field}
                        required
                        onFocus={() => setShowTooltip(true)}
                        onBlur={() => {
                          // Small delay to allow clicking on tooltip
                          setTimeout(() => {
                            if (!field.value) {
                              setShowTooltip(false);
                            }
                          }, 100);
                        }}
                      />
                    </FormControl>

                    {/* Password strength tooltip - show on focus or when has content */}
                    {showTooltip && field.value && (
                      <div
                        className='absolute top-1/2 left-0 z-50 mt-1'
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => {
                          if (!field.value) {
                            setShowTooltip(false);
                          }
                        }}
                      >
                        <PasswordStrengthMeter
                          password={field.value}
                          showAsTooltip={true}
                          tooltipPosition='left'
                          policy={{
                            minLength: 8,
                            requireUppercase: true,
                            requireLowercase: true,
                            requireNumbers: true,
                            requireSpecialChars: true,
                            maxLength: 128,
                          }}
                        />
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      label='Confirm Password'
                      placeholder='Re-Enter your Password'
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Terms and Conditions Checkbox */}
          <FormField
            control={form.control}
            name='acceptTerms'
            render={({ field }) => (
              <FormItem className='w-full flex items-start'>
                <div className='flex items-start gap-3'>
                  <FormControl>
                    <input
                      type='checkbox'
                      id='acceptTerms'
                      className='mt-1 w-4 h-4 border border-[#F0806C] rounded-sm accent-[#F0806C]'
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <label
                    htmlFor='acceptTerms'
                    className='body-small sm:body-medium font-normal font-poppins leading-[1.5em] text-[#626262] cursor-pointer'
                  >
                    I have read and accept Terms of Use, Privacy Policy, Terms & Conditions
                  </label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Error Display */}
          {error && (
            <div className='text-red-600 body-small p-3 bg-red-50 rounded-md border border-red-200 w-full'>
              {error}
            </div>
          )}

          <Button
            type='submit'
            className='w-full sm:w-full md:w-fit mx-auto self-center'
            disabled={isLoading}
            loading={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
};
