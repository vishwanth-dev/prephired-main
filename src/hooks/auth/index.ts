/**
 * 🔐 Authentication Hooks Index
 *
 * Centralized exports for all authentication-related hooks following SOLID principles:
 * - Single Responsibility: Each hook has a focused authentication purpose
 * - Open/Closed: Extensible through options and parameters
 * - Liskov Substitution: Consistent authentication interfaces
 * - Interface Segregation: Clean, focused interfaces
 * - Dependency Inversion: Works with authentication abstractions
 */

// ============================================
// 🔐 AUTHENTICATION HOOKS
// ============================================

// Main authentication hook
export { default as useAuth } from '../use-auth';

// Session management
export { default as useSession } from './use-session';

// Route protection and access control
export {
  default as useAuthGuard,
  useRequireAuth,
  useRequireRole,
  useRequireAnyRole,
} from './use-auth-guard';

// ============================================
// 🎯 USAGE EXAMPLES
// ============================================

/*
// Basic authentication
const { user, isAuthenticated, login, logout } = useAuth();

// Session management with timeout
const { isActive, timeRemaining, extendSession } = useSession({
  timeout: 30 * 60 * 1000, // 30 minutes
  onTimeout: () => logout(),
  onWarning: () => showWarningModal()
});

// Route protection
const { isAuthorized, isLoading } = useAuthGuard({
  requireAuth: true,
  requireRoles: ['admin'],
  redirectTo: '/login'
});

// Specialized guards
const authGuard = useRequireAuth('/login');
const adminGuard = useRequireRole('admin', '/unauthorized');
const roleGuard = useRequireAnyRole(['admin', 'moderator'], '/unauthorized');
*/
