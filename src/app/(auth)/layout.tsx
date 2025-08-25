'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn('min-h-screen flex bg-gradient', className)}>
      {/* Mobile & Tablet: Stack vertically with logo above form */}
      <div className='w-full flex flex-col lg:hidden'>
        {/* Logo Section - Mobile & Tablet */}
        <div className='flex justify-center pt-8 pb-6'>
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center'>
              <div className='w-4 h-4 bg-white rounded-sm' />
            </div>
            <span className='text-xl font-bold text-gray-800'>PREPAIRED</span>
          </div>
        </div>

        {/* Form Section - Mobile & Tablet */}
        <div className='flex-1 flex items-center justify-center px-6 xl:px-4 pb-8'>
          <div className='w-full max-w-sm md:max-w-2xl xl:max-w-[400px] mx-auto'>{children}</div>
        </div>
      </div>

      {/* Desktop: Side-by-side layout */}
      <div className='hidden lg:flex max-w-7xl mx-auto w-full'>
        {/* Left Section - Illustration */}
        <div className='lg:w-1/2 xl:w-1/2 2xl:w-1/2 relative overflow-hidden'>
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
              className='w-full h-auto max-w-[500px]'
            />
          </div>
        </div>

        {/* Right Section - Form */}
        <div className='lg:w-1/2 xl:w-1/2 2xl:w-1/2 flex items-center justify-center p-8'>
          <div className='w-full max-w-[500px] xl:max-w-[500px] 2xl:max-w-[600px]'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
