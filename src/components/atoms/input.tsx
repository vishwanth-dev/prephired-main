import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from './label';

interface InputProps extends React.ComponentProps<'input'> {
  label?: string;
  labelClassName?: string;
  required?: boolean;
  error?: string | undefined;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  onPrefixClick?: () => void;
  onSuffixClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      labelClassName,
      required,
      error = null,
      id,
      prefixIcon,
      suffixIcon,
      onPrefixClick,
      onSuffixClick,
      ...props
    },
    ref
  ) => {
    const hasPrefix = !!prefixIcon;
    const hasSuffix = !!suffixIcon;

    return (
      <div className='flex flex-col gap-2'>
        {label && (
          <Label
            htmlFor={id}
            className={cn(
              'text-sm font-normal leading-none text-font-prime-color font-poppins',
              labelClassName
            )}
          >
            {label} {required && <span className='text-primary'>*</span>}
          </Label>
        )}
        <div className='relative'>
          {prefixIcon && (
            <div
              className={cn(
                'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400',
                onPrefixClick && 'cursor-pointer hover:text-gray-600'
              )}
              onClick={onPrefixClick}
            >
              {prefixIcon}
            </div>
          )}
          <input
            type={type}
            id={id}
            className={cn(
              'border-input bg-white text-primary-foreground  file:text-foreground placeholder:text-support-text-color flex w-full rounded-full border  text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:border-ring focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-base',
              hasPrefix && 'pl-10',
              hasSuffix && 'pr-10',
              error && 'border-red-500 focus-visible:ring-red-500',
              'px-6 py-4',
              className
            )}
            ref={ref}
            {...props}
          />
          {suffixIcon && (
            <div
              className={cn(
                'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400',
                onSuffixClick && 'cursor-pointer hover:text-gray-600'
              )}
              onClick={onSuffixClick}
            >
              {suffixIcon}
            </div>
          )}
        </div>
        {error && <p className='text-red-500 text-xs'>{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
