'use client';

import * as React from 'react';

import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

const labelVariants = cva(
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70 body-medium 2xl:body-regular'
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={`${labelVariants()} ${className}`} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
