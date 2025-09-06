// components/ui/otp-input-field.tsx
'use client';

import * as React from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/design-system';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface OTPInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  length?: number;
  className?: string;
}

export function OTPInputField({
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  length = 6,
  className,
}: OTPInputFieldProps) {
  React.useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn('w-full flex justify-center', className)}
    >
      <InputOTP
        maxLength={length}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className='gap-3'
      >
        <InputOTPGroup className='gap-3'>
          {Array.from({ length }).map((_, index) => (
            <OTPSlot key={index} index={index} error={error} animationDelay={index * 0.05} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </motion.div>
  );
}

// Custom styled OTP slot to match your design
function OTPSlot({
  index,
  error,
  animationDelay = 0,
}: {
  index: number;
  error?: boolean;
  animationDelay?: number;
}) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: animationDelay,
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
    >
      <InputOTPSlot
        index={index}
        className={cn(
          // Base styles
          'w-12 h-12 text-lg font-semibold',
          'border rounded-lg transition-all duration-200',
          'shadow-sm',

          // Background
          'bg-[rgba(230,102,26,0.02)]',

          // Border styles
          error
            ? 'border-red-500 data-[active=true]:border-red-500'
            : 'border-[#C8C8C8] data-[active=true]:border-primary',

          // Focus/Active states
          'data-[active=true]:ring-2',
          error ? 'data-[active=true]:ring-red-500/20' : 'data-[active=true]:ring-primary/20',

          // Animation for error
          error && 'animate-shake',

          // Has value
          'has-[div]:border-primary'
        )}
      />
    </motion.div>
  );
}
