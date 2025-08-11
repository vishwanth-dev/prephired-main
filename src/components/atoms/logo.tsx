/**
 * 🏷️ Logo Component
 *
 * Reusable logo component following atomic design principles.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'default', className }) => {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div
        className={cn(
          'bg-gray-800 rounded-lg flex items-center justify-center',
          variant === 'default' ? 'w-8 h-8' : 'w-6 h-6'
        )}
      >
        <div className={cn('bg-white rounded-sm', variant === 'default' ? 'w-4 h-4' : 'w-3 h-3')} />
      </div>
      <span
        className={cn('font-bold text-gray-800', variant === 'default' ? 'text-xl' : 'text-lg')}
      >
        PREPAIRED
      </span>
    </div>
  );
};
