import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-blue-primary text-white hover:bg-blue-600',
        secondary: 'border-transparent bg-light-secondary text-dark-primary hover:bg-light-primary',
        destructive: 'border-transparent bg-red-primary text-white hover:bg-red-600',
        outline: 'text-dark-primary border-light-borders bg-white hover:bg-light-background',
        success: 'border-transparent bg-positive-state text-white hover:bg-green-600',
        warning: 'border-transparent bg-warning-state text-white hover:bg-red-600',
        accent: 'border-transparent bg-yellow-primary text-dark-primary hover:bg-yellow-600',
        purple: 'border-transparent bg-purple-primary text-white hover:bg-purple-600',
        indigo: 'border-transparent bg-indigo-primary text-white hover:bg-indigo-600',
        pink: 'border-transparent bg-pink-primary text-white hover:bg-pink-600',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge: React.FC<BadgeProps> = ({ className, variant, size, ...props }) => {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
};

Badge.displayName = 'Badge';

export default Badge;
