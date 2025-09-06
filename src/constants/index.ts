/**
 * 📋 Constants - Centralized Export Hub
 *
 * This file serves as the centralized export point for all constants
 * and configurations in the PrepAI application. It provides clean,
 * organized access to all configuration values, endpoints, and settings.
 *
 * 📋 Architecture:
 * - Application configuration
 * - API endpoints and methods
 * - Integration providers
 * - Permissions and roles
 * - Feature flags and settings
 *
 * 🔧 Usage:
 * ```typescript
 * import { CONFIG, USER_ENDPOINTS, PERMISSIONS, INTEGRATION_PROVIDERS } from '@/constants';
 * ```
 */

// ============================================
// ⚙️ APPLICATION CONFIGURATION
// ============================================

export {
  CONFIG,
  APP_CONFIG,
  PAGINATION_CONFIG,
  UI_CONFIG,
  AUTH_CONFIG,
  API_CONFIG,
  FEATURE_FLAGS,
  VALIDATION_CONFIG,
  STORAGE_KEYS,
  THEME_CONFIG,
  DATE_CONFIG,
} from './config';

// ============================================
// 🌐 API ENDPOINTS & METHODS
// ============================================

export {
  API_BASE_URL,
  USER_ENDPOINTS,
  GROUP_ENDPOINTS,
  ROLE_ENDPOINTS,
  TENANT_ENDPOINTS,
  RESUME_ENDPOINTS,
  SYSTEM_ENDPOINTS,
  API_ENDPOINTS,
  API_METHODS,
  buildApiUrl,
} from './api-endpoints';

export type { UserEndpoint } from './api-endpoints';

// ============================================
// 🧩 INTEGRATION PROVIDERS
// ============================================

export {
  INTEGRATION_PROVIDERS,
  UI_PROVIDERS,
  FORM_PROVIDERS,
  STATE_PROVIDERS,
  ANALYTICS_PROVIDERS,
  getProviderConfig,
  getProviderDocs,
  getProviderFeatures,
  hasProviderFeature,
  getProvidersByType,
  getProviderRecommendations,
} from './integration-providers';

// ============================================
// 🛣️ ROUTE HELPERS
// ============================================

export {
  isAuthRoute,
  isProtectedRoute,
  isAdminRoute,
  isWidgetRoute,
  isPublicRoute,
  isApiRoute,
  isStaticRoute,
  getRouteType,
  requiresAuth,
  shouldRedirectAuth,
  getAuthRedirectUrl,
  getAuthenticatedRedirectUrl,
  ROUTE_TYPES,
} from './routes';

export type { RouteType } from './routes';

// ============================================
// 🔐 PERMISSIONS & ROLES
// ============================================

export {
  PERMISSIONS,
  PERMISSION_TYPES,
  RESOURCE_TYPES,
  USER_PERMISSIONS,
  RESUME_PERMISSIONS,
  TENANT_PERMISSIONS,
  GROUP_PERMISSIONS,
  ROLE_PERMISSIONS,
  SLOT_PERMISSIONS,
  SYSTEM_PERMISSIONS,
  ROLES,
  ROLE_PERMISSIONS_MAP,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  canPerformAction,
  getAllPermissions,
} from './permissions';

// ============================================
// 📦 CONSTANTS COLLECTIONS
// ============================================

/**
 * Constants information for documentation
 */
export const CONSTANTS_INFO = {
  config: [
    'CONFIG',
    'APP_CONFIG',
    'PAGINATION_CONFIG',
    'UI_CONFIG',
    'AUTH_CONFIG',
    'API_CONFIG',
    'FEATURE_FLAGS',
    'VALIDATION_CONFIG',
    'STORAGE_KEYS',
    'THEME_CONFIG',
    'DATE_CONFIG',
  ],
  endpoints: [
    'API_BASE_URL',
    'USER_ENDPOINTS',
    'GROUP_ENDPOINTS',
    'ROLE_ENDPOINTS',
    'TENANT_ENDPOINTS',
    'RESUME_ENDPOINTS',
    'SYSTEM_ENDPOINTS',
    'API_ENDPOINTS',
    'API_METHODS',
  ],
  routes: [
    'isAuthRoute',
    'isProtectedRoute',
    'isAdminRoute',
    'isWidgetRoute',
    'isPublicRoute',
    'isApiRoute',
    'isStaticRoute',
    'getRouteType',
    'requiresAuth',
    'shouldRedirectAuth',
    'getAuthRedirectUrl',
    'getAuthenticatedRedirectUrl',
    'ROUTE_TYPES',
  ],
  integrations: [
    'INTEGRATION_PROVIDERS',
    'UI_PROVIDERS',
    'FORM_PROVIDERS',
    'STATE_PROVIDERS',
    'ANALYTICS_PROVIDERS',
  ],
  permissions: [
    'PERMISSIONS',
    'PERMISSION_TYPES',
    'RESOURCE_TYPES',
    'USER_PERMISSIONS',
    'RESUME_PERMISSIONS',
    'TENANT_PERMISSIONS',
    'GROUP_PERMISSIONS',
    'ROLE_PERMISSIONS',
    'SLOT_PERMISSIONS',
    'SYSTEM_PERMISSIONS',
    'ROLES',
    'ROLE_PERMISSIONS_MAP',
  ],
} as const;

// Default export for convenience
export default CONSTANTS_INFO;
