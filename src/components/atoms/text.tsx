/**
 * 📝 Text Component
 *
 * Reusable text component following atomic design principles.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface TextProps {
  variant?: 'body' | 'caption' | 'label' | 'small';
  className?: string;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({ variant = 'body', className, children }) => {
  const baseClasses = 'font-poppins leading-[1.5em]';

  const variantClasses = {
    body: 'text-base lg:text-lg font-normal',
    caption: 'text-sm font-normal text-gray-600',
    label: 'text-sm font-medium text-gray-700',
    small: 'text-xs font-normal text-gray-500',
  };

  return <p className={cn(baseClasses, variantClasses[variant], className)}>{children}</p>;
};
