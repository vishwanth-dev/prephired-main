import React from 'react';
import { useForm, type SubmitErrorHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import { Button } from '@/components/atoms/button';
import { PasswordInput } from '@/features/auth/components/inputs/PasswordInput';
import { PasswordStrengthMeter } from '@/features/auth/components/display/PasswordStrengthMeter';
import { registerSchema, type RegisterFormData } from '@/features/auth/schema';
import { MailIcon, User } from 'lucide-react';
import { PhoneInput } from '@/components/atoms';
import { AuthForm } from '@/features/auth/components/layout/AuthForm';

export const RegistrationForm: React.FC = () => {
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

  // Manage visibility of the password strength tooltip.
  // The previous implementation created this state inside the
  // `render` callback of `FormField`, which violates the React
  // Hooks rules by calling `useState` conditionally. Defining it
  // here ensures the hook executes consistently on every render.
  const [showTooltip, setShowTooltip] = React.useState(false);

  const onSubmit = (data: RegisterFormData) => {
    console.log(data);
    // Handle form submission
  };

  const onError: SubmitErrorHandler<RegisterFormData> = errors => {
    console.log(errors);
  };

  return (
    <AuthForm
      type='register'
      title='Registration'
      subtitle='If you already have an account,'
      linkText='Login here'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className='space-y-6'>
          {/* Name fields - 2 columns */}
          <div className='grid grid-cols-2 gap-4'>
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
                      suffixIcon={<User className='w-6 h-6 text-[#989898]' />}
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
                      suffixIcon={<User className='w-6 h-6 text-[#989898]' />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Contact fields - 2 columns */}
          <div className='grid grid-cols-2 gap-4'>
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
                      suffixIcon={<MailIcon className='w-6 h-6 text-[#989898]' />}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Password fields - 2 columns */}
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => {
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
              <FormItem>
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
                    className='text-sm font-normal font-poppins leading-[1.5em] text-[#626262] cursor-pointer'
                  >
                    I have read and accept Terms of Use, Privacy Policy, Terms & Conditions
                  </label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
};
