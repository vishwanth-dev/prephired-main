# Authentication API Documentation

## Overview

The PrepHired Authentication API provides secure user authentication and session management capabilities. This API supports multiple authentication methods including email/password login, registration, password reset, and email verification.

## Base URL

```
https://api.prephired.com/api/auth
```

## Authentication Flow

### 1. User Login Flow

```
User Input → Form Validation → API Call → Authentication → Session Creation → Redirect
```

### 2. User Registration Flow

```
User Input → Form Validation → API Call → User Creation → Email Verification → Account Activation
```

## API Endpoints

### 1. User Login

**Endpoint:** `POST /api/auth/signin`

**Description:** Authenticate user with email/phone and password

**Request Body:**

```json
{
  "emailOrPhone": "user@example.com",
  "password": "SecurePassword123",
  "rememberMe": false
}
```

**Request Schema:**

```typescript
interface LoginRequest {
  emailOrPhone: string;  // Email or phone number
  password: string;       // User password
  rememberMe?: boolean;   // Remember user session (optional)
}
```

**Validation Rules:**

- `emailOrPhone`: Required, must be valid email or phone format
- `password`: Required, minimum 1 character
- `rememberMe`: Optional boolean

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "user@example.com",
      "phone": "+1234567890",
      "avatarUrl": "https://example.com/avatar.jpg",
      "emailVerified": true,
      "phoneVerified": false,
      "status": "active",
      "roles": ["user"],
      "permissions": ["read:own"],
      "displayName": "John Doe",
      "initials": "JD",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "session": {
      "id": "session-456",
      "userId": "user-123",
      "tenantId": "tenant-789",
      "expiresAt": "2024-01-02T00:00:00.000Z",
      "ipAddress": "127.0.0.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastActivity": "2024-01-01T00:00:00.000Z"
    },
    "tenant": {
      "id": "tenant-789",
      "name": "Default Organization",
      "slug": "default",
      "status": "active",
      "country": "US",
      "timezone": "America/New_York",
      "language": "en",
      "currency": "USD"
    },
    "redirectTo": "/verify-account?type=login"
  },
  "error": null
}
```

**Response (Error - 400/401):**

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "field": "emailOrPhone"
  }
}
```

**Error Codes:**

- `INVALID_CREDENTIALS`: Email/phone or password is incorrect
- `ACCOUNT_LOCKED`: Account is temporarily locked due to failed attempts
- `EMAIL_NOT_VERIFIED`: Email address not verified
- `ACCOUNT_INACTIVE`: Account is inactive or suspended
- `RATE_LIMIT_EXCEEDED`: Too many login attempts

### 2. User Registration

**Endpoint:** `POST /api/auth/signup`

**Description:** Create a new user account

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "phone": "+1234567890",
  "password": "SecurePassword123",
  "confirmPassword": "SecurePassword123",
  "acceptTerms": true,
  "acceptPrivacy": true
}
```

**Request Schema:**

```typescript
interface RegisterRequest {
  firstName: string;      // User's first name
  lastName: string;       // User's last name
  email: string;          // User's email address
  phone?: string;         // User's phone number (optional)
  password: string;       // User's password
  confirmPassword: string; // Password confirmation
  acceptTerms: boolean;   // Terms acceptance
  acceptPrivacy: boolean; // Privacy policy acceptance
}
```

**Password Requirements:**

- Minimum length: 8 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number
- Symbols are optional

**Response (Success - 201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "user@example.com",
      "phone": "+1234567890",
      "status": "pending",
      "emailVerified": false,
      "phoneVerified": false,
      "roles": ["user"],
      "permissions": ["read:own"]
    },
    "redirectTo": "/verify-email"
  },
  "error": null
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "Email address already registered",
    "field": "email"
  }
}
```

**Error Codes:**

- `EMAIL_EXISTS`: Email address already registered
- `PHONE_EXISTS`: Phone number already registered
- `INVALID_PASSWORD`: Password doesn't meet requirements
- `PASSWORDS_DONT_MATCH`: Password confirmation doesn't match
- `TERMS_NOT_ACCEPTED`: Terms and conditions not accepted

### 3. Password Reset Request

**Endpoint:** `POST /api/auth/forgot-password`

**Description:** Request password reset link

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent",
    "resetTokenExpiry": "2024-01-01T01:00:00.000Z"
  },
  "error": null
}
```

### 4. Password Reset

**Endpoint:** `POST /api/auth/reset-password`

**Description:** Reset password using reset token

**Request Body:**

```json
{
  "token": "reset-token-123",
  "password": "NewSecurePassword123",
  "confirmPassword": "NewSecurePassword123"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "message": "Password reset successful",
    "redirectTo": "/login"
  },
  "error": null
}
```

### 5. Email Verification

**Endpoint:** `POST /api/auth/verify-email`

**Description:** Verify user's email address

**Request Body:**

```json
{
  "token": "verification-token-123"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "message": "Email verified successfully",
    "redirectTo": "/dashboard"
  },
  "error": null
}
```

### 6. Session Management

**Endpoint:** `GET /api/auth/session`

**Description:** Get current user session

**Headers:**

```
Authorization: Bearer <session-token>
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "user": { /* user profile */ },
    "session": { /* session info */ },
    "tenant": { /* tenant info */ }
  },
  "error": null
}
```

**Endpoint:** `POST /api/auth/signout`

**Description:** Logout user and invalidate session

**Headers:**

```
Authorization: Bearer <session-token>
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully",
    "redirectTo": "/login"
  },
  "error": null
}
```

## Data Models

### User Profile

```typescript
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  status: 'active' | 'inactive' | 'pending';
  roles: string[];
  permissions: string[];
  displayName: string;
  initials: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
}
```

### Session

```typescript
interface Session {
  id: string;
  userId: string;
  tenantId?: string;
  expiresAt: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastActivity: string;
  metadata: Record<string, unknown>;
}
```

### Tenant

```typescript
interface Tenant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  status: 'active' | 'inactive';
  country: string;
  timezone: string;
  language: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}
```

## Error Handling

### Standard Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    field?: string;
    details?: Record<string, unknown>;
  };
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Security Features

### Rate Limiting

- Login attempts: 5 per 15 minutes per IP
- Password reset requests: 3 per hour per email
- Registration: 10 per hour per IP

### Session Security

- JWT tokens with configurable expiration
- Secure HTTP-only cookies
- CSRF protection
- IP address validation
- User agent tracking

### Password Security

- Bcrypt hashing with salt rounds
- Minimum complexity requirements
- Failed attempt tracking
- Account lockout after 5 failed attempts

## Client Integration Examples

### JavaScript/TypeScript

```typescript
// Login example
const loginUser = async (credentials: LoginRequest) => {
  try {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Handle successful login
      return result.data;
    } else {
      // Handle error
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
```

### React Hook Example

```typescript
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await loginUser(credentials);
      setUser(result.user);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, login };
};
```

## Testing

### Test Endpoints

- **Development:** `http://localhost:3000/api/auth/*`
- **Staging:** `https://staging-api.prephired.com/api/auth/*`
- **Production:** `https://api.prephired.com/api/auth/*`

### Test Credentials

```json
{
  "email": "test@prephired.com",
  "password": "TestPassword123"
}
```

## Support

For API support and questions:

- **Email:** <api-support@prephired.com>
- **Documentation:** <https://docs.prephired.com/api>
- **Status Page:** <https://status.prephired.com>

## Changelog

### Version 1.0.0 (Current)

- Initial authentication API release
- User login and registration
- Password reset functionality
- Email verification
- Session management
- Multi-tenant support
