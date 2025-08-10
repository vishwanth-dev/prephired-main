'use client';

import React, { forwardRef } from 'react';
import BasePhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const phoneInputVariants = cva(
  'flex w-full border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'rounded-md px-3 py-2',
        rounded: 'rounded-full px-4 py-2',
        minimal:
          'border-0 border-b-2 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-primary',
      },
      size: {
        sm: 'h-8 text-xs',
        default: 'h-10',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'size'>,
    VariantProps<typeof phoneInputVariants> {
  value?: string;
  onChange?: (value: string | undefined) => void;
  defaultCountry?: string;
  countries?: string[] | undefined;
  international?: boolean;
  withCountryCallingCode?: boolean;
  countrySelectComponent?: React.ComponentType<any>;
  numberInputComponent?: React.ComponentType<any>;
  error?: boolean;
  label?: string;
  hint?: string;
  errorMessage?: string;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      variant,
      size,
      value,
      onChange,
      defaultCountry = 'IN',
      countries,
      international = true,
      withCountryCallingCode = false,
      error,
      label,
      hint,
      errorMessage,
      disabled,
      placeholder = 'Enter phone number',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `phone-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className='space-y-2'>
        {label && (
          <label
            htmlFor={inputId}
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            {label}
          </label>
        )}

        <div className='relative'>
          <BasePhoneInput
            ref={ref}
            id={inputId}
            value={value}
            onChange={onChange}
            defaultCountry={defaultCountry}
            countries={countries}
            international={international}
            withCountryCallingCode={withCountryCallingCode}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              phoneInputVariants({ variant, size }),
              error && 'border-destructive focus-visible:ring-destructive',
              disabled && 'cursor-not-allowed opacity-50',
              className,
              "w-full bg-white border border-[#b1b1b1] rounded-[60px] pl-[120px] pr-6 py-4 font-['Poppins:Regular',_sans-serif] text-[#626262] text-base placeholder:text-[#989898] outline-none focus:border-[#f35427] transition-colors"
            )}
            {...props}
          />
        </div>

        {hint && !error && <p className='text-xs text-muted-foreground'>{hint}</p>}

        {error && errorMessage && <p className='text-xs text-destructive'>{errorMessage}</p>}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export { PhoneInput, phoneInputVariants };
