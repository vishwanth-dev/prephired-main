'use client';

import React from 'react';
import { useRegistration } from '@/features/auth/hooks/useRegistration';
import { RegistrationForm } from '@/features/auth/components/forms/RegistrationForm';

export const RegistrationFormContainer: React.FC = () => {
  const registrationLogic = useRegistration();

  return <RegistrationForm {...registrationLogic} />;
};
