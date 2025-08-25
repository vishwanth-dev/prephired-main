/**
 * 📝 Text Component
 *
 * Reusable text component following atomic design principles.
 */

import React from 'react';
import { cn } from '../../lib/utils';

export interface TextProps {
  variant?:
    | 'body'
    | 'body-large'
    | 'body-small'
    | 'lead'
    | 'caption'
    | 'small'
    | 'body-t1'
    | 'body-t2'
    | 'body-t3'
    | 'body-t4'
    | 'input';
  as?: 'p' | 'span' | 'div' | 'label';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  children: React.ReactNode;
}

const Text: React.FC<TextProps> = ({
  variant = 'body',
  as = 'p',
  weight,
  className,
  children,
  ...props
}) => {
  const Component = as;

  // Typography classes based on WunderUI design system
  const variantClasses = {
    body: 'text-body',
    'body-large': 'text-body-large',
    'body-small': 'text-body-small',
    lead: 'text-lead',
    caption: 'text-caption',
    small: 'text-sm',
    'body-t1': 'text-body-t1',
    'body-t2': 'text-body-t2',
    'body-t3': 'text-body-t3',
    'body-t4': 'text-body-t4',
    input: 'text-input',
  };

  // Weight classes
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const classes = cn(
    'font-sans',
    variantClasses[variant],
    weight && weightClasses[weight],
    className
  );

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

Text.displayName = 'Text';

export default Text;
