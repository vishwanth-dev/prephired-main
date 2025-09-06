// components/guards/auth.guard.tsx
// Authentication guard components

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useAuthGuard } from '@/context/auth.context';
import { UserStatus } from '@/types/backend';

// ============================================
// AUTH GUARD PROPS
// ============================================

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireStatus?: UserStatus[];
  redirectTo?: string;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

// ============================================
// AUTH GUARD COMPONENT
// ============================================

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requireStatus,
  redirectTo = '/login',
  fallback = <LoginRequired />,
  loadingComponent = <AuthLoading />,
}) => {
  const { isAuthorized, isLoading } = useAuthGuard({
    requireAuth,
    requireStatus: requireStatus || undefined,
    redirectTo,
    fallback,
  });

  // ============================================
  // RENDER LOGIC
  // ============================================

  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  if (!isAuthorized) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// ============================================
// PUBLIC ROUTE GUARD
// ============================================

interface PublicRouteGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  loadingComponent?: React.ReactNode;
}

export const PublicRouteGuard: React.FC<PublicRouteGuardProps> = ({
  children,
  redirectTo = '/dashboard',
  loadingComponent = <AuthLoading />,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, redirectTo, router]);

  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
};

// ============================================
// STATUS GUARD
// ============================================

interface StatusGuardProps {
  children: React.ReactNode;
  allowedStatuses: UserStatus[];
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export const StatusGuard: React.FC<StatusGuardProps> = ({
  children,
  allowedStatuses,
  fallback = <StatusNotAllowed allowedStatuses={allowedStatuses} />,
  loadingComponent = <AuthLoading />,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  if (!user || !allowedStatuses.includes(user.status)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// ============================================
// REGISTRATION STEP GUARD
// ============================================

interface RegistrationStepGuardProps {
  children: React.ReactNode;
  allowedSteps: Array<'register' | 'verify-otp' | 'select-role' | 'complete'>;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export const RegistrationStepGuard: React.FC<RegistrationStepGuardProps> = ({
  children,
  allowedSteps,
  fallback = <RegistrationStepNotAllowed allowedSteps={allowedSteps} />,
  loadingComponent = <AuthLoading />,
}) => {
  const { registrationStep, isLoading } = useAuth();

  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  if (!allowedSteps.includes(registrationStep)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// ============================================
// LOADING AND ERROR COMPONENTS
// ============================================

const AuthLoading: React.FC = () => (
  <div className='flex items-center justify-center min-h-screen'>
    <div className='text-center'>
      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
      <p className='text-gray-600'>Loading...</p>
    </div>
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
    <div className='text-yellow-600 mb-6'>
      <svg className='w-20 h-20 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
        />
      </svg>
    </div>
    <h1 className='text-3xl font-bold text-gray-900 mb-4'>Account Status Required</h1>
    <p className='text-gray-600 mb-8 max-w-md'>
      Your account status needs to be one of the following to access this page:
    </p>
    <div className='space-y-2 mb-8'>
      {allowedStatuses.map(status => (
        <span
          key={status}
          className='inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium'
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ))}
    </div>
    <button
      onClick={() => (window.location.href = '/profile')}
      className='px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
    >
      Go to Profile
    </button>
  </div>
);

const RegistrationStepNotAllowed: React.FC<{
  allowedSteps: Array<'register' | 'verify-otp' | 'select-role' | 'complete'>;
}> = ({ allowedSteps }) => (
  <div className='flex flex-col items-center justify-center min-h-screen p-8 text-center'>
    <div className='text-purple-600 mb-6'>
      <svg className='w-20 h-20 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
    </div>
    <h1 className='text-3xl font-bold text-gray-900 mb-4'>Registration Step Required</h1>
    <p className='text-gray-600 mb-8 max-w-md'>
      You need to complete the following registration step to access this page:
    </p>
    <div className='space-y-2 mb-8'>
      {allowedSteps.map(step => (
        <span
          key={step}
          className='inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium'
        >
          {step.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      ))}
    </div>
    <button
      onClick={() => (window.location.href = '/register')}
      className='px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors'
    >
      Continue Registration
    </button>
  </div>
);

// ============================================
// EXPORTS
// ============================================

export default AuthGuard;
