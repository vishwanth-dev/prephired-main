import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui';

interface PasswordInputProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  label?: string;
  labelClassName?: string;
  required?: boolean;
  error?: string | undefined;
  showStrength?: boolean;
  strength?: {
    score: 0 | 1 | 2 | 3 | 4;
    feedback: {
      warning?: string;
      suggestions: string[];
    };
  };
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    { className, label, labelClassName, required, error, showStrength = false, strength, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const getStrengthColor = (score: number) => {
      switch (score) {
        case 0:
        case 1:
          return 'bg-red-500';
        case 2:
          return 'bg-orange-500';
        case 3:
          return 'bg-yellow-500';
        case 4:
          return 'bg-green-500';
        default:
          return 'bg-gray-300';
      }
    };

    const getStrengthText = (score: number) => {
      switch (score) {
        case 0:
        case 1:
          return 'Very Weak';
        case 2:
          return 'Weak';
        case 3:
          return 'Good';
        case 4:
          return 'Strong';
        default:
          return '';
      }
    };

    return (
      <div className='space-y-2'>
        <Input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          label={label || ''}
          labelClassName={labelClassName || ''}
          required={required || false}
          error={error}
          className={className}
          suffixIcon={
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='text-gray-400 hover:text-gray-600 transition-colors'
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
            </button>
          }
          {...props}
        />

        {showStrength && strength && (
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <div className='flex-1 bg-gray-200 rounded-full h-2'>
                <div
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    getStrengthColor(strength.score)
                  )}
                  style={{ width: `${(strength.score / 4) * 100}%` }}
                />
              </div>
              <span className='text-sm text-gray-600 min-w-fit'>
                {getStrengthText(strength.score)}
              </span>
            </div>

            {strength.feedback.warning && (
              <p className='text-sm text-orange-600'>{strength.feedback.warning}</p>
            )}

            {strength.feedback.suggestions.length > 0 && (
              <ul className='text-sm text-gray-600 space-y-1'>
                {strength.feedback.suggestions.map((suggestion, index) => (
                  <li key={index} className='flex items-start gap-1'>
                    <span className='text-gray-400 mt-0.5'>•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
