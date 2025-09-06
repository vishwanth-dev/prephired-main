/**
 * 🔐 Permissions Configuration
 *
 * This file serves as the centralized hub for role-based access control (RBAC)
 * in the PrepAI application. It provides comprehensive permission definitions,
 * role mappings, and utility functions for access control.
 *
 * 📋 Features:
 * - Permission types and resource definitions
 * - Role-based permission mappings
 * - Utility functions for permission checking
 * - Comprehensive access control system
 *
 * 🔧 Usage:
 * ```typescript
 * import { PERMISSIONS, hasPermission, getRolePermissions } from '@/constants/permissions';
 *
 * // Check user permissions
 * const canRead = hasPermission(userPermissions, PERMISSIONS.USER.USER_READ);
 * const rolePermissions = getRolePermissions('user');
 * ```
 *
 * 📝 Maintenance:
 * - Add new permissions as features are developed
 * - Update role mappings when access patterns change
 * - Keep permission names consistent and descriptive
 * - Document any special access requirements
 */

// ============================================
// 🔑 PERMISSION TYPES
// ============================================

/**
 * Basic permission types
 *
 * 🎯 Purpose: Define the fundamental actions that can be performed
 *
 * 📋 Features:
 * - Standard CRUD operations
 * - Special actions like manage, approve, reject
 * - Export and import capabilities
 */
export const PERMISSION_TYPES = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  UPDATE: 'update',
  CREATE: 'create',
  MANAGE: 'manage',
  EXPORT: 'export',
  IMPORT: 'import',
  APPROVE: 'approve',
  REJECT: 'reject',
} as const;

// ============================================
// 📦 RESOURCE TYPES
// ============================================

/**
 * Resource types that permissions can be applied to
 *
 * 🎯 Purpose: Define the entities and resources in the system
 *
 * 📋 Features:
 * - Core application resources
 * - System-level resources
 * - Future resource types for expansion
 */
export const RESOURCE_TYPES = {
  USER: 'user',
  RESUME: 'resume',
  TENANT: 'tenant',
  GROUP: 'group',
  ROLE: 'role',
  SLOT: 'slot',
  EMAIL: 'email',
  FILE: 'file',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings',
  BILLING: 'billing',
  AUDIT: 'audit',
} as const;

// ============================================
// 👤 USER PERMISSIONS
// ============================================

/**
 * User-related permissions
 *
 * 🎯 Purpose: Define permissions for user management and authentication
 *
 * 📋 Features:
 * - User management operations
 * - Profile management
 * - Authentication actions
 * - User settings access
 */
export const USER_PERMISSIONS = {
  // User management
  USER_READ: `${RESOURCE_TYPES.USER}:${PERMISSION_TYPES.READ}`,
  USER_CREATE: `${RESOURCE_TYPES.USER}:${PERMISSION_TYPES.CREATE}`,
  USER_UPDATE: `${RESOURCE_TYPES.USER}:${PERMISSION_TYPES.UPDATE}`,
  USER_DELETE: `${RESOURCE_TYPES.USER}:${PERMISSION_TYPES.DELETE}`,
  USER_MANAGE: `${RESOURCE_TYPES.USER}:${PERMISSION_TYPES.MANAGE}`,

  // User profile
  PROFILE_READ: 'profile:read',
  PROFILE_UPDATE: 'profile:update',
  PROFILE_DELETE: 'profile:delete',

  // User authentication
  AUTH_LOGIN: 'auth:login',
  AUTH_LOGOUT: 'auth:logout',
  AUTH_REGISTER: 'auth:register',
  AUTH_RESET_PASSWORD: 'auth:reset_password',
  AUTH_CHANGE_PASSWORD: 'auth:change_password',

  // User settings
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
} as const;

// ============================================
// 📄 RESUME PERMISSIONS (Future Implementation)
// ============================================

/**
 * Resume-related permissions
 *
 * 🎯 Purpose: Define permissions for resume management and operations
 *
 * 📋 Planned Features:
 * - Resume CRUD operations
 * - File upload and download
 * - Resume analysis and templates
 * - Sharing and visibility controls
 *
 * 🚧 Status: Not implemented yet - will be added when resume features are developed
 */
export const RESUME_PERMISSIONS = {
  // Resume management
  RESUME_READ: `${RESOURCE_TYPES.RESUME}:${PERMISSION_TYPES.READ}`,
  RESUME_CREATE: `${RESOURCE_TYPES.RESUME}:${PERMISSION_TYPES.CREATE}`,
  RESUME_UPDATE: `${RESOURCE_TYPES.RESUME}:${PERMISSION_TYPES.UPDATE}`,
  RESUME_DELETE: `${RESOURCE_TYPES.RESUME}:${PERMISSION_TYPES.DELETE}`,
  RESUME_MANAGE: `${RESOURCE_TYPES.RESUME}:${PERMISSION_TYPES.MANAGE}`,

  // Resume operations
  RESUME_UPLOAD: 'resume:upload',
  RESUME_DOWNLOAD: 'resume:download',
  RESUME_EXPORT: `${RESOURCE_TYPES.RESUME}:${PERMISSION_TYPES.EXPORT}`,
  RESUME_IMPORT: `${RESOURCE_TYPES.RESUME}:${PERMISSION_TYPES.IMPORT}`,
  RESUME_ANALYZE: 'resume:analyze',
  RESUME_TEMPLATE_CREATE: 'resume:template_create',
  RESUME_TEMPLATE_USE: 'resume:template_use',

  // Resume sharing
  RESUME_SHARE: 'resume:share',
  RESUME_PUBLIC_VIEW: 'resume:public_view',
  RESUME_PRIVATE_VIEW: 'resume:private_view',
} as const;

// ============================================
// 🏢 TENANT PERMISSIONS (Future Implementation)
// ============================================

/**
 * Tenant-related permissions
 *
 * 🎯 Purpose: Define permissions for tenant management and operations
 *
 * 📋 Planned Features:
 * - Tenant CRUD operations
 * - Tenant membership management
 * - Invitation and approval workflows
 * - Tenant settings and billing
 *
 * 🚧 Status: Not implemented yet - will be added when tenant features are developed
 */
export const TENANT_PERMISSIONS = {
  // Tenant management
  TENANT_READ: `${RESOURCE_TYPES.TENANT}:${PERMISSION_TYPES.READ}`,
  TENANT_CREATE: `${RESOURCE_TYPES.TENANT}:${PERMISSION_TYPES.CREATE}`,
  TENANT_UPDATE: `${RESOURCE_TYPES.TENANT}:${PERMISSION_TYPES.UPDATE}`,
  TENANT_DELETE: `${RESOURCE_TYPES.TENANT}:${PERMISSION_TYPES.DELETE}`,
  TENANT_MANAGE: `${RESOURCE_TYPES.TENANT}:${PERMISSION_TYPES.MANAGE}`,

  // Tenant operations
  TENANT_JOIN: 'tenant:join',
  TENANT_LEAVE: 'tenant:leave',
  TENANT_INVITE: 'tenant:invite',
  TENANT_APPROVE: `${RESOURCE_TYPES.TENANT}:${PERMISSION_TYPES.APPROVE}`,
  TENANT_REJECT: `${RESOURCE_TYPES.TENANT}:${PERMISSION_TYPES.REJECT}`,

  // Tenant settings
  TENANT_SETTINGS_READ: 'tenant:settings_read',
  TENANT_SETTINGS_UPDATE: 'tenant:settings_update',
  TENANT_BILLING_READ: 'tenant:billing_read',
  TENANT_BILLING_UPDATE: 'tenant:billing_update',
} as const;

// ============================================
// 👥 GROUP PERMISSIONS (Future Implementation)
// ============================================

/**
 * Group-related permissions
 *
 * 🎯 Purpose: Define permissions for group management and operations
 *
 * 📋 Planned Features:
 * - Group CRUD operations
 * - Group membership management
 * - Invitation and approval workflows
 * - Group collaboration features
 *
 * 🚧 Status: Not implemented yet - will be added when group features are developed
 */
export const GROUP_PERMISSIONS = {
  // Group management
  GROUP_READ: `${RESOURCE_TYPES.GROUP}:${PERMISSION_TYPES.READ}`,
  GROUP_CREATE: `${RESOURCE_TYPES.GROUP}:${PERMISSION_TYPES.CREATE}`,
  GROUP_UPDATE: `${RESOURCE_TYPES.GROUP}:${PERMISSION_TYPES.UPDATE}`,
  GROUP_DELETE: `${RESOURCE_TYPES.GROUP}:${PERMISSION_TYPES.DELETE}`,
  GROUP_MANAGE: `${RESOURCE_TYPES.GROUP}:${PERMISSION_TYPES.MANAGE}`,

  // Group operations
  GROUP_JOIN: 'group:join',
  GROUP_LEAVE: 'group:leave',
  GROUP_INVITE: 'group:invite',
  GROUP_APPROVE: `${RESOURCE_TYPES.GROUP}:${PERMISSION_TYPES.APPROVE}`,
  GROUP_REJECT: `${RESOURCE_TYPES.GROUP}:${PERMISSION_TYPES.REJECT}`,
} as const;

// ============================================
// 🎭 ROLE PERMISSIONS (Future Implementation)
// ============================================

/**
 * Role-related permissions
 *
 * 🎯 Purpose: Define permissions for role management and assignment
 *
 * 📋 Planned Features:
 * - Role CRUD operations
 * - Role assignment and unassignment
 * - Permission granting and revoking
 * - Role hierarchy management
 *
 * 🚧 Status: Not implemented yet - will be added when role management features are developed
 */
export const ROLE_PERMISSIONS = {
  // Role management
  ROLE_READ: `${RESOURCE_TYPES.ROLE}:${PERMISSION_TYPES.READ}`,
  ROLE_CREATE: `${RESOURCE_TYPES.ROLE}:${PERMISSION_TYPES.CREATE}`,
  ROLE_UPDATE: `${RESOURCE_TYPES.ROLE}:${PERMISSION_TYPES.UPDATE}`,
  ROLE_DELETE: `${RESOURCE_TYPES.ROLE}:${PERMISSION_TYPES.DELETE}`,
  ROLE_MANAGE: `${RESOURCE_TYPES.ROLE}:${PERMISSION_TYPES.MANAGE}`,

  // Role assignment
  ROLE_ASSIGN: 'role:assign',
  ROLE_UNASSIGN: 'role:unassign',
  ROLE_PERMISSION_GRANT: 'role:permission_grant',
  ROLE_PERMISSION_REVOKE: 'role:permission_revoke',
} as const;

// ============================================
// 📅 SLOT PERMISSIONS (Future Implementation)
// ============================================

/**
 * Slot-related permissions
 *
 * 🎯 Purpose: Define permissions for slot management and operations
 *
 * 📋 Planned Features:
 * - Slot CRUD operations
 * - Slot booking and cancellation
 * - Rescheduling and approval workflows
 * - Calendar and scheduling management
 *
 * 🚧 Status: Not implemented yet - will be added when scheduling features are developed
 */
export const SLOT_PERMISSIONS = {
  // Slot management
  SLOT_READ: `${RESOURCE_TYPES.SLOT}:${PERMISSION_TYPES.READ}`,
  SLOT_CREATE: `${RESOURCE_TYPES.SLOT}:${PERMISSION_TYPES.CREATE}`,
  SLOT_UPDATE: `${RESOURCE_TYPES.SLOT}:${PERMISSION_TYPES.UPDATE}`,
  SLOT_DELETE: `${RESOURCE_TYPES.SLOT}:${PERMISSION_TYPES.DELETE}`,
  SLOT_MANAGE: `${RESOURCE_TYPES.SLOT}:${PERMISSION_TYPES.MANAGE}`,

  // Slot operations
  SLOT_BOOK: 'slot:book',
  SLOT_CANCEL: 'slot:cancel',
  SLOT_RESCHEDULE: 'slot:reschedule',
  SLOT_APPROVE: `${RESOURCE_TYPES.SLOT}:${PERMISSION_TYPES.APPROVE}`,
  SLOT_REJECT: `${RESOURCE_TYPES.SLOT}:${PERMISSION_TYPES.REJECT}`,
} as const;

// ============================================
// ⚙️ SYSTEM PERMISSIONS (Future Implementation)
// ============================================

/**
 * System-level permissions
 *
 * 🎯 Purpose: Define permissions for system operations and administration
 *
 * 📋 Planned Features:
 * - Analytics and reporting access
 * - File management operations
 * - Email and communication features
 * - Audit logging and compliance
 * - Billing and subscription management
 *
 * 🚧 Status: Not implemented yet - will be added when system features are developed
 */
export const SYSTEM_PERMISSIONS = {
  // Analytics
  ANALYTICS_READ: `${RESOURCE_TYPES.ANALYTICS}:${PERMISSION_TYPES.READ}`,
  ANALYTICS_EXPORT: `${RESOURCE_TYPES.ANALYTICS}:${PERMISSION_TYPES.EXPORT}`,

  // File management
  FILE_READ: `${RESOURCE_TYPES.FILE}:${PERMISSION_TYPES.READ}`,
  FILE_UPLOAD: 'file:upload',
  FILE_DOWNLOAD: 'file:download',
  FILE_DELETE: `${RESOURCE_TYPES.FILE}:${PERMISSION_TYPES.DELETE}`,

  // Email
  EMAIL_READ: `${RESOURCE_TYPES.EMAIL}:${PERMISSION_TYPES.READ}`,
  EMAIL_SEND: 'email:send',
  EMAIL_TEMPLATE_MANAGE: 'email:template_manage',

  // Audit logs
  AUDIT_READ: `${RESOURCE_TYPES.AUDIT}:${PERMISSION_TYPES.READ}`,
  AUDIT_EXPORT: `${RESOURCE_TYPES.AUDIT}:${PERMISSION_TYPES.EXPORT}`,

  // Billing
  BILLING_READ: `${RESOURCE_TYPES.BILLING}:${PERMISSION_TYPES.READ}`,
  BILLING_UPDATE: `${RESOURCE_TYPES.BILLING}:${PERMISSION_TYPES.UPDATE}`,
  BILLING_MANAGE: `${RESOURCE_TYPES.BILLING}:${PERMISSION_TYPES.MANAGE}`,
} as const;

// ============================================
// 🎭 ROLE DEFINITIONS
// ============================================

/**
 * User roles in the system
 *
 * 🎯 Purpose: Define the different user roles and their hierarchy
 *
 * 📋 Features:
 * - Role hierarchy from guest to super admin
 * - Clear role definitions for access control
 * - Scalable role system for future expansion
 */
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  TENANT_ADMIN: 'tenant_admin',
  GROUP_ADMIN: 'group_admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

// ============================================
// 🔗 ROLE PERMISSION MAPPINGS
// ============================================

/**
 * Role permission mappings
 *
 * 🎯 Purpose: Define which permissions each role has access to
 *
 * 📋 Features:
 * - Role-based permission assignments
 * - Hierarchical permission structure
 * - Easy permission management and updates
 */
export const ROLE_PERMISSIONS_MAP = {
  [ROLES.SUPER_ADMIN]: [
    // All permissions
    ...Object.values(USER_PERMISSIONS),
    ...Object.values(RESUME_PERMISSIONS),
    ...Object.values(TENANT_PERMISSIONS),
    ...Object.values(GROUP_PERMISSIONS),
    ...Object.values(ROLE_PERMISSIONS),
    ...Object.values(SLOT_PERMISSIONS),
    ...Object.values(SYSTEM_PERMISSIONS),
  ],
  [ROLES.TENANT_ADMIN]: [
    // Tenant-level permissions
    USER_PERMISSIONS.USER_READ,
    USER_PERMISSIONS.USER_CREATE,
    USER_PERMISSIONS.USER_UPDATE,
    USER_PERMISSIONS.USER_DELETE,
    ...Object.values(RESUME_PERMISSIONS),
    TENANT_PERMISSIONS.TENANT_READ,
    TENANT_PERMISSIONS.TENANT_UPDATE,
    TENANT_PERMISSIONS.TENANT_MANAGE,
    TENANT_PERMISSIONS.TENANT_INVITE,
    TENANT_PERMISSIONS.TENANT_APPROVE,
    TENANT_PERMISSIONS.TENANT_REJECT,
    TENANT_PERMISSIONS.TENANT_SETTINGS_READ,
    TENANT_PERMISSIONS.TENANT_SETTINGS_UPDATE,
    TENANT_PERMISSIONS.TENANT_BILLING_READ,
    TENANT_PERMISSIONS.TENANT_BILLING_UPDATE,
    ...Object.values(GROUP_PERMISSIONS),
    ...Object.values(ROLE_PERMISSIONS),
    ...Object.values(SLOT_PERMISSIONS),
    SYSTEM_PERMISSIONS.ANALYTICS_READ,
    SYSTEM_PERMISSIONS.ANALYTICS_EXPORT,
    SYSTEM_PERMISSIONS.AUDIT_READ,
    SYSTEM_PERMISSIONS.AUDIT_EXPORT,
  ],
  [ROLES.GROUP_ADMIN]: [
    // Group-level permissions
    USER_PERMISSIONS.USER_READ,
    USER_PERMISSIONS.USER_CREATE,
    USER_PERMISSIONS.USER_UPDATE,
    RESUME_PERMISSIONS.RESUME_READ,
    RESUME_PERMISSIONS.RESUME_CREATE,
    RESUME_PERMISSIONS.RESUME_UPDATE,
    RESUME_PERMISSIONS.RESUME_DELETE,
    RESUME_PERMISSIONS.RESUME_UPLOAD,
    RESUME_PERMISSIONS.RESUME_DOWNLOAD,
    RESUME_PERMISSIONS.RESUME_EXPORT,
    RESUME_PERMISSIONS.RESUME_ANALYZE,
    TENANT_PERMISSIONS.TENANT_READ,
    GROUP_PERMISSIONS.GROUP_READ,
    GROUP_PERMISSIONS.GROUP_UPDATE,
    GROUP_PERMISSIONS.GROUP_MANAGE,
    GROUP_PERMISSIONS.GROUP_INVITE,
    GROUP_PERMISSIONS.GROUP_APPROVE,
    GROUP_PERMISSIONS.GROUP_REJECT,
    SLOT_PERMISSIONS.SLOT_READ,
    SLOT_PERMISSIONS.SLOT_CREATE,
    SLOT_PERMISSIONS.SLOT_UPDATE,
    SLOT_PERMISSIONS.SLOT_DELETE,
    SLOT_PERMISSIONS.SLOT_MANAGE,
    SLOT_PERMISSIONS.SLOT_APPROVE,
    SLOT_PERMISSIONS.SLOT_REJECT,
    SYSTEM_PERMISSIONS.ANALYTICS_READ,
  ],
  [ROLES.USER]: [
    // Basic user permissions
    USER_PERMISSIONS.PROFILE_READ,
    USER_PERMISSIONS.PROFILE_UPDATE,
    USER_PERMISSIONS.AUTH_LOGIN,
    USER_PERMISSIONS.AUTH_LOGOUT,
    USER_PERMISSIONS.AUTH_CHANGE_PASSWORD,
    USER_PERMISSIONS.SETTINGS_READ,
    USER_PERMISSIONS.SETTINGS_UPDATE,
    RESUME_PERMISSIONS.RESUME_READ,
    RESUME_PERMISSIONS.RESUME_CREATE,
    RESUME_PERMISSIONS.RESUME_UPDATE,
    RESUME_PERMISSIONS.RESUME_DELETE,
    RESUME_PERMISSIONS.RESUME_UPLOAD,
    RESUME_PERMISSIONS.RESUME_DOWNLOAD,
    RESUME_PERMISSIONS.RESUME_EXPORT,
    RESUME_PERMISSIONS.RESUME_ANALYZE,
    RESUME_PERMISSIONS.RESUME_TEMPLATE_USE,
    TENANT_PERMISSIONS.TENANT_READ,
    TENANT_PERMISSIONS.TENANT_JOIN,
    GROUP_PERMISSIONS.GROUP_READ,
    GROUP_PERMISSIONS.GROUP_JOIN,
    SLOT_PERMISSIONS.SLOT_READ,
    SLOT_PERMISSIONS.SLOT_BOOK,
    SLOT_PERMISSIONS.SLOT_CANCEL,
    SLOT_PERMISSIONS.SLOT_RESCHEDULE,
    SYSTEM_PERMISSIONS.FILE_UPLOAD,
    SYSTEM_PERMISSIONS.FILE_DOWNLOAD,
  ],
  [ROLES.GUEST]: [
    // Limited guest permissions
    USER_PERMISSIONS.AUTH_LOGIN,
    USER_PERMISSIONS.AUTH_REGISTER,
    USER_PERMISSIONS.AUTH_RESET_PASSWORD,
    RESUME_PERMISSIONS.RESUME_PUBLIC_VIEW,
    TENANT_PERMISSIONS.TENANT_READ,
  ],
} as const;

// ============================================
// 🛠️ PERMISSION UTILITIES
// ============================================

/**
 * Check if user has specific permission
 *
 * 🎯 Purpose: Verify if a user has a specific permission
 *
 * @param userPermissions - Array of user's permissions
 * @param permission - Permission to check
 * @returns Boolean indicating if user has the permission
 */
export const hasPermission = (userPermissions: string[], permission: string): boolean => {
  return userPermissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 *
 * 🎯 Purpose: Verify if a user has at least one of the specified permissions
 *
 * @param userPermissions - Array of user's permissions
 * @param permissions - Array of permissions to check
 * @returns Boolean indicating if user has any of the permissions
 */
export const hasAnyPermission = (userPermissions: string[], permissions: string[]): boolean => {
  return permissions.some(permission => userPermissions.includes(permission));
};

/**
 * Check if user has all of the specified permissions
 *
 * 🎯 Purpose: Verify if a user has all of the specified permissions
 *
 * @param userPermissions - Array of user's permissions
 * @param permissions - Array of permissions to check
 * @returns Boolean indicating if user has all permissions
 */
export const hasAllPermissions = (userPermissions: string[], permissions: string[]): boolean => {
  return permissions.every(permission => userPermissions.includes(permission));
};

/**
 * Get permissions for a specific role
 *
 * 🎯 Purpose: Retrieve all permissions assigned to a specific role
 *
 * @param role - Role name
 * @returns Array of permissions for the role
 */
export const getRolePermissions = (role: string): string[] => {
  return [...(ROLE_PERMISSIONS_MAP[role as keyof typeof ROLE_PERMISSIONS_MAP] || [])];
};

/**
 * Check if user can perform action on resource
 *
 * 🎯 Purpose: Verify if a user can perform a specific action on a resource
 *
 * @param userPermissions - Array of user's permissions
 * @param resource - Resource type
 * @param action - Action to perform
 * @returns Boolean indicating if user can perform the action
 */
export const canPerformAction = (
  userPermissions: string[],
  resource: string,
  action: string
): boolean => {
  const permission = `${resource}:${action}`;
  return hasPermission(userPermissions, permission);
};

/**
 * Get all permissions grouped by resource
 *
 * 🎯 Purpose: Retrieve all permissions organized by resource type
 *
 * @returns Object containing all permissions grouped by resource
 */
export const getAllPermissions = () => ({
  USER: USER_PERMISSIONS,
  RESUME: RESUME_PERMISSIONS,
  TENANT: TENANT_PERMISSIONS,
  GROUP: GROUP_PERMISSIONS,
  ROLE: ROLE_PERMISSIONS,
  SLOT: SLOT_PERMISSIONS,
  SYSTEM: SYSTEM_PERMISSIONS,
});

// ============================================
// 📦 EXPORT ALL PERMISSIONS
// ============================================

/**
 * Complete permissions object
 *
 * 🎯 Purpose: Centralized access to all permission configurations
 *
 * 📋 Features:
 * - Single import for all permissions
 * - Type-safe permission access
 * - Easy maintenance and updates
 * - Comprehensive permission information
 *
 * 🔧 Usage:
 * ```typescript
 * import { PERMISSIONS } from '@/constants/permissions';
 *
 * // Access any permission configuration
 * const userPermissions = PERMISSIONS.USER;
 * const roles = PERMISSIONS.ROLES;
 * ```
 */
export const PERMISSIONS = {
  TYPES: PERMISSION_TYPES,
  RESOURCES: RESOURCE_TYPES,
  USER: USER_PERMISSIONS,
  RESUME: RESUME_PERMISSIONS,
  TENANT: TENANT_PERMISSIONS,
  GROUP: GROUP_PERMISSIONS,
  ROLE: ROLE_PERMISSIONS,
  SLOT: SLOT_PERMISSIONS,
  SYSTEM: SYSTEM_PERMISSIONS,
  ROLES: ROLES,
  ROLE_MAP: ROLE_PERMISSIONS_MAP,
} as const;

// Default export for convenience
export default PERMISSIONS;
