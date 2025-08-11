'use client';

import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/atoms/input';

interface PasswordInputProps {
  label: string;
  labelClassName?: string;
  required?: boolean;
  placeholder: string;
  error?: string | undefined;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, required = false, onFocus, onBlur, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className='flex flex-col gap-1 w-full'>
        <Input
          ref={ref}
          label={label}
          type={showPassword ? 'text' : 'password'}
          required={required ?? false}
          onFocus={onFocus}
          onBlur={onBlur}
          suffixIcon={
            <div
              onClick={() => setShowPassword(!showPassword)}
              className='text-[#989898] hover:text-[#F0806C] hover:bg-transparent cursor-pointer'
            >
              {showPassword ? (
                <EyeOff className='w-6 h-6 text-[#989898]' />
              ) : (
                <Eye className='w-6 h-6 text-[#989898]' />
              )}
            </div>
          }
          {...props}
        />
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
