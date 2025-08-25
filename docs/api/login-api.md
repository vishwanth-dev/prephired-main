# Login API Documentation

## Overview

This document provides detailed API documentation for the PrepHired login
functionality based on the actual implementation in the codebase.

## Base URL

```
https://api.prephired.com/api/auth
```

## Login Endpoint

### POST /api/auth/signin

**Description:** Authenticate user with email/phone and password

**Content-Type:** `application/json`

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
  emailOrPhone: string; // Email or phone number
  password: string; // User password
  rememberMe?: boolean; // Remember user session (optional)
}
```

## Validation Rules

### Email/Phone Validation

- **Required:** Yes
- **Format:** Valid email address or phone number
- **Phone Format:** International format (e.g., +1234567890)
- **Validation:** Uses `emailOrPhoneSchema` from shared validation

### Password Validation

- **Required:** Yes
- **Minimum Length:** 1 character (UI validation)
- **Server Validation:** More strict requirements apply

### Remember Me

- **Required:** No
- **Type:** Boolean
- **Default:** false

## Response Format

### Success Response (200 OK)

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
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "metadata": {}
    },
    "session": {
      "id": "session-456",
      "userId": "user-123",
      "tenantId": "tenant-789",
      "expiresAt": "2024-01-02T00:00:00.000Z",
      "ipAddress": "127.0.0.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastActivity": "2024-01-01T00:00:00.000Z",
      "metadata": {}
    },
    "tenant": {
      "id": "tenant-789",
      "name": "Default Organization",
      "slug": "default",
      "description": "Default organization",
      "website": "https://example.com",
      "logoUrl": "https://via.placeholder.com/100",
      "status": "active",
      "country": "US",
      "timezone": "America/New_York",
      "language": "en",
      "currency": "USD",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "redirectTo": "/verify-account?type=login"
  },
  "error": null
}
```

### Error Response (400/401)

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

## Error Codes

| Code                  | Message                          | Description                           |
| --------------------- | -------------------------------- | ------------------------------------- |
| `INVALID_CREDENTIALS` | Invalid email or password        | Email/phone or password is incorrect  |
| `ACCOUNT_LOCKED`      | Account is temporarily locked    | Account locked due to failed attempts |
| `EMAIL_NOT_VERIFIED`  | Email address not verified       | Email verification required           |
| `ACCOUNT_INACTIVE`    | Account is inactive or suspended | Account status prevents login         |
| `RATE_LIMIT_EXCEEDED` | Too many login attempts          | Rate limiting applied                 |

## HTTP Status Codes

| Status | Description                        |
| ------ | ---------------------------------- |
| `200`  | Login successful                   |
| `400`  | Bad request (validation errors)    |
| `401`  | Unauthorized (invalid credentials) |
| `429`  | Too many requests (rate limited)   |
| `500`  | Internal server error              |

## Implementation Details

### Frontend Flow

1. **Form Input:** User enters email/phone and password
2. **Validation:** Client-side validation using Zod schema
3. **API Call:** POST request to `/api/auth/signin`
4. **Response Handling:** Success redirects to verify-account page
5. **Error Handling:** Displays error messages in UI

### Backend Processing

1. **Request Validation:** Server-side validation of input
2. **Credential Verification:** Check against stored user data
3. **Session Creation:** Generate new session with JWT token
4. **Tenant Assignment:** Associate user with appropriate tenant
5. **Response Generation:** Return user, session, and tenant data

## Security Features

### Rate Limiting

- **Login Attempts:** 5 per 15 minutes per IP address
- **Account Lockout:** Temporary lockout after 5 failed attempts
- **IP Tracking:** Monitor suspicious IP addresses

### Session Security

- **JWT Tokens:** Secure token-based authentication
- **Expiration:** Configurable session timeout
- **IP Validation:** Session tied to IP address
- **User Agent Tracking:** Monitor device changes

### Password Security

- **Hashing:** Bcrypt with salt rounds
- **Complexity Requirements:** Enforced server-side
- **Failed Attempt Tracking:** Monitor brute force attempts

## Client Integration

### JavaScript Example

```javascript
const loginUser = async credentials => {
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
      // Store session data
      localStorage.setItem('session', JSON.stringify(result.data.session));
      localStorage.setItem('user', JSON.stringify(result.data.user));

      // Redirect user
      window.location.href = result.data.redirectTo;
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
import { useState, useCallback } from 'react';

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async credentials => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginUser(credentials);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, isLoading, error };
};
```

## Testing

### Test Credentials

```json
{
  "email": "test@prephired.com",
  "password": "TestPassword123"
}
```

### Test Endpoints

- **Development:** `http://localhost:3000/api/auth/signin`
- **Staging:** `https://staging-api.prephired.com/api/auth/signin`
- **Production:** `https://api.prephired.com/api/auth/signin`

### cURL Example

```bash
curl -X POST https://api.prephired.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "test@prephired.com",
    "password": "TestPassword123",
    "rememberMe": false
  }'
```

## Related Endpoints

- **Registration:** `POST /api/auth/signup`
- **Password Reset:** `POST /api/auth/forgot-password`
- **Session Check:** `GET /api/auth/session`
- **Logout:** `POST /api/auth/signout`

## Dependencies

### Frontend

- React Hook Form for form management
- Zod for validation schemas
- Zustand for state management
- Next.js for routing

### Backend

- JWT for token generation
- Bcrypt for password hashing
- Redis for session storage
- PostgreSQL for user data

## Notes

- The current implementation includes mock data for development
- Production should integrate with actual authentication service
- Session management includes multi-tenant support
- Error handling follows consistent response format
- All endpoints support CORS for cross-origin requests
