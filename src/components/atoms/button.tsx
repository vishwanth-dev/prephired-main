import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer rounded-full',
  {
    variants: {
      variant: {
        default: 'bg-primary !text-white shadow-sm hover:bg-primary/95  active:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive/95',
        outline:
          'border-2 border-primary bg-white text-primary shadow-sm hover:bg-accent hover:text-primary active:bg-accent/80',
        secondary:
          'bg-light-secondary text-dark-primary shadow-sm hover:bg-light-primary active:bg-dark-grey',
        ghost:
          'text-dark-primary hover:bg-light-content hover:text-dark-primary active:bg-light-borders',
        link: 'text-blue-primary underline-offset-4 hover:underline active:text-blue-primary/80',
        success: 'bg-positive-state text-white shadow-sm hover:bg-green-600 active:bg-green-700',
        warning: 'bg-warning-state text-white shadow-sm hover:bg-red-600 active:bg-red-700',
        accent:
          'bg-yellow-primary text-dark-primary shadow-sm hover:bg-yellow-600 active:bg-yellow-700',
      },
      size: {
        xs: 'h-7 px-2.5 body-small font-normal [&_svg]:size-3.5',
        sm: 'h-8 px-3 body-small font-medium [&_svg]:size-4',
        base: 'h-10 px-4 body-medium font-medium [&_svg]:size-4',
        lg: 'h-12 px-6 body-regular font-semibold [&_svg]:size-5',
        xl: 'h-14 px-8 body-regular font-semibold [&_svg]:size-6',
        icon: 'size-10 [&_svg]:size-4',
        'icon-sm': 'size-8 [&_svg]:size-3.5',
        'icon-lg': 'size-12 [&_svg]:size-5',
        link: 'p-0 body-small 2xl:body-medium',
      },
      iconPosition: {
        none: '',
        prefix: '[&_svg:first-child]:order-first',
        suffix: '[&_svg:last-child]:order-last',
        only: 'justify-center [&_svg]:size-4',
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'base',
      iconPosition: 'none',
      weight: 'medium',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'prefix' | 'suffix' | 'only';
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      iconPosition,
      weight,
      icon,
      children,
      asChild = false,
      loading = false,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    // If icon is provided and no iconPosition specified, default to prefix
    const finalIconPosition = icon ? iconPosition || 'prefix' : 'none';

    // If icon is provided but no children, treat as icon-only button
    const isIconOnly = icon && !children;
    const finalIconPositionForIconOnly = isIconOnly ? 'only' : finalIconPosition;

    // Handle loading state
    const isDisabled = disabled || loading;

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            iconPosition: finalIconPositionForIconOnly,
            weight,
            className,
          }),
          fullWidth && 'w-full',
          loading && 'cursor-wait'
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className='animate-spin size-4'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            />
          </svg>
        )}
        {!loading && icon && finalIconPosition === 'prefix' && icon}
        {children}
        {!loading && icon && finalIconPosition === 'suffix' && icon}
        {!loading && icon && finalIconPosition === 'only' && icon}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
