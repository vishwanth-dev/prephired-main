'use client';

import React from 'react';
import { VerifyAccountForm } from '@/features/auth/components/forms/VerifyAccountForm';
import { useVerifyAccount } from '@/features/auth/hooks/useVerifyAccount';

export const VerifyAccountContainer: React.FC = () => {
  const verifyAccountLogic = useVerifyAccount();

  return <VerifyAccountForm {...verifyAccountLogic} />;
};
