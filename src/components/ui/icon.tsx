import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const iconVariants = cva('inline-block', {
  variants: {
    size: {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8',
      '2xl': 'w-12 h-12',
      '3xl': 'w-16 h-16',
    },
    color: {
      default: 'text-gray-900',
      muted: 'text-gray-600',
      orange: 'text-orange-500',
      white: 'text-white',
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'default',
  },
});

export interface IconProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof iconVariants> {
  children: React.ReactNode;
}

const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  ({ className, size, color, children, ...props }, ref) => {
    return (
      <span className={cn(iconVariants({ size, color, className }))} ref={ref} {...props}>
        {children}
      </span>
    );
  }
);

Icon.displayName = 'Icon';

export { Icon, iconVariants };
