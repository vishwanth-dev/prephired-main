/**
 * 🏷️ Logo Component
 *
 * Reusable logo component following atomic design principles.
 */

import React from 'react';
import { cn } from '../../lib/utils';

export interface LogoProps {
  variant?: 'default' | 'squared' | 'rounded' | 'circle';
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  variant = 'default',
  size = 'medium',
  showText = true,
  className,
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  const textSizeClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
  };

  const variantClasses = {
    default: '',
    squared: 'rounded-lg',
    rounded: 'rounded-xl',
    circle: 'rounded-full',
  };

  const logoContent = (
    <div
      className={cn(
        'flex items-center justify-center',
        sizeClasses[size],
        variantClasses[variant],
        'bg-gradient-to-br from-red-400 via-pink-400 to-blue-400',
        className
      )}
    >
      {/* PrepAiRed Logo - Simplified version based on Figma design */}
      <div className='relative w-full h-full flex items-center justify-center'>
        {/* Main logo elements */}
        <div className='absolute inset-0 flex items-center justify-center'>
          {/* Red circle */}
          <div className='w-3 h-3 bg-red-400 rounded-full absolute -top-1 -left-1'></div>
          {/* Blue circle */}
          <div className='w-3 h-3 bg-blue-400 rounded-full absolute -top-1 -right-1'></div>
          {/* Yellow accent */}
          <div className='w-2 h-2 bg-yellow-400 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2'></div>
        </div>

        {/* Central element */}
        <div className='w-4 h-4 bg-white rounded-sm opacity-90'></div>
      </div>
    </div>
  );

  if (!showText) {
    return logoContent;
  }

  return (
    <div className='flex items-center gap-3'>
      {logoContent}
      <span className={cn('font-poppins font-bold text-dark-grey', textSizeClasses[size])}>
        PrepAiRed
      </span>
    </div>
  );
};

Logo.displayName = 'Logo';

export default Logo;
