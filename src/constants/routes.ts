/**
 * 🛣️ Route Helper Functions
 *
 * This file contains utility functions for route classification and protection.
 * It provides centralized route checking logic for middleware and components.
 *
 * 📋 Features:
 * - Authentication route detection
 * - Protected route identification
 * - Admin route checking
 * - Widget route handling
 * - Public route classification
 *
 * 🔧 Usage:
 * ```typescript
 * import { isAuthRoute, isProtectedRoute } from '@/constants/routes';
 *
 * if (isAuthRoute(pathname)) {
 *   // Handle auth route logic
 * }
 * ```
 */

// ============================================
// 🔐 AUTHENTICATION ROUTES
// ============================================

/**
 * Check if the given pathname is an authentication route
 * @param pathname - The pathname to check
 * @returns true if the route requires authentication
 */
export const isAuthRoute = (pathname: string): boolean => {
  return (
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/verify-account') ||
    pathname.startsWith('/verify-otp')
  );
};

// ============================================
// 🛡️ PROTECTED ROUTES
// ============================================

/**
 * Check if the given pathname is a protected route that requires authentication
 * @param pathname - The pathname to check
 * @returns true if the route requires authentication
 */
export const isProtectedRoute = (pathname: string): boolean => {
  return (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/interviews') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/resume-analysis') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/billing') ||
    pathname.startsWith('/notifications')
  );
};

// ============================================
// 👑 ADMIN ROUTES
// ============================================

/**
 * Check if the given pathname is an admin route that requires admin privileges
 * @param pathname - The pathname to check
 * @returns true if the route requires admin access
 */
export const isAdminRoute = (pathname: string): boolean => {
  return (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/super-admin') ||
    pathname.startsWith('/system')
  );
};

// ============================================
// 🎨 WIDGET ROUTES
// ============================================

/**
 * Check if the given pathname is a widget route
 * @param pathname - The pathname to check
 * @returns true if the route is a widget route
 */
export const isWidgetRoute = (pathname: string): boolean => {
  return (
    pathname.startsWith('/widget') ||
    pathname.startsWith('/embed') ||
    pathname.startsWith('/public-widget')
  );
};

// ============================================
// 🌐 PUBLIC ROUTES
// ============================================

/**
 * Check if the given pathname is a public route that doesn't require authentication
 * @param pathname - The pathname to check
 * @returns true if the route is public
 */
export const isPublicRoute = (pathname: string): boolean => {
  return (
    pathname === '/' ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/pricing') ||
    pathname.startsWith('/features') ||
    pathname.startsWith('/help') ||
    pathname.startsWith('/docs') ||
    pathname.startsWith('/blog') ||
    pathname.startsWith('/legal') ||
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/terms') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap')
  );
};

// ============================================
// 🔄 API ROUTES
// ============================================

/**
 * Check if the given pathname is an API route
 * @param pathname - The pathname to check
 * @returns true if the route is an API route
 */
export const isApiRoute = (pathname: string): boolean => {
  return pathname.startsWith('/api/');
};

// ============================================
// 📱 STATIC ROUTES
// ============================================

/**
 * Check if the given pathname is a static route (Next.js internal)
 * @param pathname - The pathname to check
 * @returns true if the route is a static route
 */
export const isStaticRoute = (pathname: string): boolean => {
  return (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/manifest')
  );
};

// ============================================
// 🎯 ROUTE CLASSIFICATION
// ============================================

/**
 * Get the route type for a given pathname
 * @param pathname - The pathname to classify
 * @returns The route type
 */
export const getRouteType = (
  pathname: string
): 'auth' | 'protected' | 'admin' | 'widget' | 'public' | 'api' | 'static' => {
  if (isAuthRoute(pathname)) return 'auth';
  if (isProtectedRoute(pathname)) return 'protected';
  if (isAdminRoute(pathname)) return 'admin';
  if (isWidgetRoute(pathname)) return 'widget';
  if (isApiRoute(pathname)) return 'api';
  if (isStaticRoute(pathname)) return 'static';
  return 'public';
};

// ============================================
// 🛠️ UTILITY FUNCTIONS
// ============================================

/**
 * Check if a route requires authentication
 * @param pathname - The pathname to check
 * @returns true if authentication is required
 */
export const requiresAuth = (pathname: string): boolean => {
  return isProtectedRoute(pathname) || isAdminRoute(pathname);
};

/**
 * Check if a route should redirect authenticated users
 * @param pathname - The pathname to check
 * @returns true if authenticated users should be redirected
 */
export const shouldRedirectAuth = (pathname: string): boolean => {
  return isAuthRoute(pathname);
};

/**
 * Get the appropriate redirect URL for unauthenticated users
 * @param pathname - The current pathname
 * @returns The redirect URL
 */
export const getAuthRedirectUrl = (pathname: string): string => {
  if (isAuthRoute(pathname)) return '/login';
  if (isProtectedRoute(pathname)) return '/login';
  if (isAdminRoute(pathname)) return '/login';
  return '/login';
};

/**
 * Get the appropriate redirect URL for authenticated users
 * @param pathname - The current pathname
 * @returns The redirect URL
 */
export const getAuthenticatedRedirectUrl = (pathname: string): string => {
  if (isAuthRoute(pathname)) return '/dashboard';
  return '/dashboard';
};

// ============================================
// 📦 EXPORTS
// ============================================

export const ROUTE_TYPES = {
  AUTH: 'auth',
  PROTECTED: 'protected',
  ADMIN: 'admin',
  WIDGET: 'widget',
  PUBLIC: 'public',
  API: 'api',
  STATIC: 'static',
} as const;

export type RouteType = (typeof ROUTE_TYPES)[keyof typeof ROUTE_TYPES];
