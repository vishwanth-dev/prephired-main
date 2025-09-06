/**
 * 🔒 Password Strength Component
 *
 * This component provides password strength visualization following SOLID principles:
 * - Single Responsibility: Only handles password strength display
 * - Open/Closed: Extensible through props and customization
 * - Liskov Substitution: Can be replaced with other strength components
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Depends on abstractions (props)
 *
 * 📋 Features:
 * - Real-time password strength calculation
 * - Visual strength indicator
 * - Detailed feedback and suggestions
 * - Accessibility support
 * - Customizable styling
 *
 * 🔧 Usage:
 * ```tsx
 * <PasswordStrength
 *   password={password}
 *   showFeedback={true}
 *   className="w-full"
 * />
 * ```
 */

'use client';

import React from 'react';
import { getPasswordStrength } from '@/lib/validations/auth';
import { cn } from '@/lib/utils';

// ============================================
// 🎯 INTERFACE DEFINITIONS
// ============================================

interface PasswordStrengthProps {
  password: string;
  showFeedback?: boolean;
  showSuggestions?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'detailed';
}

interface PasswordStrengthIndicatorProps {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// ============================================
// 🔒 PASSWORD STRENGTH COMPONENT
// ============================================

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
  showFeedback = true,
  showSuggestions = true,
  className,
  size = 'md',
  variant = 'default',
}) => {
  // ============================================
  // 🎯 STRENGTH CALCULATION
  // ============================================

  const strength = getPasswordStrength(password);

  // Don't show anything for empty passwords
  if (!password) {
    return null;
  }

  // ============================================
  // 🎨 RENDER
  // ============================================

  return (
    <div className={cn('password-strength', className)}>
      {/* Strength Indicator */}
      <PasswordStrengthIndicator
        score={strength.score}
        label={strength.label}
        color={strength.color}
        size={size}
        className='mb-2'
      />

      {/* Feedback and Suggestions */}
      {showFeedback && variant === 'detailed' && (
        <div className='space-y-2'>
          {/* Current Status */}
          <div className='text-sm text-gray-600'>
            Password strength:{' '}
            <span className={`font-medium text-${strength.color}-600`}>{strength.label}</span>
          </div>

          {/* Suggestions */}
          {showSuggestions && strength.score < 4 && (
            <div className='text-sm text-gray-500'>
              <p className='font-medium mb-1'>Suggestions:</p>
              <ul className='list-disc list-inside space-y-1'>
                {password.length < 8 && <li>Use at least 8 characters</li>}
                {!/[A-Z]/.test(password) && <li>Include uppercase letters</li>}
                {!/[a-z]/.test(password) && <li>Include lowercase letters</li>}
                {!/\d/.test(password) && <li>Include numbers</li>}
                {!/[@$!%*?&#]/.test(password) && <li>Include special characters (@$!%*?&#)</li>}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// 📊 PASSWORD STRENGTH INDICATOR COMPONENT
// ============================================

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  score,
  label,
  color,
  size = 'md',
  className,
}) => {
  // ============================================
  // 🎯 SIZE CONFIGURATION
  // ============================================

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'h-2',
          bar: 'h-2',
          text: 'text-xs',
        };
      case 'md':
        return {
          container: 'h-3',
          bar: 'h-3',
          text: 'text-sm',
        };
      case 'lg':
        return {
          container: 'h-4',
          bar: 'h-4',
          text: 'text-base',
        };
      default:
        return {
          container: 'h-3',
          bar: 'h-3',
          text: 'text-sm',
        };
    }
  };

  const sizeClasses = getSizeClasses();

  // ============================================
  // 🎯 COLOR CONFIGURATION
  // ============================================

  const getColorClasses = () => {
    switch (color) {
      case 'red':
        return 'bg-red-500';
      case 'orange':
        return 'bg-orange-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const colorClass = getColorClasses();

  // ============================================
  // 🎨 RENDER
  // ============================================

  return (
    <div className={cn('space-y-1', className)}>
      {/* Progress Bar */}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses.container)}>
        <div
          className={cn(
            'transition-all duration-300 ease-in-out rounded-full',
            colorClass,
            sizeClasses.bar
          )}
          style={{ width: `${(score / 4) * 100}%` }}
        />
      </div>

      {/* Label */}
      <div className={cn('text-center font-medium', sizeClasses.text, `text-${color}-600`)}>
        {label}
      </div>
    </div>
  );
};

// ============================================
// 🎨 COMPACT PASSWORD STRENGTH COMPONENT
// ============================================

export const CompactPasswordStrength: React.FC<Omit<PasswordStrengthProps, 'variant'>> = props => (
  <PasswordStrength {...props} variant='compact' showFeedback={false} />
);

// ============================================
// 🎨 DETAILED PASSWORD STRENGTH COMPONENT
// ============================================

export const DetailedPasswordStrength: React.FC<Omit<PasswordStrengthProps, 'variant'>> = props => (
  <PasswordStrength {...props} variant='detailed' showFeedback={true} showSuggestions={true} />
);

// ============================================
// 🎯 EXPORT
// ============================================

export default PasswordStrength;
