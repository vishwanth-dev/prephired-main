'use client';

import React, { useState, forwardRef } from 'react';
import { Input } from '@/components/atoms/input';
import Image from 'next/image';

export interface PasswordInputProps {
  label: string;
  labelClassName?: string;
  required?: boolean;
  placeholder: string;
  error?: string | undefined;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  disabled?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    { label, required = false, onFocus, onBlur, value, onChange, name, id, disabled, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
      <div className='flex flex-col gap-1 w-full'>
        <Input
          ref={ref}
          label={label}
          type={showPassword ? 'text' : 'password'}
          required={required}
          value={value}
          onChange={onChange}
          name={name}
          id={id}
          disabled={disabled}
          onFocus={onFocus}
          onBlur={onBlur}
          suffixIcon={
            <div
              onClick={() => setShowPassword(!showPassword)}
              className='text-support-text-color hover:text-primary hover:bg-transparent cursor-pointer'
            >
              <Image
                src={`/images/icons/${showPassword ? 'Eye' : 'EyeOff'}.svg`}
                alt='Show Password'
                width={24}
                height={24}
                className='2xl:w-6 2xl:h-6 w-5 h-5'
              />
            </div>
          }
          {...props}
        />
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
