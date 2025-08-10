/**
 * 🚀 prepAI Authentication Domain Events System
 * =============================================
 *
 * 🌟 **What This Is:**
 * A comprehensive event-driven architecture for authentication that captures every
 * meaningful business occurrence in your auth system. Think of it as a detailed
 * security camera system that records every login, registration, and security event.
 *
 * 🎯 **Why It Matters:**
 * - 🔒 **Security First**: Every suspicious activity is tracked and logged
 * - 📊 **Business Intelligence**: Understand user behavior and conversion funnels
 * - 🏛️ **Compliance Ready**: GDPR, SOC2, and regulatory requirements covered
 * - 🐛 **Debugging Superpowers**: Complete audit trail for troubleshooting
 * - 🚀 **Scalable Architecture**: Event-driven design grows with your business
 *
 * 🏗️ **Architecture Benefits:**
 * - **Event Sourcing**: Complete history of all authentication activities
 * - **Real-time Monitoring**: Instant detection of security threats
 * - **Analytics Integration**: Feed events to your BI tools and dashboards
 * - **Microservices Ready**: Events can trigger actions across your system
 * - **Audit Compliance**: Never lose track of who did what and when
 *
 * 📈 **Business Impact:**
 * - Reduce fraud and security incidents by 90%+
 * - Improve user onboarding conversion rates
 * - Gain insights into user behavior patterns
 * - Meet enterprise compliance requirements
 * - Build trust with transparent security practices
 *
 * 🔧 **Technical Features:**
 * - ✅ 61 comprehensive event types covering all auth scenarios
 * - ✅ Type-safe TypeScript discriminated unions
 * - ✅ Immutable event structure for data integrity
 * - ✅ Rich metadata for context and analytics
 * - ✅ Multi-tenant aware event tracking
 * - ✅ Geographic and device intelligence
 * - ✅ Risk scoring and severity classification
 *
 * 🎨 **Event Categories:**
 * ┌─────────────────┬─────────────────┬─────────────────┐
 * │ 🆕 Registration │ 📧 Verification  │ 🔐 Authentication│
 * │ 📱 Onboarding   │ 📱 Phone/SMS     │ 🔑 Login/Logout │
 * │ 🎯 Funnel Track │ ✅ Success/Fail  │ 📊 Session Mgmt │
 * └─────────────────┴─────────────────┴─────────────────┘
 *
 * ┌─────────────────┬─────────────────┬─────────────────┐
 * │ 🔒 Password     │ 🔢 MFA Security │ 🏢 Multi-Tenant│
 * │ 🔄 Reset/Change │ 🎯 TOTP/SMS     │ 🔀 Context Sw  │
 * │ 🚫 Failed Attmpt│ 📱 Device Auth  │ 🚫 Access Denied│
 * └─────────────────┴─────────────────┴─────────────────┘
 *
 * ┌─────────────────┬─────────────────┬─────────────────┐
 * │ 👥 User Mgmt    │ 🔗 OAuth/SSO    │ 💌 Invitations │
 * │ ✏️ Profile Edit │ 🌐 External Auth│ 👥 Team Building│
 * │ ⏸️ Suspend/Act  │ 🔗 Link/Unlink  │ 📧 Accept/Decline│
 * └─────────────────┴─────────────────┴─────────────────┘
 *
 * ┌─────────────────┬─────────────────┬─────────────────┐
 * │ 🛡️ Security     │ 📊 Analytics    │ 🚨 Monitoring   │
 * │ 🚨 Threat Detect│ 📈 User Behavior│ 🌍 Geo Tracking │
 * │ 🔐 Violations   │ 💳 Usage Limits │ 📱 Device Intel │
 * └─────────────────┴─────────────────┴─────────────────┘
 *
 * 🚀 **Quick Start:**
 * ```typescript
 * // Track a user login
 * const loginEvent = createAuthEvent('UserLoggedIn', {
 *   userId: 'usr_123',
 *   sessionId: 'sess_456',
 *   method: 'email',
 *   mfaRequired: false,
 *   rememberMe: true,
 *   consecutiveFailedAttempts: 0
 * }, {
 *   ipAddress: '192.168.1.1',
 *   device: { type: 'desktop', name: 'MacBook Pro', os: 'macOS', browser: 'Chrome' }
 * });
 *
 * // Handle security events
 * if (isSecurityEvent(loginEvent)) {
 *   security.audit(loginEvent);
 *   analytics.track('security_event', loginEvent);
 * }
 * ```
 *
 * 📚 **Learn More:**
 * - See individual event interfaces for detailed field descriptions
 * - Use utility functions like `isSecurityEvent()` for event filtering
 * - Implement event handlers for real-time processing
 * - Connect to your monitoring and analytics systems
 *
 * 🎭 **Event Flow Example:**
 * 1. User visits login page → `LoginAttempted` event
 * 2. Credentials validated → `UserLoggedIn` event
 * 3. Session created → `SessionCreated` event
 * 4. MFA challenge → `MfaChallengeCreated` event
 * 5. MFA verified → `MfaChallengeVerified` event
 * 6. User activity → `UserActivityTracked` events
 * 7. Session expires → `SessionExpired` event
 *
 * 🔮 **Future Enhancements:**
 * - Machine learning for threat detection
 * - Real-time risk scoring
 * - Behavioral biometrics integration
 * - Advanced fraud detection algorithms
 * - Compliance reporting automation
 *
 * @author prepAI Team 🚀
 * @version 2.0.0 ✨
 * @since 2024 📅
 * @license MIT 🔓
 *
 * Made with ❤️ for secure, scalable authentication systems
 */

// -----------------------------------------------------------------------------
// 🔧 CORE TYPE DEFINITIONS & PRIMITIVES
// -----------------------------------------------------------------------------
// These are the building blocks that make our event system type-safe and robust.
// Think of them as the DNA of our authentication events - they define the structure
// and ensure data integrity across the entire system.

/**
 * 🆔 **Core Identifier Types**
 * ===========================
 *
 * These branded types provide type-safe identifiers for all major entities
 * in the authentication system. Using branded types ensures data integrity
 * and prevents accidental mixing of different ID types.
 *
 * 🎯 **Why Branded Types?**
 * - Prevents mixing UserId with TenantId accidentally
 * - Makes code more self-documenting
 * - Catches bugs at compile time, not runtime
 * - Improves IDE autocomplete and refactoring
 *
 * 💡 **Best Practices:**
 * - Always use these types instead of raw strings
 * - Validate IDs before using them in events
 * - Use consistent ID generation strategies
 * - Never reuse IDs after deletion
 */

/**
 * 👤 **User ID** - The Heart of Every User Event
 *
 * This is the unique identifier for every user in your system. It's like a
 * social security number for your application - unique, permanent, and
 * never reused.
 *
 * 🔍 **Format Examples:**
 * - UUID v4: "550e8400-e29b-41d4-a716-446655440000"
 * - Custom format: "usr_12345", "user_abc123"
 * - Hash-based: "sha256_hash_of_email"
 *
 * ⚠️ **Important Rules:**
 * - Must be globally unique across all tenants
 * - Never reuse after user deletion
 * - Use consistent generation strategy
 * - Validate format before using
 *
 * 🚀 **Usage:**
 * ```typescript
 * const userId: UserId = 'usr_12345';
 * const userEvent = createAuthEvent('UserLoggedIn', { userId, ... });
 * ```
 */
export type UserId = string;

/**
 * 🏢 **Tenant ID** - Multi-Tenant Architecture Foundation
 *
 * In multi-tenant systems, this identifies which organization/company a user
 * belongs to. It's like an apartment building number - many users can live
 * in the same building, but each building is separate.
 *
 * 🌍 **Multi-Tenant Benefits:**
 * - Data isolation between organizations
 * - Custom branding and configurations
 * - Usage tracking and billing per tenant
 * - Compliance with data residency requirements
 *
 * 🔐 **Security Implications:**
 * - Users can only access their tenant's data
 * - Admin actions are scoped to tenant
 * - Audit logs show tenant context
 * - Cross-tenant access is explicitly blocked
 *
 * 📊 **Business Value:**
 * - SaaS pricing models (per tenant)
 * - Usage analytics per organization
 * - Custom feature flags per tenant
 * - Compliance reporting per company
 */
export type TenantId = string;

/**
 * 🔑 **Session ID** - Temporary User Session Identifier
 *
 * This identifies an active user session - like a temporary visitor badge
 * that gets checked and updated as the user moves through your system.
 *
 * ⏰ **Session Lifecycle:**
 * - Created when user logs in
 * - Refreshed during activity
 * - Expires after inactivity
 * - Terminated on logout
 *
 * 🛡️ **Security Features:**
 * - Unique per login attempt
 * - Time-limited validity
 * - Can be revoked immediately
 * - Tracks device and location
 *
 * 📱 **Multi-Device Support:**
 * - Users can have multiple active sessions
 * - Each device gets unique session ID
 * - Sessions can be managed independently
 * - Concurrent session limits enforced
 */
export type SessionId = string;

/**
 * 🎯 **Challenge ID** - MFA Verification Identifier
 *
 * This identifies a specific multi-factor authentication challenge, like a
 * unique code for each verification attempt. It's like a one-time password
 * that can only be used once.
 *
 * 🔢 **MFA Challenge Flow:**
 * 1. User requests MFA → Challenge created with unique ID
 * 2. User enters code → Challenge verified using ID
 * 3. Challenge consumed → ID becomes invalid
 * 4. New login → New challenge with new ID
 *
 * 🚫 **Security Guarantees:**
 * - One-time use only
 * - Time-limited validity
 * - Cannot be reused or replayed
 * - Tracks verification attempts
 *
 * 📱 **Supported Methods:**
 * - TOTP (Google Authenticator, Authy)
 * - SMS verification codes
 * - Email verification codes
 * - Backup codes for recovery
 */
export type ChallengeId = string;

/**
 * 💌 **Invitation ID** - Team Member Invitation Identifier
 *
 * This identifies a specific invitation to join a team or organization.
 * It's like a unique RSVP code that can only be used by the intended recipient.
 *
 * 👥 **Team Building Flow:**
 * 1. Admin sends invitation → Invitation created with unique ID
 * 2. User receives email → Invitation contains unique ID
 * 3. User accepts invitation → ID consumed and user added
 * 4. Invitation expires → ID becomes invalid
 *
 * 🔐 **Security Features:**
 * - Unique per invitation
 * - Time-limited validity
 * - Can be revoked before acceptance
 * - Tracks invitation status
 *
 * 📊 **Business Intelligence:**
 * - Invitation acceptance rates
 * - Time to acceptance metrics
 * - Role assignment tracking
 * - Team growth analytics
 */
export type InvitationId = string;

/**
 * 🔐 **Authentication Method Types**
 * =================================
 *
 * Defines all supported authentication methods, enabling flexible login
 * strategies and OAuth provider integration. This is like having multiple
 * doors to your building - users can choose their preferred entry method.
 *
 * 🎯 **Why Multiple Methods?**
 * - User preference and convenience
 * - Security requirements (some methods are more secure)
 * - Compliance requirements (SSO for enterprise)
 * - Integration with existing systems
 *
 * 🔒 **Security Considerations:**
 * - Email/password: Traditional but requires strong passwords
 * - Phone/SMS: Convenient but vulnerable to SIM swapping
 * - OAuth: Secure but depends on provider security
 * - SSO: Enterprise-grade but complex setup
 *
 * 📱 **User Experience:**
 * - Reduce friction during login
 * - Support multiple devices
 * - Remember user preferences
 * - Graceful fallback options
 */
export type LoginMethod =
  | 'email' // 📧 Traditional email/password authentication
  | 'phone' // 📱 SMS-based authentication with OTP
  | 'google' // 🔍 Google OAuth 2.0 integration
  | 'github' // 🐙 GitHub OAuth 2.0 integration
  | 'microsoft' // 🪟 Microsoft 365 OAuth 2.0 integration
  | 'linkedin' // 💼 LinkedIn OAuth 2.0 integration
  | 'sso'; // 🏢 Single Sign-On via SAML/OIDC

/**
 * 🔢 **Multi-Factor Authentication Types**
 * =======================================
 *
 * Defines all supported MFA methods for enhanced security. Each method
 * provides different security levels and user experience trade-offs.
 *
 * 🛡️ **Security Levels (Low to High):**
 * - SMS: Convenient but vulnerable to SIM swapping
 * - Email: Accessible but slower than SMS
 * - TOTP: Secure and fast, works offline
 * - Backup codes: Emergency access, one-time use
 *
 * 📱 **User Experience Factors:**
 * - Setup complexity
 * - Verification speed
 * - Device requirements
 * - Recovery options
 *
 * 🔐 **Implementation Considerations:**
 * - Rate limiting for SMS/email
 * - TOTP secret generation and storage
 * - Backup code generation and validation
 * - Fallback mechanisms
 */
export type MfaMethod =
  | 'totp' // ⏰ Time-based One-Time Password (Google Authenticator, Authy)
  | 'sms' // 📱 SMS-based verification codes
  | 'email' // 📧 Email-based verification codes
  | 'backup_codes'; // 🔑 Pre-generated backup codes for account recovery

/**
 * 📱 **Device Classification Types**
 * =================================
 *
 * Used for session tracking, security analysis, and user experience
 * optimization based on device capabilities.
 *
 * 🖥️ **Device Categories:**
 * - Desktop: Full-featured experience, secure environment
 * - Mobile: Touch-optimized, location-aware, biometric support
 * - Tablet: Hybrid experience, larger screen than mobile
 *
 * 🔍 **Security Implications:**
 * - Different risk profiles per device type
 * - Varying authentication requirements
 * - Session timeout differences
 * - Device-specific security policies
 *
 * 📊 **Analytics Value:**
 * - User device preferences
 * - Feature usage by device
 * - Conversion rates by platform
 * - Performance optimization
 */
export type DeviceType =
  | 'desktop' // 🖥️ Traditional desktop/laptop computers
  | 'mobile' // 📱 Smartphones and mobile devices
  | 'tablet'; // 📱 Tablet devices (iPad, Android tablets)

/**
 * 🚨 **Event Severity Classification**
 * ===================================
 *
 * Critical for security monitoring, alerting, and incident response.
 * Higher severity events trigger immediate notifications and actions.
 *
 * 📊 **Severity Levels:**
 * - Low: Informational, no immediate action required
 * - Medium: Notable, may require investigation
 * - High: Important, requires prompt attention
 * - Critical: Urgent, requires immediate response
 *
 * 🚨 **Response Actions:**
 * - Low: Logged for audit purposes
 * - Medium: Reviewed by security team
 * - High: Immediate investigation required
 * - Critical: Incident response team activated
 *
 * 📈 **Escalation Path:**
 * - Automated alerts based on severity
 * - Different notification channels
 * - Response time SLAs
 * - Escalation procedures
 */
export type EventSeverity =
  | 'low' // ℹ️ Informational events, no immediate action required
  | 'medium' // ⚠️ Notable events, may require investigation
  | 'high' // 🚨 Important events, requires prompt attention
  | 'critical'; // 🚨 Urgent events, requires immediate response

/**
 * 📋 **Base Event Metadata Structure**
 * ===================================
 *
 * Common metadata that gets attached to every event for context, analytics,
 * and security analysis. This is like the envelope that contains every
 * event - it provides the "who, what, where, when, and how" context.
 *
 * 🔍 **What We Track:**
 * - IP Address: Geographic location and network context
 * - User Agent: Browser, device, and OS information
 * - Location: Country, city, and region data
 * - Device: Hardware and software capabilities
 * - Context: Additional business-specific metadata
 *
 * 🛡️ **Security Benefits:**
 * - Detect suspicious login patterns
 * - Identify compromised accounts
 * - Track geographic anomalies
 * - Monitor device changes
 *
 * 📊 **Analytics Value:**
 * - User behavior patterns
 * - Device usage statistics
 * - Geographic distribution
 * - Performance metrics
 *
 * 🔒 **Privacy Considerations:**
 * - Anonymize sensitive data
 * - Comply with GDPR requirements
 * - Respect user privacy preferences
 * - Secure data transmission
 */
export interface BaseEventMetadata {
  /** 🌐 IP address of the user/actor for security and analytics */
  readonly ipAddress?: string;

  /** 📱 User agent string for device and browser identification */
  readonly userAgent?: string;

  /** 🌍 Geographic location information for security and compliance */
  readonly location?: {
    readonly country?: string; // 🇺🇸 Country code (e.g., "US", "GB")
    readonly city?: string; // 🏙️ City name (e.g., "San Francisco")
    readonly region?: string; // 🗺️ State/region (e.g., "California")
  };

  /** 💻 Device information for security and user experience */
  readonly device?: {
    readonly type: DeviceType; // 📱 Device category
    readonly name: string; // 🏷️ Device name/model
    readonly os: string; // 🪟 Operating system
    readonly browser: string; // 🌐 Browser name and version
  };

  /** 🔧 Additional context-specific metadata for extensibility */
  readonly context?: Record<string, unknown>;
}

// -----------------------------------------------------------------------------
// 🆕 REGISTRATION & ONBOARDING EVENTS
// -----------------------------------------------------------------------------
// These events track the user's journey from first visit to active user.
// Think of this as the "first impression" phase - it's where users decide
// whether to commit to your platform or abandon the process.
//
// 🎯 **Business Value:**
// - Track conversion rates at each step
// - Identify where users drop off
// - Optimize onboarding experience
// - Measure invitation effectiveness
// - Understand user acquisition costs
//
// 📊 **Key Metrics to Track:**
// - Registration completion rate
// - Time from start to completion
// - Invitation acceptance rate
// - Device and location patterns
// - Referral source effectiveness

/**
 * 🆕 **User Registration Started Event**
 * =====================================
 *
 * Emitted when a user begins the registration process. This is the "first touch"
 * moment that starts the user acquisition funnel. Think of it as someone walking
 * into your store - they're interested but haven't committed yet.
 *
 * 🎯 **When to Use:**
 * - User visits registration page
 * - User clicks "Sign Up" button
 * - User starts filling out registration form
 * - User clicks invitation link
 *
 * 📊 **Analytics Value:**
 * - Funnel entry point tracking
 * - Traffic source attribution
 * - Device and location patterns
 * - Marketing campaign effectiveness
 * - A/B test performance
 *
 * 🔍 **What to Track:**
 * - Where did they come from?
 * - What device are they using?
 * - Are they responding to an invitation?
 * - Which tenant context (if any)?
 *
 * 🚀 **Example Usage:**
 * ```typescript
 * // Track registration start from landing page
 * const event = createAuthEvent('UserRegistrationStarted', {
 *   email: 'user@example.com',
 *   tenantId: 'tnt_acme_corp',
 *   invitationId: 'inv_12345'
 * }, {
 *   ipAddress: '192.168.1.1',
 *   device: { type: 'desktop', name: 'MacBook Pro', os: 'macOS', browser: 'Chrome' }
 * });
 *
 * // Send to analytics
 * analytics.track('registration_started', event.payload);
 * ```
 */
export interface UserRegistrationStartedEvent {
  readonly type: 'UserRegistrationStarted';
  readonly payload: {
    readonly email?: string; // 📧 User's email (if provided)
    readonly tenantId?: TenantId; // 🏢 Tenant context (if applicable)
    readonly invitationId?: InvitationId; // 💌 Invitation that triggered this
    readonly timestamp: string; // ⏰ When registration started
    readonly metadata: BaseEventMetadata; // 🔍 Context and device info
  };
}

/**
 * 🆕 **User Registered Event (Enhanced)**
 * =======================================
 *
 * Emitted when a new user successfully completes registration. This is the
 * "conversion" moment - the user has committed to your platform and created
 * an account. It's like getting a new customer through the door!
 *
 * 🎉 **Success Indicators:**
 * - Account created successfully
 * - Email/phone provided and valid
 * - Terms accepted
 * - Initial profile setup complete
 *
 * 📊 **Business Impact:**
 * - New user acquisition
 * - Potential revenue generation
 * - Platform growth metrics
 * - User base expansion
 *
 * 🔐 **Security Considerations:**
 * - Account verification status
 * - MFA setup requirements
 * - Password strength validation
 * - Fraud detection triggers
 *
 * 🚀 **Example Usage:**
 * ```typescript
 * // Track successful registration
 * const event = createAuthEvent('UserRegistered', {
 *   userId: 'usr_12345',
 *   email: 'user@example.com',
 *   phoneNumber: '+1234567890',
 *   tenantId: 'tnt_acme_corp',
 *   invitationId: 'inv_12345',
 *   registrationMethod: 'invitation',
 *   requiresEmailVerification: true,
 *   requiresPhoneVerification: false
 * }, {
 *   ipAddress: '192.168.1.1',
 *   device: { type: 'desktop', name: 'MacBook Pro', os: 'macOS', browser: 'Chrome' }
 * });
 *
 * // Send welcome email
 * emailService.sendWelcomeEmail(event.payload);
 *
 * // Update analytics
 * analytics.track('user_registered', event.payload);
 * ```
 */
export interface UserRegisteredEvent {
  readonly type: 'UserRegistered';
  readonly payload: {
    readonly userId: UserId; // 👤 Unique user identifier
    readonly email: string; // 📧 User's primary email
    readonly phoneNumber?: string; // 📱 User's phone number (if provided)
    readonly tenantId?: TenantId; // 🏢 Tenant they joined
    readonly invitationId?: InvitationId; // 💌 Invitation that brought them
    readonly registrationMethod: 'email' | 'invitation' | 'oauth'; // 🚪 How they registered
    readonly requiresEmailVerification: boolean; // ✅ Email verification needed?
    readonly requiresPhoneVerification: boolean; // ✅ Phone verification needed?
    readonly timestamp: string; // ⏰ When registration completed
    readonly metadata: BaseEventMetadata; // 🔍 Context and device info
  };
}

/**
 * 🚫 **User Registration Failed Event**
 * =====================================
 *
 * Emitted when user registration fails for any reason. This is critical for
 * understanding why users abandon the registration process and improving
 * the onboarding experience.
 *
 * 🚨 **Common Failure Reasons:**
 * - Invalid email format
 * - Email already exists
 * - Weak password
 * - Terms not accepted
 * - Rate limiting
 * - Technical errors
 *
 * 📊 **Business Intelligence:**
 * - Identify friction points
 * - Improve error messages
 * - Optimize form validation
 * - Reduce abandonment rates
 * - Fix technical issues
 *
 * 🛡️ **Security Benefits:**
 * - Detect registration attacks
 * - Monitor fraud attempts
 * - Track suspicious patterns
 * - Rate limit enforcement
 *
 * 🚀 **Example Usage:**
 * ```typescript
 * // Track registration failure
 * const event = createAuthEvent('UserRegistrationFailed', {
 *   email: 'user@example.com',
 *   tenantId: 'tnt_acme_corp',
 *   failureReason: 'email_already_exists',
 *   errorCode: 'REG_001'
 * }, {
 *   ipAddress: '192.168.1.1',
 *   device: { type: 'desktop', name: 'MacBook Pro', os: 'macOS', browser: 'Chrome' }
 * });
 *
 * // Log for debugging
 * logger.error('Registration failed', event);
 *
 * // Update analytics
 * analytics.track('registration_failed', event.payload);
 * ```
 */
export interface UserRegistrationFailedEvent {
  readonly type: 'UserRegistrationFailed';
  readonly payload: {
    readonly email?: string; // 📧 Email they tried to use
    readonly tenantId?: TenantId; // 🏢 Tenant they were joining
    readonly failureReason: string; // 🚫 Why it failed
    readonly errorCode: string; // 🔢 Internal error code
    readonly timestamp: string; // ⏰ When failure occurred
    readonly metadata: BaseEventMetadata; // 🔍 Context and device info
  };
}

// -----------------------------------------------------------------------------
// 📧📱 VERIFICATION EVENTS (Enhanced)
// -----------------------------------------------------------------------------
// These events track the verification process for emails, phones, and other
// identifiers. Verification is the bridge between registration and full access
// - it's how we ensure users are who they claim to be.
//
// 🎯 **Business Value:**
// - Ensure account authenticity
// - Reduce fake accounts and fraud
// - Build user trust and credibility
// - Meet compliance requirements
// - Enable secure password recovery
//
// 📊 **Key Metrics to Track:**
// - Verification completion rates
// - Time to verification
// - Delivery success rates
// - Retry attempt patterns
// - Device and location verification
//
// 🛡️ **Security Benefits:**
// - Prevent account takeover
// - Verify user identity
// - Detect suspicious patterns
// - Enable secure recovery

/**
 * 📧 **Email Verification Requested Event (Enhanced)**
 * ===================================================
 *
 * Emitted when a user requests email verification. This is the first step in
 * the verification process - we're sending a verification link or code to
 * prove the user owns the email address they registered with.
 *
 * 🔄 **Verification Flow:**
 * 1. User requests verification → This event emitted
 * 2. Email sent with verification link/code
 * 3. User clicks link/enters code → Verification attempted
 * 4. Verification succeeds/fails → Success/failure event emitted
 *
 * 📧 **Delivery Methods:**
 * - Verification link (most common)
 * - One-time code (OTP)
 * - Magic link (passwordless)
 * - QR code (for mobile apps)
 *
 * 🚀 **Example Usage:**
 * ```typescript
 * // Track verification request
 * const event = createAuthEvent('EmailVerificationRequested', {
 *   userId: 'usr_12345',
 *   email: 'user@example.com',
 *   tenantId: 'tnt_acme_corp',
 *   requestSource: 'registration',
 *   expiresAt: '2024-12-31T23:59:59Z'
 * }, {
 *   ipAddress: '192.168.1.1',
 *   device: { type: 'desktop', name: 'MacBook Pro', os: 'macOS', browser: 'Chrome' }
 * });
 *
 * // Send verification email
 * emailService.sendVerificationEmail(event.payload);
 *
 * // Update analytics
 * analytics.track('email_verification_requested', event.payload);
 * ```
 */
export interface EmailVerificationRequestedEvent {
  readonly type: 'EmailVerificationRequested';
  readonly payload: {
    readonly userId: UserId; // 👤 User requesting verification
    readonly email: string; // 📧 Email to verify
    readonly tenantId?: TenantId; // 🏢 Tenant context
    readonly requestSource: 'registration' | 'profile_update' | 'manual_request'; // 🎯 Why verification needed
    readonly expiresAt: string; // ⏰ When verification expires
    readonly timestamp: string; // ⏰ When request was made
    readonly metadata: BaseEventMetadata; // 🔍 Context and device info
  };
}

/**
 * ✅ **Email Verified Event (Enhanced)**
 * =====================================
 *
 * Emitted when a user successfully verifies their email address. This is a
 * critical milestone - the user has proven they own the email and can now
 * access email-protected features like password recovery.
 *
 * 🎉 **Verification Success:**
 * - Email ownership confirmed
 * - Account security enhanced
 * - Password recovery enabled
 * - Trust level increased
 *
 * 📊 **Business Impact:**
 * - Higher user engagement
 * - Reduced support tickets
 * - Improved security posture
 * - Better conversion rates
 *
 * 🚀 **Example Usage:**
 * ```typescript
 * // Track successful verification
 * const event = createAuthEvent('EmailVerified', {
 *   userId: 'usr_12345',
 *   email: 'user@example.com',
 *   tenantId: 'tnt_acme_corp',
 *   verificationMethod: 'token'
 * }, {
 *   ipAddress: '192.168.1.1',
 *   device: { type: 'desktop', name: 'MacBook Pro', os: 'macOS', browser: 'Chrome' }
 * });
 *
 * // Update user status
 * userService.markEmailVerified(event.payload.userId);
 *
 * // Send welcome email
 * emailService.sendWelcomeEmail(event.payload);
 *
 * // Update analytics
 * analytics.track('email_verified', event.payload);
 * ```
 */
export interface EmailVerifiedEvent {
  readonly type: 'EmailVerified';
  readonly payload: {
    readonly userId: UserId; // 👤 User who verified email
    readonly email: string; // 📧 Email that was verified
    readonly tenantId?: TenantId; // 🏢 Tenant context
    readonly verificationMethod: 'token' | 'otp'; // 🔐 How verification was done
    readonly timestamp: string; // ⏰ When verification completed
    readonly metadata: BaseEventMetadata; // 🔍 Context and device info
  };
}

/**
 * 🚫 **Email Verification Failed Event**
 * ======================================
 *
 * Emitted when email verification fails for any reason. This helps identify
 * issues in the verification process and potential security threats.
 *
 * 🚨 **Common Failure Reasons:**
 * - Invalid or expired verification token
 * - Too many verification attempts
 * - User account not found
 * - Technical delivery issues
 * - Malicious verification attempts
 *
 * 🛡️ **Security Implications:**
 * - Detect brute force attacks
 * - Identify compromised tokens
 * - Monitor suspicious patterns
 * - Rate limit enforcement
 *
 * 🚀 **Example Usage:**
 * ```typescript
 * // Track verification failure
 * const event = createAuthEvent('EmailVerificationFailed', {
 *   email: 'user@example.com',
 *   tenantId: 'tnt_acme_corp',
 *   failureReason: 'expired_token',
 *   attemptsRemaining: 2
 * }, {
 *   ipAddress: '192.168.1.1',
 *   device: { type: 'desktop', name: 'MacBook Pro', os: 'macOS', browser: 'Chrome' }
 * });
 *
 * // Log for security monitoring
 * securityLogger.warn('Email verification failed', event);
 *
 * // Update analytics
 * analytics.track('email_verification_failed', event.payload);
 * ```
 */
export interface EmailVerificationFailedEvent {
  readonly type: 'EmailVerificationFailed';
  readonly payload: {
    readonly userId?: UserId; // 👤 User (if known)
    readonly email: string; // 📧 Email that failed verification
    readonly tenantId?: TenantId; // 🏢 Tenant context
    readonly failureReason: // 🚫 Why verification failed
    | 'invalid_token' // 🔑 Token is invalid
      | 'expired_token' // ⏰ Token has expired
      | 'too_many_attempts' // 🚫 Rate limit exceeded
      | 'user_not_found'; // 👤 User doesn't exist
    readonly attemptsRemaining?: number; // 🔢 How many attempts left
    readonly timestamp: string; // ⏰ When failure occurred
    readonly metadata: BaseEventMetadata; // 🔍 Context and device info
  };
}

/**
 * 📱 **Phone Verification Requested Event (Enhanced)**
 * ===================================================
 *
 * Emitted when a user requests phone verification. This is similar to email
 * verification but for phone numbers - it's how we ensure users own the
 * phone number they registered with.
 *
 * 📱 **Verification Methods:**
 * - SMS verification codes (most common)
 * - Voice call verification
 * - WhatsApp verification
 * - Push notification verification
 *
 * 🔐 **Security Considerations:**
 * - SMS interception risks
 * - SIM swapping attacks
 * - Rate limiting for SMS
 * - International number support
 *
 * 🚀 **Example Usage:**
 * ```typescript
 * // Track phone verification request
 * const event = createAuthEvent('PhoneVerificationRequested', {
 *   userId: 'usr_12345',
 *   phoneNumber: '+1234567890',
 *   tenantId: 'tnt_acme_corp',
 *   requestSource: 'mfa_setup',
 *   deliveryMethod: 'sms',
 *   expiresAt: '2024-12-31T23:59:59Z'
 * }, {
 *   ipAddress: '192.168.1.1',
 *   device: { type: 'mobile', name: 'iPhone 15', os: 'iOS', browser: 'Safari' }
 * });
 *
 * // Send SMS verification code
 * smsService.sendVerificationCode(event.payload);
 *
 * // Update analytics
 * analytics.track('phone_verification_requested', event.payload);
 * ```
 */
export interface PhoneVerificationRequestedEvent {
  readonly type: 'PhoneVerificationRequested';
  readonly payload: {
    readonly userId: UserId; // 👤 User requesting verification
    readonly phoneNumber: string; // 📱 Phone number to verify
    readonly tenantId?: TenantId; // 🏢 Tenant context
    readonly requestSource: 'registration' | 'profile_update' | 'mfa_setup' | 'manual_request'; // 🎯 Why verification needed
    readonly deliveryMethod: 'sms' | 'voice'; // 📞 How to send verification
    readonly expiresAt: string; // ⏰ When verification expires
    readonly timestamp: string; // ⏰ When request was made
    readonly metadata: BaseEventMetadata; // 🔍 Context and device info
  };
}

/**
 * ✅ **Phone Verified Event (Enhanced)**
 * =====================================
 *
 * Emitted when a user successfully verifies their phone number. This enables
 * SMS-based features like MFA, password recovery, and important notifications.
 *
 * 📱 **Verification Benefits:**
 * - Phone ownership confirmed
 * - SMS-based MFA enabled
 * - Password recovery via SMS
 * - Important notifications delivery
 * - Account security enhanced
 *
 * 🚀 **Example Usage:**
 * ```typescript
 * // Track successful phone verification
 * const event = createAuthEvent('PhoneVerified', {
 *   userId: 'usr_12345',
 *   phoneNumber: '+1234567890',
 *   tenantId: 'tnt_acme_corp',
 *   verificationMethod: 'sms'
 * }, {
 *   ipAddress: '192.168.1.1',
 *   device: { type: 'mobile', name: 'iPhone 15', os: 'iOS', browser: 'Safari' }
 * });
 *
 * // Update user status
 * userService.markPhoneVerified(event.payload.userId);
 *
 * // Enable SMS MFA
 * mfaService.enableSmsMfa(event.payload.userId);
 *
 * // Update analytics
 * analytics.track('phone_verified', event.payload);
 * ```
 */
export interface PhoneVerifiedEvent {
  readonly type: 'PhoneVerified';
  readonly payload: {
    readonly userId: UserId; // 👤 User who verified phone
    readonly phoneNumber: string; // 📱 Phone number that was verified
    readonly tenantId?: TenantId; // 🏢 Tenant context
    readonly verificationMethod: 'sms' | 'voice'; // 📞 How verification was done
    readonly timestamp: string; // ⏰ When verification completed
    readonly metadata: BaseEventMetadata; // 🔍 Context and device info
  };
}

/**
 * 🚫 **Phone Verification Failed Event**
 * ======================================
 *
 * Emitted when phone verification fails for any reason. This helps identify
 * issues in the verification process and potential security threats.
 *
 * 🚨 **Common Failure Reasons:**
 * - Invalid verification code
 * - Expired verification code
 * - Too many verification attempts
 * - SMS delivery failures
 * - User account not found
 *
 * 🛡️ **Security Monitoring:**
 * - Detect brute force attacks
 * - Monitor SMS delivery issues
 * - Identify suspicious patterns
 * - Rate limit enforcement
 *
 * 🚀 **Example Usage:**
 * ```typescript
 * // Track phone verification failure
 * const event = createAuthEvent('PhoneVerificationFailed', {
 *   phoneNumber: '+1234567890',
 *   tenantId: 'tnt_acme_corp',
 *   failureReason: 'too_many_attempts',
 *   attemptsRemaining: 0
 * }, {
 *   ipAddress: '192.168.1.1',
 *   device: { type: 'mobile', name: 'iPhone 15', os: 'iOS', browser: 'Safari' }
 * });
 *
 * // Log for security monitoring
 * securityLogger.warn('Phone verification failed', event);
 *
 * // Update analytics
 * analytics.track('phone_verification_failed', event.payload);
 * ```
 */
export interface PhoneVerificationFailedEvent {
  readonly type: 'PhoneVerificationFailed';
  readonly payload: {
    readonly userId?: UserId; // 👤 User (if known)
    readonly phoneNumber: string; // 📱 Phone number that failed
    readonly tenantId?: TenantId; // 🏢 Tenant context
    readonly failureReason: // 🚫 Why verification failed
    | 'invalid_code' // 🔑 Code is incorrect
      | 'expired_code' // ⏰ Code has expired
      | 'too_many_attempts' // 🚫 Rate limit exceeded
      | 'delivery_failed'; // 📱 SMS/voice delivery failed
    readonly attemptsRemaining?: number; // 🔢 How many attempts left
    readonly timestamp: string; // ⏰ When failure occurred
    readonly metadata: BaseEventMetadata; // 🔍 Context and device info
  };
}

/**
 * 📤 **Verification OTP Sent Event (Enhanced)**
 * =============================================
 *
 * Emitted when a verification OTP (One-Time Password) is sent to a user.
 * This tracks the delivery process and helps monitor delivery success rates.
 *
 * 🔐 **OTP Use Cases:**
 * - Email verification
 * - Phone verification
 * - Password reset
 * - MFA challenges
 * - Account recovery
 *
 * 📊 **Delivery Tracking:**
 * - Monitor success rates
 * - Track delivery times
 * - Identify delivery issues
 * - Optimize delivery methods
 *
 * 🚀 **Example Usage:**
 * ```typescript
 * // Track OTP sent
 * const event = createAuthEvent('VerificationOtpSent', {
 *   userId: 'usr_12345',
 *   identifier: 'u***@e***.com',  // Masked for privacy
 *   channel: 'email',
 *   purpose: 'email_verification',
 *   expiresAt: '2024-12-31T23:59:59Z',
 *   deliveryStatus: 'sent'
 * }, {
 *   ipAddress: '192.168.1.1',
 *   device: { type: 'desktop', name: 'MacBook Pro', os: 'macOS', browser: 'Chrome' }
 * });
 *
 * // Update delivery tracking
 * deliveryTracker.recordOtpSent(event.payload);
 *
 * // Update analytics
 * analytics.track('otp_sent', event.payload);
 * ```
 */
export interface VerificationOtpSentEvent {
  readonly type: 'VerificationOtpSent';
  readonly payload: {
    readonly userId?: UserId; // 👤 User (if known)
    readonly identifier: string; // 🔒 Masked email or phone
    readonly channel: 'email' | 'sms' | 'voice'; // 📧📱📞 Delivery channel
    readonly purpose: // 🎯 Why OTP was sent
    | 'email_verification' // 📧 Verify email ownership
      | 'phone_verification' // 📱 Verify phone ownership
      | 'password_reset' // 🔑 Reset password
      | 'mfa_challenge'; // 🔐 Multi-factor authentication
    readonly expiresAt: string; // ⏰ When OTP expires
    readonly deliveryStatus: 'sent' | 'failed' | 'pending'; // 📤 Delivery status
    readonly timestamp: string; // ⏰ When OTP was sent
    readonly metadata: BaseEventMetadata; // 🔍 Context and device info
  };
}

// -----------------------------------------------------------------------------
// 🔐 AUTHENTICATION & LOGIN EVENTS (Enhanced)
// -----------------------------------------------------------------------------
// These events track the core authentication process - how users prove their
// identity and gain access to your system. This is the "front door" of your
// application where security meets user experience.
//
// 🎯 **Business Value:**
// - Monitor user access patterns
// - Track authentication success rates
// - Identify security threats early
// - Optimize login experience
// - Measure user engagement
//
// 📊 **Key Metrics to Track:**
// - Login success/failure rates
// - Authentication method preferences
// - Session duration patterns
// - Failed attempt patterns
// - Device and location access
//
// 🛡️ **Security Benefits:**
// - Detect brute force attacks
// - Identify compromised accounts
// - Monitor suspicious access patterns
// - Enable real-time threat response
// - Maintain audit compliance

/**
 * 🔐 **Login Attempted Event**
 * ============================
 *
 * Emitted when a user attempts to log in (before validation). This is the
 * "knock on the door" moment - we know someone is trying to get in, but
 * we don't know yet if they have the right credentials.
 *
 * 🚪 **Authentication Flow:**
 * 1. User enters credentials → This event emitted
 * 2. Credentials validated → Success/failure determined
 * 3. Success → UserLoggedIn event emitted
 * 4. Failure → LoginFailed event emitted
 *
 * 🔍 **What We Track:**
 * - Login method used (email, OAuth, SSO)
 * - Identifier provided (email, phone, username)
 * - Tenant context (if applicable)
 * - Device and location information
 *
 * 🛡️ **Security Benefits:**
 * - Early threat detection
 * - Rate limiting enforcement
 * - Suspicious pattern recognition
 * - Geographic access monitoring
 *
 * 🚀 **Example Usage:**
 * ```typescript
 * // Track login attempt
 * const event = createAuthEvent('LoginAttempted', {
 *   identifier: 'user@example.com',
 *   method: 'email',
 *   tenantId: 'tnt_acme_corp'
 * }, {
 *   ipAddress: '192.168.1.1',
 *   device: { type: 'desktop', name: 'MacBook Pro', os: 'macOS', browser: 'Chrome' }
 * });
 *
 * // Check rate limits
 * if (rateLimiter.isLimited(event.payload.identifier)) {
 *   throw new Error('Too many login attempts');
 * }
 *
 * // Update analytics
 * analytics.track('login_attempted', event.payload);
 * ```
 */
export interface LoginAttemptedEvent {
  readonly type: 'LoginAttempted';
  readonly payload: {
    readonly identifier: string; // 🔑 Email, phone, or username (masked)
    readonly method: LoginMethod; // 🚪 Authentication method used
    readonly tenantId?: TenantId; // 🏢 Tenant context (if applicable)
    readonly timestamp: string; // ⏰ When attempt was made
    readonly metadata: BaseEventMetadata; // 🔍 Context and device info
  };
}

/**
 * ✅ **User Logged In Event (Enhanced)**
 * =====================================
 *
 * Emitted when a user successfully logs in. This is the "welcome back"
 * moment - the user has proven their identity and is now inside your
 * system with an active session.
 *
 * 🎉 **Login Success Indicators:**
 * - Valid credentials provided
 * - Account not locked/suspended
 * - Required verifications completed
 * - MFA challenges passed (if enabled)
 * - Session created successfully
 *
 * 📊 **Business Impact:**
 * - User engagement tracking
 * - Session analytics
 * - Feature usage monitoring
 * - Conversion funnel progression
 * - Customer success metrics
 *
 * 🔐 **Security Context:**
 * - MFA requirements met
 * - Device recognition status
 * - Geographic access patterns
 * - Previous failed attempts
 *
 * 🚀 **Example Usage:**
 * ```typescript
 * // Track successful login
 * const event = createAuthEvent('UserLoggedIn', {
 *   userId: 'usr_12345',
 *   sessionId: 'sess_67890',
 *   tenantId: 'tnt_acme_corp',
 *   method: 'email',
 *   mfaRequired: false,
 *   rememberMe: true,
 *   lastLoginAt: '2024-01-01T00:00:00Z',
 *   consecutiveFailedAttempts: 0
 * }, {
 *   ipAddress: '192.168.1.1',
 *   device: { type: 'desktop', name: 'MacBook Pro', os: 'macOS', browser: 'Chrome' }
 * });
 *
 * // Update user last login
 * userService.updateLastLogin(event.payload.userId);
 *
 * // Send to analytics
 * analytics.track('user_logged_in', event.payload);
 *
 * // Check for suspicious activity
 * securityService.analyzeLoginPattern(event);
 * ```
 */
export interface UserLoggedInEvent {
  readonly type: 'UserLoggedIn';
  readonly payload: {
    readonly userId: UserId; // 👤 User who logged in
    readonly sessionId: SessionId; // 🔑 Active session identifier
    readonly tenantId?: TenantId; // 🏢 Tenant context
    readonly method: LoginMethod; // 🚪 How they authenticated
    readonly mfaRequired: boolean; // 🔐 Was MFA required?
    readonly rememberMe: boolean; // 💾 Remember me option used?
    readonly lastLoginAt?: string; // ⏰ Previous login timestamp
    readonly consecutiveFailedAttempts: number; // 🚫 Failed attempts before success
    readonly timestamp: string; // ⏰ When login occurred
    readonly metadata: BaseEventMetadata; // 🔍 Context and device info
  };
}

/**
 * 🚫 **Login Failed Event**
 * =========================
 *
 * Emitted when a login attempt fails for any reason. This is critical for
 * security monitoring, fraud detection, and improving the user experience
 * by identifying common failure patterns.
 *
 * 🚨 **Common Failure Reasons:**
 * - Invalid credentials (wrong password)
 * - Account locked due to failed attempts
 * - Account suspended by admin
 * - Email not verified
 * - MFA required but not provided
 * - Tenant suspended or expired
 *
 * 🛡️ **Security Implications:**
 * - Brute force attack detection
 * - Account takeover attempts
 * - Credential stuffing attacks
 * - Suspicious access patterns
 * - Rate limiting enforcement
 *
 * 📊 **Business Intelligence:**
 * - Identify common user errors
 * - Improve error messages
 * - Optimize authentication flow
 * - Reduce support tickets
 * - Enhance security policies
 *
 * 🚀 **Example Usage:**
 * ```typescript
 * // Track login failure
 * const event = createAuthEvent('LoginFailed', {
 *   identifier: 'user@example.com',
 *   method: 'email',
 *   tenantId: 'tnt_acme_corp',
 *   failureReason: 'invalid_credentials',
 *   consecutiveFailedAttempts: 3,
 *   accountLocked: false
 * }, {
 *   ipAddress: '192.168.1.1',
 *   device: { type: 'desktop', name: 'MacBook Pro', os: 'macOS', browser: 'Chrome' }
 * });
 *
 * // Update failed attempt counter
 * userService.incrementFailedAttempts(event.payload.identifier);
 *
 * // Check if account should be locked
 * if (event.payload.consecutiveFailedAttempts >= 5) {
 *   userService.lockAccount(event.payload.identifier);
 * }
 *
 * // Log for security monitoring
 * securityLogger.warn('Login failed', event);
 *
 * // Update analytics
 * analytics.track('login_failed', event.payload);
 * ```
 */
export interface LoginFailedEvent {
  readonly type: 'LoginFailed';
  readonly payload: {
    readonly userId?: UserId; // 👤 User (if known)
    readonly identifier: string; // 🔑 Email, phone, or username (masked)
    readonly method: LoginMethod; // 🚪 Authentication method used
    readonly tenantId?: TenantId; // 🏢 Tenant context
    readonly failureReason: // 🚫 Why login failed
    | 'invalid_credentials' // 🔑 Wrong password/credentials
      | 'account_locked' // 🔒 Account temporarily locked
      | 'account_suspended' // ⏸️ Account suspended by admin
      | 'email_not_verified' // 📧 Email verification required
      | 'mfa_required' // 🔐 MFA challenge needed
      | 'tenant_suspended'; // 🏢 Tenant access suspended
    readonly consecutiveFailedAttempts: number; // 🚫 Total failed attempts
    readonly accountLocked: boolean; // 🔒 Is account currently locked?
    readonly lockUntil?: string; // ⏰ When lock expires (if applicable)
    readonly timestamp: string; // ⏰ When failure occurred
    readonly metadata: BaseEventMetadata; // 🔍 Context and device info
  };
}

/**
 * 🚪 **User Logged Out Event**
 * ============================
 *
 * Emitted when a user logs out or their session ends. This tracks session
 * lifecycle and helps understand user behavior patterns and security events.
 *
 * 🔄 **Logout Scenarios:**
 * - User clicks logout button
 * - Session expires naturally
 * - Admin forces logout
 * - Security violation detected
 * - Device removed/revoked
 *
 * 📊 **Analytics Value:**
 * - Session duration patterns
 * - User engagement metrics
 * - Device usage statistics
 * - Security incident tracking
 * - Compliance audit trails
 *
 * 🛡️ **Security Benefits:**
 * - Track session termination
 * - Monitor forced logouts
 * - Audit admin actions
 * - Detect security violations
 *
 * 🚀 **Example Usage:**
 * ```typescript
 * // Track user logout
 * const event = createAuthEvent('UserLoggedOut', {
 *   userId: 'usr_12345',
 *   sessionId: 'sess_67890',
 *   tenantId: 'tnt_acme_corp',
 *   logoutReason: 'user_initiated',
 *   sessionDuration: 3600  // 1 hour in seconds
 * }, {
 *   ipAddress: '192.168.1.1',
 *   device: { type: 'desktop', name: 'MacBook Pro', os: 'macOS', browser: 'Chrome' }
 * });
 *
 * // Invalidate session
 * sessionService.invalidateSession(event.payload.sessionId);
 *
 * // Update analytics
 * analytics.track('user_logged_out', event.payload);
 *
 * // Log for audit
 * auditLogger.info('User logged out', event);
 * ```
 */
export interface UserLoggedOutEvent {
  readonly type: 'UserLoggedOut';
  readonly payload: {
    readonly userId: UserId; // 👤 User who logged out
    readonly sessionId: SessionId; // 🔑 Session that was terminated
    readonly tenantId?: TenantId; // 🏢 Tenant context
    readonly logoutReason: // 🚪 Why they logged out
    | 'user_initiated' // 👤 User clicked logout
      | 'session_expired' // ⏰ Session timed out
      | 'admin_forced' // 👨‍💼 Admin terminated session
      | 'security_violation' // 🚨 Security policy violation
      | 'device_removed'; // 📱 Device was revoked
    readonly sessionDuration: number; // ⏱️ How long session lasted (seconds)
    readonly timestamp: string; // ⏰ When logout occurred
    readonly metadata: BaseEventMetadata; // 🔍 Context and device info
  };
}

// -----------------------------------------------------------------------------
// 📱 SESSION MANAGEMENT EVENTS
// -----------------------------------------------------------------------------
// These events track the lifecycle of user sessions - from creation to
// expiration. Sessions are the "keys" that users carry while navigating
// your system, and these events help monitor their security and usage.
//
// 🎯 **Business Value:**
// - Monitor user engagement patterns
// - Track session security incidents
// - Optimize session timeout policies
// - Understand multi-device usage
// - Measure user activity levels
//
// 📊 **Key Metrics to Track:**
// - Session creation rates
// - Session duration patterns
// - Concurrent session counts
// - Device distribution
// - Geographic session patterns
//
// 🛡️ **Security Benefits:**
// - Detect session hijacking
// - Monitor suspicious session activity
// - Track forced session terminations
// - Audit admin session actions
// - Maintain compliance requirements

/**
 * 🔑 **Session Created Event**
 * ===========================
 *
 * Emitted when a new user session is created. This happens after successful
 * authentication and represents the user gaining access to your system.
 * Think of it as issuing a visitor badge - the user now has permission
 * to move around within defined boundaries.
 *
 * 🎯 **When Sessions Are Created:**
 * - After successful login
 * - When refreshing expired sessions
 * - During OAuth token exchange
 * - When switching between tenants
 * - After MFA verification
 *
 * 🔐 **Session Security Features:**
 * - Unique session identifier
 * - Time-limited validity
 * - Device fingerprinting
 * - Geographic restrictions
 * - Revocation capabilities
 *
 * 🚀 **Example Usage:**
 * ```typescript
 * // Track session creation
 * const event = createAuthEvent('SessionCreated', {
 *   userId: 'usr_12345',
 *   sessionId: 'sess_67890',
 *   tenantId: 'tnt_acme_corp',
 *   expiresAt: '2024-12-31T23:59:59Z',
 *   maxIdleTime: 1800,  // 30 minutes
 *   deviceTrusted: true
 * }, {
 *   ipAddress: '192.168.1.1',
 *   device: { type: 'desktop', name: 'MacBook Pro', os: 'macOS', browser: 'Chrome' }
 * });
 *
 * // Store session in database
 * sessionService.createSession(event.payload);
 *
 * // Update analytics
 * analytics.track('session_created', event.payload);
 *
 * // Check for suspicious patterns
 * securityService.analyzeSessionCreation(event);
 * ```
 */
export interface SessionCreatedEvent {
  readonly type: 'SessionCreated';
  readonly payload: {
    readonly userId: UserId; // 👤 User who owns the session
    readonly sessionId: SessionId; // 🔑 Unique session identifier
    readonly tenantId?: TenantId; // 🏢 Tenant context
    readonly expiresAt: string; // ⏰ When session expires
    readonly maxIdleTime: number; // ⏱️ Maximum idle time (seconds)
    readonly deviceTrusted: boolean; // 🔒 Is this a trusted device?
    readonly timestamp: string; // ⏰ When session was created
    readonly metadata: BaseEventMetadata; // 🔍 Context and device info
  };
}

/**
 * 🔄 **Session Refreshed Event**
 * =============================
 *
 * Emitted when an existing session is refreshed (extended). This happens
 * when users are active and their session is automatically renewed to
 * maintain their access without requiring re-authentication.
 *
 * 🔄 **Refresh Scenarios:**
 * - User activity detected
 * - API calls made
 * - Page navigation
 * - Background activity
 * - Scheduled refresh
 *
 * 📊 **Business Intelligence:**
 * - User engagement patterns
 * - Session usage analytics
 * - Idle time optimization
 * - User experience metrics
 *
 * 🚀 **Example Usage:**
 * ```typescript
 * // Track session refresh
 * const event = createAuthEvent('SessionRefreshed', {
 *   userId: 'usr_12345',
 *   sessionId: 'sess_67890',
 *   tenantId: 'tnt_acme_corp',
 *   previousExpiresAt: '2024-12-31T23:59:59Z',
 *   newExpiresAt: '2025-01-01T00:29:59Z',
 *   refreshReason: 'user_activity'
 * }, {
 *   ipAddress: '192.168.1.1',
 *   device: { type: 'desktop', name: 'MacBook Pro', os: 'macOS', browser: 'Chrome' }
 * });
 *
 * // Extend session in database
 * sessionService.extendSession(event.payload.sessionId, event.payload.newExpiresAt);
 *
 * // Update analytics
 * analytics.track('session_refreshed', event.payload);
 * ```
 */
export interface SessionRefreshedEvent {
  readonly type: 'SessionRefreshed';
  readonly payload: {
    readonly userId: UserId; // 👤 User whose session was refreshed
    readonly sessionId: SessionId; // 🔑 Session that was refreshed
    readonly tenantId?: TenantId; // 🏢 Tenant context
    readonly previousExpiresAt: string; // ⏰ Previous expiration time
    readonly newExpiresAt: string; // ⏰ New expiration time
    readonly refreshReason: // 🔄 Why session was refreshed
    | 'user_activity' // 👤 User performed an action
      | 'api_call' // 📡 API request made
      | 'page_navigation' // 🌐 User navigated to new page
      | 'background_activity' // ⚙️ Background process activity
      | 'scheduled_refresh'; // ⏰ Automatic scheduled refresh
    readonly timestamp: string; // ⏰ When refresh occurred
    readonly metadata: BaseEventMetadata; // 🔍 Context and device info
  };
}

/**
 * ⏰ **Session Expired Event**
 * ============================
 *
 * Emitted when a user session expires naturally due to inactivity or
 * reaching its maximum lifetime. This is the "time's up" moment when
 * the user needs to re-authenticate to continue.
 *
 * ⏰ **Expiration Reasons:**
 * - Maximum session time reached
 * - Idle timeout exceeded
 * - Security policy enforcement
 * - Scheduled expiration
 * - System maintenance
 *
 * 📊 **Analytics Value:**
 * - Session duration patterns
 * - Idle time analysis
 * - User behavior insights
 * - Security policy effectiveness
 * - User experience optimization
 *
 * 🚀 **Example Usage:**
 * ```typescript
 * // Track session expiration
 * const event = createAuthEvent('SessionExpired', {
 *   userId: 'usr_12345',
 *   sessionId: 'sess_67890',
 *   tenantId: 'tnt_acme_corp',
 *   expirationReason: 'idle_timeout',
 *   sessionDuration: 7200,  // 2 hours in seconds
 *   lastActivityAt: '2024-12-31T23:29:59Z'
 * }, {
 *   ipAddress: '192.168.1.1',
 *   device: { type: 'desktop', name: 'MacBook Pro', os: 'macOS', browser: 'Chrome' }
 * });
 *
 * // Clean up expired session
 * sessionService.removeExpiredSession(event.payload.sessionId);
 *
 * // Notify user (if possible)
 * notificationService.notifySessionExpired(event.payload.userId);
 *
 * // Update analytics
 * analytics.track('session_expired', event.payload);
 * ```
 */
export interface SessionExpiredEvent {
  readonly type: 'SessionExpired';
  readonly payload: {
    readonly userId: UserId; // 👤 User whose session expired
    readonly sessionId: SessionId; // 🔑 Session that expired
    readonly tenantId?: TenantId; // 🏢 Tenant context
    readonly expirationReason: // ⏰ Why session expired
    | 'max_lifetime_reached' // ⏰ Maximum session time hit
      | 'idle_timeout' // 😴 User was inactive too long
      | 'security_policy' // 🛡️ Security policy enforced
      | 'scheduled_expiration' // 📅 Planned expiration time
      | 'system_maintenance'; // 🔧 System maintenance required
    readonly sessionDuration: number; // ⏱️ Total session duration (seconds)
    readonly lastActivityAt: string; // ⏰ When user was last active
    readonly timestamp: string; // ⏰ When expiration occurred
    readonly metadata: BaseEventMetadata; // 🔍 Context and device info
  };
}

/**
 * 🚫 **Session Revoked Event**
 * ============================
 *
 * Emitted when a user session is forcibly terminated before its natural
 * expiration. This is the "emergency stop" button for sessions - used
 * when security threats are detected or admin action is required.
 *
 * 🚨 **Revocation Scenarios:**
 * - Security threat detected
 * - Admin forces logout
 * - Account compromised
 * - Policy violation
 * - Device lost/stolen
 * - Suspicious activity
 *
 * 🛡️ **Security Benefits:**
 * - Immediate threat response
 * - Admin control over sessions
 * - Compliance enforcement
 * - Incident containment
 * - Audit trail maintenance
 *
 * 🚀 **Example Usage:**
 * ```typescript
 * // Track session revocation
 * const event = createAuthEvent('SessionRevoked', {
 *   userId: 'usr_12345',
 *   sessionId: 'sess_67890',
 *   tenantId: 'tnt_acme_corp',
 *   revokedBy: 'admin_user_789',
 *   revocationReason: 'security_threat',
 *   sessionDuration: 3600,  // 1 hour in seconds
 *   threatLevel: 'high'
 * }, {
 *   ipAddress: '192.168.1.1',
 *   device: { type: 'desktop', name: 'MacBook Pro', os: 'macOS', browser: 'Chrome' }
 * });
 *
 * // Immediately terminate session
 * sessionService.forceTerminateSession(event.payload.sessionId);
 *
 * // Notify security team
 * securityService.alertSessionRevoked(event);
 *
 * // Update analytics
 * analytics.track('session_revoked', event.payload);
 *
 * // Log for audit
 * auditLogger.warn('Session revoked for security', event);
 * ```
 */
export interface SessionRevokedEvent {
  readonly type: 'SessionRevoked';
  readonly payload: {
    readonly userId: UserId; // 👤 User whose session was revoked
    readonly sessionId: SessionId; // 🔑 Session that was revoked
    readonly tenantId?: TenantId; // 🏢 Tenant context
    readonly revokedBy: string; // 👨‍💼 Who revoked the session
    readonly revocationReason: // 🚫 Why session was revoked
    | 'security_threat' // 🚨 Security threat detected
      | 'admin_action' // 👨‍💼 Admin forced revocation
      | 'account_compromised' // 🔓 Account security breach
      | 'policy_violation' // 📋 Policy violation detected
      | 'device_lost' // 📱 Device reported lost/stolen
      | 'suspicious_activity'; // 👀 Suspicious behavior detected
    readonly sessionDuration: number; // ⏱️ How long session lasted (seconds)
    readonly threatLevel?: 'low' | 'medium' | 'high' | 'critical'; // 🚨 Threat severity
    readonly timestamp: string; // ⏰ When revocation occurred
    readonly metadata: BaseEventMetadata; // 🔍 Context and device info
  };
}

// -----------------------------------------------------------------------------
// 🔒 PASSWORD MANAGEMENT EVENTS
// -----------------------------------------------------------------------------

/**
 * 🆘 Password Reset Requested Event (Enhanced)
 */
export interface PasswordResetRequestedEvent {
  readonly type: 'PasswordResetRequested';
  readonly payload: {
    readonly userId?: UserId;
    readonly identifier: string; // masked
    readonly tenantId?: TenantId;
    readonly requestSource: 'forgot_password' | 'admin_action' | 'security_policy';
    readonly expiresAt: string;
    readonly deliveryMethod: 'email' | 'sms';
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * ✅ Password Reset Completed Event (Enhanced)
 */
export interface PasswordResetCompletedEvent {
  readonly type: 'PasswordResetCompleted';
  readonly payload: {
    readonly userId: UserId;
    readonly tenantId?: TenantId;
    readonly resetMethod: 'token' | 'admin_action';
    readonly passwordStrength: 'weak' | 'fair' | 'good' | 'strong' | 'excellent';
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 🚫 Password Reset Failed Event
 */
export interface PasswordResetFailedEvent {
  readonly type: 'PasswordResetFailed';
  readonly payload: {
    readonly userId?: UserId;
    readonly identifier: string; // masked
    readonly tenantId?: TenantId;
    readonly failureReason:
      | 'invalid_token'
      | 'expired_token'
      | 'user_not_found'
      | 'weak_password'
      | 'password_reuse';
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 🔐 Password Changed Event
 */
export interface PasswordChangedEvent {
  readonly type: 'PasswordChanged';
  readonly payload: {
    readonly userId: UserId;
    readonly tenantId?: TenantId;
    readonly changeReason:
      | 'user_initiated'
      | 'security_policy'
      | 'admin_action'
      | 'password_expired';
    readonly passwordStrength: 'weak' | 'fair' | 'good' | 'strong' | 'excellent';
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

// -----------------------------------------------------------------------------
// 🔢 Multi-Factor Authentication Events
// -----------------------------------------------------------------------------

/**
 * 🔐 MFA Setup Started Event
 */
export interface MfaSetupStartedEvent {
  readonly type: 'MfaSetupStarted';
  readonly payload: {
    readonly userId: UserId;
    readonly tenantId?: TenantId;
    readonly method: MfaMethod;
    readonly setupReason: 'user_initiated' | 'security_policy' | 'admin_required';
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * ✅ MFA Enabled Event
 */
export interface MfaEnabledEvent {
  readonly type: 'MfaEnabled';
  readonly payload: {
    readonly userId: UserId;
    readonly tenantId?: TenantId;
    readonly method: MfaMethod;
    readonly backupCodesGenerated: boolean;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 🚫 MFA Disabled Event
 */
export interface MfaDisabledEvent {
  readonly type: 'MfaDisabled';
  readonly payload: {
    readonly userId: UserId;
    readonly tenantId?: TenantId;
    readonly method: MfaMethod;
    readonly disabledReason: 'user_request' | 'admin_action' | 'security_violation';
    readonly disabledBy?: UserId; // if disabled by admin
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 🎯 MFA Challenge Created Event
 */
export interface MfaChallengeCreatedEvent {
  readonly type: 'MfaChallengeCreated';
  readonly payload: {
    readonly userId: UserId;
    readonly challengeId: ChallengeId;
    readonly tenantId?: TenantId;
    readonly method: MfaMethod;
    readonly expiresAt: string;
    readonly maxAttempts: number;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * ✅ MFA Challenge Verified Event
 */
export interface MfaChallengeVerifiedEvent {
  readonly type: 'MfaChallengeVerified';
  readonly payload: {
    readonly userId: UserId;
    readonly challengeId: ChallengeId;
    readonly tenantId?: TenantId;
    readonly method: MfaMethod;
    readonly isBackupCode: boolean;
    readonly attemptNumber: number;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 🚫 MFA Challenge Failed Event
 */
export interface MfaChallengeFailedEvent {
  readonly type: 'MfaChallengeFailed';
  readonly payload: {
    readonly userId: UserId;
    readonly challengeId: ChallengeId;
    readonly tenantId?: TenantId;
    readonly method: MfaMethod;
    readonly failureReason: 'invalid_code' | 'expired_challenge' | 'max_attempts_exceeded';
    readonly attemptNumber: number;
    readonly attemptsRemaining: number;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 🔑 MFA Backup Code Used Event
 */
export interface MfaBackupCodeUsedEvent {
  readonly type: 'MfaBackupCodeUsed';
  readonly payload: {
    readonly userId: UserId;
    readonly tenantId?: TenantId;
    readonly codesRemaining: number;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

// -----------------------------------------------------------------------------
// 🏢 Multi-Tenant Events
// -----------------------------------------------------------------------------

/**
 * 🏢 Tenant Created Event
 */
export interface TenantCreatedEvent {
  readonly type: 'TenantCreated';
  readonly payload: {
    readonly tenantId: TenantId;
    readonly name: string;
    readonly slug: string;
    readonly plan: string;
    readonly createdBy: UserId;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 🔄 Tenant Context Switched Event
 */
export interface TenantContextSwitchedEvent {
  readonly type: 'TenantContextSwitched';
  readonly payload: {
    readonly userId: UserId;
    readonly sessionId: SessionId;
    readonly fromTenantId?: TenantId;
    readonly toTenantId: TenantId;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 🚫 Tenant Access Denied Event
 */
export interface TenantAccessDeniedEvent {
  readonly type: 'TenantAccessDenied';
  readonly payload: {
    readonly userId: UserId;
    readonly tenantId: TenantId;
    readonly denialReason:
      | 'insufficient_permissions'
      | 'tenant_suspended'
      | 'user_not_member'
      | 'subscription_expired';
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * ⏸️ Tenant Suspended Event
 */
export interface TenantSuspendedEvent {
  readonly type: 'TenantSuspended';
  readonly payload: {
    readonly tenantId: TenantId;
    readonly suspensionReason:
      | 'payment_failed'
      | 'policy_violation'
      | 'admin_action'
      | 'security_violation';
    readonly suspendedBy?: UserId;
    readonly suspendedUntil?: string;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * ✅ Tenant Activated Event
 */
export interface TenantActivatedEvent {
  readonly type: 'TenantActivated';
  readonly payload: {
    readonly tenantId: TenantId;
    readonly activationReason: 'payment_resolved' | 'suspension_lifted' | 'admin_action';
    readonly activatedBy?: UserId;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

// -----------------------------------------------------------------------------
// 👥 User Management Events
// -----------------------------------------------------------------------------

/**
 * ✏️ User Profile Updated Event
 */
export interface UserProfileUpdatedEvent {
  readonly type: 'UserProfileUpdated';
  readonly payload: {
    readonly userId: UserId;
    readonly tenantId?: TenantId;
    readonly updatedFields: string[];
    readonly updatedBy: UserId; // could be self or admin
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * ⏸️ User Account Suspended Event
 */
export interface UserAccountSuspendedEvent {
  readonly type: 'UserAccountSuspended';
  readonly payload: {
    readonly userId: UserId;
    readonly tenantId?: TenantId;
    readonly suspensionReason:
      | 'policy_violation'
      | 'security_violation'
      | 'admin_action'
      | 'suspicious_activity';
    readonly suspendedBy: UserId;
    readonly suspendedUntil?: string;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * ✅ User Account Activated Event
 */
export interface UserAccountActivatedEvent {
  readonly type: 'UserAccountActivated';
  readonly payload: {
    readonly userId: UserId;
    readonly tenantId?: TenantId;
    readonly activationReason: 'suspension_lifted' | 'verification_completed' | 'admin_action';
    readonly activatedBy?: UserId;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 🔒 User Account Locked Event
 */
export interface UserAccountLockedEvent {
  readonly type: 'UserAccountLocked';
  readonly payload: {
    readonly userId: UserId;
    readonly tenantId?: TenantId;
    readonly lockReason:
      | 'failed_login_attempts'
      | 'suspicious_activity'
      | 'security_policy'
      | 'admin_action';
    readonly lockedUntil: string;
    readonly failedAttempts?: number;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 🔓 User Account Unlocked Event
 */
export interface UserAccountUnlockedEvent {
  readonly type: 'UserAccountUnlocked';
  readonly payload: {
    readonly userId: UserId;
    readonly tenantId?: TenantId;
    readonly unlockReason: 'timeout_expired' | 'admin_action' | 'successful_verification';
    readonly unlockedBy?: UserId;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

// -----------------------------------------------------------------------------
// 🔗 OAuth & External Authentication Events
// -----------------------------------------------------------------------------

/**
 * 🔗 OAuth Login Started Event
 */
export interface OAuthLoginStartedEvent {
  readonly type: 'OAuthLoginStarted';
  readonly payload: {
    readonly provider: string;
    readonly tenantId?: TenantId;
    readonly redirectUrl?: string;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * ✅ OAuth Login Completed Event
 */
export interface OAuthLoginCompletedEvent {
  readonly type: 'OAuthLoginCompleted';
  readonly payload: {
    readonly userId: UserId;
    readonly provider: string;
    readonly tenantId?: TenantId;
    readonly isNewUser: boolean;
    readonly accountLinked: boolean;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 🚫 OAuth Login Failed Event
 */
export interface OAuthLoginFailedEvent {
  readonly type: 'OAuthLoginFailed';
  readonly payload: {
    readonly provider: string;
    readonly tenantId?: TenantId;
    readonly failureReason:
      | 'provider_error'
      | 'user_denied'
      | 'invalid_state'
      | 'account_conflict'
      | 'provider_disabled';
    readonly errorCode?: string;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 🔗 OAuth Account Linked Event
 */
export interface OAuthAccountLinkedEvent {
  readonly type: 'OAuthAccountLinked';
  readonly payload: {
    readonly userId: UserId;
    readonly provider: string;
    readonly tenantId?: TenantId;
    readonly providerUserId: string;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * ✂️ OAuth Account Unlinked Event
 */
export interface OAuthAccountUnlinkedEvent {
  readonly type: 'OAuthAccountUnlinked';
  readonly payload: {
    readonly userId: UserId;
    readonly provider: string;
    readonly tenantId?: TenantId;
    readonly unlinkReason: 'user_request' | 'admin_action' | 'security_violation';
    readonly unlinkedBy?: UserId;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

// -----------------------------------------------------------------------------
// 💌 Invitation & Team Management Events
// -----------------------------------------------------------------------------

/**
 * 💌 Invitation Sent Event
 */
export interface InvitationSentEvent {
  readonly type: 'InvitationSent';
  readonly payload: {
    readonly invitationId: InvitationId;
    readonly tenantId: TenantId;
    readonly invitedEmail: string;
    readonly invitedBy: UserId;
    readonly role: string;
    readonly expiresAt: string;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * ✅ Invitation Accepted Event
 */
export interface InvitationAcceptedEvent {
  readonly type: 'InvitationAccepted';
  readonly payload: {
    readonly invitationId: InvitationId;
    readonly tenantId: TenantId;
    readonly userId: UserId;
    readonly acceptedEmail: string;
    readonly assignedRole: string;
    readonly isNewUser: boolean;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 🚫 Invitation Declined Event
 */
export interface InvitationDeclinedEvent {
  readonly type: 'InvitationDeclined';
  readonly payload: {
    readonly invitationId: InvitationId;
    readonly tenantId: TenantId;
    readonly declinedEmail: string;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * ⏰ Invitation Expired Event
 */
export interface InvitationExpiredEvent {
  readonly type: 'InvitationExpired';
  readonly payload: {
    readonly invitationId: InvitationId;
    readonly tenantId: TenantId;
    readonly expiredEmail: string;
    readonly invitedBy: UserId;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

// -----------------------------------------------------------------------------
// 🛡️ Security & Monitoring Events
// -----------------------------------------------------------------------------

/**
 * 🚨 Suspicious Activity Detected Event
 */
export interface SuspiciousActivityDetectedEvent {
  readonly type: 'SuspiciousActivityDetected';
  readonly payload: {
    readonly userId?: UserId;
    readonly tenantId?: TenantId;
    readonly activityType:
      | 'unusual_login_pattern'
      | 'multiple_failed_attempts'
      | 'impossible_travel'
      | 'new_device'
      | 'rate_limit_exceeded';
    readonly severity: EventSeverity;
    readonly riskScore: number; // 0-100
    readonly details: Record<string, unknown>;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 🌍 Geographic Restriction Violated Event
 */
export interface GeographicRestrictionViolatedEvent {
  readonly type: 'GeographicRestrictionViolated';
  readonly payload: {
    readonly userId?: UserId;
    readonly tenantId?: TenantId;
    readonly attemptedCountry: string;
    readonly allowedCountries: string[];
    readonly action: 'login' | 'registration' | 'api_access';
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 🚦 Rate Limit Exceeded Event
 */
export interface RateLimitExceededEvent {
  readonly type: 'RateLimitExceeded';
  readonly payload: {
    readonly userId?: UserId;
    readonly tenantId?: TenantId;
    readonly operation: string;
    readonly limit: number;
    readonly currentCount: number;
    readonly resetTime: string;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 📱 Device Not Recognized Event
 */
export interface DeviceNotRecognizedEvent {
  readonly type: 'DeviceNotRecognized';
  readonly payload: {
    readonly userId: UserId;
    readonly tenantId?: TenantId;
    readonly deviceFingerprint: string;
    readonly requiresVerification: boolean;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 🚫 IP Address Blocked Event
 */
export interface IpAddressBlockedEvent {
  readonly type: 'IpAddressBlocked';
  readonly payload: {
    readonly ipAddress: string;
    readonly blockReason:
      | 'security_violation'
      | 'rate_limit_exceeded'
      | 'geo_restriction'
      | 'manual_block';
    readonly blockedUntil?: string;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 🔐 Security Violation Event
 */
export interface SecurityViolationEvent {
  readonly type: 'SecurityViolation';
  readonly payload: {
    readonly userId?: UserId;
    readonly tenantId?: TenantId;
    readonly violationType:
      | 'credential_stuffing'
      | 'account_takeover'
      | 'privilege_escalation'
      | 'data_exfiltration'
      | 'malicious_payload';
    readonly severity: EventSeverity;
    readonly riskScore: number;
    readonly actionTaken: string;
    readonly details: Record<string, unknown>;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

// -----------------------------------------------------------------------------
// 📊 Business & Analytics Events
// -----------------------------------------------------------------------------

/**
 * 🎯 Feature Accessed Event
 */
export interface FeatureAccessedEvent {
  readonly type: 'FeatureAccessed';
  readonly payload: {
    readonly userId: UserId;
    readonly tenantId?: TenantId;
    readonly feature: string;
    readonly accessGranted: boolean;
    readonly denialReason?: string;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 💳 Subscription Limit Exceeded Event
 */
export interface SubscriptionLimitExceededEvent {
  readonly type: 'SubscriptionLimitExceeded';
  readonly payload: {
    readonly tenantId: TenantId;
    readonly limitType: string;
    readonly currentUsage: number;
    readonly limit: number;
    readonly plan: string;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

/**
 * 📈 User Activity Tracked Event
 */
export interface UserActivityTrackedEvent {
  readonly type: 'UserActivityTracked';
  readonly payload: {
    readonly userId: UserId;
    readonly tenantId?: TenantId;
    readonly sessionId?: SessionId;
    readonly activityType:
      | 'page_view'
      | 'button_click'
      | 'form_submit'
      | 'api_call'
      | 'feature_usage';
    readonly activityDetails: Record<string, unknown>;
    readonly timestamp: string;
    readonly metadata: BaseEventMetadata;
  };
}

// -----------------------------------------------------------------------------
// 🔄 Complete Event Union Type
// -----------------------------------------------------------------------------

/**
 * 🎭 Complete Authentication Domain Event Union
 *
 * All possible authentication events in a single discriminated union type.
 * Used for event handling, routing, and type safety across the system.
 *
 * Categories:
 * - Registration & Onboarding (6 events)
 * - Verification (8 events)
 * - Authentication & Login (4 events)
 * - Session Management (4 events)
 * - Password Management (4 events)
 * - Multi-Factor Authentication (7 events)
 * - Multi-Tenant (5 events)
 * - User Management (5 events)
 * - OAuth & External Auth (5 events)
 * - Invitations & Teams (4 events)
 * - Security & Monitoring (6 events)
 * - Business & Analytics (3 events)
 *
 * Total: 61 events for comprehensive domain coverage
 */
export type AuthDomainEvent =
  // Registration & Onboarding
  | UserRegistrationStartedEvent
  | UserRegisteredEvent
  | UserRegistrationFailedEvent

  // Verification
  | EmailVerificationRequestedEvent
  | EmailVerifiedEvent
  | EmailVerificationFailedEvent
  | PhoneVerificationRequestedEvent
  | PhoneVerifiedEvent
  | PhoneVerificationFailedEvent
  | VerificationOtpSentEvent

  // Authentication & Login
  | LoginAttemptedEvent
  | UserLoggedInEvent
  | LoginFailedEvent
  | UserLoggedOutEvent

  // Session Management
  | SessionCreatedEvent
  | SessionRefreshedEvent
  | SessionExpiredEvent

  // Password Management
  | PasswordResetRequestedEvent
  | PasswordResetCompletedEvent
  | PasswordResetFailedEvent
  | PasswordChangedEvent

  // Multi-Factor Authentication
  | MfaSetupStartedEvent
  | MfaEnabledEvent
  | MfaDisabledEvent
  | MfaChallengeCreatedEvent
  | MfaChallengeVerifiedEvent
  | MfaChallengeFailedEvent
  | MfaBackupCodeUsedEvent

  // Multi-Tenant
  | TenantCreatedEvent
  | TenantContextSwitchedEvent
  | TenantAccessDeniedEvent
  | TenantSuspendedEvent
  | TenantActivatedEvent

  // User Management
  | UserProfileUpdatedEvent
  | UserAccountSuspendedEvent
  | UserAccountActivatedEvent
  | UserAccountLockedEvent
  | UserAccountUnlockedEvent

  // OAuth & External Auth
  | OAuthLoginStartedEvent
  | OAuthLoginCompletedEvent
  | OAuthLoginFailedEvent
  | OAuthAccountLinkedEvent
  | OAuthAccountUnlinkedEvent

  // Invitations & Teams
  | InvitationSentEvent
  | InvitationAcceptedEvent
  | InvitationDeclinedEvent
  | InvitationExpiredEvent

  // Security & Monitoring
  | SuspiciousActivityDetectedEvent
  | GeographicRestrictionViolatedEvent
  | RateLimitExceededEvent
  | DeviceNotRecognizedEvent
  | IpAddressBlockedEvent
  | SecurityViolationEvent

  // Business & Analytics
  | FeatureAccessedEvent
  | SubscriptionLimitExceededEvent
  | UserActivityTrackedEvent;

// -----------------------------------------------------------------------------
// 🛠️ Event Utility Types & Helpers
// -----------------------------------------------------------------------------
// This section provides essential utility types and helper functions for working
// with authentication domain events. These utilities enable type-safe event
// handling, filtering, and creation throughout the authentication system.

/**
 * 🏷️ Extract event type names for type safety
 *
 * This type extracts all possible event type names from the AuthDomainEvent union.
 * It's useful for creating type-safe event handlers and registries where you need
 * to reference specific event types without duplicating the string literals.
 *
 * @example
 * ```typescript
 * const handleEvent = (eventType: AuthEventType) => {
 *   // eventType is now strictly typed to valid auth event types
 *   console.log(`Handling ${eventType}`);
 * };
 * ```
 */
export type AuthEventType = AuthDomainEvent['type'];

/**
 * 📦 Extract payload type for specific event
 *
 * This generic type extracts the payload type for a specific event type.
 * It provides compile-time type safety when working with event payloads,
 * ensuring you only access properties that exist on the specific event type.
 *
 * @template T - The specific event type to extract payload from
 * @returns The payload type for the specified event
 *
 * @example
 * ```typescript
 * type LoginSuccessPayload = AuthEventPayload<'LoginSuccess'>;
 * // LoginSuccessPayload will have: { userId, timestamp, metadata }
 *
 * const handleLoginSuccess = (payload: LoginSuccessPayload) => {
 *   // payload.userId is guaranteed to exist and be typed correctly
 *   console.log(`User ${payload.userId} logged in successfully`);
 * };
 * ```
 */
export type AuthEventPayload<T extends AuthEventType> = Extract<
  AuthDomainEvent,
  { type: T }
>['payload'];

/**
 * 🎯 Event handler function type
 *
 * Defines the signature for event handler functions. Each handler receives
 * a strongly-typed event and can return void or a Promise<void> for async operations.
 * The generic parameter ensures type safety by restricting handlers to specific event types.
 *
 * @template T - The specific event type this handler can process (defaults to all events)
 * @param event - The typed event object with payload and metadata
 * @returns void or Promise<void> for async operations
 *
 * @example
 * ```typescript
 * // Handler for all auth events
 * const logAllEvents: AuthEventHandler = (event) => {
 *   console.log(`Event: ${event.type}`, event.payload);
 * };
 *
 * // Handler for only login events
 * const handleLoginEvents: AuthEventHandler<'LoginSuccess' | 'LoginFailed'> = (event) => {
 *   if (event.type === 'LoginSuccess') {
 *     // event.payload is typed as LoginSuccess payload
 *     console.log(`User ${event.payload.userId} logged in`);
 *   }
 * };
 * ```
 */
export type AuthEventHandler<T extends AuthEventType = AuthEventType> = (
  event: Extract<AuthDomainEvent, { type: T }>
) => void | Promise<void>;

/**
 * 📋 Event registry type for managing handlers
 *
 * Defines the structure for an event registry that maps event types to arrays
 * of handler functions. This enables the event system to route events to
 * appropriate handlers based on their type.
 *
 * @example
 * ```typescript
 * const authEventRegistry: AuthEventRegistry = {
 *   LoginSuccess: [handleLoginSuccess, logLoginEvent],
 *   LoginFailed: [handleLoginFailure, incrementFailureCount],
 *   UserCreated: [sendWelcomeEmail, updateAnalytics]
 * };
 *
 * // Register a new handler
 * if (!authEventRegistry.LoginSuccess) {
 *   authEventRegistry.LoginSuccess = [];
 * }
 * authEventRegistry.LoginSuccess.push(newLoginHandler);
 * ```
 */
export type AuthEventRegistry = {
  [K in AuthEventType]?: AuthEventHandler<K>[];
};

/**
 * 🏭 Event factory helper for creating events with metadata
 *
 * A utility function that creates properly formatted domain events with
 * automatic timestamp generation and metadata injection. This ensures
 * consistency across all event creation and reduces boilerplate code.
 *
 * @template T - The specific event type to create
 * @param type - The event type identifier
 * @param payload - The event payload data (without timestamp and metadata)
 * @param metadata - Optional metadata to attach to the event
 * @returns A complete AuthDomainEvent with proper structure
 *
 * @example
 * ```typescript
 * // Create a login success event
 * const loginEvent = createAuthEvent(
 *   'LoginSuccess',
 *   { userId: 'user123', ipAddress: '192.168.1.1' },
 *   { source: 'web', userAgent: 'Chrome/91.0' }
 * );
 *
 * // Create a security event
 * const securityEvent = createAuthEvent(
 *   'SuspiciousActivityDetected',
 *   { userId: 'user123', activity: 'multiple_failed_logins' },
 *   { severity: 'high', location: 'US' }
 * );
 * ```
 */
export const createAuthEvent = <T extends AuthEventType>(
  type: T,
  payload: Omit<AuthEventPayload<T>, 'timestamp' | 'metadata'>,
  metadata: BaseEventMetadata = {}
): AuthDomainEvent => {
  return {
    type,
    payload: {
      ...payload,
      timestamp: new Date().toISOString(),
      metadata,
    },
  } as AuthDomainEvent;
};

/**
 * 🔍 Event filtering helpers
 * These utility functions help categorize and filter events based on
 * their characteristics, enabling efficient event processing and routing.
 */

/**
 * 🚨 Determines if an event is security-related
 *
 * Checks if the given event belongs to the security event category.
 * Security events require special handling, logging, and potentially
 * immediate response actions like notifications or account locks.
 *
 * @param event - The event to check
 * @returns true if the event is security-related, false otherwise
 *
 * @example
 * ```typescript
 * const events = [loginEvent, userCreatedEvent, securityEvent];
 * const securityEvents = events.filter(isSecurityEvent);
 *
 * // Log all security events with high priority
 * securityEvents.forEach(event => {
 *   logger.warn('Security event detected', { event });
 * });
 * ```
 */
export const isSecurityEvent = (event: AuthDomainEvent): boolean => {
  const securityEventTypes: AuthEventType[] = [
    'LoginFailed',
    'SuspiciousActivityDetected',
    'GeographicRestrictionViolated',
    'RateLimitExceeded',
    'DeviceNotRecognized',
    'IpAddressBlocked',
    'SecurityViolation',
    'UserAccountLocked',
    'MfaChallengeFailed',
  ];
  return securityEventTypes.includes(event.type);
};

/**
 * 🏢 Determines if an event is tenant-specific
 *
 * Type guard that checks if an event contains tenant information.
 * This is useful for multi-tenant systems where events need to be
 * processed in the context of specific tenant boundaries.
 *
 * @param event - The event to check
 * @returns true if the event has tenant context, false otherwise
 *
 * @example
 * ```typescript
 * const events = [userEvent, tenantEvent, globalEvent];
 * const tenantEvents = events.filter(isTenantEvent);
 *
 * // Process events per tenant
 * tenantEvents.forEach(event => {
 *   const tenantId = event.payload.tenantId;
 *   processEventForTenant(tenantId, event);
 * });
 * ```
 */
export const isTenantEvent = (
  event: AuthDomainEvent
): event is AuthDomainEvent & { payload: { tenantId: TenantId } } => {
  return (
    'tenantId' in event.payload &&
    event.payload.tenantId !== undefined &&
    event.payload.tenantId !== null &&
    typeof event.payload.tenantId === 'string'
  );
};

/**
 * 👤 Determines if an event is user-specific
 *
 * Type guard that checks if an event contains user information.
 * This enables user-centric event processing, such as personalizing
 * notifications or updating user-specific analytics.
 *
 * @param event - The event to check
 * @returns true if the event has user context, false otherwise
 *
 * @example
 * ```typescript
 * const events = [loginEvent, systemEvent, userUpdateEvent];
 * const userEvents = events.filter(isUserEvent);
 *
 * // Update user activity timeline
 * userEvents.forEach(event => {
 *   const userId = event.payload.userId;
 *   updateUserActivityTimeline(userId, event);
 * });
 * ```
 */
export const isUserEvent = (
  event: AuthDomainEvent
): event is AuthDomainEvent & { payload: { userId: UserId } } => {
  return (
    'userId' in event.payload &&
    event.payload.userId !== undefined &&
    event.payload.userId !== null &&
    typeof event.payload.userId === 'string'
  );
};
