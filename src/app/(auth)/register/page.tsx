import { Metadata } from 'next';
import React from 'react';
import { RegistrationFormContainer } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Create Account - PrepHired',
  description: 'Join PrepHired and start your AI-powered interview preparation journey',
};

export default function RegisterPage() {
  return <RegistrationFormContainer />;
}

