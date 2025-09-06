/**
 * 🛡️ Auth Guard Component
 *
 * This component provides authentication protection following SOLID principles:
 * - Single Responsibility: Only handles authentication state checking
 * - Open/Closed: Extensible through props and callbacks
 * - Liskov Substitution: Can be replaced with other guard components
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Depends on abstractions (hooks, services)
 *
 * 📋 Features:
 * - Authentication state checking
 * - User status validation
 * - Registration step validation
 * - Custom fallback components
 * - Loading states
 * - Redirect handling
 *
 * 🔧 Usage:
 * ```tsx
 * <AuthGuard
 *   requireAuth={true}
 *   requireStatus={['active']}
 *   fallback={<LoginRequired />}
 * >
 *   <ProtectedContent />
 * </AuthGuard>
 * ```
 */

'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { UserStatus } from '@/types/backend';
import { cn } from '@/lib/utils';

// ============================================
// 🎯 INTERFACE DEFINITIONS
// ============================================

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireStatus?: UserStatus[];
  redirectTo?: string;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  className?: string;
}

interface PublicRouteGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  loadingComponent?: React.ReactNode;
  className?: string;
}

interface StatusGuardProps {
  children: React.ReactNode;
  allowedStatuses: UserStatus[];
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  className?: string;
}

interface RegistrationStepGuardProps {
  children: React.ReactNode;
  allowedSteps: Array<'register' | 'verify-otp' | 'select-role' | 'complete'>;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  className?: string;
}

// ============================================
// 🛡️ AUTH GUARD COMPONENT
// ============================================

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requireStatus,
  fallback = <LoginRequired />,
  loadingComponent = <AuthLoading />,
  className,
}) => {
  const { user, isAuthenticated, isLoading, registrationStep } = useAuth();

  // ============================================
  // 🎯 RENDER LOGIC
  // ============================================

  // Show loading state
  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  // Check user status requirement
  if (requireStatus && user && !requireStatus.includes(user.status)) {
    return <StatusNotAllowed allowedStatuses={requireStatus} />;
  }

  // Check registration step requirement
  if (requireAuth && user && registrationStep !== 'complete') {
    return <RegistrationStepNotAllowed allowedSteps={[registrationStep]} />;
  }

  // Render protected content
  return <div className={cn('auth-guard', className)}>{children}</div>;
};

// ============================================
// 🌐 PUBLIC ROUTE GUARD COMPONENT
// ============================================

export const PublicRouteGuard: React.FC<PublicRouteGuardProps> = ({
  children,
  redirectTo = '/dashboard',
  loadingComponent = <AuthLoading />,
  className,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  // Redirect authenticated users
  if (isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
    return <>{loadingComponent}</>;
  }

  // Render public content
  return <div className={cn('public-route-guard', className)}>{children}</div>;
};

// ============================================
// 📊 STATUS GUARD COMPONENT
// ============================================

export const StatusGuard: React.FC<StatusGuardProps> = ({
  children,
  allowedStatuses,
  fallback = <StatusNotAllowed allowedStatuses={allowedStatuses} />,
  loadingComponent = <AuthLoading />,
  className,
}) => {
  const { user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  // Check user status
  if (!user || !allowedStatuses.includes(user.status)) {
    return <>{fallback}</>;
  }

  // Render content for allowed status
  return <div className={cn('status-guard', className)}>{children}</div>;
};

// ============================================
// 📝 REGISTRATION STEP GUARD COMPONENT
// ============================================

export const RegistrationStepGuard: React.FC<RegistrationStepGuardProps> = ({
  children,
  allowedSteps,
  fallback = <RegistrationStepNotAllowed allowedSteps={allowedSteps} />,
  loadingComponent = <AuthLoading />,
  className,
}) => {
  const { registrationStep, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  // Check registration step
  if (!allowedSteps.includes(registrationStep)) {
    return <>{fallback}</>;
  }

  // Render content for allowed step
  return <div className={cn('registration-step-guard', className)}>{children}</div>;
};

// ============================================
// 🎨 LOADING AND FALLBACK COMPONENTS
// ============================================

const AuthLoading: React.FC = () => (
  <div className='flex flex-col items-center justify-center min-h-screen p-8'>
    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
    <p className='mt-4 text-gray-600'>Loading...</p>
  </div>
);

const LoginRequired: React.FC = () => (
  <div className='flex flex-col items-center justify-center min-h-screen p-8 text-center'>
    <div className='text-blue-600 mb-6'>
      <svg className='w-20 h-20 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
        />
      </svg>
    </div>
    <h1 className='text-3xl font-bold text-gray-900 mb-4'>Authentication Required</h1>
    <p className='text-gray-600 mb-8 max-w-md'>
      You need to be logged in to access this page. Please sign in to continue.
    </p>
    <div className='space-x-4'>
      <button
        onClick={() => (window.location.href = '/login')}
        className='px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
      >
        Sign In
      </button>
      <button
        onClick={() => (window.location.href = '/register')}
        className='px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors'
      >
        Sign Up
      </button>
    </div>
  </div>
);

const StatusNotAllowed: React.FC<{ allowedStatuses: UserStatus[] }> = ({ allowedStatuses }) => (
  <div className='flex flex-col items-center justify-center min-h-screen p-8 text-center'>
    <div className='text-red-600 mb-6'>
      <svg className='w-20 h-20 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
        />
      </svg>
    </div>
    <h1 className='text-3xl font-bold text-gray-900 mb-4'>Access Denied</h1>
    <p className='text-gray-600 mb-8 max-w-md'>
      Your account status does not allow access to this page. Required statuses:{' '}
      {allowedStatuses.join(', ')}.
    </p>
    <button
      onClick={() => (window.location.href = '/dashboard')}
      className='px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
    >
      Go to Dashboard
    </button>
  </div>
);

const RegistrationStepNotAllowed: React.FC<{
  allowedSteps: Array<'register' | 'verify-otp' | 'select-role' | 'complete'>;
}> = ({ allowedSteps }) => (
  <div className='flex flex-col items-center justify-center min-h-screen p-8 text-center'>
    <div className='text-yellow-600 mb-6'>
      <svg className='w-20 h-20 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
    </div>
    <h1 className='text-3xl font-bold text-gray-900 mb-4'>Registration Incomplete</h1>
    <p className='text-gray-600 mb-8 max-w-md'>
      Please complete your registration process to access this page. Required steps:{' '}
      {allowedSteps.join(', ')}.
    </p>
    <button
      onClick={() => (window.location.href = '/register')}
      className='px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
    >
      Complete Registration
    </button>
  </div>
);

// ============================================
// 🎯 EXPORT
// ============================================

export default AuthGuard;
