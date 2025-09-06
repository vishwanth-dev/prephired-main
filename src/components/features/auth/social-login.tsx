/**
 * 🌐 Social Login Component
 *
 * This component provides social authentication options following SOLID principles:
 * - Single Responsibility: Only handles social login functionality
 * - Open/Closed: Extensible through props and providers
 * - Liskov Substitution: Can be replaced with other login components
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Depends on abstractions (callbacks)
 *
 * 📋 Features:
 * - Multiple social providers (Google, GitHub, LinkedIn)
 * - Customizable styling and layout
 * - Loading states and error handling
 * - Accessibility support
 * - Responsive design
 *
 * 🔧 Usage:
 * ```tsx
 * <SocialLogin
 *   onProviderLogin={handleSocialLogin}
 *   isLoading={isLoading}
 *   providers={['google', 'github', 'linkedin']}
 * />
 * ```
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ============================================
// 🎯 INTERFACE DEFINITIONS
// ============================================

interface SocialLoginProps {
  onProviderLogin: (provider: SocialProvider) => Promise<void>;
  isLoading?: boolean;
  providers?: SocialProvider[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export type SocialProvider =
  | 'google'
  | 'github'
  | 'linkedin'
  | 'facebook'
  | 'twitter'
  | 'microsoft';

interface SocialProviderConfig {
  id: SocialProvider;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  hoverColor: string;
}

// ============================================
// 🌐 SOCIAL LOGIN COMPONENT
// ============================================

export const SocialLogin: React.FC<SocialLoginProps> = ({
  onProviderLogin,
  isLoading = false,
  providers = ['google', 'github', 'linkedin'],
  layout = 'horizontal',
  size = 'md',
  className,
  disabled = false,
}) => {
  // ============================================
  // 🎯 PROVIDER CONFIGURATION
  // ============================================

  const getProviderConfig = (provider: SocialProvider): SocialProviderConfig => {
    const configs: Record<SocialProvider, SocialProviderConfig> = {
      google: {
        id: 'google',
        name: 'Google',
        icon: (
          <svg className='h-4 w-4' viewBox='0 0 24 24'>
            <path
              fill='currentColor'
              d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
            />
            <path
              fill='currentColor'
              d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
            />
            <path
              fill='currentColor'
              d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
            />
            <path
              fill='currentColor'
              d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
            />
          </svg>
        ),
        color: 'text-gray-700',
        bgColor: 'bg-white',
        hoverColor: 'hover:bg-gray-50',
      },
      github: {
        id: 'github',
        name: 'GitHub',
        icon: (
          <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
          </svg>
        ),
        color: 'text-gray-700',
        bgColor: 'bg-white',
        hoverColor: 'hover:bg-gray-50',
      },
      linkedin: {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: (
          <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
          </svg>
        ),
        color: 'text-gray-700',
        bgColor: 'bg-white',
        hoverColor: 'hover:bg-gray-50',
      },
      facebook: {
        id: 'facebook',
        name: 'Facebook',
        icon: (
          <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
          </svg>
        ),
        color: 'text-white',
        bgColor: 'bg-blue-600',
        hoverColor: 'hover:bg-blue-700',
      },
      twitter: {
        id: 'twitter',
        name: 'Twitter',
        icon: (
          <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
          </svg>
        ),
        color: 'text-white',
        bgColor: 'bg-blue-400',
        hoverColor: 'hover:bg-blue-500',
      },
      microsoft: {
        id: 'microsoft',
        name: 'Microsoft',
        icon: (
          <svg className='h-4 w-4' viewBox='0 0 24 24'>
            <path fill='#f25022' d='M1 1h10v10H1z' />
            <path fill='#00a4ef' d='M13 1h10v10H13z' />
            <path fill='#7fba00' d='M1 13h10v10H1z' />
            <path fill='#ffb900' d='M13 13h10v10H13z' />
          </svg>
        ),
        color: 'text-gray-700',
        bgColor: 'bg-white',
        hoverColor: 'hover:bg-gray-50',
      },
    };

    return configs[provider];
  };

  // ============================================
  // 🎯 EVENT HANDLERS
  // ============================================

  const handleProviderClick = async (provider: SocialProvider) => {
    if (isLoading || disabled) return;

    try {
      await onProviderLogin(provider);
    } catch (error) {
      console.error(`Social login error for ${provider}:`, error);
    }
  };

  // ============================================
  // 🎯 LAYOUT CONFIGURATION
  // ============================================

  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-row space-x-3';
      case 'vertical':
        return 'flex flex-col space-y-3';
      case 'grid':
        return 'grid grid-cols-3 gap-3';
      default:
        return 'flex flex-row space-x-3';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  // ============================================
  // 🎨 RENDER
  // ============================================

  return (
    <div className={cn('social-login', className)}>
      <div className={getLayoutClasses()}>
        {providers.map(provider => {
          const config = getProviderConfig(provider);

          return (
            <Button
              key={provider}
              type='button'
              variant='outline'
              onClick={() => handleProviderClick(provider)}
              disabled={isLoading || disabled}
              className={cn(
                'w-full transition-colors',
                config.bgColor,
                config.color,
                config.hoverColor,
                getSizeClasses(),
                'border-gray-300'
              )}
            >
              <span className='flex items-center justify-center space-x-2'>
                {config.icon}
                <span className='hidden sm:inline'>{config.name}</span>
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// 🎨 SPECIALIZED SOCIAL LOGIN COMPONENTS
// ============================================

/**
 * Horizontal layout social login
 */
export const HorizontalSocialLogin: React.FC<Omit<SocialLoginProps, 'layout'>> = props => (
  <SocialLogin {...props} layout='horizontal' />
);

/**
 * Vertical layout social login
 */
export const VerticalSocialLogin: React.FC<Omit<SocialLoginProps, 'layout'>> = props => (
  <SocialLogin {...props} layout='vertical' />
);

/**
 * Grid layout social login
 */
export const GridSocialLogin: React.FC<Omit<SocialLoginProps, 'layout'>> = props => (
  <SocialLogin {...props} layout='grid' />
);

// ============================================
// 🎯 EXPORT
// ============================================

export default SocialLogin;
