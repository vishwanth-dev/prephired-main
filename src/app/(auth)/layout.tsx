import { AuthLayout } from '@/components/templates/Layouts/AuthLayout/AuthLayout';
import React from 'react';

const AuthLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default AuthLayoutWrapper;
