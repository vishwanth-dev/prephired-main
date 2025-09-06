// components/guards/permission.guard.tsx
// Permission-based component guards

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth.context';
import { groupService, roleService } from '@/services/api';
import { ModuleType, PermissionAction, IPermissionCheck } from '@/types/backend';

// ============================================
// PERMISSION GUARD PROPS
// ============================================

interface PermissionGuardProps {
  children: React.ReactNode;
  module: ModuleType;
  action: PermissionAction;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  redirectTo?: string;
  requireAll?: boolean; // If true, requires ALL actions, if false, requires ANY action
}

interface PermissionCheckState {
  hasPermission: boolean;
  isLoading: boolean;
  error: string | null;
  userRole?: string;
  userGroup?: string | undefined;
}

// ============================================
// PERMISSION GUARD COMPONENT
// ============================================

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  module,
  action,
  fallback = <AccessDenied />,
  loadingComponent = <PermissionLoading />,
  redirectTo,
  requireAll = false,
}) => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [permissionState, setPermissionState] = useState<PermissionCheckState>({
    hasPermission: false,
    isLoading: true,
    error: null,
  });

  // ============================================
  // PERMISSION CHECKING LOGIC
  // ============================================

  const checkPermission = async (): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false;
    }

    try {
      // Get user's role
      const role = await roleService.getRoleByRoleId(user.role);
      if (!role) {
        return false;
      }

      // Check each group for permissions
      const groupChecks = await Promise.all(
        role.groups.map(async groupId => {
          try {
            const hasPermission = await groupService.checkGroupPermission(groupId, module, action);
            return hasPermission.hasPermission;
          } catch {
            return false;
          }
        })
      );

      // Apply requireAll logic
      const hasPermission = requireAll
        ? groupChecks.every(check => check)
        : groupChecks.some(check => check);

      setPermissionState({
        hasPermission,
        isLoading: false,
        error: null,
        userRole: role.name,
        userGroup: role.groups[0] || undefined, // Primary group
      });

      return hasPermission;
    } catch (error: any) {
      setPermissionState({
        hasPermission: false,
        isLoading: false,
        error: error.message || 'Permission check failed',
      });
      return false;
    }
  };

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    if (isAuthenticated && user) {
      checkPermission();
    } else {
      setPermissionState({
        hasPermission: false,
        isLoading: false,
        error: null,
      });
    }
  }, [isAuthenticated, user, module, action]);

  // Handle redirect
  useEffect(() => {
    if (!permissionState.isLoading && !permissionState.hasPermission && redirectTo) {
      router.push(redirectTo);
    }
  }, [permissionState.isLoading, permissionState.hasPermission, redirectTo, router]);

  // ============================================
  // RENDER LOGIC
  // ============================================

  if (permissionState.isLoading) {
    return <>{loadingComponent}</>;
  }

  if (permissionState.error) {
    return <PermissionError error={permissionState.error} />;
  }

  if (!permissionState.hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// ============================================
// MULTIPLE PERMISSION GUARD
// ============================================

interface MultiplePermissionGuardProps {
  children: React.ReactNode;
  permissions: Array<{
    module: ModuleType;
    action: PermissionAction;
  }>;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  requireAll?: boolean; // If true, requires ALL permissions, if false, requires ANY permission
}

export const MultiplePermissionGuard: React.FC<MultiplePermissionGuardProps> = ({
  children,
  permissions,
  fallback = <AccessDenied />,
  loadingComponent = <PermissionLoading />,
  requireAll = false,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [permissionState, setPermissionState] = useState<PermissionCheckState>({
    hasPermission: false,
    isLoading: true,
    error: null,
  });

  const checkMultiplePermissions = async (): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false;
    }

    try {
      const permissionChecks = await Promise.all(
        permissions.map(async ({ module, action }) => {
          try {
            const role = await roleService.getRoleByRoleId(user.role);
            if (!role) return false;

            const groupChecks = await Promise.all(
              role.groups.map(async groupId => {
                const hasPermission = await groupService.checkGroupPermission(
                  groupId,
                  module,
                  action
                );
                return hasPermission.hasPermission;
              })
            );

            return groupChecks.some(check => check);
          } catch {
            return false;
          }
        })
      );

      const hasPermission = requireAll
        ? permissionChecks.every(check => check)
        : permissionChecks.some(check => check);

      setPermissionState({
        hasPermission,
        isLoading: false,
        error: null,
      });

      return hasPermission;
    } catch (error: any) {
      setPermissionState({
        hasPermission: false,
        isLoading: false,
        error: error.message || 'Permission check failed',
      });
      return false;
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      checkMultiplePermissions();
    } else {
      setPermissionState({
        hasPermission: false,
        isLoading: false,
        error: null,
      });
    }
  }, [isAuthenticated, user, permissions]);

  if (permissionState.isLoading) {
    return <>{loadingComponent}</>;
  }

  if (permissionState.error) {
    return <PermissionError error={permissionState.error} />;
  }

  if (!permissionState.hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// ============================================
// PERMISSION HOOK
// ============================================

export const usePermission = (module: ModuleType, action: PermissionAction) => {
  const { user, isAuthenticated } = useAuth();
  const [permissionCheck, setPermissionCheck] = useState<IPermissionCheck>({
    hasPermission: false,
    module,
    action,
  });

  const checkPermission = async (): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      setPermissionCheck(prev => ({ ...prev, hasPermission: false }));
      return false;
    }

    try {
      const role = await roleService.getRoleByRoleId(user.role);
      if (!role) {
        setPermissionCheck(prev => ({ ...prev, hasPermission: false }));
        return false;
      }

      const groupChecks = await Promise.all(
        role.groups.map(async groupId => {
          const hasPermission = await groupService.checkGroupPermission(groupId, module, action);
          return hasPermission.hasPermission;
        })
      );

      const hasPermission = groupChecks.some(check => check);

      setPermissionCheck({
        hasPermission,
        module,
        action,
        userRole: role.name,
        userGroup: role.groups[0] || undefined,
      });

      return hasPermission;
    } catch (error: any) {
      setPermissionCheck(prev => ({ ...prev, hasPermission: false }));
      return false;
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      checkPermission();
    }
  }, [isAuthenticated, user, module, action]);

  return {
    ...permissionCheck,
    checkPermission,
  };
};

// ============================================
// LOADING AND ERROR COMPONENTS
// ============================================

const PermissionLoading: React.FC = () => (
  <div className='flex items-center justify-center p-4'>
    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
    <span className='ml-2 text-gray-600'>Checking permissions...</span>
  </div>
);

const PermissionError: React.FC<{ error: string }> = ({ error }) => (
  <div className='flex items-center justify-center p-4'>
    <div className='text-red-600'>
      <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
        />
      </svg>
    </div>
    <span className='ml-2 text-red-600'>Permission Error: {error}</span>
  </div>
);

const AccessDenied: React.FC = () => (
  <div className='flex flex-col items-center justify-center p-8 text-center'>
    <div className='text-red-600 mb-4'>
      <svg className='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
        />
      </svg>
    </div>
    <h2 className='text-2xl font-bold text-gray-900 mb-2'>Access Denied</h2>
    <p className='text-gray-600 mb-4'>You don't have permission to access this resource.</p>
    <button
      onClick={() => window.history.back()}
      className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
    >
      Go Back
    </button>
  </div>
);

// ============================================
// EXPORTS
// ============================================

export default PermissionGuard;
