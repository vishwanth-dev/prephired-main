import React from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: 'default' | 'hero' | 'section' | 'card';
  className?: string;
  children: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({
  level = 1,
  variant = 'default',
  className,
  children,
}) => {
  const baseClasses = 'font-poppins font-semibold leading-[1.5em]';

  const variantClasses = {
    default: 'text-gray-900',
    hero: 'text-[#F0806C]',
    section: 'text-gray-800',
    card: 'text-[#F0806C]',
  };

  const sizeClasses = {
    1: 'text-2xl sm:text-3xl lg:text-4xl',
    2: 'text-xl sm:text-2xl lg:text-3xl',
    3: 'text-lg sm:text-xl lg:text-2xl',
    4: 'text-base sm:text-lg lg:text-xl',
    5: 'text-sm sm:text-base lg:text-lg',
    6: 'text-xs sm:text-sm lg:text-base',
  };

  const renderHeading = () => {
    const classes = cn(baseClasses, variantClasses[variant], sizeClasses[level], className);

    switch (level) {
      case 1:
        return <h1 className={classes}>{children}</h1>;
      case 2:
        return <h2 className={classes}>{children}</h2>;
      case 3:
        return <h3 className={classes}>{children}</h3>;
      case 4:
        return <h4 className={classes}>{children}</h4>;
      case 5:
        return <h5 className={classes}>{children}</h5>;
      case 6:
        return <h6 className={classes}>{children}</h6>;
      default:
        return <h1 className={classes}>{children}</h1>;
    }
  };

  return renderHeading();
};
