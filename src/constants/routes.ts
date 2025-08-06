// Public routes
export const PUBLIC_ROUTES = {
  HOME: '/',
  LANDING: '/landing',
  PRICING: '/pricing',
  FEATURES: '/features',
  ABOUT: '/about',
  CONTACT: '/contact',
  BLOG: '/blog',
  LEGAL: {
    PRIVACY: '/legal/privacy',
    TERMS: '/legal/terms',
    COOKIES: '/legal/cookies',
  },
} as const;

// Authentication routes
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  SSO: '/sso',
} as const;

// Dashboard routes
export const DASHBOARD_ROUTES = {
  OVERVIEW: '/overview',
  INTERVIEWS: {
    LIST: '/interviews',
    CREATE: '/interviews/create',
    DETAIL: (id: string) => `/interviews/${id}`,
    EDIT: (id: string) => `/interviews/${id}/edit`,
    SETTINGS: (id: string) => `/interviews/${id}/settings`,
  },
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    ROLES: '/users/roles',
    INVITE: '/users/invite',
  },
  ANALYTICS: {
    OVERVIEW: '/analytics',
    REPORTS: '/analytics/reports',
    METRICS: '/analytics/metrics',
  },
  SETTINGS: {
    PROFILE: '/settings/profile',
    TEAM: '/settings/team',
    INTEGRATIONS: '/settings/integrations',
    SECURITY: '/settings/security',
    PREFERENCES: '/settings/preferences',
    API_KEYS: '/settings/api-keys',
  },
} as const;

// Admin routes
export const ADMIN_ROUTES = {
  TENANTS: '/admin/tenants',
  SYSTEM: '/admin/system',
  MONITORING: '/admin/monitoring',
} as const;

// Widget routes
export const WIDGET_ROUTES = {
  EMBED: '/embed',
  PREVIEW: '/preview',
  TENANT_EMBED: (tenantId: string) => `/embed/${tenantId}`,
} as const;

// API routes
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/signin',
    REGISTER: '/api/auth/signup',
    LOGOUT: '/api/auth/signout',
    SESSION: '/api/auth/session',
    PROVIDERS: '/api/auth/providers',
  },
  INTERVIEWS: {
    LIST: '/api/interviews',
    CREATE: '/api/interviews',
    DETAIL: (id: string) => `/api/interviews/${id}`,
    UPDATE: (id: string) => `/api/interviews/${id}`,
    DELETE: (id: string) => `/api/interviews/${id}`,
    START: (id: string) => `/api/interviews/${id}/start`,
    END: (id: string) => `/api/interviews/${id}/end`,
  },
  CANDIDATES: {
    LIST: '/api/candidates',
    CREATE: '/api/candidates',
    DETAIL: (id: string) => `/api/candidates/${id}`,
    UPDATE: (id: string) => `/api/candidates/${id}`,
    DELETE: (id: string) => `/api/candidates/${id}`,
    INVITE: (id: string) => `/api/candidates/${id}/invite`,
  },
  USERS: {
    LIST: '/api/users',
    CREATE: '/api/users',
    DETAIL: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
    INVITE: '/api/users/invite',
    ROLES: '/api/users/roles',
  },
  ANALYTICS: {
    OVERVIEW: '/api/analytics',
    METRICS: '/api/analytics/metrics',
    REPORTS: '/api/analytics/reports',
    EVENTS: '/api/analytics/events',
  },
  UPLOAD: '/api/upload',
  HEALTH: '/api/health',
  TENANTS: {
    LIST: '/api/tenants',
    DETAIL: (id: string) => `/api/tenants/${id}`,
  },
  INTEGRATIONS: {
    LIST: '/api/integrations',
    CREATE: '/api/integrations',
    WEBHOOKS: '/api/integrations/webhooks',
    OAUTH: '/api/integrations/oauth',
    API_KEYS: '/api/integrations/api-keys',
  },
} as const;

// Route patterns for middleware
export const ROUTE_PATTERNS = {
  PUBLIC: [
    '/',
    '/landing',
    '/pricing',
    '/features',
    '/about',
    '/contact',
    '/blog',
    '/blog/(.+)',
    '/legal/(.+)',
  ],
  AUTH: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/sso/(.+)',
  ],
  PROTECTED: [
    '/overview',
    '/interviews',
    '/interviews/(.+)',
    '/candidates',
    '/candidates/(.+)',
    '/users',
    '/users/(.+)',
    '/analytics',
    '/analytics/(.+)',
    '/settings',
    '/settings/(.+)',
  ],
  ADMIN: ['/admin/(.+)'],
  WIDGET: ['/embed', '/embed/(.+)', '/preview'],
  API: ['/api/(.+)'],
} as const;

// Helper functions
export const isPublicRoute = (pathname: string): boolean => {
  return ROUTE_PATTERNS.PUBLIC.some(pattern => new RegExp(`^${pattern}$`).test(pathname));
};

export const isAuthRoute = (pathname: string): boolean => {
  return ROUTE_PATTERNS.AUTH.some(pattern => new RegExp(`^${pattern}$`).test(pathname));
};

export const isProtectedRoute = (pathname: string): boolean => {
  return ROUTE_PATTERNS.PROTECTED.some(pattern => new RegExp(`^${pattern}$`).test(pathname));
};

export const isAdminRoute = (pathname: string): boolean => {
  return ROUTE_PATTERNS.ADMIN.some(pattern => new RegExp(`^${pattern}$`).test(pathname));
};

export const isWidgetRoute = (pathname: string): boolean => {
  return ROUTE_PATTERNS.WIDGET.some(pattern => new RegExp(`^${pattern}$`).test(pathname));
};

export const isApiRoute = (pathname: string): boolean => {
  return ROUTE_PATTERNS.API.some(pattern => new RegExp(`^${pattern}$`).test(pathname));
};
