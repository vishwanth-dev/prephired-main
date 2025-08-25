'use client';

import React from 'react';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { LoginForm } from '@/features/auth/components/forms/LoginForm';

export const LoginFormContainer: React.FC = () => {
  const loginLogic = useLogin();

  return <LoginForm {...loginLogic} />;
};
