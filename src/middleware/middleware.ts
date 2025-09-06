// middleware.ts
// Main middleware for the PrepAI application
// Handles authentication, security headers, CORS, and multi-tenancy

import { NextRequest, NextResponse } from 'next/server';
import {
  requiresAuth,
  shouldRedirectAuth,
  isApiRoute,
  isWidgetRoute,
  isStaticRoute,
  getAuthRedirectUrl,
  getAuthenticatedRedirectUrl,
} from '@/constants/routes';
import { STORAGE_KEYS } from '@/constants/config';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Skip static routes and API routes (handled separately)
  if (isStaticRoute(pathname)) {
    return NextResponse.next();
  }

  // ============================================
  // 🔐 AUTHENTICATION LOGIC
  // ============================================

  // Get token from cookies using correct storage key
  const token = request.cookies.get(STORAGE_KEYS.AUTH_TOKEN)?.value;
  const isAuthenticated = !!token;

  // Check if route requires authentication
  const needsAuth = requiresAuth(pathname);
  const isAuthPage = shouldRedirectAuth(pathname);

  // Redirect to login if accessing protected route without token
  if (needsAuth && !isAuthenticated) {
    const loginUrl = new URL(getAuthRedirectUrl(pathname), request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth pages with token
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL(getAuthenticatedRedirectUrl(pathname), request.url));
  }

  // ============================================
  // 🏢 MULTI-TENANT SUPPORT
  // ============================================

  // Extract tenant from subdomain or query params
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  const tenantFromQuery = searchParams.get('tenant');

  // Add tenant headers for API routes
  const headers: Record<string, string> = {};
  if (tenantFromQuery) {
    headers['X-Tenant-ID'] = tenantFromQuery;
  } else if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
    headers['X-Tenant-Slug'] = subdomain;
  }

  // ============================================
  // 🌐 CORS HANDLING
  // ============================================

  // Handle CORS for API and widget routes
  if (isApiRoute(pathname) || isWidgetRoute(pathname)) {
    const response = NextResponse.next();

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Tenant-ID, X-Tenant-Slug'
    );

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers });
    }

    return response;
  }

  // ============================================
  // 🛡️ SECURITY HEADERS
  // ============================================

  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Add tenant headers
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add request tracing headers
  response.headers.set('X-Request-ID', crypto.randomUUID());
  response.headers.set('X-Request-Timestamp', Date.now().toString());

  return response;
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
