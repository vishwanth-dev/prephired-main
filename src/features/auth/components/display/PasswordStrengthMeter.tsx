'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { assessPasswordStrength, DEFAULT_PASSWORD_POLICY } from '../../domain/rules';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
  policy?: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxLength: number;
  };
  showAsTooltip?: boolean;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  policy = DEFAULT_PASSWORD_POLICY,
  showAsTooltip = false,
  tooltipPosition = 'bottom',
  className,
}) => {
  if (!password) return null;

  // Dynamically assess password strength
  const strength = assessPasswordStrength(password, policy);

  const strengthConfig = {
    weak: {
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: XCircle,
      label: 'Weak Password',
    },
    fair: {
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      icon: AlertCircle,
      label: 'Fair Password',
    },
    good: {
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: AlertCircle,
      label: 'Good Password',
    },
    strong: {
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: CheckCircle,
      label: 'Strong Password',
    },
  };

  const config = strengthConfig[strength.level];
  const IconComponent = config.icon;

  // Calculate percentage for progress bar
  const maxScore = 6;
  const percentage = Math.round((strength.score / maxScore) * 100);

  // Tooltip positioning classes
  const tooltipPositionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  // Compact tooltip version
  if (showAsTooltip) {
    return (
      <div
        className={cn(
          'absolute z-50 w-80 p-3 rounded-lg border shadow-lg transition-all duration-300 ease-in-out',
          tooltipPositionClasses[tooltipPosition],
          config.bgColor,
          config.borderColor,
          className
        )}
      >
        {/* Arrow indicator */}
        <div
          className={cn(
            'absolute w-2 h-2 bg-white border transform rotate-45',
            tooltipPosition === 'top' && 'top-full -mt-1 left-1/2 -ml-1 border-t-0 border-l-0',
            tooltipPosition === 'bottom' &&
              'bottom-full -mb-1 left-1/2 -ml-1 border-b-0 border-r-0',
            tooltipPosition === 'left' && 'left-full -ml-1 top-1/2 -mt-1 border-l-0 border-t-0',
            tooltipPosition === 'right' && 'right-full -mr-1 top-1/2 -mt-1 border-r-0 border-b-0'
          )}
          style={{
            borderColor: 'inherit',
          }}
        />

        {/* Header with icon and label */}
        <div className='flex items-center gap-2 mb-3'>
          <IconComponent className={cn('w-4 h-4 flex-shrink-0', config.textColor)} />
          <span className={cn('text-sm font-semibold', config.textColor)}>{config.label}</span>
          <span
            className={cn(
              'text-xs font-medium ml-auto px-2 py-1 rounded-full flex-shrink-0',
              config.textColor,
              config.bgColor
            )}
          >
            {strength.score}/{maxScore}
          </span>
        </div>

        {/* Progress bar */}
        <div className='mb-3'>
          <div className='flex items-center justify-between text-xs text-gray-600 mb-1'>
            <span>Password Strength</span>
            <span className='font-medium'>{percentage}%</span>
          </div>
          <div className='w-full h-2 bg-gray-200 rounded-full overflow-hidden'>
            <div
              className={cn(
                'h-full transition-all duration-500 ease-out rounded-full',
                config.color
              )}
              style={{
                width: `${percentage}%`,
                transition: 'width 0.5s ease-out, background-color 0.3s ease-out',
              }}
            />
          </div>
        </div>

        {/* Requirements checklist - compact */}
        <div className='space-y-1.5'>
          <div className='text-xs font-medium text-gray-700 mb-2'>Requirements:</div>

          {/* Length requirement */}
          <div className='flex items-center gap-2'>
            {password.length >= policy.minLength ? (
              <CheckCircle className='w-3.5 h-3.5 text-green-500 flex-shrink-0' />
            ) : (
              <XCircle className='w-3.5 h-3.5 text-red-400 flex-shrink-0' />
            )}
            <span
              className={cn(
                'text-xs',
                password.length >= policy.minLength ? 'text-green-600' : 'text-red-500'
              )}
            >
              At least {policy.minLength} characters
            </span>
          </div>

          {/* Uppercase requirement */}
          <div className='flex items-center gap-2'>
            {/[A-Z]/.test(password) ? (
              <CheckCircle className='w-3.5 h-3.5 text-green-500 flex-shrink-0' />
            ) : (
              <XCircle className='w-3.5 h-3.5 text-red-400 flex-shrink-0' />
            )}
            <span
              className={cn('text-xs', /[A-Z]/.test(password) ? 'text-green-600' : 'text-red-500')}
            >
              One uppercase letter
            </span>
          </div>

          {/* Lowercase requirement */}
          <div className='flex items-center gap-2'>
            {/[a-z]/.test(password) ? (
              <CheckCircle className='w-3.5 h-3.5 text-green-500 flex-shrink-0' />
            ) : (
              <XCircle className='w-3.5 h-3.5 text-red-400 flex-shrink-0' />
            )}
            <span
              className={cn('text-xs', /[a-z]/.test(password) ? 'text-green-600' : 'text-red-500')}
            >
              One lowercase letter
            </span>
          </div>

          {/* Numbers requirement */}
          <div className='flex items-center gap-2'>
            {/\d/.test(password) ? (
              <CheckCircle className='w-3.5 h-3.5 text-green-500 flex-shrink-0' />
            ) : (
              <XCircle className='w-3.5 h-3.5 text-red-400 flex-shrink-0' />
            )}
            <span
              className={cn('text-xs', /\d/.test(password) ? 'text-green-600' : 'text-red-500')}
            >
              One number
            </span>
          </div>

          {/* Special characters requirement */}
          <div className='flex items-center gap-2'>
            {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? (
              <CheckCircle className='w-3.5 h-3.5 text-green-500 flex-shrink-0' />
            ) : (
              <XCircle className='w-3.5 h-3.5 text-red-400 flex-shrink-0' />
            )}
            <span
              className={cn(
                'text-xs',
                /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-red-500'
              )}
            >
              One special character
            </span>
          </div>
        </div>

        {/* Additional feedback for non-strong passwords */}
        {strength.feedback.length > 0 && strength.level !== 'strong' && (
          <div className='mt-3 pt-3 border-t border-gray-200'>
            <div className='text-xs font-medium text-gray-700 mb-2'>Suggestions:</div>
            <div className='space-y-1'>
              {strength.feedback.slice(0, 2).map((suggestion, index) => (
                <div key={index} className='text-xs text-gray-600 flex items-start gap-2'>
                  <span className='w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0'></span>
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success message for strong passwords */}
        {strength.level === 'strong' && (
          <div className='mt-3 pt-3 border-t border-green-200'>
            <div className='flex items-center gap-2 text-green-600'>
              <CheckCircle className='w-4 h-4 flex-shrink-0' />
              <span className='text-xs font-medium'>
                Excellent! Your password meets all security requirements.
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Original inline version (fallback)
  return (
    <div
      className={cn(
        'p-3 rounded-lg border transition-all duration-300 ease-in-out max-w-full',
        config.bgColor,
        config.borderColor
      )}
    >
      {/* Header with icon and label */}
      <div className='flex items-center gap-2 mb-3'>
        <IconComponent className={cn('w-4 h-4 flex-shrink-0', config.textColor)} />
        <span className={cn('text-sm font-semibold truncate', config.textColor)}>
          {config.label}
        </span>
        <span
          className={cn(
            'text-xs font-medium ml-auto px-2 py-1 rounded-full flex-shrink-0',
            config.textColor,
            config.bgColor
          )}
        >
          {strength.score}/{maxScore}
        </span>
      </div>

      {/* Progress bar */}
      <div className='mb-3'>
        <div className='flex items-center justify-between text-xs text-gray-600 mb-1'>
          <span>Password Strength</span>
          <span className='font-medium'>{percentage}%</span>
        </div>
        <div className='w-full h-2 bg-gray-200 rounded-full overflow-hidden'>
          <div
            className={cn('h-full transition-all duration-500 ease-out rounded-full', config.color)}
            style={{
              width: `${percentage}%`,
              transition: 'width 0.5s ease-out, background-color 0.3s ease-out',
            }}
          />
        </div>
      </div>

      {/* Requirements checklist - more compact */}
      <div className='space-y-1.5'>
        <div className='text-xs font-medium text-gray-700 mb-2'>Requirements:</div>

        {/* Length requirement */}
        <div className='flex items-center gap-2'>
          {password.length >= policy.minLength ? (
            <CheckCircle className='w-3.5 h-3.5 text-green-500 flex-shrink-0' />
          ) : (
            <XCircle className='w-3.5 h-3.5 text-red-400 flex-shrink-0' />
          )}
          <span
            className={cn(
              'text-xs truncate',
              password.length >= policy.minLength ? 'text-green-600' : 'text-red-500'
            )}
          >
            At least {policy.minLength} characters
          </span>
        </div>

        {/* Uppercase requirement */}
        <div className='flex items-center gap-2'>
          {/[A-Z]/.test(password) ? (
            <CheckCircle className='w-3.5 h-3.5 text-green-500 flex-shrink-0' />
          ) : (
            <XCircle className='w-3.5 h-3.5 text-red-400 flex-shrink-0' />
          )}
          <span
            className={cn(
              'text-xs truncate',
              /[A-Z]/.test(password) ? 'text-green-600' : 'text-red-500'
            )}
          >
            One uppercase letter
          </span>
        </div>

        {/* Lowercase requirement */}
        <div className='flex items-center gap-2'>
          {/[a-z]/.test(password) ? (
            <CheckCircle className='w-3.5 h-3.5 text-green-500 flex-shrink-0' />
          ) : (
            <XCircle className='w-3.5 h-3.5 text-red-400 flex-shrink-0' />
          )}
          <span
            className={cn(
              'text-xs truncate',
              /[a-z]/.test(password) ? 'text-green-600' : 'text-red-500'
            )}
          >
            One lowercase letter
          </span>
        </div>

        {/* Numbers requirement */}
        <div className='flex items-center gap-2'>
          {/\d/.test(password) ? (
            <CheckCircle className='w-3.5 h-3.5 text-green-500 flex-shrink-0' />
          ) : (
            <XCircle className='w-3.5 h-3.5 text-red-400 flex-shrink-0' />
          )}
          <span
            className={cn(
              'text-xs truncate',
              /\d/.test(password) ? 'text-green-600' : 'text-red-500'
            )}
          >
            One number
          </span>
        </div>

        {/* Special characters requirement */}
        <div className='flex items-center gap-2'>
          {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? (
            <CheckCircle className='w-3.5 h-3.5 text-green-500 flex-shrink-0' />
          ) : (
            <XCircle className='w-3.5 h-3.5 text-red-400 flex-shrink-0' />
          )}
          <span
            className={cn(
              'text-xs truncate',
              /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-red-500'
            )}
          >
            One special character
          </span>
        </div>
      </div>

      {/* Additional feedback for non-strong passwords */}
      {strength.feedback.length > 0 && strength.level !== 'strong' && (
        <div className='mt-3 pt-3 border-t border-gray-200'>
          <div className='text-xs font-medium text-gray-700 mb-2'>Suggestions:</div>
          <div className='space-y-1'>
            {strength.feedback.slice(0, 2).map((suggestion, index) => (
              <div key={index} className='text-xs text-gray-600 flex items-start gap-2'>
                <span className='w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0'></span>
                <span className='truncate'>{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success message for strong passwords */}
      {strength.level === 'strong' && (
        <div className='mt-3 pt-3 border-t border-green-200'>
          <div className='flex items-center gap-2 text-green-600'>
            <CheckCircle className='w-4 h-4 flex-shrink-0' />
            <span className='text-xs font-medium'>
              Excellent! Your password meets all security requirements.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
