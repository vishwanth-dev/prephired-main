/**
 * 🚀 API Endpoints Configuration
 *
 * This file serves as the single source of truth for all API endpoints in the PrepAI application.
 * It provides centralized management of backend routes, making it easy to maintain and update
 * API connections across the entire frontend application.
 *
 * 📋 Features:
 * - Environment-based API URL configuration
 * - Type-safe endpoint definitions
 * - HTTP method mappings
 * - Dynamic URL building utilities
 * - Comprehensive documentation
 *
 * 🔧 Usage:
 * ```typescript
 * import { USER_ENDPOINTS, API_BASE_URL } from '@/constants/api-endpoints';
 *
 * // Use in API calls
 * const response = await fetch(`${API_BASE_URL}${USER_ENDPOINTS.REGISTER}`, {
 *   method: 'POST',
 *   body: JSON.stringify(userData)
 * });
 * ```
 *
 * 📝 Maintenance:
 * - Add new endpoints as features are developed
 * - Keep endpoint names descriptive and consistent
 * - Update HTTP methods when backend changes
 * - Document any special parameters or requirements
 */

// ============================================
// 🌐 BASE CONFIGURATION
// ============================================

/**
 * Base API URL for all backend requests
 *
 * Environment Variables:
 * - NEXT_PUBLIC_API_URL: Production API URL
 * - Default: http://localhost:5000/api (Development)
 *
 * @example
 * Development: http://localhost:5000/api
 * Production: https://api.prephired.com/api
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ============================================
// 👤 USER AUTHENTICATION & MANAGEMENT
// ============================================

/**
 * User-related API endpoints
 *
 * 🔐 Authentication Flow:
 * 1. REGISTER → Create new user account
 * 2. LOGIN → Authenticate existing user
 * 3. VERIFY_OTP → Verify phone/email OTP
 * 4. SELECT_ROLE → Choose user role after registration
 *
 * 📊 Management Operations:
 * - User CRUD operations
 * - Profile management
 * - Password operations
 * - Bulk operations
 * - Analytics and reporting
 */
export const USER_ENDPOINTS = {
  // 🔐 Authentication Endpoints
  REGISTER: '/user/register', // POST - Create new user account
  LOGIN: '/user/login', // POST - User authentication
  VERIFY_OTP: '/user/verify-otp', // POST - Verify OTP code
  SELECT_ROLE: '/user/select-role', // PUT - Select user role
  AUTH_DETAILS: '/user/auth-details', // GET - Get authenticated user details

  // 👤 User Management
  GET_USER: '/user/:userId', // GET - Get user by ID
  UPDATE_USER: '/user/:userId', // PUT - Update user details
  UPDATE_USER_PROFILE: '/user/:userId/profile', // PATCH - Update user profile
  CHANGE_PASSWORD: '/user/:userId/password', // PUT - Change user password
  DEACTIVATE_USER: '/user/:userId/deactivate', // PUT - Deactivate user account
  REACTIVATE_USER: '/user/:userId/reactivate', // PUT - Reactivate user account

  // 📋 User Listing & Search
  LIST_USERS: '/user/list', // GET - List all users
  SEARCH_USERS: '/user/search', // GET - Search users
  USERS_BY_STATUS: '/user/by-status/:status', // GET - Users by status
  USERS_BY_ROLE: '/user/by-role/:role', // GET - Users by role

  // 📊 Analytics & Statistics
  USER_STATS: '/user/stats', // GET - User statistics
  USER_ANALYTICS: '/user/analytics/registrations', // GET - Registration analytics

  // 🔄 Bulk Operations
  BULK_UPDATE_STATUS: '/user/bulk/status', // PUT - Bulk status update
  BULK_ASSIGN_ROLE: '/user/bulk/role', // PUT - Bulk role assignment

  // 📤 Export Operations
  EXPORT_USERS: '/user/export', // GET - Export user data
} as const;

// ============================================
// 🏢 GROUP MANAGEMENT (Future Implementation)
// ============================================

/**
 * Group-related API endpoints
 *
 * 🎯 Purpose: Manage user groups, permissions, and collaborative features
 *
 * 📋 Planned Features:
 * - Group creation and management
 * - Permission-based access control
 * - Group templates and bulk operations
 * - Analytics and reporting
 *
 * 🚧 Status: Not implemented yet - will be added when group features are developed
 */
export const GROUP_ENDPOINTS = {
  // 🏢 Group Management
  CREATE_GROUP: '/group/create-group', // POST - Create new group
  GET_GROUP: '/group/:groupId', // GET - Get group details
  GET_GROUP_BY_ID: '/group/:groupId', // GET - Get group by ID
  UPDATE_GROUP: '/group/:groupId', // PUT - Update group
  DELETE_GROUP: '/group/:groupId', // DELETE - Delete group
  LIST_GROUPS: '/group/list', // GET - List all groups

  // 🔐 Group Permissions
  ADD_MODULE_PERMISSIONS: '/group/:groupId/modules', // POST - Add permissions
  UPDATE_MODULE_PERMISSIONS: '/group/:groupId/modules', // PUT - Update permissions
  REMOVE_MODULE_PERMISSIONS: '/group/:groupId/modules', // DELETE - Remove permissions
  UPDATE_MODULE_PERMISSION: '/group/:groupId/modules/:module', // PUT - Update specific permission
  CHECK_GROUP_PERMISSION: '/group/:groupId/permissions/:module/:action', // GET - Check permission
  GET_GROUP_PERMISSIONS: '/group/:groupId/permissions', // GET - Get group permissions

  // 📊 Group Analytics
  GROUP_STATS: '/group/stats', // GET - Group statistics
  GROUP_TEMPLATES: '/group/templates', // GET - Available templates
  CREATE_GROUP_FROM_TEMPLATE: '/group/from-template', // POST - Create from template
} as const;

// ============================================
// 👥 ROLE MANAGEMENT (Future Implementation)
// ============================================

/**
 * Role-related API endpoints
 *
 * 🎯 Purpose: Manage user roles and role-based access control (RBAC)
 *
 * 📋 Planned Features:
 * - Role creation and assignment
 * - Permission management
 * - Role hierarchy and inheritance
 * - Bulk role operations
 *
 * 🚧 Status: Not implemented yet - will be added when role management features are developed
 */
export const ROLE_ENDPOINTS = {
  // 👥 Role Management
  CREATE_ROLE: '/role/create-role', // POST - Create new role
  GET_ROLE: '/role/:roleId', // GET - Get role details
  GET_ROLE_BY_ID: '/role/:roleId', // GET - Get role by ID
  UPDATE_ROLE: '/role/:roleId', // PUT - Update role
  DELETE_ROLE: '/role/:roleId', // DELETE - Delete role
  LIST_ROLES: '/role/list', // GET - List all roles

  // 🔗 Role Assignment
  ASSIGN_GROUPS_TO_ROLE: '/role/:roleId/groups', // PUT - Assign groups to role
  REMOVE_GROUPS_FROM_ROLE: '/role/:roleId/groups', // DELETE - Remove groups from role
  ROLES_BY_GROUP: '/role/by-group/:groupId', // GET - Roles by group

  // 📊 Role Analytics
  ROLE_STATS: '/role/stats', // GET - Role statistics
} as const;

// ============================================
// 🏢 TENANT MANAGEMENT (Future Implementation)
// ============================================

/**
 * Tenant-related API endpoints
 *
 * 🎯 Purpose: Manage multi-tenant architecture and tenant-specific operations
 *
 * 📋 Planned Features:
 * - Tenant registration and approval
 * - Tenant-specific configurations
 * - Billing and subscription management
 * - Tenant analytics and reporting
 *
 * 🚧 Status: Not implemented yet - will be added when tenant features are developed
 */
export const TENANT_ENDPOINTS = {
  // 🏢 Tenant Management
  APPLY: '/tenant/apply', // POST - Apply for tenant
  CREATE_TENANT: '/tenant/create-tenant', // POST - Create tenant
  GET_TENANT: '/tenant/get-tenant/:tenantId', // GET - Get tenant details
  UPDATE_TENANT: '/tenant/update-tenant', // PUT - Update tenant
  DELETE_TENANT: '/tenant/:tenantId', // DELETE - Delete tenant

  // ✅ Tenant Approval
  REQUEST_DECISION: '/tenant/request/decision', // PUT - Approve/reject tenant
  GET_TENANT_REQUEST: '/tenant/request/:requestId', // GET - Get tenant request
  LIST_TENANT_REQUESTS: '/tenant/requests', // GET - List tenant requests

  // 🔍 Tenant Search & Filtering
  LIST_TENANTS: '/tenant/list-tenants', // GET - List all tenants
  SEARCH_TENANTS: '/tenant/search', // GET - Search tenants
  TENANTS_BY_STATUS: '/tenant/by-status/:status', // GET - Tenants by status

  // ⚙️ Tenant Operations
  SUSPEND_TENANT: '/tenant/:tenantId/suspend', // PUT - Suspend tenant
  ACTIVATE_TENANT: '/tenant/:tenantId/activate', // PUT - Activate tenant
  UPDATE_TENANT_SUBSCRIPTION: '/tenant/:tenantId/subscription', // PUT - Update subscription

  // 📊 Tenant Analytics
  TENANT_STATS: '/tenant/stats', // GET - Tenant statistics
  TENANT_ANALYTICS: '/tenant/analytics', // GET - Tenant analytics

  // 🔧 Tenant Validation
  CHECK_SUBDOMAIN: '/tenant/check-subdomain/:subdomain', // GET - Check subdomain availability
  VALIDATE_TENANT_CONFIG: '/tenant/validate-config', // POST - Validate tenant config
} as const;

// ============================================
// 📄 RESUME MANAGEMENT (Future Implementation)
// ============================================

/**
 * Resume-related API endpoints
 *
 * 🎯 Purpose: Handle resume upload, processing, analysis, and management
 *
 * 📋 Planned Features:
 * - Resume upload and processing
 * - AI-powered resume analysis
 * - Resume templates and customization
 * - Export and sharing capabilities
 * - Resume analytics and insights
 *
 * 🚧 Status: Not implemented yet - will be added when resume features are developed
 */
export const RESUME_ENDPOINTS = {
  // 📤 Resume Upload
  UPLOAD: '/resume/upload', // POST - Upload single resume
  UPLOAD_MULTIPLE: '/resume/upload-multiple', // POST - Upload multiple resumes

  // 📄 Resume Management
  GET_RESUME: '/resume/:resumeId', // GET - Get resume details
  GET_RESUMES_BY_USER: '/resume/user/:userId', // GET - Get user's resumes
  UPDATE_RESUME: '/resume/:resumeId', // PUT - Update resume
  DELETE_RESUME: '/resume/:resumeId', // DELETE - Delete resume

  // ⚙️ Resume Processing
  STREAM_STATUS: '/resume/:resumeId/stream', // GET - Get processing status
  START_PROCESSING: '/resume/:resumeId/process', // POST - Start processing
  RETRY_PROCESSING: '/resume/:resumeId/retry', // POST - Retry processing
  GET_PROCESSING_HISTORY: '/resume/:resumeId/history', // GET - Processing history

  // 🤖 Resume Analysis
  GET_RESUME_SCORES: '/resume/:resumeId/scores', // GET - Get resume scores
  GET_RESUME_TEXT: '/resume/:resumeId/text', // GET - Extract resume text
  GET_RESUME_ANALYSIS: '/resume/:resumeId/analysis', // GET - Get AI analysis

  // 📋 Resume Listing
  LIST_RESUMES: '/resume/list', // GET - List all resumes
  RESUMES_BY_STATUS: '/resume/by-status/:status', // GET - Resumes by status

  // 📊 Resume Analytics
  RESUME_STATS: '/resume/stats', // GET - Resume statistics
  RESUME_ANALYTICS: '/resume/analytics', // GET - Resume analytics

  // 📤 Resume Export
  EXPORT_PDF: '/resume/:resumeId/export/pdf', // GET - Export as PDF
  EXPORT_DOCX: '/resume/:resumeId/export/docx', // GET - Export as DOCX
  EXPORT_ANALYSIS: '/resume/:resumeId/export/analysis', // GET - Export analysis
} as const;

// ============================================
// 🔧 SYSTEM & HEALTH ENDPOINTS
// ============================================

/**
 * System-related API endpoints
 *
 * 🎯 Purpose: System health checks, monitoring, and basic system operations
 *
 * 📋 Features:
 * - Health check for system status
 * - Welcome message for API testing
 * - System monitoring and diagnostics
 */
export const SYSTEM_ENDPOINTS = {
  // 🏥 Health Check
  HEALTH: '/health', // GET - System health status

  // 👋 Welcome Message
  WELCOME: '/', // GET - API welcome message
} as const;

// ============================================
// 🔗 COMPLETE API ENDPOINTS OBJECT
// ============================================

/**
 * Complete API Endpoints Object
 *
 * 🎯 Purpose: Provides easy access to all endpoints with full URLs
 *
 * 📋 Features:
 * - Pre-built full URLs for all endpoints
 * - Environment-aware base URL
 * - Type-safe endpoint access
 *
 * 🔧 Usage:
 * ```typescript
 * import { API_ENDPOINTS } from '@/constants/api-endpoints';
 *
 * // Use pre-built URLs
 * const registerUrl = API_ENDPOINTS.USER.REGISTER;
 * // Result: "http://localhost:5000/api/user/register"
 * ```
 */
export const API_ENDPOINTS = {
  USER: Object.fromEntries(
    Object.entries(USER_ENDPOINTS).map(([key, value]) => [key, `${API_BASE_URL}${value}`])
  ),
  GROUP: Object.fromEntries(
    Object.entries(GROUP_ENDPOINTS).map(([key, value]) => [key, `${API_BASE_URL}${value}`])
  ),
  ROLE: Object.fromEntries(
    Object.entries(ROLE_ENDPOINTS).map(([key, value]) => [key, `${API_BASE_URL}${value}`])
  ),
  TENANT: Object.fromEntries(
    Object.entries(TENANT_ENDPOINTS).map(([key, value]) => [key, `${API_BASE_URL}${value}`])
  ),
  RESUME: Object.fromEntries(
    Object.entries(RESUME_ENDPOINTS).map(([key, value]) => [key, `${API_BASE_URL}${value}`])
  ),
  SYSTEM: Object.fromEntries(
    Object.entries(SYSTEM_ENDPOINTS).map(([key, value]) => [key, `${API_BASE_URL}${value}`])
  ),
} as const;

// ============================================
// 📋 HTTP METHODS MAPPING
// ============================================

/**
 * HTTP Methods for each endpoint
 *
 * 🎯 Purpose: Provides type safety and API documentation for HTTP methods
 *
 * 📋 Features:
 * - Method validation for each endpoint
 * - API documentation reference
 * - Type-safe method checking
 *
 * 🔧 Usage:
 * ```typescript
 * import { API_METHODS } from '@/constants/api-endpoints';
 *
 * // Check method for endpoint
 * const method = API_METHODS.USER.REGISTER; // "POST"
 * ```
 */
export const API_METHODS = {
  USER: {
    // 🔐 Authentication Methods
    REGISTER: 'POST', // Create new user account
    LOGIN: 'POST', // User authentication
    VERIFY_OTP: 'POST', // Verify OTP code
    SELECT_ROLE: 'PUT', // Select user role
    AUTH_DETAILS: 'GET', // Get authenticated user details

    // 👤 User Management Methods
    GET_USER: 'GET', // Get user by ID
    UPDATE_USER: 'PUT', // Update user details
    UPDATE_USER_PROFILE: 'PATCH', // Update user profile
    CHANGE_PASSWORD: 'PUT', // Change user password
    DEACTIVATE_USER: 'PUT', // Deactivate user account
    REACTIVATE_USER: 'PUT', // Reactivate user account

    // 📋 User Listing Methods
    LIST_USERS: 'GET', // List all users
    SEARCH_USERS: 'GET', // Search users
    USERS_BY_STATUS: 'GET', // Users by status
    USERS_BY_ROLE: 'GET', // Users by role

    // 📊 Analytics Methods
    USER_STATS: 'GET', // User statistics
    USER_ANALYTICS: 'GET', // Registration analytics

    // 🔄 Bulk Operations Methods
    BULK_UPDATE_STATUS: 'PUT', // Bulk status update
    BULK_ASSIGN_ROLE: 'PUT', // Bulk role assignment

    // 📤 Export Methods
    EXPORT_USERS: 'GET', // Export user data
  },
  GROUP: {
    // 🏢 Group Management Methods
    CREATE_GROUP: 'POST', // Create new group
    GET_GROUP: 'GET', // Get group details
    GET_GROUP_BY_ID: 'GET', // Get group by ID
    UPDATE_GROUP: 'PUT', // Update group
    DELETE_GROUP: 'DELETE', // Delete group
    LIST_GROUPS: 'GET', // List all groups

    // 🔐 Group Permissions Methods
    ADD_MODULE_PERMISSIONS: 'POST', // Add permissions
    UPDATE_MODULE_PERMISSIONS: 'PUT', // Update permissions
    REMOVE_MODULE_PERMISSIONS: 'DELETE', // Remove permissions
    UPDATE_MODULE_PERMISSION: 'PUT', // Update specific permission
    CHECK_GROUP_PERMISSION: 'GET', // Check permission
    GET_GROUP_PERMISSIONS: 'GET', // Get group permissions

    // 📊 Group Analytics Methods
    GROUP_STATS: 'GET', // Group statistics
    GROUP_TEMPLATES: 'GET', // Available templates
    CREATE_GROUP_FROM_TEMPLATE: 'POST', // Create from template
  },
  ROLE: {
    // 👥 Role Management Methods
    CREATE_ROLE: 'POST', // Create new role
    GET_ROLE: 'GET', // Get role details
    GET_ROLE_BY_ID: 'GET', // Get role by ID
    UPDATE_ROLE: 'PUT', // Update role
    DELETE_ROLE: 'DELETE', // Delete role
    LIST_ROLES: 'GET', // List all roles

    // 🔗 Role Assignment Methods
    ASSIGN_GROUPS_TO_ROLE: 'PUT', // Assign groups to role
    REMOVE_GROUPS_FROM_ROLE: 'DELETE', // Remove groups from role
    ROLES_BY_GROUP: 'GET', // Roles by group

    // 📊 Role Analytics Methods
    ROLE_STATS: 'GET', // Role statistics
  },
  TENANT: {
    // 🏢 Tenant Management Methods
    APPLY: 'POST', // Apply for tenant
    CREATE_TENANT: 'POST', // Create tenant
    GET_TENANT: 'GET', // Get tenant details
    UPDATE_TENANT: 'PUT', // Update tenant
    DELETE_TENANT: 'DELETE', // Delete tenant

    // ✅ Tenant Approval Methods
    REQUEST_DECISION: 'PUT', // Approve/reject tenant
    GET_TENANT_REQUEST: 'GET', // Get tenant request
    LIST_TENANT_REQUESTS: 'GET', // List tenant requests

    // 🔍 Tenant Search Methods
    LIST_TENANTS: 'GET', // List all tenants
    SEARCH_TENANTS: 'GET', // Search tenants
    TENANTS_BY_STATUS: 'GET', // Tenants by status

    // ⚙️ Tenant Operations Methods
    SUSPEND_TENANT: 'PUT', // Suspend tenant
    ACTIVATE_TENANT: 'PUT', // Activate tenant
    UPDATE_TENANT_SUBSCRIPTION: 'PUT', // Update subscription

    // 📊 Tenant Analytics Methods
    TENANT_STATS: 'GET', // Tenant statistics
    TENANT_ANALYTICS: 'GET', // Tenant analytics

    // 🔧 Tenant Validation Methods
    CHECK_SUBDOMAIN: 'GET', // Check subdomain availability
    VALIDATE_TENANT_CONFIG: 'POST', // Validate tenant config
  },
  RESUME: {
    // 📤 Resume Upload Methods
    UPLOAD: 'POST', // Upload single resume
    UPLOAD_MULTIPLE: 'POST', // Upload multiple resumes

    // 📄 Resume Management Methods
    GET_RESUME: 'GET', // Get resume details
    GET_RESUMES_BY_USER: 'GET', // Get user's resumes
    UPDATE_RESUME: 'PUT', // Update resume
    DELETE_RESUME: 'DELETE', // Delete resume

    // ⚙️ Resume Processing Methods
    STREAM_STATUS: 'GET', // Get processing status
    START_PROCESSING: 'POST', // Start processing
    RETRY_PROCESSING: 'POST', // Retry processing
    GET_PROCESSING_HISTORY: 'GET', // Processing history

    // 🤖 Resume Analysis Methods
    GET_RESUME_SCORES: 'GET', // Get resume scores
    GET_RESUME_TEXT: 'GET', // Extract resume text
    GET_RESUME_ANALYSIS: 'GET', // Get AI analysis

    // 📋 Resume Listing Methods
    LIST_RESUMES: 'GET', // List all resumes
    RESUMES_BY_STATUS: 'GET', // Resumes by status

    // 📊 Resume Analytics Methods
    RESUME_STATS: 'GET', // Resume statistics
    RESUME_ANALYTICS: 'GET', // Resume analytics

    // 📤 Resume Export Methods
    EXPORT_PDF: 'GET', // Export as PDF
    EXPORT_DOCX: 'GET', // Export as DOCX
    EXPORT_ANALYSIS: 'GET', // Export analysis
  },
  SYSTEM: {
    // 🏥 System Methods
    HEALTH: 'GET', // System health status
    WELCOME: 'GET', // API welcome message
  },
} as const;

// ============================================
// 🛠️ UTILITY FUNCTIONS
// ============================================

/**
 * Helper function to build dynamic URLs with parameters
 *
 * 🎯 Purpose: Replace URL parameters with actual values
 *
 * 📋 Features:
 * - Dynamic parameter replacement
 * - Type-safe parameter handling
 * - Support for string and number parameters
 *
 * 🔧 Usage:
 * ```typescript
 * import { buildApiUrl } from '@/constants/api-endpoints';
 *
 * // Build dynamic URL
 * const userUrl = buildApiUrl('/user/:userId', { userId: 123 });
 * // Result: "http://localhost:5000/api/user/123"
 * ```
 *
 * @param endpoint - The endpoint template with parameters (e.g., '/user/:userId')
 * @param params - Object containing parameter values
 * @returns Complete URL with parameters replaced
 */
export const buildApiUrl = (endpoint: string, params?: Record<string, string | number>): string => {
  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }

  return url;
};

// ============================================
// 📝 TYPESCRIPT TYPE EXPORTS
// ============================================

/**
 * TypeScript type exports for type safety
 *
 * 🎯 Purpose: Provide type-safe endpoint access
 *
 * 📋 Features:
 * - Type-safe endpoint keys
 * - IntelliSense support
 * - Compile-time validation
 */
export type UserEndpoint = keyof typeof USER_ENDPOINTS;
