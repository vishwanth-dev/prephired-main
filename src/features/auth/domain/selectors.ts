/**
 * 🔍 Enhanced Authentication Domain Selectors - Complete for prepAI
 *
 * This file contains pure selector functions that transform the raw AuthState into UI-ready data
 * without exposing the entire store structure to the UI. Enhanced for comprehensive auth coverage.
 *
 * 🎯 Purpose:
 * Selectors act as a clean API layer between the authentication store and UI components.
 * They encapsulate complex state transformations, provide computed values, and ensure
 * type safety while maintaining performance through pure function principles.
 *
 * 🏗️ Architecture Benefits:
 * - ✅ Type-safe selectors aligned with domain entities
 * - ✅ Multi-tenant aware selectors for enterprise applications
 * - ✅ Security and MFA status selectors for compliance
 * - ✅ User profile and display selectors for UI rendering
 * - ✅ Session management and expiry selectors for security
 * - ✅ Form validation and defaults for better UX
 * - ✅ Tenant context and permissions for access control
 * - ✅ Analytics and metrics selectors for business intelligence
 * - ✅ Accessibility and preferences for inclusive design
 *
 * 🔧 Usage Pattern:
 * ```typescript
 * // In components, use selectors like this:
 * const user = useAuthStore(selectAuthUser);
 * const isAuthenticated = useAuthStore(selectIsAuthenticated);
 * const displayName = useAuthStore(selectUserDisplayName);
 * ```
 *
 * 🚀 Performance Notes:
 * - All selectors are pure functions for optimal React rendering
 * - Consider memoization for expensive computed values
 * - Selectors handle null/undefined cases gracefully
 *
 * @author prepAI Team
 * @version 2.0.0
 * @since 2024
 */

import type {
  // Core Types
  UserId,
  TenantId,
  SessionId,
  ChallengeId,
  // Entities
  UserProfile,
  Tenant,
  Session,
  AuthState,
  AuthLoadingState,
  // Form Types
  RegisterForm,
  LoginForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  VerifyEmailForm,
  VerifyMfaForm,
  // Enums
  UserRole,
  SubscriptionPlan,
  MfaMethod,
} from './entities';

// -----------------------------------------------------------------------------
// 🔑 Core Authentication Selectors
// -----------------------------------------------------------------------------

/**
 * 👤 Get the currently authenticated user profile
 *
 * Returns the sanitized user profile (without sensitive fields like passwordHash).
 * This is the primary way to access user information throughout the application.
 *
 * 🎯 Use Cases:
 * - Display user information in navigation bars
 * - Show user details in profile pages
 * - Access user preferences and settings
 * - Check user roles and permissions
 *
 * 🔒 Security Note:
 * The returned profile is sanitized and safe for UI consumption.
 * Sensitive data like password hashes, MFA backup codes, and
 * internal system fields are excluded.
 *
 * 📱 Example Usage:
 * ```typescript
 * const user = useAuthStore(selectAuthUser);
 * if (user) {
 *   console.log(`Welcome, ${user.firstName}!`);
 * }
 * ```
 *
 * @param state - The current authentication state
 * @returns UserProfile object if authenticated, null otherwise
 */
export const selectAuthUser = (state: AuthState): UserProfile | null => state.user;

/**
 * 🔐 Check if user is currently authenticated
 *
 * Essential for route protection, conditional rendering, and authentication state management.
 * This selector is the foundation for all authentication-dependent UI logic.
 *
 * 🎯 Use Cases:
 * - Route guards and protected page access
 * - Conditional rendering of authenticated vs guest content
 * - Navigation menu state management
 * - API call authorization checks
 *
 * 🚦 State Transitions:
 * - false → true: User successfully logs in
 * - true → false: User logs out, session expires, or token invalidates
 *
 * 📱 Example Usage:
 * ```typescript
 * const isAuthenticated = useAuthStore(selectIsAuthenticated);
 *
 * if (isAuthenticated) {
 *   return <Dashboard />;
 * } else {
 *   return <LoginPage />;
 * }
 * ```
 *
 * @param state - The current authentication state
 * @returns true if user is authenticated, false otherwise
 */
export const selectIsAuthenticated = (state: AuthState): boolean => state.isAuthenticated;

/**
 * ⏳ Check if authentication operations are in progress
 *
 * Indicates whether auth operations (login, logout, token refresh) are currently loading.
 * This selector provides granular loading state information for better UX.
 *
 * 🎯 Use Cases:
 * - Show loading spinners during authentication operations
 * - Disable form submissions while processing
 * - Display progress indicators for multi-step flows
 * - Prevent duplicate requests during processing
 *
 * 🔄 Loading States:
 * - 'idle': No authentication operation in progress
 * - 'loading': Authentication operation is currently processing
 * - 'success': Last operation completed successfully
 * - 'error': Last operation failed with an error
 *
 * 📱 Example Usage:
 * ```typescript
 * const loadingState = useAuthStore(selectAuthLoadingState);
 *
 * if (loadingState === 'loading') {
 *   return <LoadingSpinner message="Signing you in..." />;
 * }
 * ```
 *
 * @param state - The current authentication state
 * @returns Current loading state
 */
export const selectAuthLoadingState = (state: AuthState): AuthLoadingState => state.loading;

/**
 * ⏳ Check if authentication state is currently loading (backward compatibility)
 */
export const selectIsAuthLoading = (state: AuthState): boolean => state.loading === 'loading';

/**
 * ❌ Get authentication error for user display
 *
 * Extracts user-friendly error messages from authentication errors.
 * This selector provides human-readable error information for UI feedback.
 *
 * 🎯 Use Cases:
 * - Display error messages in authentication forms
 * - Show toast notifications for failed operations
 * - Provide user guidance for error resolution
 * - Log errors for debugging and monitoring
 *
 * 🚨 Error Handling:
 * - Returns null when no error exists (clean state)
 * - Provides localized, user-friendly error messages
 * - Errors are automatically cleared on successful operations
 * - Supports internationalization for multi-language apps
 *
 * 📱 Example Usage:
 * ```typescript
 * const error = useAuthStore(selectAuthError);
 *
 * if (error) {
 *   return <ErrorMessage message={error} onDismiss={clearError} />;
 * }
 * ```
 *
 * @param state - The current authentication state
 * @returns Human-readable error message or null if no error
 */
export const selectAuthError = (state: AuthState): string | null => state.error;

/**
 * 🔑 Get current authentication session
 *
 * Essential for token management, session monitoring, and maintaining user state.
 *
 * @param state - The current authentication state
 * @returns Session object or null if no session
 */
export const selectAuthSession = (state: AuthState): Session | null => state.session;

/**
 * 📅 Get when authentication state was last updated
 *
 * Useful for cache invalidation and state freshness checks.
 *
 * @param state - The current authentication state
 * @returns ISO timestamp of last update
 */
export const selectAuthLastUpdated = (state: AuthState): string => state.lastUpdated;

// -----------------------------------------------------------------------------
// 🏢 Multi-Tenant Selectors
// -----------------------------------------------------------------------------

/**
 * 🏢 Get current tenant context
 *
 * Provides access to current tenant information for multi-tenant applications.
 *
 * @param state - The current authentication state
 * @returns Current tenant object or null
 */
export const selectCurrentTenant = (state: AuthState): Tenant | null => state.currentTenant;

/**
 * 🏢 Get all available tenants for the user
 *
 * Lists all tenants the user has access to for tenant switching.
 *
 * @param state - The current authentication state
 * @returns Array of available tenant objects
 */
export const selectAvailableTenants = (state: AuthState): readonly Tenant[] =>
  state.availableTenants;

/**
 * 🔄 Check if user can switch between tenants
 *
 * Determines if tenant switching UI should be shown.
 *
 * @param state - The current authentication state
 * @returns true if user has multiple tenants, false otherwise
 */
export const selectCanSwitchTenants = (state: AuthState): boolean =>
  state.availableTenants.length > 1;

/**
 * 🆔 Get current tenant ID
 *
 * Quick access to current tenant identifier.
 *
 * @param state - The current authentication state
 * @returns Current tenant ID or null
 */
export const selectCurrentTenantId = (state: AuthState): TenantId | null =>
  state.currentTenant?.id || null;

/**
 * 📋 Get current tenant's subscription plan
 *
 * Useful for feature gating and plan-specific UI.
 *
 * @param state - The current authentication state
 * @returns Current subscription plan or null
 */
export const selectCurrentTenantPlan = (state: AuthState): SubscriptionPlan | null =>
  state.currentTenant?.plan || null;

/**
 * ⚡ Get current tenant's enabled features
 *
 * Returns list of features available to current tenant.
 *
 * @param state - The current authentication state
 * @returns Array of enabled feature names
 */
export const selectCurrentTenantFeatures = (state: AuthState): readonly string[] =>
  state.currentTenant?.features || [];

/**
 * 🔍 Check if specific feature is enabled for current tenant
 *
 * @param state - The current authentication state
 * @param featureName - Name of the feature to check
 * @returns true if feature is enabled, false otherwise
 */
export const selectIsTenantFeatureEnabled = (state: AuthState, featureName: string): boolean =>
  Boolean(state.currentTenant?.features.includes(featureName));

/**
 * 📊 Get current tenant's usage limits
 *
 * Returns usage limits and quotas for the current tenant.
 *
 * @param state - The current authentication state
 * @returns Object containing usage limits
 */
export const selectCurrentTenantLimits = (state: AuthState): Readonly<Record<string, number>> =>
  state.currentTenant?.limits || {};

/**
 * ⚙️ Get current tenant's settings
 *
 * Returns tenant-specific configuration settings.
 *
 * @param state - The current authentication state
 * @returns Object containing tenant settings
 */
export const selectCurrentTenantSettings = (state: AuthState): Readonly<Record<string, unknown>> =>
  state.currentTenant?.settings || {};

// -----------------------------------------------------------------------------
// 🔐 Security & MFA Selectors
// -----------------------------------------------------------------------------

/**
 * ✉️ Check if email verification is required
 *
 * Determines if user needs to verify their email before proceeding.
 *
 * @param state - The current authentication state
 * @returns true if email verification is required
 */
export const selectEmailVerificationRequired = (state: AuthState): boolean =>
  state.emailVerificationRequired;

/**
 * 🔐 Check if MFA challenge is currently active
 *
 * Indicates if user is in an active MFA verification flow.
 *
 * @param state - The current authentication state
 * @returns true if MFA challenge is active
 */
export const selectIsMfaChallengeActive = (state: AuthState): boolean => state.mfaChallengeActive;

/**
 * 🎯 Get active MFA challenge ID
 *
 * Returns the current MFA challenge identifier if one is active.
 *
 * @param state - The current authentication state
 * @returns Active challenge ID or null
 */
export const selectActiveMfaChallengeId = (state: AuthState): ChallengeId | undefined =>
  state.activeChallengeId;

/**
 * 🔐 Check if user has MFA enabled
 *
 * Determines if the current user has any MFA methods enabled.
 *
 * @param state - The current authentication state
 * @returns true if user has MFA enabled
 */
export const selectUserHasMfaEnabled = (state: AuthState): boolean =>
  Boolean(state.user?.mfaEnabled);

/**
 * 🔢 Get user's preferred MFA method
 *
 * Returns the user's preferred MFA method if available.
 *
 * @param state - The current authentication state
 * @returns Preferred MFA method or null
 */
export const selectUserMfaMethod = (state: AuthState): MfaMethod | undefined =>
  state.user?.mfaMethod;

/**
 * 🔑 Check if user has MFA backup codes available
 *
 * Note: This information is not available in UserProfile for security reasons.
 * Backup codes are excluded from the profile view to prevent exposure of sensitive data.
 * This selector always returns false as backup codes are not accessible through the profile.
 *
 * @param state - The current authentication state (unused but kept for API consistency)
 * @returns false (backup codes data not available in profile)
 */
export const selectUserHasMfaBackupCodes = (_state: AuthState): boolean => {
  // UserProfile excludes mfaBackupCodes for security
  // This would need to be fetched separately from a secure endpoint
  return false;
};

/**
 * ✅ Check if user's email is verified
 *
 * @param state - The current authentication state
 * @returns true if email is verified
 */
export const selectIsEmailVerified = (state: AuthState): boolean =>
  Boolean(state.user?.emailVerified);

/**
 * ✅ Check if user's phone is verified
 *
 * @param state - The current authentication state
 * @returns true if phone is verified
 */
export const selectIsPhoneVerified = (state: AuthState): boolean =>
  Boolean(state.user?.phoneVerified);

// -----------------------------------------------------------------------------
// 👤 User Profile & Display Selectors
// -----------------------------------------------------------------------------

/**
 * 🧑‍💼 Get user's full display name
 *
 * Intelligently constructs display name from first and last names.
 * Provides a fallback chain to ensure users always have a meaningful identifier.
 *
 * 🎯 Use Cases:
 * - Display personalized greetings and welcome messages
 * - Show user identity in navigation bars and headers
 * - Personalize email templates and notifications
 * - Provide consistent user identification across the UI
 *
 * 🔄 Fallback Priority Chain:
 * 1. **Full Name**: firstName + lastName (e.g., "John Doe")
 * 2. **First Name**: firstName only (e.g., "John")
 * 3. **Last Name**: lastName only (e.g., "Doe")
 * 4. **Email Prefix**: username part of email (e.g., "john.doe")
 * 5. **Guest User**: fallback for unauthenticated users
 *
 * 📱 Example Usage:
 * ```typescript
 * const displayName = useAuthStore(selectUserDisplayName);
 *
 * return (
 *   <div>
 *     <h1>Welcome back, {displayName}!</h1>
 *     <p>We're glad to see you again.</p>
 *   </div>
 * );
 * ```
 *
 * @param state - The current authentication state
 * @returns Formatted display name or fallback
 */
export const selectUserDisplayName = (state: AuthState): string => {
  const user = state.user;
  if (!user) return 'Guest User';

  const firstName = user.firstName?.trim() || '';
  const lastName = user.lastName?.trim() || '';

  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;

  return user.email?.split('@')[0] || 'Unknown User';
};

/**
 * 🆔 Get user's initials for avatars
 *
 * Extracts first letters of first and last names for avatar display.
 * Perfect for creating personalized avatar placeholders and user identification.
 *
 * 🎯 Use Cases:
 * - Generate avatar placeholders with user initials
 * - Create user identification badges and chips
 * - Display user identity in compact UI elements
 * - Provide fallback avatars when profile images are unavailable
 *
 * 🔄 Initial Generation Logic:
 * 1. **Full Name**: First letter of firstName + first letter of lastName (e.g., "JD")
 * 2. **Single Name**: First letter of available name (e.g., "J" or "D")
 * 3. **Email Fallback**: First letter of email address (e.g., "J")
 * 4. **Default**: "U" for unknown users, "G" for guests
 *
 * 📱 Example Usage:
 * ```typescript
 * const initials = useAuthStore(selectUserInitials);
 *
 * return (
 *   <Avatar>
 *     {user.avatarUrl ? (
 *       <img src={user.avatarUrl} alt={displayName} />
 *     ) : (
 *       <div className="avatar-placeholder">{initials}</div>
 *     )}
 *   </Avatar>
 * );
 * ```
 *
 * @param state - The current authentication state
 * @returns User initials (1-2 characters)
 */
export const selectUserInitials = (state: AuthState): string => {
  const user = state.user;
  if (!user) return 'G';

  const firstName = user.firstName?.trim() || '';
  const lastName = user.lastName?.trim() || '';

  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  if (firstName) return firstName[0]?.toUpperCase() || 'U';
  if (lastName) return lastName[0]?.toUpperCase() || 'U';
  if (user.email) return user.email[0]?.toUpperCase() || 'U';

  return 'U';
};

/**
 * 📧 Get user's email with optional privacy masking
 *
 * Retrieves the user's email address with intelligent privacy masking for sensitive displays.
 * The masking algorithm preserves readability while protecting user privacy.
 *
 * 🎯 Use Cases:
 * - Display email in user profile sections
 * - Show masked email in public interfaces
 * - Provide privacy protection in screenshots
 * - Maintain email functionality while protecting privacy
 *
 * 🔒 Privacy Masking Algorithm:
 * - **Local Part**: Shows first and last character, masks middle (e.g., "j***n")
 * - **Domain**: Shows first and last character, masks middle (e.g., "g***l.com")
 * - **Minimum Length**: Preserves emails shorter than masking threshold
 * - **Fallback**: Returns original email if masking fails
 *
 * 📱 Example Usage:
 * ```typescript
 * const email = useAuthStore(selectUserEmail);
 * const maskedEmail = useAuthStore(state => selectUserEmail(state, true));
 *
 * return (
 *   <div>
 *     <p>Full email: {email}</p>
 *     <p>Masked email: {maskedEmail}</p>
 *   </div>
 * );
 * ```
 *
 * @param state - The current authentication state
 * @param mask - Whether to apply privacy masking (default: false)
 * @returns Email address (masked or unmasked)
 */
export const selectUserEmail = (state: AuthState, mask: boolean = false): string => {
  const user = state.user;
  if (!user?.email) return '';

  if (!mask) return user.email;

  const [localPart, domain] = user.email.split('@');
  if (!domain || !localPart) return user.email;

  const maskedLocal =
    localPart.length > 2
      ? `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`
      : localPart;

  const maskedDomain =
    domain.length > 4
      ? `${domain[0]}${'*'.repeat(domain.length - 2)}${domain[domain.length - 1]}`
      : domain;

  return `${maskedLocal}@${maskedDomain}`;
};

/**
 * 📱 Get user's phone number with optional privacy masking
 *
 * Retrieves the user's phone number with intelligent privacy masking for sensitive displays.
 * Preserves country code visibility while protecting the main number.
 *
 * 🎯 Use Cases:
 * - Display phone in user profile sections
 * - Show masked phone in public interfaces
 * - Provide privacy protection in screenshots
 * - Maintain phone functionality while protecting privacy
 *
 * 🔒 Privacy Masking Algorithm:
 * - **Country Code**: Always visible (e.g., "+1", "+44")
 * - **Main Number**: Shows last 4 digits, masks the rest (e.g., "***-1234")
 * - **Minimum Length**: Preserves numbers shorter than masking threshold
 * - **Format Preservation**: Maintains original number structure
 *
 * 📱 Example Usage:
 * ```typescript
 * const phone = useAuthStore(selectUserPhone);
 * const maskedPhone = useAuthStore(state => selectUserPhone(state, true));
 *
 * return (
 *   <div>
 *     <p>Full phone: {phone}</p>
 *     <p>Masked phone: {maskedPhone}</p>
 *   </div>
 * );
 * ```
 *
 * @param state - The current authentication state
 * @param mask - Whether to apply privacy masking (default: false)
 * @returns Phone number (masked or unmasked)
 */
export const selectUserPhone = (state: AuthState, mask: boolean = false): string => {
  const user = state.user;
  if (!user?.phone) return '';

  if (!mask) return user.phone;

  const countryCode = user.phone.slice(0, 3);
  const numberPart = user.phone.slice(3);
  const maskedNumber =
    numberPart.length > 4
      ? `${'*'.repeat(numberPart.length - 4)}${numberPart.slice(-4)}`
      : numberPart;

  return `${countryCode}${maskedNumber}`;
};

/**
 * 🆔 Get current user ID
 *
 * @param state - The current authentication state
 * @returns User ID or null
 */
export const selectUserId = (state: AuthState): UserId | null => state.user?.id || null;

/**
 * 👔 Get user's job title
 *
 * @param state - The current authentication state
 * @returns Job title or null
 */
export const selectUserJobTitle = (state: AuthState): string | undefined => state.user?.jobTitle;

/**
 * 🏢 Get user's department
 *
 * @param state - The current authentication state
 * @returns Department or null
 */
export const selectUserDepartment = (state: AuthState): string | undefined =>
  state.user?.department;

/**
 * 📍 Get user's location
 *
 * @param state - The current authentication state
 * @returns Location or null
 */
export const selectUserLocation = (state: AuthState): string | undefined => state.user?.location;

/**
 * 📝 Get user's bio
 *
 * @param state - The current authentication state
 * @returns Bio/description or null
 */
export const selectUserBio = (state: AuthState): string | undefined => state.user?.bio;

/**
 * 🌐 Get user's website URL
 *
 * @param state - The current authentication state
 * @returns Website URL or null
 */
export const selectUserWebsite = (state: AuthState): string | undefined => state.user?.website;

/**
 * 📅 Get user's account age in human-readable format
 *
 * @param state - The current authentication state
 * @returns Human-readable account age
 */
export const selectUserAccountAge = (state: AuthState): string => {
  const user = state.user;
  if (!user?.createdAt) return 'Unknown';

  try {
    const created = new Date(user.createdAt);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months`;

    const years = Math.floor(diffInDays / 365);
    return `${years} year${years > 1 ? 's' : ''}`;
  } catch {
    return 'Unknown';
  }
};

/**
 * 📸 Get user's avatar URL
 *
 * @param state - The current authentication state
 * @returns Avatar URL or null
 */
export const selectUserAvatarUrl = (state: AuthState): string | undefined => state.user?.avatarUrl;

// -----------------------------------------------------------------------------
// 🔐 User Roles & Permissions Selectors
// -----------------------------------------------------------------------------

/**
 * 👮 Get user's roles
 *
 * @param state - The current authentication state
 * @returns Array of user roles
 */
export const selectUserRoles = (state: AuthState): readonly UserRole[] => state.user?.roles || [];

/**
 * 🔐 Get user's permissions
 *
 * @param state - The current authentication state
 * @returns Array of permission strings
 */
export const selectUserPermissions = (state: AuthState): readonly string[] =>
  state.user?.permissions || [];

/**
 * ✅ Check if user has specific role
 *
 * @param state - The current authentication state
 * @param role - Role to check for
 * @returns true if user has the role
 */
export const selectUserHasRole = (state: AuthState, role: UserRole): boolean =>
  Boolean(state.user?.roles.includes(role));

/**
 * ✅ Check if user has specific permission
 *
 * @param state - The current authentication state
 * @param permission - Permission to check for
 * @returns true if user has the permission
 */
export const selectUserHasPermission = (state: AuthState, permission: string): boolean =>
  Boolean(state.user?.permissions.includes(permission));

/**
 * ✅ Check if user has any of the specified roles
 *
 * @param state - The current authentication state
 * @param roles - Array of roles to check
 * @returns true if user has at least one role
 */
export const selectUserHasAnyRole = (state: AuthState, roles: UserRole[]): boolean =>
  Boolean(roles.some(role => state.user?.roles.includes(role)));

/**
 * ✅ Check if user has all specified permissions
 *
 * @param state - The current authentication state
 * @param permissions - Array of permissions to check
 * @returns true if user has all permissions
 */
export const selectUserHasAllPermissions = (state: AuthState, permissions: string[]): boolean =>
  Boolean(permissions.every(permission => state.user?.permissions.includes(permission)));

/**
 * 👑 Check if user is admin
 *
 * @param state - The current authentication state
 * @returns true if user has admin role
 */
export const selectIsUserAdmin = (state: AuthState): boolean =>
  selectUserHasAnyRole(state, ['admin', 'super_admin']);

/**
 * 🔧 Check if user is super admin
 *
 * @param state - The current authentication state
 * @returns true if user has super admin role
 */
export const selectIsUserSuperAdmin = (state: AuthState): boolean =>
  selectUserHasRole(state, 'super_admin');

// -----------------------------------------------------------------------------
// 📱 Session Management Selectors
// -----------------------------------------------------------------------------

/**
 * 🆔 Get current session ID
 *
 * @param state - The current authentication state
 * @returns Session ID or null
 */
export const selectSessionId = (state: AuthState): SessionId | null => state.session?.id || null;

/**
 * ⏰ Get comprehensive session expiry information
 *
 * @param state - The current authentication state
 * @returns Object with detailed session expiry information
 */
/**
 * ⏰ Get comprehensive session expiry information
 *
 * Provides detailed information about session expiration status, including
 * time remaining, formatted display text, and security warnings.
 *
 * 🎯 Use Cases:
 * - Display session countdown timers
 * - Show security warnings for expiring sessions
 * - Implement auto-logout functionality
 * - Provide user feedback about session status
 *
 * 🔄 Return Object Structure:
 * - **isExpired**: Boolean indicating if session has expired
 * - **timeRemaining**: Milliseconds remaining (null if no expiry)
 * - **isExpiringSoon**: Boolean for sessions expiring within 30 minutes
 * - **formattedTimeRemaining**: Human-readable time remaining
 * - **expiresAt**: Original expiry timestamp
 *
 * ⏱️ Time Formatting Logic:
 * - **Minutes**: "5 minutes", "1 minute"
 * - **Hours**: "2 hours", "1 hour"
 * - **Days**: "3 days", "1 day"
 * - **Fallback**: "Unknown" for invalid dates
 *
 * 📱 Example Usage:
 * ```typescript
 * const expiryInfo = useAuthStore(selectSessionExpiryInfo);
 *
 * if (expiryInfo.isExpired) {
 *   return <SessionExpiredMessage />;
 * } else if (expiryInfo.isExpiringSoon) {
 *   return <SessionExpiringWarning time={expiryInfo.formattedTimeRemaining} />;
 * }
 * ```
 *
 * @param state - The current authentication state
 * @returns Session expiry information object
 */
export const selectSessionExpiryInfo = (state: AuthState) => {
  const session = state.session;
  if (!session?.expiresAt) {
    return {
      isExpired: false,
      timeRemaining: null,
      isExpiringSoon: false,
      formattedTimeRemaining: 'Unknown',
      expiresAt: null,
    };
  }

  try {
    const expiry = new Date(session.expiresAt);
    const now = new Date();
    const timeRemaining = expiry.getTime() - now.getTime();
    const diffInMinutes = Math.floor(timeRemaining / (1000 * 60));

    const isExpired = diffInMinutes <= 0;
    const isExpiringSoon = diffInMinutes <= 30 && diffInMinutes > 0;

    let formattedTimeRemaining = 'Unknown';
    if (!isExpired && timeRemaining > 0) {
      if (diffInMinutes < 60) {
        formattedTimeRemaining = `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''}`;
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        formattedTimeRemaining = `${hours} hour${hours !== 1 ? 's' : ''}`;
      } else {
        const days = Math.floor(diffInMinutes / 1440);
        formattedTimeRemaining = `${days} day${days !== 1 ? 's' : ''}`;
      }
    }

    return {
      isExpired,
      timeRemaining,
      isExpiringSoon,
      formattedTimeRemaining,
      expiresAt: session.expiresAt,
    };
  } catch {
    return {
      isExpired: false,
      timeRemaining: null,
      isExpiringSoon: false,
      formattedTimeRemaining: 'Unknown',
      expiresAt: session.expiresAt,
    };
  }
};

/**
 * ⏱️ Calculate current session duration
 *
 * @param state - The current authentication state
 * @returns Session duration in milliseconds or null
 */
export const selectSessionDuration = (state: AuthState): number | null => {
  const session = state.session;
  if (!session?.createdAt) return null;

  try {
    const created = new Date(session.createdAt);
    const now = new Date();
    return now.getTime() - created.getTime();
  } catch {
    return null;
  }
};

/**
 * 📱 Get session device information
 *
 * @param state - The current authentication state
 * @returns Device info object or null
 */
export const selectSessionDevice = (state: AuthState) => state.session?.device || null;

/**
 * 🌍 Get session location information
 *
 * @param state - The current authentication state
 * @returns Location info object or null
 */
export const selectSessionLocation = (state: AuthState) => state.session?.location || null;

/**
 * 🔐 Check if session needs security attention
 *
 * Combines multiple security factors to determine if session needs attention.
 * This selector provides a comprehensive security assessment for proactive
 * security management and user guidance.
 *
 * 🎯 Use Cases:
 * - Display security warning banners
 * - Show security improvement suggestions
 * - Trigger security verification flows
 * - Implement progressive security enforcement
 *
 * 🚨 Security Factors Evaluated:
 * - **Session Expiry**: Session expiring soon or already expired
 * - **Email Verification**: Unverified email address
 * - **Phone Verification**: Missing phone number verification
 * - **MFA Status**: Multi-factor authentication not enabled
 *
 * 🔒 Security Recommendations:
 * - Prompt users to verify email/phone when missing
 * - Encourage MFA setup for enhanced security
 * - Warn about expiring sessions
 * - Guide users through security improvements
 *
 * 📱 Example Usage:
 * ```typescript
 * const needsAttention = useAuthStore(selectSessionNeedsSecurityAttention);
 *
 * if (needsAttention) {
 *   return <SecurityAttentionBanner />;
 * }
 * ```
 *
 * @param state - The current authentication state
 * @returns true if session needs security review
 */
export const selectSessionNeedsSecurityAttention = (state: AuthState): boolean => {
  const expiryInfo = selectSessionExpiryInfo(state);
  const user = state.user;

  // Check various security factors
  const isExpiringSoon = Boolean(expiryInfo.isExpiringSoon);
  const isExpired = Boolean(expiryInfo.isExpired);
  const hasUnverifiedEmail = Boolean(user && !user.emailVerified);
  const lacksPhoneVerification = Boolean(user && !user.phoneVerified);
  const lacksMfa = Boolean(user && !user.mfaEnabled);

  return isExpiringSoon || isExpired || hasUnverifiedEmail || lacksPhoneVerification || lacksMfa;
};

// -----------------------------------------------------------------------------
// 📋 Form Defaults & Validation
// -----------------------------------------------------------------------------

/**
 * 📝 Get initial values for login form
 *
 * @param state - The current authentication state
 * @returns Object with login form defaults
 */
export const selectLoginInitialValues = (state: AuthState): Partial<LoginForm> => ({
  email: state.user?.email || '',
  password: '',
  rememberMe: false,
  ...(state.currentTenant?.slug && { tenantSlug: state.currentTenant.slug }),
});

/**
 * 📝 Get initial values for registration form
 *
 * @returns Object with registration form defaults
 */
export const selectRegisterInitialValues = (): Partial<RegisterForm> => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  acceptPrivacy: false,
  marketingEmails: false,
});

/**
 * 📝 Get initial values for forgot password form
 *
 * @param state - The current authentication state
 * @returns Object with forgot password form defaults
 */
export const selectForgotPasswordInitialValues = (
  state: AuthState
): Partial<ForgotPasswordForm> => ({
  email: state.user?.email || '',
  ...(state.currentTenant?.slug && { tenantSlug: state.currentTenant.slug }),
});

/**
 * 📝 Get initial values for password reset form
 *
 * @returns Object with password reset form defaults
 */
export const selectResetPasswordInitialValues = (): Partial<ResetPasswordForm> => ({
  token: '',
  password: '',
  confirmPassword: '',
});

/**
 * 📝 Get initial values for email verification form
 *
 * @param state - The current authentication state
 * @returns Object with email verification form defaults
 */
export const selectVerifyEmailInitialValues = (state: AuthState): Partial<VerifyEmailForm> => ({
  token: '',
  ...(state.user?.email && { email: state.user.email }),
});

/**
 * 📝 Get initial values for MFA verification form
 *
 * @param state - The current authentication state
 * @returns Object with MFA verification form defaults
 */
export const selectVerifyMfaInitialValues = (state: AuthState): Partial<VerifyMfaForm> => ({
  challengeId: state.activeChallengeId || '',
  code: '',
  isBackupCode: false,
});

// -----------------------------------------------------------------------------
// ✅ Enhanced Form Validation Selectors
// -----------------------------------------------------------------------------

/**
 * ✅ Validate login form for submission
 *
 * @param form - Login form data
 * @returns true if form is valid
 */
export const selectIsLoginFormValid = (form: Partial<LoginForm>): boolean =>
  Boolean(form.email?.trim() && form.password?.trim());

/**
 * ✅ Validate registration form for submission
 *
 * @param form - Registration form data
 * @returns true if form is valid
 */
export const selectIsRegistrationFormValid = (form: Partial<RegisterForm>): boolean =>
  Boolean(
    form.firstName?.trim() &&
      form.lastName?.trim() &&
      form.email?.trim() &&
      form.password?.trim() &&
      form.confirmPassword?.trim() &&
      form.password === form.confirmPassword &&
      form.acceptTerms &&
      form.acceptPrivacy
  );

/**
 * ✅ Validate password reset form for submission
 *
 * @param form - Password reset form data
 * @returns true if form is valid
 */
export const selectIsPasswordResetFormValid = (form: Partial<ResetPasswordForm>): boolean =>
  Boolean(
    form.token?.trim() &&
      form.password?.trim() &&
      form.confirmPassword?.trim() &&
      form.password === form.confirmPassword
  );

/**
 * ✅ Validate MFA verification form for submission
 *
 * @param form - MFA verification form data
 * @returns true if form is valid
 */
export const selectIsMfaFormValid = (form: Partial<VerifyMfaForm>): boolean =>
  Boolean(form.challengeId?.trim() && form.code?.trim());

// -----------------------------------------------------------------------------
// 🎨 UI Preferences & Accessibility
// -----------------------------------------------------------------------------

/**
 * 🎨 Get user's theme preference
 *
 * @param state - The current authentication state
 * @returns Theme preference
 */
export const selectUserTheme = (state: AuthState): 'light' | 'dark' | 'system' => {
  // In production, this would read from user.metadata or tenant settings
  return (state.user?.metadata?.theme as 'light' | 'dark' | 'system') || 'system';
};

/**
 * ♿ Check if user prefers reduced motion
 *
 * @param state - The current authentication state
 * @returns true if user prefers reduced motion
 */
export const selectUserPrefersReducedMotion = (state: AuthState): boolean => {
  // In production, this would read from user.metadata or accessibility settings
  return Boolean(state.user?.metadata?.reducedMotion);
};

/**
 * 🌍 Get user's language preference
 *
 * @param state - The current authentication state
 * @returns Language code
 */
export const selectUserLanguage = (state: AuthState): string => {
  // In production, this would read from user.metadata or tenant settings
  return (state.user?.metadata?.language as string) || state.currentTenant?.language || 'en';
};

/**
 * 💰 Get user's currency preference
 *
 * @param state - The current authentication state
 * @returns Currency code
 */
export const selectUserCurrency = (state: AuthState): string => {
  return state.currentTenant?.currency || 'USD';
};

/**
 * 🕐 Get user's timezone preference
 *
 * @param state - The current authentication state
 * @returns Timezone string
 */
export const selectUserTimezone = (state: AuthState): string => {
  return state.currentTenant?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// -----------------------------------------------------------------------------
// 📊 Analytics & Metrics Selectors
// -----------------------------------------------------------------------------

/**
 * 📊 Get user activity metrics
 *
 * @param state - The current authentication state
 * @returns Object with user activity data
 */
export const selectUserActivityMetrics = (state: AuthState) => {
  const user = state.user;

  return {
    lastLoginAt: user?.lastLoginAt,
    lastActivityAt: user?.lastActivityAt,
    sessionDuration: selectSessionDuration(state),
    accountAge: selectUserAccountAge(state),
    isFirstTimeUser: selectUserAccountAge(state) === 'Today',
  };
};

/**
 * 🔐 Get security status summary
 *
 * @param state - The current authentication state
 * @returns Object with security status information
 */
export const selectSecurityStatusSummary = (state: AuthState) => {
  const user = state.user;
  const expiryInfo = selectSessionExpiryInfo(state);

  return {
    emailVerified: user?.emailVerified || false,
    phoneVerified: user?.phoneVerified || false,
    mfaEnabled: user?.mfaEnabled || false,
    sessionValid: !expiryInfo.isExpired,
    sessionExpiringSoon: expiryInfo.isExpiringSoon,
    needsSecurityAttention: selectSessionNeedsSecurityAttention(state),
    securityScore: calculateSecurityScore(state),
  };
};

/**
 * 🔒 Calculate user security score (0-100)
 *
 * @param state - The current authentication state
 * @returns Security score from 0-100
 */
const calculateSecurityScore = (state: AuthState): number => {
  const user = state.user;
  if (!user) return 0;

  let score = 0;

  // Base score for being authenticated
  score += 20;

  // Email verification
  if (user.emailVerified) score += 20;

  // Phone verification
  if (user.phoneVerified) score += 15;

  // MFA enabled
  if (user.mfaEnabled) score += 25;

  // Recent password change (if available)
  if (user.passwordChangedAt) {
    const daysSinceChange = Math.floor(
      (Date.now() - new Date(user.passwordChangedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceChange < 90) score += 10;
  }

  // Session security
  const expiryInfo = selectSessionExpiryInfo(state);
  if (!expiryInfo.isExpired && !expiryInfo.isExpiringSoon) score += 10;

  return Math.min(100, score);
};

/**
 * 🏢 Get tenant-specific capabilities
 *
 * @param state - The current authentication state
 * @returns Object with tenant capabilities
 */
export const selectTenantCapabilities = (state: AuthState) => {
  const tenant = state.currentTenant;

  if (!tenant) return null;

  return {
    canInviteUsers: selectUserHasPermission(state, 'users:invite'),
    canManageSettings: selectUserHasPermission(state, 'tenant:manage'),
    canViewAnalytics: selectUserHasPermission(state, 'analytics:view'),
    canManageBilling: selectUserHasPermission(state, 'billing:manage'),
    maxUsers: tenant.limits.maxUsers || Infinity,
    plan: tenant.plan,
    features: tenant.features,
  };
};

// -----------------------------------------------------------------------------
// 🔍 Advanced Computed Selectors
// -----------------------------------------------------------------------------

/**
 * 📋 Get complete user profile summary for display
 *
 * @param state - The current authentication state
 * @returns Comprehensive user profile object
 */
export const selectUserProfileSummary = (state: AuthState) => {
  if (!state.user) return null;

  return {
    // Basic Info
    id: state.user.id,
    displayName: selectUserDisplayName(state),
    initials: selectUserInitials(state),
    email: state.user.email,
    phone: state.user.phone,
    avatarUrl: state.user.avatarUrl,

    // Professional Info
    jobTitle: state.user.jobTitle,
    department: state.user.department,
    location: state.user.location,
    bio: state.user.bio,
    website: state.user.website,

    // Account Status
    emailVerified: state.user.emailVerified,
    phoneVerified: state.user.phoneVerified,
    mfaEnabled: state.user.mfaEnabled,
    accountAge: selectUserAccountAge(state),
    lastLoginAt: state.user.lastLoginAt,

    // Security
    roles: state.user.roles,
    permissions: state.user.permissions,
    securityScore: calculateSecurityScore(state),

    // Social Links
    linkedinUrl: state.user.linkedinUrl,
    twitterUrl: state.user.twitterUrl,
    githubUrl: state.user.githubUrl,
  };
};

/**
 * 🏢 Get complete tenant context summary
 *
 * @param state - The current authentication state
 * @returns Comprehensive tenant context object
 */
export const selectTenantContextSummary = (state: AuthState) => {
  if (!state.currentTenant) return null;

  return {
    // Basic Info
    id: state.currentTenant.id,
    name: state.currentTenant.name,
    slug: state.currentTenant.slug,
    description: state.currentTenant.description,
    logoUrl: state.currentTenant.logoUrl,
    website: state.currentTenant.website,

    // Business Info
    industry: state.currentTenant.industry,
    companySize: state.currentTenant.companySize,
    plan: state.currentTenant.plan,
    status: state.currentTenant.status,

    // Configuration
    features: state.currentTenant.features,
    limits: state.currentTenant.limits,
    settings: state.currentTenant.settings,

    // Localization
    country: state.currentTenant.country,
    timezone: state.currentTenant.timezone,
    language: state.currentTenant.language,
    currency: state.currentTenant.currency,

    // User Context
    canSwitchTenants: selectCanSwitchTenants(state),
    availableTenantsCount: state.availableTenants.length,
    userCapabilities: selectTenantCapabilities(state),
  };
};

// -----------------------------------------------------------------------------
// 🚨 Error Boundary Helpers
// -----------------------------------------------------------------------------

/**
 * 🛡️ Safe selector wrapper for error boundary protection
 *
 * Wraps any selector function to ensure it never throws errors, providing
 * graceful degradation and error logging for debugging purposes.
 *
 * 🎯 Use Cases:
 * - Protect components from selector failures
 * - Provide fallback values during errors
 * - Log errors for debugging without breaking UI
 * - Ensure application stability during state issues
 *
 * 🔒 Error Handling:
 * - Catches any errors thrown by the wrapped selector
 * - Logs warnings to console for debugging
 * - Returns fallback value to prevent crashes
 * - Maintains type safety with generic parameters
 *
 * 📱 Example Usage:
 * ```typescript
 * const safeUserSelector = createSafeSelector(selectAuthUser, null);
 * const user = useAuthStore(safeUserSelector);
 *
 * // Even if selectAuthUser throws, this won't crash
 * if (user) {
 *   return <UserProfile user={user} />;
 * }
 * ```
 *
 * @param selector - Selector function to wrap with error protection
 * @param fallback - Fallback value returned if selector fails
 * @returns Wrapped selector that never throws errors
 */
export const createSafeSelector =
  <T, R>(selector: (state: T) => R, fallback: R) =>
  (state: T): R => {
    try {
      return selector(state);
    } catch (error) {
      console.warn('Selector failed:', error);
      return fallback;
    }
  };

// -----------------------------------------------------------------------------
// 📦 Exported Utilities
// -----------------------------------------------------------------------------

/**
 * 🏭 Create memoized selectors for performance optimization
 *
 * Implements a simple memoization strategy to prevent unnecessary
 * recalculations when the state hasn't changed. This is useful for
 * expensive computed selectors that are called frequently.
 *
 * 🎯 Use Cases:
 * - Optimize expensive computed selectors
 * - Reduce unnecessary re-renders in components
 * - Improve performance for complex calculations
 * - Cache results for derived state
 *
 * ⚡ Performance Benefits:
 * - **Reference Equality**: Compares state references for fast checks
 * - **Result Caching**: Stores last result to avoid recalculation
 * - **Memory Efficient**: Minimal memory overhead for caching
 * - **Type Safe**: Maintains full TypeScript type safety
 *
 * ⚠️ Important Notes:
 * - Only caches the last result (not a full cache)
 * - Best for selectors called with the same state reference
 * - Consider reselect library for more advanced memoization
 * - Works best with immutable state updates
 *
 * 📱 Example Usage:
 * ```typescript
 * const expensiveSelector = createMemoizedSelector((state) => {
 *   // Expensive computation here
 *   return heavyCalculation(state.data);
 * });
 *
 * const result = useAuthStore(expensiveSelector);
 * ```
 *
 * @param selector - Selector function to memoize
 * @returns Memoized version of the selector
 */
export const createMemoizedSelector = <T, R>(selector: (state: T) => R) => {
  let lastState: T;
  let lastResult: R;

  return (state: T): R => {
    if (state !== lastState) {
      lastState = state;
      lastResult = selector(state);
    }
    return lastResult;
  };
};
