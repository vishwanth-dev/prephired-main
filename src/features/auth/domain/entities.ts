/**
 * 🔐 Authentication Domain Entities - Enhanced for prepAI
 *
 * This file contains the core domain models and types for the authentication system.
 * Enhanced for multi-tenant SaaS architecture with interview platform features.
 * All entities are designed to be:
 * - ✅ Immutable (readonly properties)
 * - ✅ Type-safe with strict validation
 * - ✅ Framework-agnostic (pure domain logic)
 * - ✅ Multi-tenant aware
 * - ✅ Security-focused with audit trails
 *
 * 🏗️ ARCHITECTURE OVERVIEW:
 * This file follows Domain-Driven Design (DDD) principles where each entity
 * represents a core business concept. The authentication domain handles:
 * - User identity and profile management
 * - Multi-tenant organization structure
 * - Session management and security
 * - Multi-factor authentication flows
 * - Audit logging and compliance
 *
 * 🔒 SECURITY FEATURES:
 * - Immutable entities prevent accidental mutations
 * - Comprehensive audit trails for compliance
 * - MFA support with multiple methods
 * - Session tracking and device fingerprinting
 * - Rate limiting and account lockout protection
 *
 * 🌍 MULTI-TENANT SUPPORT:
 * - Organizations can have multiple users
 * - Users can belong to multiple organizations
 * - Role-based access control per tenant
 * - Tenant-specific settings and limits
 * - Subdomain routing support
 *
 * @author prepAI Team
 * @version 2.0.0
 * @since 2024
 */

// -----------------------------------------------------------------------------
// 🌍 Basic Type Aliases & Primitives
// -----------------------------------------------------------------------------

/**
 * 📧 Email Address Type
 *
 * Represents a valid email address string used throughout the system.
 * This type ensures consistency and provides semantic meaning for email fields.
 *
 * USAGE:
 * - User registration and login
 * - Password reset requests
 * - Email verification flows
 * - User profile management
 * - Audit logging and tracking
 *
 * VALIDATION:
 * - Must be a valid email format
 * - Stored in lowercase for consistency
 * - Used as primary identifier for users
 */
export type Email = string;

/**
 * 📱 E.164 Normalized Phone Number
 *
 * International phone number format following E.164 standard.
 * Ensures consistent phone number storage and validation across the system.
 *
 * FORMAT: +[country code][national number]
 * EXAMPLES:
 * - "+919876543210" (India)
 * - "+15551234567" (US/Canada)
 * - "+442071234567" (UK)
 * - "+61412345678" (Australia)
 *
 * BENEFITS:
 * - Global compatibility
 * - Consistent formatting
 * - Easy international calling
 * - SMS delivery reliability
 */
export type PhoneNumber = string;

/**
 * 🆔 Entity Identifier Type
 *
 * Unique identifier for all domain entities in the system.
 * Generated as UUID v4 or similar cryptographically secure random string.
 *
 * CHARACTERISTICS:
 * - Globally unique across all tenants
 * - Cryptographically secure
 * - URL-safe for API endpoints
 * - Database primary key compatible
 *
 * USAGE:
 * - User identification
 * - Session tracking
 * - Audit log references
 * - API resource identification
 */
export type EntityId = string;

/**
 * ⏰ ISO 8601 Timestamp Type
 *
 * Standardized timestamp format for all date/time operations.
 * Ensures consistency across different timezones and systems.
 *
 * FORMAT: "YYYY-MM-DDTHH:mm:ss.sssZ"
 * EXAMPLES:
 * - "2024-01-15T10:30:00Z" (UTC)
 * - "2024-01-15T10:30:00.123Z" (with milliseconds)
 * - "2024-01-15T10:30:00+05:30" (with timezone offset)
 *
 * BENEFITS:
 * - ISO standard compliance
 * - Timezone awareness
 * - Sortable string format
 * - Database compatibility
 */
export type Timestamp = string;

/**
 * 🔗 URL String Type
 *
 * Represents valid URL strings for external resources and assets.
 * Used for avatars, websites, logos, and other external links.
 *
 * VALIDATION:
 * - Must be valid URL format
 * - Supports HTTP/HTTPS protocols
 * - Can include query parameters
 * - Supports relative and absolute paths
 *
 * USAGE:
 * - User profile avatars
 * - Organization logos
 * - External website links
 * - Social media profiles
 */
export type Url = string;

/**
 * 📋 Metadata Object Type
 *
 * Flexible JSON-serializable object for storing additional entity information.
 * Allows for extensibility without changing core entity structure.
 *
 * STRUCTURE:
 * - Key-value pairs
 * - Nested objects supported
 * - Arrays allowed
 * - Primitive values (string, number, boolean)
 *
 * USAGE:
 * - Custom user preferences
 * - Feature flags per tenant
 * - Audit trail extensions
 * - Integration-specific data
 */
export type Metadata = Record<string, unknown>;

// -----------------------------------------------------------------------------
// 🏢 Multi-Tenant Types
// -----------------------------------------------------------------------------

/**
 * 🏢 Tenant Identifier Type
 *
 * Unique identifier for tenant organizations in the multi-tenant system.
 * Each tenant represents a separate customer organization with isolated data.
 *
 * CHARACTERISTICS:
 * - Globally unique across the entire platform
 * - Generated as UUID v4 for security
 * - Used in all tenant-scoped operations
 * - Part of URL routing for subdomains
 *
 * USAGE:
 * - Database partitioning
 * - API endpoint scoping
 * - User membership tracking
 * - Billing and subscription management
 */
export type TenantId = string;

/**
 * 📊 Tenant Status Enumeration
 *
 * Represents the current operational status of a tenant organization.
 * Controls access levels, billing, and feature availability.
 *
 * STATUSES:
 * - 'active': Fully operational with all features
 * - 'inactive': Temporarily disabled (maintenance, billing issues)
 * - 'suspended': Admin-disabled due to policy violations
 * - 'trial': Limited access during trial period
 *
 * BUSINESS LOGIC:
 * - Only 'active' tenants can access production features
 * - 'trial' tenants have usage limitations
 * - 'suspended' tenants lose all access
 * - Status changes trigger audit events
 */
export type TenantStatus = 'active' | 'inactive' | 'suspended' | 'trial';

/**
 * 💳 Subscription Plan Types
 *
 * Defines the available subscription tiers for prepAI platform.
 * Each plan includes different feature sets, limits, and pricing.
 *
 * PLANS:
 * - 'starter': Basic features for small teams
 * - 'professional': Advanced features for growing organizations
 * - 'enterprise': Full features with custom limits
 * - 'custom': Tailored solution for large enterprises
 *
 * FEATURE DIFFERENCES:
 * - User limits per plan
 * - Interview session quotas
 * - Advanced analytics availability
 * - Priority support levels
 * - Custom branding options
 */
export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise' | 'custom';

/**
 * 🏢 Tenant/Organization Entity
 *
 * Represents a customer organization in the prepAI multi-tenant system.
 * Each tenant has their own interview settings, team members, and billing.
 *
 * 🏗️ ARCHITECTURE:
 * This is a core domain entity that represents the top-level organization
 * in the multi-tenant hierarchy. All other entities (users, interviews,
 * candidates) are scoped to a specific tenant.
 *
 * 🔐 SECURITY MODEL:
 * - Data isolation between tenants
 * - Role-based access control per tenant
 * - Tenant-specific feature flags
 * - Usage quotas and rate limiting
 *
 * 💼 BUSINESS CONTEXT:
 * - Billing and subscription management
 * - Feature access control
 * - Compliance and localization
 * - Branding and customization
 */
export interface Tenant {
  /**
   * 🆔 Unique tenant identifier
   * Generated as UUID v4, used for all tenant-scoped operations
   */
  readonly id: TenantId;

  /**
   * 🏷️ Organization display name
   * Human-readable name shown in UI and communications
   * Example: "Acme Corporation", "TechStart Inc."
   */
  readonly name: string;

  /**
   * 🔗 URL-friendly slug for subdomain/routing
   * Used for tenant-specific URLs like "acme.prepai.com"
   * Must be unique across all tenants
   */
  readonly slug: string;

  /**
   * 📝 Optional organization description
   * Brief description of the organization's purpose
   * Used in admin panels and partner portals
   */
  readonly description?: string;

  /**
   * 🌐 Organization website URL
   * External website for the organization
   * Used for verification and partner integrations
   */
  readonly website?: Url;

  /**
   * 🖼️ Organization logo URL
   * Logo displayed in the application header and branding
   * Supports custom tenant branding
   */
  readonly logoUrl?: Url;

  /**
   * 🏭 Industry category
   * Business sector classification for analytics and targeting
   * Examples: "Technology", "Healthcare", "Finance"
   */
  readonly industry: string;

  /**
   * 👥 Company size category
   * Employee count range for feature recommendations
   * Examples: "1-10", "11-50", "51-200", "200+"
   */
  readonly companySize: string;

  /**
   * 📊 Current tenant status
   * Controls access levels and feature availability
   * See TenantStatus enum for possible values
   */
  readonly status: TenantStatus;

  /**
   * 💳 Current subscription plan
   * Determines feature access and usage limits
   * See SubscriptionPlan enum for available plans
   */
  readonly plan: SubscriptionPlan;

  /**
   * ✨ Enabled features for this tenant
   * Array of feature flags that control functionality
   * Examples: ["advanced_analytics", "custom_branding", "api_access"]
   */
  readonly features: readonly string[];

  /**
   * 📏 Usage limits and quotas
   * Plan-specific limits for various resources
   * Examples: { "users": 50, "interviews_per_month": 1000, "storage_gb": 100 }
   */
  readonly limits: Readonly<Record<string, number>>;

  /**
   * ⚙️ Tenant-specific settings
   * Configuration options specific to this organization
   * Examples: interview settings, notification preferences, integrations
   */
  readonly settings: Readonly<Record<string, unknown>>;

  /**
   * 🌍 Country code for compliance/localization
   * ISO 3166-1 alpha-2 country code
   * Used for GDPR compliance, tax calculations, and localization
   */
  readonly country: string;

  /**
   * ⏰ Primary timezone
   * IANA timezone identifier for the organization
   * Examples: "America/New_York", "Europe/London", "Asia/Tokyo"
   */
  readonly timezone: string;

  /**
   * 🌐 Primary language/locale
   * ISO 639-1 language code for localization
   * Examples: "en", "es", "fr", "de"
   */
  readonly language: string;

  /**
   * 💰 Primary currency for billing
   * ISO 4217 currency code for pricing and invoicing
   * Examples: "USD", "EUR", "GBP", "INR"
   */
  readonly currency: string;

  /**
   * 🆕 Tenant creation timestamp
   * When the tenant was first created in the system
   * Used for billing cycles and trial periods
   */
  readonly createdAt: Timestamp;

  /**
   * 🔄 Last update timestamp
   * When tenant information was last modified
   * Used for audit trails and change tracking
   */
  readonly updatedAt: Timestamp;

  /**
   * 👤 Who created this tenant
   * Reference to the user who initiated tenant creation
   * Usually a sales representative or admin user
   */
  readonly createdBy?: EntityId;
}

// -----------------------------------------------------------------------------
// 👤 User Entity & Core Types
// -----------------------------------------------------------------------------

/**
 * 👤 User Identifier Type
 *
 * Unique identifier for users across the entire prepAI platform.
 * Generated as UUID v4 and used for all user-related operations.
 *
 * CHARACTERISTICS:
 * - Globally unique across all tenants
 * - Cryptographically secure
 * - URL-safe for API endpoints
 * - Database primary key compatible
 *
 * USAGE:
 * - User authentication and sessions
 * - Profile management
 * - Permission checks
 * - Audit logging
 * - Cross-tenant user references
 */
export type UserId = string;

/**
 * 🎭 User Role Types for RBAC
 *
 * Role-based access control system defining user permissions.
 * Each role has specific capabilities and access levels.
 *
 * ROLES & CAPABILITIES:
 * - 'super_admin': Platform-wide administration (rare)
 * - 'admin': Tenant-level full access and user management
 * - 'manager': Team management and interview oversight
 * - 'interviewer': Conduct interviews and view results
 * - 'viewer': Read-only access to assigned resources
 * - 'candidate': Interview participant with limited access
 *
 * SECURITY NOTES:
 * - Roles are tenant-scoped
 * - Users can have different roles in different tenants
 * - Role changes trigger audit events
 * - Super admin requires special approval
 */
export type UserRole = 'super_admin' | 'admin' | 'manager' | 'interviewer' | 'viewer' | 'candidate';

/**
 * 📊 User Status Enumeration
 *
 * Represents the current operational status of a user account.
 * Controls login access, feature availability, and system behavior.
 *
 * STATUSES & MEANING:
 * - 'active': Full access to all assigned features
 * - 'inactive': Temporarily disabled (maintenance, leave)
 * - 'pending': Awaiting email verification or admin approval
 * - 'suspended': Admin-disabled due to policy violations
 *
 * BUSINESS LOGIC:
 * - Only 'active' users can log in
 * - 'pending' users must complete verification
 * - 'suspended' users lose all access
 * - Status changes require admin approval
 */
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

/**
 * 🔐 MFA Method Types
 *
 * Multi-factor authentication methods supported by the system.
 * Each method provides different security levels and user experience.
 *
 * METHODS & CHARACTERISTICS:
 * - 'totp': Time-based one-time passwords (Google Authenticator)
 * - 'sms': SMS-based verification codes
 * - 'email': Email-based verification codes
 * - 'backup_codes': Pre-generated emergency access codes
 *
 * SECURITY CONSIDERATIONS:
 * - TOTP is most secure (offline, time-based)
 * - SMS vulnerable to SIM swapping attacks
 * - Email provides good balance of security/UX
 * - Backup codes for account recovery
 */
export type MfaMethod = 'totp' | 'sms' | 'email' | 'backup_codes';

/**
 * 🔗 OAuth Provider Types
 *
 * External authentication providers supported by the system.
 * Allows users to sign in with existing accounts from major platforms.
 *
 * PROVIDERS & FEATURES:
 * - 'google': Google Workspace integration, SSO support
 * - 'github': Developer-friendly, repository access
 * - 'microsoft': Azure AD integration, enterprise SSO
 * - 'linkedin': Professional network integration
 *
 * INTEGRATION BENEFITS:
 * - Reduced password fatigue
 * - Enterprise SSO compatibility
 * - Professional profile enrichment
 * - Reduced account creation friction
 */
export type OAuthProvider = 'google' | 'github' | 'microsoft' | 'linkedin';

/**
 * 🧑‍💼 Enhanced User Entity
 *
 * Represents a registered user in the prepAI system.
 * Enhanced with security fields, multi-tenant support, and profile data.
 *
 * 🏗️ ARCHITECTURE:
 * This is the core user entity that represents an individual person
 * in the system. Users can belong to multiple tenants with different
 * roles and permissions in each context.
 *
 * 🔐 SECURITY FEATURES:
 * - Immutable properties prevent tampering
 * - Comprehensive audit trail tracking
 * - Multi-factor authentication support
 * - Account lockout protection
 * - Password change tracking
 *
 * 💼 BUSINESS CONTEXT:
 * - Professional profile management
 * - Multi-tenant membership
 * - Role-based access control
 * - Activity monitoring
 * - Compliance and audit support
 */
export interface User {
  /**
   * 🆔 Unique user identifier
   * Globally unique UUID v4 used across all systems
   */
  readonly id: UserId;

  /**
   * 👤 User's first/given name
   * Personal name used for display and communication
   * Example: "John", "Maria", "Ahmed"
   */
  readonly firstName: string;

  /**
   * 👤 User's last/family name
   * Family name used for display and communication
   * Example: "Smith", "Garcia", "Khan"
   */
  readonly lastName: string;

  /**
   * 📧 User's email address (primary identifier)
   * Primary contact method and login credential
   * Must be unique across the entire platform
   */
  readonly email: Email;

  /**
   * 📱 User's phone number (E.164 format)
   * Secondary contact method for SMS and calls
   * Optional but recommended for MFA and notifications
   */
  readonly phone?: PhoneNumber;

  /**
   * 🔒 Hashed password (bcrypt, argon2, etc.)
   * Never stored in plain text, used for authentication
   * Hash includes salt and cost factors for security
   */
  readonly passwordHash: string;

  /**
   * ✅ Email verification status
   * Boolean flag indicating if email has been verified
   * Required for full account access
   */
  readonly emailVerified: boolean;

  /**
   * ⏰ Email verification timestamp
   * When the email was successfully verified
   * Used for audit trails and compliance
   */
  readonly emailVerifiedAt?: Timestamp;

  /**
   * ✅ Phone verification status
   * Boolean flag indicating if phone has been verified
   * Required for SMS-based MFA
   */
  readonly phoneVerified: boolean;

  /**
   * ⏰ Phone verification timestamp
   * When the phone number was successfully verified
   * Used for audit trails and compliance
   */
  readonly phoneVerifiedAt?: Timestamp;

  /**
   * 🖼️ User's profile avatar URL
   * Profile picture displayed in the application
   * Supports various image formats and sizes
   */
  readonly avatarUrl?: Url;

  /**
   * 📝 Professional bio/description
   * Brief professional summary or introduction
   * Used in team directories and interview contexts
   */
  readonly bio?: string;

  /**
   * 💼 Job title
   * Current professional position or role
   * Example: "Senior Software Engineer", "Product Manager"
   */
  readonly jobTitle?: string;

  /**
   * 🏢 Department or team
   * Organizational unit within the company
   * Example: "Engineering", "Product", "Sales"
   */
  readonly department?: string;

  /**
   * 📍 Work location
   * Geographic location or office location
   * Example: "San Francisco, CA", "Remote", "London, UK"
   */
  readonly location?: string;

  /**
   * 🌐 Professional website URL
   * Personal or professional website
   * Used for portfolio and credibility verification
   */
  readonly website?: Url;

  /**
   * 💼 LinkedIn profile URL
   * Professional networking profile
   * Used for background verification and networking
   */
  readonly linkedinUrl?: Url;

  /**
   * 🐦 Twitter profile URL
   * Social media profile for professional updates
   * Optional social presence indicator
   */
  readonly twitterUrl?: Url;

  /**
   * 💻 GitHub profile URL
   * Code repository and developer profile
   * Important for technical roles and code review
   */
  readonly githubUrl?: Url;

  /**
   * 📊 Current user status
   * Account operational status controlling access
   * See UserStatus enum for possible values
   */
  readonly status: UserStatus;

  /**
   * 🎭 User roles across all tenants
   * Array of roles the user has in different organizations
   * Each role grants specific permissions and access
   */
  readonly roles: readonly UserRole[];

  /**
   * 🔑 Specific permissions
   * Granular permissions beyond role-based access
   * Examples: ["can_export_data", "can_manage_billing", "can_view_analytics"]
   */
  readonly permissions: readonly string[];

  /**
   * 🔐 MFA enabled status
   * Boolean flag indicating if multi-factor auth is active
   * Enhances account security beyond password
   */
  readonly mfaEnabled: boolean;

  /**
   * 🔐 Preferred MFA method
   * User's chosen multi-factor authentication method
   * See MfaMethod enum for available options
   */
  readonly mfaMethod?: MfaMethod;

  /**
   * 🔑 MFA backup codes (hashed)
   * Emergency access codes for account recovery
   * Stored as hashed values for security
   */
  readonly mfaBackupCodes?: readonly string[];

  /**
   * 🔓 Last successful login timestamp
   * When the user last successfully authenticated
   * Used for security monitoring and session management
   */
  readonly lastLoginAt?: Timestamp;

  /**
   * 📱 Last activity timestamp
   * When the user last performed any action
   * Used for session timeout and activity tracking
   */
  readonly lastActivityAt?: Timestamp;

  /**
   * ❌ Failed login attempt counter
   * Number of consecutive failed authentication attempts
   * Triggers account lockout after threshold
   */
  readonly failedLoginAttempts: number;

  /**
   * 🔒 Account locked until timestamp
   * Temporary lockout period after failed attempts
   * Prevents brute force attacks
   */
  readonly lockedUntil?: Timestamp;

  /**
   * 🔑 Password last changed timestamp
   * When the password was last modified
   * Used for password expiration policies
   */
  readonly passwordChangedAt?: Timestamp;

  /**
   * 🆕 Account creation timestamp
   * When the user account was first created
   * Used for account age and trial period calculations
   */
  readonly createdAt: Timestamp;

  /**
   * 🔄 Last profile update timestamp
   * When user information was last modified
   * Used for audit trails and change tracking
   */
  readonly updatedAt: Timestamp;

  /**
   * 📋 Additional metadata for customization
   * Flexible storage for custom fields and preferences
   * Examples: theme preferences, notification settings, custom fields
   */
  readonly metadata: Metadata;
}

/**
 * 👤 User Profile View (Sanitized for Client-Side Use)
 *
 * Safe user representation for client-side consumption.
 * Excludes sensitive security fields and adds computed properties.
 *
 * 🔒 SECURITY CONSIDERATIONS:
 * This interface removes sensitive fields that should never
 * be exposed to the client, such as:
 * - passwordHash: Never expose password information
 * - mfaBackupCodes: Security-sensitive backup codes
 * - failedLoginAttempts: Internal security metric
 * - lockedUntil: Internal security state
 *
 * ✨ COMPUTED PROPERTIES:
 * - displayName: Formatted full name for UI display
 * - initials: Abbreviated name for avatars and headers
 *
 * 🎯 USAGE:
 * - User interface components
 * - Profile displays
 * - Team member listings
 * - Public user information
 * - API responses to client applications
 */
export interface UserProfile
  extends Omit<User, 'passwordHash' | 'mfaBackupCodes' | 'failedLoginAttempts' | 'lockedUntil'> {
  /**
   * 🏷️ Computed display name
   * Full name formatted for display in user interfaces
   * Example: "John Smith", "Maria Garcia"
   */
  readonly displayName: string;

  /**
   * 🔤 Computed user initials
   * Abbreviated name for avatars and compact displays
   * Example: "JS", "MG", "AK"
   */
  readonly initials: string;
}

// -----------------------------------------------------------------------------
// 🔑 Session Management
// -----------------------------------------------------------------------------

/**
 * 🔑 Session Identifier Type
 *
 * Unique identifier for active user sessions in the system.
 * Generated as UUID v4 and used for session tracking and management.
 *
 * CHARACTERISTICS:
 * - Globally unique across all tenants
 * - Cryptographically secure
 * - URL-safe for API endpoints
 * - Expires after inactivity or logout
 *
 * USAGE:
 * - Session authentication
 * - Activity tracking
 * - Security monitoring
 * - Audit logging
 * - Device management
 */
export type SessionId = string;

/**
 * 📱 Device Information Interface
 *
 * Comprehensive device details for session tracking and security.
 * Used to identify and monitor user devices across sessions.
 *
 * 🔐 SECURITY FEATURES:
 * - Device fingerprinting for anomaly detection
 * - Session validation across devices
 * - Suspicious activity monitoring
 * - Multi-device session management
 *
 * 📊 ANALYTICS:
 * - User behavior patterns
 * - Device preference analysis
 * - Security incident correlation
 * - Support and troubleshooting
 */
export interface DeviceInfo {
  /**
   * 📱 Device type classification
   * Categorizes the device for UI optimization and analytics
   * Examples: 'desktop', 'mobile', 'tablet'
   */
  readonly type: 'desktop' | 'mobile' | 'tablet';

  /**
   * 🏷️ Device name or model
   * Human-readable device identifier
   * Examples: "iPhone 15 Pro", "MacBook Pro", "Samsung Galaxy S24"
   */
  readonly name: string;

  /**
   * 💻 Operating system
   * OS name and version for compatibility and security
   * Examples: "iOS 17.2", "macOS 14.1", "Android 14", "Windows 11"
   */
  readonly os: string;

  /**
   * 🌐 Browser name and version
   * Web browser details for feature compatibility
   * Examples: "Chrome 120.0", "Safari 17.2", "Firefox 121.0"
   */
  readonly browser: string;

  /**
   * 🔍 Device fingerprint for security
   * Unique device signature for security monitoring
   * Generated from hardware and software characteristics
   */
  readonly fingerprint?: string;
}

/**
 * 📱 Session Entity
 *
 * Represents an active user session in the system.
 * Tracks device information, location, and activity for security.
 *
 * 🏗️ ARCHITECTURE:
 * Sessions are temporary entities that represent active user
 * authentication states. They expire automatically and can be
 * terminated by users or administrators.
 *
 * 🔐 SECURITY FEATURES:
 * - Automatic expiration for security
 * - Device fingerprinting and validation
 * - Geographic location tracking
 * - Activity monitoring and timeout
 * - Multi-tenant context switching
 *
 * 📊 MONITORING:
 * - User activity patterns
 * - Security incident detection
 * - Session analytics
 * - Compliance reporting
 */
export interface Session {
  /**
   * 🔑 Unique session identifier
   * Globally unique UUID v4 for session tracking
   */
  readonly id: SessionId;

  /**
   * 👤 User who owns this session
   * Reference to the authenticated user
   */
  readonly userId: UserId;

  /**
   * 🏢 Current tenant context (can be switched)
   * Active organization context for this session
   * Users can switch between tenants they belong to
   */
  readonly tenantId?: TenantId;

  /**
   * ⏰ Session expiration timestamp
   * When the session will automatically expire
   * Extends with activity, resets on logout
   */
  readonly expiresAt: Timestamp;

  /**
   * 📱 Device information
   * Comprehensive device details for security monitoring
   * Includes type, OS, browser, and fingerprint
   */
  readonly device: DeviceInfo;

  /**
   * 🌐 IP address when session created
   * Network origin for security and compliance
   * Used for geographic location and security monitoring
   */
  readonly ipAddress: string;

  /**
   * 🌐 User agent string
   * Browser and device identification string
   * Used for compatibility and security analysis
   */
  readonly userAgent: string;

  /**
   * 📍 Geographic location (if available)
   * Approximate location derived from IP address
   * Used for compliance, security, and analytics
   */
  readonly location?: {
    /**
     * 🌍 Country code
     * ISO 3166-1 alpha-2 country identifier
     * Example: "US", "GB", "IN"
     */
    readonly country?: string;

    /**
     * 🏙️ City name
     * Geographic city for location tracking
     * Example: "San Francisco", "London", "Mumbai"
     */
    readonly city?: string;

    /**
     * 🗺️ Region/state
     * Administrative region within country
     * Example: "California", "England", "Maharashtra"
     */
    readonly region?: string;
  };

  /**
   * 🆕 Session creation timestamp
   * When the session was first established
   * Used for session age and security monitoring
   */
  readonly createdAt: Timestamp;

  /**
   * 📱 Last activity timestamp
   * When the user last performed any action
   * Used for session timeout and activity tracking
   */
  readonly lastActivity: Timestamp;

  /**
   * 📋 Session metadata
   * Additional session-specific information
   * Examples: login method, referral source, campaign tracking
   */
  readonly metadata: Metadata;
}

// -----------------------------------------------------------------------------
// 🔐 Multi-Factor Authentication
// -----------------------------------------------------------------------------

/**
 * 🔐 MFA Challenge Identifier Type
 *
 * Unique identifier for active multi-factor authentication challenges.
 * Generated as UUID v4 and used for challenge tracking and validation.
 *
 * CHARACTERISTICS:
 * - Globally unique across all tenants
 * - Cryptographically secure
 * - Short-lived (expires quickly)
 * - Single-use for security
 *
 * USAGE:
 * - MFA verification flows
 * - Challenge tracking
 * - Security monitoring
 * - Audit logging
 */
export type ChallengeId = string;

/**
 * 🔒 MFA Challenge Entity
 *
 * Represents an active MFA challenge requiring user verification.
 * Temporary entity that expires after completion or timeout.
 *
 * 🏗️ ARCHITECTURE:
 * MFA challenges are temporary security entities that enforce
 * additional verification before granting access. They expire
 * automatically and can only be used once.
 *
 * 🔐 SECURITY FEATURES:
 * - Automatic expiration for security
 * - Attempt counting and rate limiting
 * - Method-specific validation
 * - Audit trail tracking
 * - Challenge metadata for context
 *
 * 📱 SUPPORTED METHODS:
 * - TOTP: Time-based one-time passwords
 * - SMS: SMS verification codes
 * - Email: Email verification codes
 * - Backup codes: Emergency access codes
 */
export interface MfaChallenge {
  /**
   * 🔐 Unique challenge identifier
   * Globally unique UUID v4 for challenge tracking
   */
  readonly id: ChallengeId;

  /**
   * 👤 User being challenged
   * Reference to the user requiring MFA verification
   */
  readonly userId: UserId;

  /**
   * 🔐 MFA method being used
   * Authentication method for this challenge
   * See MfaMethod enum for available options
   */
  readonly method: MfaMethod;

  /**
   * ⏰ Challenge expiration timestamp
   * When the challenge will automatically expire
   * Prevents stale challenges from being used
   */
  readonly expiresAt: Timestamp;

  /**
   * 🔢 Number of verification attempts
   * Current count of failed verification attempts
   * Used for rate limiting and security monitoring
   */
  readonly attempts: number;

  /**
   * 🚫 Maximum allowed attempts
   * Limit on verification attempts before challenge expires
   * Prevents brute force attacks on MFA codes
   */
  readonly maxAttempts: number;

  /**
   * 🆕 Challenge creation timestamp
   * When the MFA challenge was initiated
   * Used for challenge age and security monitoring
   */
  readonly createdAt: Timestamp;

  /**
   * 📋 Challenge metadata (e.g., masked phone number)
   * Additional context for the challenge
   * Examples: masked phone number, email address, device info
   */
  readonly metadata: Metadata;
}

// -----------------------------------------------------------------------------
// 🛡️ Security & Audit
// -----------------------------------------------------------------------------

/**
 * 🚨 Security Event Types for Audit Logging
 *
 * Comprehensive categorization of security-related events.
 * Used for audit trails, compliance reporting, and security monitoring.
 *
 * 🔐 AUTHENTICATION EVENTS:
 * - login_attempt: Initial login attempt (successful or failed)
 * - login_success: Successful authentication
 * - login_failure: Failed authentication attempt
 * - logout: User-initiated session termination
 *
 * 🔑 PASSWORD EVENTS:
 * - password_change: Password modification
 * - password_reset_requested: Password reset initiation
 * - password_reset_completed: Password reset completion
 *
 * ✅ VERIFICATION EVENTS:
 * - email_verified: Email address verification
 * - phone_verified: Phone number verification
 *
 * 🔐 MFA EVENTS:
 * - mfa_enabled: Multi-factor authentication activation
 * - mfa_disabled: Multi-factor authentication deactivation
 * - mfa_challenge_created: MFA challenge initiation
 * - mfa_challenge_verified: MFA challenge completion
 * - mfa_challenge_failed: MFA challenge failure
 *
 * 🚫 ACCOUNT SECURITY:
 * - account_locked: Account lockout due to failed attempts
 * - account_unlocked: Account reactivation
 *
 * 📱 SESSION EVENTS:
 * - session_created: New session establishment
 * - session_refreshed: Session extension
 * - session_terminated: Session termination
 *
 * 🏢 TENANT EVENTS:
 * - tenant_switched: User switched between organizations
 *
 * ⚠️ SECURITY ALERTS:
 * - suspicious_activity: Unusual behavior detection
 * - security_violation: Policy violation or attack attempt
 */
export type SecurityEventType =
  | 'login_attempt'
  | 'login_success'
  | 'login_failure'
  | 'logout'
  | 'password_change'
  | 'password_reset_requested'
  | 'password_reset_completed'
  | 'email_verified'
  | 'phone_verified'
  | 'mfa_enabled'
  | 'mfa_disabled'
  | 'mfa_challenge_created'
  | 'mfa_challenge_verified'
  | 'mfa_challenge_failed'
  | 'account_locked'
  | 'account_unlocked'
  | 'session_created'
  | 'session_refreshed'
  | 'session_terminated'
  | 'tenant_switched'
  | 'suspicious_activity'
  | 'security_violation';

/**
 * 🚨 Security Event Severity Levels
 *
 * Risk classification system for security events.
 * Determines alert priority, response time, and escalation procedures.
 *
 * LEVELS & RESPONSE:
 * - 'low': Informational events, no immediate action required
 * - 'medium': Notable events, review within 24 hours
 * - 'high': Security concerns, investigate within 4 hours
 * - 'critical': Immediate threats, respond within 1 hour
 *
 * BUSINESS IMPACT:
 * - 'low': Normal operations, audit trail
 * - 'medium': Minor security implications
 * - 'high': Potential security risks
 * - 'critical': Active security threats
 */
export type SecurityEventSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * 🛡️ Security Event Entity
 *
 * Represents a security-related event for audit and monitoring.
 * Used for compliance, forensics, and security analytics.
 *
 * 🏗️ ARCHITECTURE:
 * Security events are immutable audit records that capture
 * all security-related activities in the system. They provide
 * a complete audit trail for compliance and investigation.
 *
 * 🔐 SECURITY FEATURES:
 * - Immutable event records
 * - Comprehensive context capture
 * - Geographic and device tracking
 * - Severity-based prioritization
 * - Metadata for extensibility
 *
 * 📊 COMPLIANCE & MONITORING:
 * - GDPR compliance reporting
 * - SOC 2 audit trails
 * - Security incident investigation
 * - User activity monitoring
 * - Threat detection and response
 */
export interface SecurityEvent {
  /**
   * 🆔 Unique event identifier
   * Globally unique UUID v4 for event tracking
   */
  readonly id: EntityId;

  /**
   * 🚨 Type of security event
   * Categorized event type for filtering and analysis
   * See SecurityEventType enum for available categories
   */
  readonly type: SecurityEventType;

  /**
   * 👤 User involved (if applicable)
   * Reference to the user who triggered the event
   * Optional for anonymous or system events
   */
  readonly userId?: UserId;

  /**
   * 📧 Email involved (for failed logins)
   * Email address associated with the event
   * Used for failed login tracking and analysis
   */
  readonly email?: Email;

  /**
   * 🏢 Tenant context
   * Organization context where the event occurred
   * Used for tenant-scoped security monitoring
   */
  readonly tenantId?: TenantId;

  /**
   * 🔑 Session involved (if applicable)
   * Active session associated with the event
   * Used for session-based security analysis
   */
  readonly sessionId?: SessionId;

  /**
   * 🚨 Event severity level
   * Risk classification for response prioritization
   * See SecurityEventSeverity enum for levels
   */
  readonly severity: SecurityEventSeverity;

  /**
   * 📝 Human-readable event description
   * Clear description of what occurred
   * Used for security team review and reporting
   */
  readonly description: string;

  /**
   * 💭 Reason or cause of the event
   * Additional context explaining why the event occurred
   * Examples: "Multiple failed attempts", "Suspicious IP detected"
   */
  readonly reason?: string;

  /**
   * 🌐 IP address of the actor
   * Network origin for security analysis
   * Used for geographic tracking and threat intelligence
   */
  readonly ipAddress?: string;

  /**
   * 🌐 User agent of the actor
   * Browser and device information
   * Used for device fingerprinting and compatibility analysis
   */
  readonly userAgent?: string;

  /**
   * 📍 Geographic location
   * Approximate location derived from IP address
   * Used for compliance and security monitoring
   */
  readonly location?: {
    /**
     * 🌍 Country code
     * ISO 3166-1 alpha-2 country identifier
     * Example: "US", "GB", "IN"
     */
    readonly country?: string;

    /**
     * 🏙️ City name
     * Geographic city for location tracking
     * Example: "San Francisco", "London", "Mumbai"
     */
    readonly city?: string;
  };

  /**
   * 📋 Additional event metadata
   * Flexible storage for event-specific information
   * Examples: device details, browser extensions, network info
   */
  readonly metadata: Metadata;

  /**
   * ⏰ Event timestamp
   * When the security event occurred
   * Used for timeline analysis and compliance reporting
   */
  readonly timestamp: Timestamp;
}

// -----------------------------------------------------------------------------
// 🏪 Global Auth State
// -----------------------------------------------------------------------------

/**
 * 🔄 Authentication Loading States
 *
 * Represents the current state of authentication operations.
 * Used by UI components to show appropriate loading states and feedback.
 *
 * STATES & MEANING:
 * - 'idle': No authentication operation in progress
 * - 'loading': Authentication operation in progress
 * - 'success': Authentication operation completed successfully
 * - 'error': Authentication operation failed
 *
 * UI IMPLICATIONS:
 * - 'idle': Show login form or user dashboard
 * - 'loading': Show loading spinner or progress indicator
 * - 'success': Show success message or redirect
 * - 'error': Show error message with retry options
 */
export type AuthLoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * 🌐 Global Authentication State
 *
 * Represents the current authentication state of the application.
 * Used by UI components to determine user access and display state.
 *
 * 🏗️ ARCHITECTURE:
 * This is the central state object that all authentication-related
 * components consume. It provides a single source of truth for
 * user authentication status and context.
 *
 * 🔐 SECURITY FEATURES:
 * - Real-time authentication status
 * - Multi-tenant context management
 * - MFA challenge state tracking
 * - Session validation and monitoring
 * - Error handling and user feedback
 *
 * 🎯 USAGE:
 * - Navigation guards and route protection
 * - User interface state management
 * - Permission-based UI rendering
 * - Multi-tenant switching
 * - Authentication flow management
 */
export interface AuthState {
  /**
   * 👤 Current authenticated user
   * User profile information for the authenticated user
   * null when no user is logged in
   */
  readonly user: UserProfile | null;

  /**
   * 🔑 Current active session
   * Active session details including device and location
   * null when no active session exists
   */
  readonly session: Session | null;

  /**
   * 🏢 Current tenant context
   * Active organization context for the current session
   * null when no tenant is selected
   */
  readonly currentTenant: Tenant | null;

  /**
   * 🏢 Available tenants for user
   * List of organizations the user can access
   * Empty array when user has no tenant access
   */
  readonly availableTenants: readonly Tenant[];

  /**
   * 🔄 Authentication loading state
   * Current state of authentication operations
   * See AuthLoadingState enum for possible values
   */
  readonly loading: AuthLoadingState;

  /**
   * ❌ Current error message
   * Error description when authentication fails
   * null when no errors exist
   */
  readonly error: string | null;

  /**
   * ✅ Whether user is authenticated
   * Boolean flag indicating authentication status
   * Used for route protection and UI state
   */
  readonly isAuthenticated: boolean;

  /**
   * 📧 Whether email verification is required
   * Boolean flag for email verification flow
   * Prevents full access until email is verified
   */
  readonly emailVerificationRequired: boolean;

  /**
   * 🔐 Whether MFA challenge is active
   * Boolean flag indicating active MFA verification
   * Prevents access until MFA is completed
   */
  readonly mfaChallengeActive: boolean;

  /**
   * 🔐 Active MFA challenge ID
   * Reference to the current MFA challenge
   * Used for challenge validation and completion
   */
  readonly activeChallengeId?: ChallengeId;

  /**
   * ⏰ Last auth state update timestamp
   * When the authentication state was last modified
   * Used for state freshness and synchronization
   */
  readonly lastUpdated: Timestamp;
}

// -----------------------------------------------------------------------------
// 📝 Form Models (UI-Facing Interfaces)
// -----------------------------------------------------------------------------

/**
 * 🆕 Enhanced User Registration Form
 *
 * Updated registration form with tenant context and simplified phone handling.
 * This interface represents the data collected from the user during registration.
 *
 * 🏗️ ARCHITECTURE:
 * Form models are UI-facing interfaces that represent user input data.
 * They are separate from domain entities to maintain clean separation
 * between presentation and business logic layers.
 *
 * 🔐 SECURITY FEATURES:
 * - Password confirmation validation
 * - Terms and privacy acceptance tracking
 * - Tenant context for organization-specific registration
 * - Invitation token validation for secure onboarding
 *
 * 💼 BUSINESS CONTEXT:
 * - User onboarding and account creation
 * - Organization-specific registration flows
 * - Compliance with terms and privacy policies
 * - Marketing preferences and communication
 *
 * 📱 USER EXPERIENCE:
 * - Progressive form completion
 * - Real-time validation feedback
 * - Clear error messaging
 * - Mobile-friendly input fields
 */
export interface RegisterForm {
  /**
   * 👤 User's first/given name
   * Personal name used for display and communication
   * Required field for account creation
   */
  readonly firstName: string;

  /**
   * 👤 User's last/family name
   * Family name used for display and communication
   * Required field for account creation
   */
  readonly lastName: string;

  /**
   * 📧 User's email address (primary identifier)
   * Primary contact method and login credential
   * Must be unique across the entire platform
   */
  readonly email: Email;

  /**
   * 📱 User's phone number (international format)
   * Secondary contact method for SMS and calls
   * Optional but recommended for MFA and notifications
   */
  readonly phone?: PhoneNumber;

  /**
   * 🔑 User's chosen password
   * Secure password for account authentication
   * Must meet security requirements (length, complexity)
   */
  readonly password: string;

  /**
   * 🔑 Password confirmation for validation
   * Password re-entry to prevent typos
   * Must exactly match the password field
   */
  readonly confirmPassword: string;

  /**
   * ✅ Terms of service acceptance flag
   * User agreement to platform terms and conditions
   * Required for account creation and compliance
   */
  readonly acceptTerms: boolean;

  /**
   * ✅ Privacy policy acceptance flag
   * User agreement to data handling and privacy practices
   * Required for GDPR compliance and user consent
   */
  readonly acceptPrivacy: boolean;

  /**
   * 📧 Marketing emails opt-in
   * User preference for promotional communications
   * Optional and can be changed later
   */
  readonly marketingEmails?: boolean;

  /**
   * 🏢 Target tenant slug (for organization-specific registration)
   * Organization identifier for direct registration
   * Used for branded onboarding experiences
   */
  readonly tenantSlug?: string;

  /**
   * 🔗 Invitation token (for invite-based registration)
   * Secure token for invited user registration
   * Validates invitation and sets initial permissions
   */
  readonly invitationToken?: string;
}

/**
 * 🚀 Normalized Registration Command
 *
 * Processed registration data ready for service layer.
 * This interface represents the validated and normalized data
 * that flows from the presentation layer to the business logic.
 *
 * 🏗️ ARCHITECTURE:
 * Command objects are processed form data that have been
 * validated and normalized. They represent the "intent" to
 * perform a business operation rather than raw user input.
 *
 * 🔐 VALIDATION:
 * - Email format and uniqueness verified
 * - Phone number format validated
 * - Password strength requirements met
 * - Business rules compliance checked
 *
 * 💼 BUSINESS LOGIC:
 * - User account creation
 * - Tenant membership assignment
 * - Initial role and permission setup
 * - Welcome email and onboarding
 *
 * 🔄 DATA FLOW:
 * RegisterForm → Validation → RegisterUserCommand → Service Layer
 */
export interface RegisterUserCommand extends Omit<RegisterForm, 'confirmPassword'> {
  /**
   * 📧 Normalized and validated email
   * Email address that has passed format and uniqueness validation
   * Stored in lowercase for consistency
   */
  readonly email: Email;

  /**
   * 📱 Validated phone number
   * Phone number that has passed format and validation checks
   * Stored in E.164 international format
   */
  readonly phone?: PhoneNumber;

  /**
   * 🔑 Validated password
   * Password that meets security requirements and complexity rules
   * Ready for secure hashing and storage
   */
  readonly password: string;
}

/**
 * 🔐 Enhanced Login Form
 *
 * Updated login form with tenant context and OAuth support.
 * This interface represents the data collected from the user during login.
 *
 * 🏗️ ARCHITECTURE:
 * Login forms handle user authentication and session creation.
 * They support multi-tenant routing and extended session options.
 *
 * 🔐 SECURITY FEATURES:
 * - Email and password validation
 * - Tenant context routing
 * - Session duration control
 * - Brute force protection
 *
 * 💼 BUSINESS CONTEXT:
 * - User authentication and access control
 * - Multi-tenant organization switching
 * - Session management and persistence
 * - Security monitoring and audit trails
 *
 * 🌍 MULTI-TENANT SUPPORT:
 * - Tenant-specific login flows
 * - Organization context switching
 * - Branded login experiences
 * - Tenant-scoped security policies
 */
export interface LoginForm {
  /**
   * 📧 Email address for login
   * Primary identifier for user authentication
   * Must be a valid email format
   */
  readonly email: Email;

  /**
   * 🔑 User's password
   * Authentication credential for account access
   * Validated against stored password hash
   */
  readonly password: string;

  /**
   * 💾 Optional remember me flag for extended sessions
   * Extends session duration for convenience
   * Increases security risk but improves user experience
   */
  readonly rememberMe?: boolean;

  /**
   * 🏢 Target tenant slug (for multi-tenant routing)
   * Organization identifier for direct login routing
   * Used for branded login experiences and context switching
   */
  readonly tenantSlug?: string;
}

/**
 * 🎯 Normalized Login Credentials
 *
 * Processed login data ready for authentication service.
 * This interface represents the validated and processed login data
 * that flows from the presentation layer to the authentication service.
 *
 * 🏗️ ARCHITECTURE:
 * LoginCredentials are processed form data that have been
 * validated and enriched with additional context. They represent
 * the "intent" to authenticate rather than raw user input.
 *
 * 🔐 VALIDATION:
 * - Email format and existence verified
 * - Password format validated
 * - Tenant slug resolved to tenant ID
 * - Business rules compliance checked
 *
 * 💼 BUSINESS LOGIC:
 * - User authentication and validation
 * - Session creation and management
 * - Tenant context establishment
 * - Security event logging
 *
 * 🔄 DATA FLOW:
 * LoginForm → Validation → LoginCredentials → Authentication Service
 */
export interface LoginCredentials {
  /**
   * 📧 Email address
   * Validated email address for user identification
   * Used to locate user account in the system
   */
  readonly email: Email;

  /**
   * 🔑 User's password
   * Password for authentication verification
   * Compared against stored password hash
   */
  readonly password: string;

  /**
   * 💾 Remember me preference
   * User's choice for extended session duration
   * Affects session timeout and security policies
   */
  readonly rememberMe: boolean;

  /**
   * 🏢 Target tenant ID (resolved from slug)
   * Organization identifier resolved from tenant slug
   * Used for tenant-scoped authentication and routing
   */
  readonly tenantId?: TenantId;
}

/**
 * 🔗 OAuth Login Form
 *
 * OAuth authentication initiation data.
 * This interface represents the data needed to initiate
 * OAuth authentication with external providers.
 *
 * 🏗️ ARCHITECTURE:
 * OAuth forms handle external authentication flows.
 * They support multiple providers and tenant-specific routing.
 *
 * 🔐 SECURITY FEATURES:
 * - Provider validation and routing
 * - Secure redirect handling
 * - Tenant context preservation
 * - State parameter validation
 *
 * 💼 BUSINESS CONTEXT:
 * - External authentication integration
 * - User onboarding simplification
 * - Enterprise SSO support
 * - Professional profile enrichment
 *
 * 🌐 SUPPORTED PROVIDERS:
 * - Google: Workspace and consumer accounts
 * - GitHub: Developer and enterprise accounts
 * - Microsoft: Azure AD and consumer accounts
 * - LinkedIn: Professional network integration
 */
export interface OAuthLoginForm {
  /**
   * 🔗 OAuth provider
   * External authentication service to use
   * See OAuthProvider enum for available options
   */
  readonly provider: OAuthProvider;

  /**
   * 🔄 Redirect URL after OAuth completion
   * Where to send user after successful authentication
   * Must be whitelisted for security
   */
  readonly redirectTo?: string;

  /**
   * 🏢 Target tenant slug
   * Organization identifier for tenant-specific routing
   * Used for branded OAuth experiences
   */
  readonly tenantSlug?: string;
}

/**
 * 🆘 Enhanced Forgot Password Form
 *
 * Password recovery with tenant context.
 * This interface represents the data needed to initiate
 * password recovery for a user account.
 *
 * 🏗️ ARCHITECTURE:
 * Forgot password forms handle account recovery flows.
 * They support multi-tenant routing and secure token generation.
 *
 * 🔐 SECURITY FEATURES:
 * - Email validation and verification
 * - Secure token generation and delivery
 * - Rate limiting and abuse prevention
 * - Tenant-scoped security policies
 *
 * 💼 BUSINESS CONTEXT:
 * - Account recovery and access restoration
 * - User support and self-service
 * - Security incident response
 * - Compliance and audit requirements
 *
 * 📧 RECOVERY PROCESS:
 * - Email validation and verification
 * - Secure token generation
 * - Email delivery with reset link
 * - Token expiration and cleanup
 */
export interface ForgotPasswordForm {
  /**
   * 📧 Email address for recovery
   * Email associated with the account to recover
   * Must exist in the system for security
   */
  readonly email: Email;

  /**
   * 🏢 Target tenant slug
   * Organization identifier for tenant-specific routing
   * Used for branded recovery experiences
   */
  readonly tenantSlug?: string;
}

/**
 * 🔑 Enhanced Password Reset Form
 *
 * Password reset with improved validation.
 * This interface represents the data needed to complete
 * a password reset using a valid reset token.
 *
 * 🏗️ ARCHITECTURE:
 * Password reset forms handle the final step of
 * account recovery by setting a new password.
 *
 * 🔐 SECURITY FEATURES:
 * - Token validation and verification
 * - Password strength requirements
 * - Confirmation matching validation
 * - Token expiration and single-use
 *
 * 💼 BUSINESS CONTEXT:
 * - Account security restoration
 * - Password policy enforcement
 * - Security incident resolution
 * - User self-service capabilities
 *
 * 🔒 SECURITY REQUIREMENTS:
 * - Valid and unexpired reset token
 * - Strong password requirements
 * - Password confirmation matching
 * - Immediate token invalidation
 */
export interface ResetPasswordForm {
  /**
   * 🔗 Password reset token from email
   * Secure token sent via email for account recovery
   * Must be valid and unexpired
   */
  readonly token: string;

  /**
   * 🔑 New password to set
   * New secure password for account access
   * Must meet security requirements
   */
  readonly password: string;

  /**
   * 🔑 Password confirmation for validation
   * Password re-entry to prevent typos
   * Must exactly match the password field
   */
  readonly confirmPassword: string;
}

/**
 * ✅ Email Verification Form
 *
 * Email verification using token.
 */
export interface VerifyEmailForm {
  /** Verification token from email */
  readonly token: string;
  /** Email being verified (optional, for validation) */
  readonly email?: Email;
}

/**
 * 🔢 MFA Verification Form
 *
 * Multi-factor authentication verification.
 */
export interface VerifyMfaForm {
  /** MFA challenge ID */
  readonly challengeId: ChallengeId;
  /** Verification code */
  readonly code: string;
  /** Whether this is a backup code */
  readonly isBackupCode?: boolean;
}

/**
 * ⚙️ MFA Setup Form
 *
 * Multi-factor authentication setup.
 */
export interface SetupMfaForm {
  /** MFA method to set up */
  readonly method: MfaMethod;
  /** Phone number (for SMS MFA) */
  readonly phoneNumber?: PhoneNumber;
  /** Current password for security verification */
  readonly currentPassword: string;
}

// -----------------------------------------------------------------------------
// 🔄 Command & Event Types
// -----------------------------------------------------------------------------

/**
 * Authentication command types for business logic
 */
export type AuthCommand =
  | RegisterUserCommand
  | LoginCredentials
  | ForgotPasswordForm
  | ResetPasswordForm
  | VerifyEmailForm
  | VerifyMfaForm
  | SetupMfaForm;

/**
 * Authentication result type for service responses
 */
export interface AuthResult<T = unknown> {
  /** Operation success status */
  readonly success: boolean;
  /** Result data (if successful) */
  readonly data?: T;
  /** Error information (if failed) */
  readonly error?: {
    readonly code: string;
    readonly message: string;
    readonly field?: string;
    readonly metadata?: Metadata;
  };
  /** Whether MFA is required */
  readonly mfaRequired?: boolean;
  /** MFA challenge ID */
  readonly challengeId?: ChallengeId;
  /** Redirect URL after operation */
  readonly redirectTo?: string;
}

/**
 * Tenant membership information
 */
export interface TenantMembership {
  /** Tenant information */
  readonly tenant: Tenant;
  /** User's role in this tenant */
  readonly role: UserRole;
  /** User's specific permissions in this tenant */
  readonly permissions: readonly string[];
  /** When user joined this tenant */
  readonly joinedAt: Timestamp;
  /** Whether membership is active */
  readonly isActive: boolean;
}
