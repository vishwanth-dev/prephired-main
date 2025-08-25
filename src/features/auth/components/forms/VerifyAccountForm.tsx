'use client';

import React, { useEffect } from 'react';
import { UseFormReturn, type FieldErrors } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/atoms/form';
import { AuthForm } from '@/features/auth/components/layout/AuthForm';
import { type VerifyAccountFormInput } from '@/features/auth/schema';
import { Mail, Phone, RefreshCw } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot, Button } from '@/components/atoms';

export interface VerifyAccountFormProps {
  form: UseFormReturn<VerifyAccountFormInput>;
  onSubmit: (data: VerifyAccountFormInput) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  resetError: () => void;
  verificationType: 'register' | 'login' | 'forgot-password';
  resendCountdown: number;
  handleResendOTP: () => Promise<void>;
}

export const VerifyAccountForm: React.FC<VerifyAccountFormProps> = ({
  form,
  onSubmit,
  isLoading,
  error,
  resetError,
  verificationType,
  resendCountdown,
  handleResendOTP,
}) => {
  const onError = (errors: FieldErrors<VerifyAccountFormInput>) => {
    console.log(errors);
  };
  const handleSubmit = form.handleSubmit(onSubmit, onError);

  // Reset error when form fields change
  useEffect(() => {
    const subscription = form.watch(() => {
      if (error) {
        resetError();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, error, resetError]);

  // Get verification type specific content
  const getVerificationContent = () => {
    switch (verificationType) {
      case 'register':
        return {
          title: 'Please enter OTP to verify your account',
          subtitle: `An OTP has been sent your email abc123@gmail.com`, // TODO: Replace with actual email from form
          icon: <Mail className='w-6 h-6 text-primary' />,
        };
      case 'login':
        return {
          title: 'Please enter OTP to login to your account',
          subtitle: 'Enter the code sent to your device',
          icon: <Phone className='w-6 h-6 text-primary' />,
        };
      case 'forgot-password':
        return {
          title: 'Reset Password',
          subtitle: 'Enter the verification code to reset your password',
          icon: <RefreshCw className='w-6 h-6 text-primary' />,
        };
      default:
        return {
          title: 'Please enter OTP to verify your account',
          subtitle: 'Enter the verification code',
          icon: <Mail className='w-6 h-6 text-primary' />,
        };
    }
  };

  const content = getVerificationContent();
  const otpLength = 6;

  return (
    <AuthForm type='verify' title={content.title} subtitle={content.subtitle} linkText=''>
      <div className='w-full max-w-[636px] mx-auto'>
        <div className='flex flex-col items-center gap-12 w-full'>
          {/* Main Content Section - Matching Figma design */}
          <div className='flex flex-col items-center gap-6 w-full'>
            {/* OTP Input Section */}
            <Form {...form}>
              <form onSubmit={handleSubmit} className='flex flex-col items-center gap-32 w-full'>
                <div className='flex flex-col gap-6'>
                  <FormField
                    control={form.control}
                    name='otp'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <InputOTP
                            maxLength={otpLength}
                            value={field.value || ''}
                            onChange={field.onChange}
                            className='gap-5'
                          >
                            <InputOTPGroup className='gap-5'>
                              {Array.from({ length: otpLength }, (_, index) => (
                                <InputOTPSlot
                                  index={index}
                                  className=' border-[1.63px] border-input rounded-[6.53px] bg-[rgba(230,102,26,0.02)] focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-center'
                                />
                              ))}
                              {/* <InputOTPSlot
                                index={0}
                                // className='w-[48.99px] h-[48.99px] text-lg font-semibold border-[1.63px] border-[#C8C8C8] rounded-[6.53px] bg-[rgba(230,102,26,0.02)] focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-center'
                              /> */}
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Error Display */}
                  {error && (
                    <div className='text-red-600 body-small p-4 bg-red-50 rounded-xl border border-red-200 w-full text-center max-w-md'>
                      {error}
                    </div>
                  )}
                  <div className='flex items-center justify-end gap-2 w-full'>
                    <span className='text-[14px] leading-[1.5em] font-normal text-[#626262]'>
                      Did not receive code?
                    </span>
                    <Button
                      type='button'
                      variant='link'
                      size='link'
                      onClick={handleResendOTP}
                      disabled={resendCountdown > 0 || isLoading}
                      className='text-[14px] leading-[1.5em] font-medium text-[#F35427] hover:text-[#F35427]/80 hover:underline p-0 h-auto'
                    >
                      {resendCountdown > 0 ? `Resend OTP in ${resendCountdown}s` : 'Resend OTP'}
                    </Button>
                  </div>
                </div>
                {/* Continue Button - Matching Figma design */}
                <Button
                  type='submit'
                  className='w-[369px]'
                  disabled={isLoading || (form.watch('otp')?.length || 0) !== 6}
                  loading={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Continue'}
                </Button>
              </form>
            </Form>

            {/* Resend OTP Section - Matching Figma design */}
          </div>
        </div>
      </div>
    </AuthForm>
  );
};
