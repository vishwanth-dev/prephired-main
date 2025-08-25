import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAuthRoute, isProtectedRoute, isAdminRoute, isWidgetRoute } from './src/constants/routes';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  )

  // Handle widget routes with different security policy
  if (isWidgetRoute(pathname)) {
    // Allow embedding for widget routes
    response.headers.delete('X-Frame-Options')
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    
    // Add CORS headers for widget
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    return response
  }

  // Handle CORS for API routes
  if (pathname.startsWith('/api/')) {
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS')
    response.headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Tenant-ID'
    )

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers })
    }
  }

  // Basic authentication check (to be enhanced with actual auth logic)
  const token = request.cookies.get('auth-token')?.value
  const isAuthenticated = !!token

  // Redirect logic based on route type
  if (isAuthRoute(pathname) && isAuthenticated) {
    // Redirect authenticated users away from auth pages
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isProtectedRoute(pathname) && !isAuthenticated) {
    // Redirect unauthenticated users to login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAdminRoute(pathname)) {
    // Additional admin role check would go here
    // For now, just check if authenticated
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Handle tenant routing (subdomain-based)
  const host = request.headers.get('host')
  if (host) {
    const subdomain = host.split('.')[0]
    
    // Skip tenant routing for localhost and main domain
    if (subdomain && subdomain !== 'localhost' && subdomain !== '127' && subdomain !== 'www') {
      // Add tenant ID to headers for API routes
      response.headers.set('X-Tenant-Slug', subdomain)
      
      // For non-API routes, you might want to rewrite the URL to include tenant context
      if (!pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
        // This could be used to rewrite URLs to include tenant context
        // For now, we'll just pass the tenant in headers
      }
    }
  }

  // Add tenant ID from query parameter (for development/testing)
  const tenantId = request.nextUrl.searchParams.get('tenant')
  if (tenantId) {
    response.headers.set('X-Tenant-ID', tenantId)
  }

  // Add request ID for tracing
  const requestId = crypto.randomUUID()
  response.headers.set('X-Request-ID', requestId)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
