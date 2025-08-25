import { Metadata } from 'next';
import React from 'react';
import { ForgotPasswordContainer } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Forgot Password - PrepHired',
  description: 'Reset your password by entering your email or phone number',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordContainer />;
}
