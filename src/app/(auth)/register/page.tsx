import { Metadata } from 'next';
import React from 'react';
import { RegisterContainer } from '@/features/auth/containers/RegisterContainer';

export const metadata: Metadata = {
  title: 'Create Account - prepAI',
  description: 'Join prepAI and start your AI-powered interview preparation journey',
};

export default function RegisterPage() {
  return <RegisterContainer />;
}
