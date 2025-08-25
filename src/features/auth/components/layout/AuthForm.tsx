'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_ROUTES } from '@/constants/routes';

interface AuthFormProps {
  type: 'login' | 'register' | 'verify';
  title: string;
  subtitle: string;
  linkText: string;
  children: React.ReactNode;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  type,
  title,
  subtitle,
  linkText,
  children,
}) => {
  const router = useRouter();

  const handleLinkClick = () => {
    if (type === 'verify') return; // No navigation for verify type

    const targetRoute = type === 'login' ? AUTH_ROUTES.REGISTER : AUTH_ROUTES.LOGIN;
    router.push(targetRoute);
  };

  return (
    <div className='w-full'>
      {/* Header Section */}
      <div className='flex flex-col gap-2 mb-6 md:mb-8 2xl:mb-12'>
        <h1 className='subheading-large text-side-heading-color font-normal'>{title}</h1>
        <div className='flex gap-1.5 flex-col sm:flex-row sm:items-start'>
          <span className='text-side-heading-color body-medium sm:body-regular'>{subtitle}</span>
          {linkText && (
            <button
              type='button'
              className='body-medium sm:body-regular text-primary hover:underline self-start'
              onClick={handleLinkClick}
            >
              {linkText}
            </button>
          )}
        </div>
      </div>
      {/* Form Content */}
      {children}
    </div>
  );
};
