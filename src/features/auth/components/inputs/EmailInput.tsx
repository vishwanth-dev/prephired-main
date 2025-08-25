import React from 'react';
import { Input } from '@/components/atoms/input';
import Image from 'next/image';

export interface EmailInputProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string | undefined;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
  disabled?: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  label,
  placeholder = 'Enter your email',
  required = false,
  error = '',
  value = '',
  onChange,
  onBlur,
  name,
  id,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <Input
      type='email'
      id={id}
      name={name}
      label={label || ''}
      required={required}
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      placeholder={placeholder}
      error={error}
      disabled={disabled}
      className='w-full'
      suffixIcon={
        <Image
          src='/images/icons/User.svg'
          alt='Email'
          width={24}
          height={24}
          className='2xl:w-6 md:h-6 w-5 h-5'
        />
      }
    />
  );
};
