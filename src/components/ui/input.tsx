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
          <Label htmlFor={id} className={cn('text-font-prime-color font-poppins', labelClassName)}>
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
              'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-full border !bg-white px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent  file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ',
              'focus-visible:border-transparent focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
              'body-medium 2xl:body-regular',
              hasPrefix && 'pl-10',
              hasSuffix && 'pr-10',
              '2xl:px-6 2xl:py-4 md:px-4 md:py-3 px-3 py-2',
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
        {error && <p className='text-red-500 body-small'>{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
