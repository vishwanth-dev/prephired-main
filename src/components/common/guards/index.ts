// components/guards/index.ts
// Export all guard components

export { PermissionGuard, MultiplePermissionGuard, usePermission } from './permission.guard';

export { AuthGuard, PublicRouteGuard, StatusGuard, RegistrationStepGuard } from './auth.guard';

// Import for convenience exports
import { PermissionGuard, MultiplePermissionGuard, usePermission } from './permission.guard';
import { AuthGuard, PublicRouteGuard, StatusGuard, RegistrationStepGuard } from './auth.guard';

// ============================================
// CONVENIENCE EXPORTS
// ============================================

/**
 * All guard components in one object for easy access
 */
export const guards = {
  PermissionGuard,
  MultiplePermissionGuard,
  AuthGuard,
  PublicRouteGuard,
  StatusGuard,
  RegistrationStepGuard,
};

/**
 * All guard hooks in one object for easy access
 */
export const guardHooks = {
  usePermission,
};
