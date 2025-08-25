'use client';

import { ForgotPasswordForm } from '@/features/auth/components/forms/ForgotPasswordForm';
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';

export const ForgotPasswordContainer: React.FC = () => {
  const forgotPasswordLogic = useForgotPassword();

  return <ForgotPasswordForm {...forgotPasswordLogic} />;
};
