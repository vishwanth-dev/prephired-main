import React from 'react';
import { cn } from '../../lib/utils';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  variant?: 'default' | 'subheading';
}

const Heading: React.FC<HeadingProps> = ({
  level = 1,
  as,
  variant = 'default',
  className,
  children,
  ...props
}) => {
  // Determine the actual element to render
  const Component = as || `h${level}`;

  // Base classes for all headings
  const baseClasses = 'font-sans tracking-tight';

  // Typography classes based on WunderUI design system
  const typographyClasses = {
    1: 'text-h1 font-bold',
    2: 'text-h2 font-bold',
    3: 'text-h3 font-bold',
    4: 'text-h4 font-semibold',
    5: 'text-h5 font-bold',
    6: 'text-h6 font-semibold',
  };

  // Subheading variants
  const subheadingClasses = {
    1: 'text-subheading-h1 font-bold',
    2: 'text-subheading-h2 font-semibold',
    3: 'text-subheading-h3 font-semibold',
    4: 'text-subheading-h3 font-semibold',
    5: 'text-subheading-h3 font-semibold',
    6: 'text-subheading-h3 font-semibold',
  };

  const classes = cn(
    baseClasses,
    variant === 'subheading' ? subheadingClasses[level] : typographyClasses[level],
    className
  );

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

Heading.displayName = 'Heading';

export default Heading;
