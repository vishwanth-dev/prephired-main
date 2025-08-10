'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'min-h-screen flex bg-gradient-to-br from-orange-50 via-pink-50 to-orange-100',
        className
      )}
    >
      {/* Left Section - Illustration */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden'>
        {/* Logo */}
        <div className='absolute top-8 left-8 flex items-center space-x-2'>
          <div className='w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center'>
            <div className='w-4 h-4 bg-white rounded-sm' />
          </div>
          <span className='text-xl font-bold text-gray-800'>PREPAIRED</span>
        </div>

        {/* Main Illustration */}
        <div className='relative z-10 flex items-center justify-center h-full w-full'>
          <Image
            src='/images/illustrations/UserWithDesktop.svg'
            alt='illustration'
            width={500}
            height={500}
          />
        </div>
      </div>

      {/* Right Section - Form */}
      <div className='flex-1 flex items-center justify-center p-8'>
        <div className='w-full max-w-2xl'>{children}</div>
      </div>
    </div>
  );
};
