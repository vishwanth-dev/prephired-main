'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_ROUTES } from '@/constants/routes';

interface AuthFormProps {
  type: 'login' | 'register';
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
    const targetRoute = type === 'login' ? AUTH_ROUTES.REGISTER : AUTH_ROUTES.LOGIN;
    router.push(targetRoute);
  };

  return (
    <div className='w-full max-w-[636px]'>
      {/* Header Section */}
      <div className='flex flex-col gap-1.5 mb-[60px]'>
        <h1 className='text-[28px] font-normal font-poppins leading-[1.5em] text-[#363848]'>
          {title}
        </h1>
        <div className='flex gap-1.5'>
          <span className='text-[20px] font-normal font-poppins leading-[1.5em] text-[#363848]'>
            {subtitle}
          </span>
          <button
            type='button'
            className='text-[20px] font-medium font-poppins leading-[1.5em] text-[#F35427] hover:underline'
            onClick={handleLinkClick}
          >
            {linkText}
          </button>
        </div>
      </div>

      {/* Form Content */}
      {children}
    </div>
  );
};
