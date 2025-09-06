/**
 * 🎨 Auth Illustration Component
 *
 * This component provides authentication page illustrations following SOLID principles:
 * - Single Responsibility: Only handles illustration display
 * - Open/Closed: Extensible through props and variants
 * - Liskov Substitution: Can be replaced with other illustration components
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Depends on abstractions (props)
 *
 * 📋 Features:
 * - Multiple illustration variants
 * - Responsive design
 * - Accessibility support
 * - Customizable styling
 * - SVG optimization
 *
 * 🔧 Usage:
 * ```tsx
 * <AuthIllustration
 *   variant="login"
 *   className="w-full h-full"
 * />
 * ```
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// ============================================
// 🎯 INTERFACE DEFINITIONS
// ============================================

interface AuthIllustrationProps {
  variant?: 'login' | 'register' | 'forgot-password' | 'reset-password' | 'verify-otp' | 'default';
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

// ============================================
// 🎨 AUTH ILLUSTRATION COMPONENT
// ============================================

export const AuthIllustration: React.FC<AuthIllustrationProps> = ({
  variant = 'default',
  className,
  width = 500,
  height = 500,
  priority = false,
}) => {
  // ============================================
  // 🎯 ILLUSTRATION CONFIGURATION
  // ============================================

  const getIllustrationConfig = () => {
    switch (variant) {
      case 'login':
        return {
          src: '/images/illustrations/UserWithDesktop.svg',
          alt: 'User logging into their account',
          title: 'Welcome back!',
          description: 'Sign in to continue your journey',
        };
      case 'register':
        return {
          src: '/images/illustrations/UserWithDesktop.svg',
          alt: 'User creating a new account',
          title: 'Join PrepHired!',
          description: 'Start your AI-powered interview preparation',
        };
      case 'forgot-password':
        return {
          src: '/images/illustrations/UserWithDesktop.svg',
          alt: 'User requesting password reset',
          title: 'Forgot your password?',
          description: "No worries, we'll help you reset it",
        };
      case 'reset-password':
        return {
          src: '/images/illustrations/UserWithDesktop.svg',
          alt: 'User setting a new password',
          title: 'Set your new password',
          description: 'Create a strong and secure password',
        };
      case 'verify-otp':
        return {
          src: '/images/illustrations/UserWithDesktop.svg',
          alt: 'User verifying their account',
          title: 'Verify your account',
          description: 'Enter the code we sent to your email',
        };
      default:
        return {
          src: '/images/illustrations/UserWithDesktop.svg',
          alt: 'Authentication illustration',
          title: 'Welcome to PrepHired',
          description: 'Your AI-powered interview preparation platform',
        };
    }
  };

  const config = getIllustrationConfig();

  // ============================================
  // 🎨 RENDER
  // ============================================

  return (
    <div className={cn('flex flex-col items-center justify-center h-full w-full', className)}>
      {/* Illustration Image */}
      <div className='relative mb-8'>
        <Image
          src={config.src}
          alt={config.alt}
          width={width}
          height={height}
          priority={priority}
          className='w-full h-auto max-w-[500px]'
        />
      </div>

      {/* Illustration Text */}
      <div className='text-center max-w-md'>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>{config.title}</h2>
        <p className='text-gray-600'>{config.description}</p>
      </div>
    </div>
  );
};

// ============================================
// 🎨 ALTERNATIVE ILLUSTRATION COMPONENTS
// ============================================

/**
 * Login-specific illustration with custom styling
 */
export const LoginIllustration: React.FC<Omit<AuthIllustrationProps, 'variant'>> = props => (
  <AuthIllustration {...props} variant='login' />
);

/**
 * Registration-specific illustration with custom styling
 */
export const RegisterIllustration: React.FC<Omit<AuthIllustrationProps, 'variant'>> = props => (
  <AuthIllustration {...props} variant='register' />
);

/**
 * Forgot password-specific illustration with custom styling
 */
export const ForgotPasswordIllustration: React.FC<
  Omit<AuthIllustrationProps, 'variant'>
> = props => <AuthIllustration {...props} variant='forgot-password' />;

/**
 * Reset password-specific illustration with custom styling
 */
export const ResetPasswordIllustration: React.FC<
  Omit<AuthIllustrationProps, 'variant'>
> = props => <AuthIllustration {...props} variant='reset-password' />;

/**
 * OTP verification-specific illustration with custom styling
 */
export const VerifyOTPIllustration: React.FC<Omit<AuthIllustrationProps, 'variant'>> = props => (
  <AuthIllustration {...props} variant='verify-otp' />
);

// ============================================
// 🎯 EXPORT
// ============================================

export default AuthIllustration;
