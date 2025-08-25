# Login API Implementation Guide

## Overview

This document provides implementation details for creating the actual login API
endpoints based on the PrepHired codebase structure and authentication system.

## Project Structure

```
src/
├── app/
│   └── api/
│       └── auth/
│           ├── signin/
│           │   └── route.ts
│           ├── signup/
│           │   └── route.ts
│           ├── signout/
│           │   └── route.ts
│           └── session/
│               └── route.ts
├── features/
│   └── auth/
│       ├── services/
│       │   └── api/
│       │       └── authService.ts
│       ├── domain/
│       │   └── entities.ts
│       └── schema/
│           └── login.zod.ts
└── lib/
    ├── auth/
    │   └── jwt.ts
    └── database/
        └── models/
            └── User.ts
```

## Implementation Steps

### 1. Create API Route Handlers

#### POST /api/auth/signin

Create `src/app/api/auth/signin/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { loginFormSchema } from '@/features/auth/schema';
import { authService } from '@/features/auth/services/api/authService';
import { rateLimiter } from '@/lib/rate-limiter';

const signinSchema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || 'unknown';
    const rateLimitResult = await rateLimiter.check(ip, 'login', 5, 15 * 60); // 5 attempts per 15 minutes

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many login attempts. Please try again later.',
          },
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = signinSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: validationResult.error.errors,
          },
        },
        { status: 400 }
      );
    }

    const { emailOrPhone, password, rememberMe } = validationResult.data;

    // Attempt login
    const loginResult = await authService.login(
      emailOrPhone,
      password,
      rememberMe
    );

    if (!loginResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: loginResult.error?.code || 'LOGIN_FAILED',
            message: loginResult.error?.message || 'Login failed',
            field: loginResult.error?.field,
          },
        },
        { status: 401 }
      );
    }

    // Set session cookie
    const response = NextResponse.json(
      {
        success: true,
        data: loginResult.data,
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set('session_token', loginResult.data.session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 1 day
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}
```

### 2. Create Authentication Service

Create `src/features/auth/services/api/authService.ts`:

```typescript
import {
  User,
  Session,
  Tenant,
  LoginForm,
  AuthResult,
} from '@/features/auth/domain/entities';
import { hashPassword, comparePassword } from '@/lib/auth/crypto';
import { generateJWT, verifyJWT } from '@/lib/auth/jwt';
import { db } from '@/lib/database/connections';
import { rateLimiter } from '@/lib/rate-limiter';

export class AuthService {
  async login(
    emailOrPhone: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<
    AuthResult<{
      user: User;
      session: Session;
      tenant: Tenant;
      redirectTo: string;
    }>
  > {
    try {
      // Find user by email or phone
      const user = await this.findUserByIdentifier(emailOrPhone);

      if (!user) {
        return {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
            field: 'emailOrPhone',
          },
        };
      }

      // Check if account is active
      if (user.status !== 'active') {
        return {
          success: false,
          error: {
            code: 'ACCOUNT_INACTIVE',
            message: 'Account is inactive or suspended',
            field: 'emailOrPhone',
          },
        };
      }

      // Check if email is verified
      if (!user.emailVerified) {
        return {
          success: false,
          error: {
            code: 'EMAIL_NOT_VERIFIED',
            message: 'Please verify your email address before logging in',
            field: 'emailOrPhone',
          },
        };
      }

      // Verify password
      const isPasswordValid = await comparePassword(
        password,
        user.passwordHash
      );

      if (!isPasswordValid) {
        // Track failed login attempt
        await this.trackFailedLogin(user.id);

        return {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
            field: 'emailOrPhone',
          },
        };
      }

      // Check if account is locked
      if (user.lockedUntil && new Date() < new Date(user.lockedUntil)) {
        return {
          success: false,
          error: {
            code: 'ACCOUNT_LOCKED',
            message: 'Account is temporarily locked due to failed attempts',
            field: 'emailOrPhone',
          },
        };
      }

      // Reset failed login attempts on successful login
      await this.resetFailedLoginAttempts(user.id);

      // Get user's primary tenant
      const tenant = await this.getUserPrimaryTenant(user.id);

      if (!tenant) {
        return {
          success: false,
          error: {
            code: 'NO_TENANT_ACCESS',
            message: 'User has no tenant access',
          },
        };
      }

      // Create session
      const session = await this.createSession(user.id, tenant.id, rememberMe);

      // Update last login
      await this.updateLastLogin(user.id);

      return {
        success: true,
        data: {
          user: this.sanitizeUser(user),
          session,
          tenant,
          redirectTo: '/verify-account?type=login',
        },
      };
    } catch (error) {
      console.error('Login service error:', error);

      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      };
    }
  }

  private async findUserByIdentifier(identifier: string): Promise<User | null> {
    // Check if identifier is email or phone
    const isEmail = identifier.includes('@');

    if (isEmail) {
      return await db.user.findUnique({
        where: { email: identifier.toLowerCase() },
        include: {
          passwordHash: true,
          lockedUntil: true,
          failedLoginAttempts: true,
        },
      });
    } else {
      return await db.user.findUnique({
        where: { phone: identifier },
        include: {
          passwordHash: true,
          lockedUntil: true,
          failedLoginAttempts: true,
        },
      });
    }
  }

  private async trackFailedLogin(userId: string): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: { increment: 1 },
        lockedUntil: undefined, // Reset lock if it was set
      },
    });

    // Check if we should lock the account
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { failedLoginAttempts: true },
    });

    if (user && user.failedLoginAttempts >= 5) {
      // Lock account for 15 minutes
      const lockUntil = new Date(Date.now() + 15 * 60 * 1000);

      await db.user.update({
        where: { id: userId },
        data: { lockedUntil: lockUntil },
      });
    }
  }

  private async resetFailedLoginAttempts(userId: string): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: undefined,
      },
    });
  }

  private async getUserPrimaryTenant(userId: string): Promise<Tenant | null> {
    const userTenant = await db.userTenant.findFirst({
      where: { userId, isPrimary: true },
      include: { tenant: true },
    });

    return userTenant?.tenant || null;
  }

  private async createSession(
    userId: string,
    tenantId: string,
    rememberMe: boolean
  ): Promise<Session> {
    const expiresAt = new Date(
      Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000
    );

    const token = await generateJWT({ userId, tenantId, type: 'session' });

    const session = await db.session.create({
      data: {
        userId,
        tenantId,
        token,
        expiresAt,
        ipAddress: '127.0.0.1', // Get from request in actual implementation
        userAgent: 'Mozilla/5.0...', // Get from request in actual implementation
      },
    });

    return session;
  }

  private async updateLastLogin(userId: string): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  private sanitizeUser(
    user: User
  ): Omit<User, 'passwordHash' | 'lockedUntil' | 'failedLoginAttempts'> {
    const { passwordHash, lockedUntil, failedLoginAttempts, ...sanitizedUser } =
      user;
    return sanitizedUser;
  }
}

export const authService = new AuthService();
```

### 3. Create JWT Utilities

Create `src/lib/auth/jwt.ts`:

```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

interface JWTPayload {
  userId: string;
  tenantId: string;
  type: 'session' | 'refresh' | 'reset' | 'verification';
  iat?: number;
  exp?: number;
}

export async function generateJWT(
  payload: Omit<JWTPayload, 'iat' | 'exp'>
): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
      (error, token) => {
        if (error) reject(error);
        else resolve(token!);
      }
    );
  });
}

export async function verifyJWT(token: string): Promise<JWTPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) reject(error);
      else resolve(decoded as JWTPayload);
    });
  });
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}
```

### 4. Create Rate Limiter

Create `src/lib/rate-limiter.ts`:

```typescript
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

export class RateLimiter {
  async check(
    key: string,
    action: string,
    maxAttempts: number,
    windowSeconds: number
  ): Promise<RateLimitResult> {
    const redisKey = `rate_limit:${action}:${key}`;
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - windowSeconds;

    try {
      // Remove expired entries
      await redis.zremrangebyscore(redisKey, 0, windowStart);

      // Count current attempts
      const attempts = await redis.zcard(redisKey);

      if (attempts >= maxAttempts) {
        return {
          success: false,
          remaining: 0,
          resetTime: now + windowSeconds,
        };
      }

      // Add current attempt
      await redis.zadd(redisKey, now, now.toString());
      await redis.expire(redisKey, windowSeconds);

      return {
        success: true,
        remaining: maxAttempts - attempts - 1,
        resetTime: now + windowSeconds,
      };
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Fail open - allow request if rate limiting fails
      return {
        success: true,
        remaining: maxAttempts,
        resetTime: now + windowSeconds,
      };
    }
  }

  async reset(key: string, action: string): Promise<void> {
    const redisKey = `rate_limit:${action}:${key}`;
    await redis.del(redisKey);
  }
}

export const rateLimiter = new RateLimiter();
```

### 5. Create Crypto Utilities

Create `src/lib/auth/crypto.ts`:

```typescript
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validatePassword(password: string): boolean {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  return (
    password.length >= minLength && hasUppercase && hasLowercase && hasNumbers
  );
}
```

### 6. Create Database Models

Create `src/lib/database/models/User.ts`:

```typescript
import { Prisma } from '@prisma/client';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  status: 'active' | 'inactive' | 'pending';
  roles: string[];
  permissions: string[];
  avatarUrl?: string;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserTenant {
  id: string;
  userId: string;
  tenantId: string;
  role: string;
  isPrimary: boolean;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  tenantId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  lastActivity: Date;
}
```

## Environment Variables

Create `.env.local`:

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/prephired"
REDIS_URL="redis://localhost:6379"

# Security
BCRYPT_SALT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_LOGIN_ATTEMPTS=5
RATE_LIMIT_LOGIN_WINDOW=900
```

## Testing the Implementation

### 1. Test with cURL

```bash
# Test login endpoint
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "test@prephired.com",
    "password": "TestPassword123",
    "rememberMe": false
  }'
```

### 2. Test Rate Limiting

```bash
# Make multiple requests to test rate limiting
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/signin \
    -H "Content-Type: application/json" \
    -d '{
      "emailOrPhone": "test@prephired.com",
      "password": "wrongpassword",
      "rememberMe": false
    }'
  echo "Request $i"
  sleep 1
done
```

### 3. Test Session Cookie

```bash
# Check if session cookie is set
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "test@prephired.com",
    "password": "TestPassword123",
    "rememberMe": false
  }' \
  -c cookies.txt

# Check cookies
cat cookies.txt
```

## Security Considerations

### 1. Input Validation

- Validate all input using Zod schemas
- Sanitize user data before processing
- Use parameterized queries to prevent SQL injection

### 2. Password Security

- Never store plain text passwords
- Use bcrypt with high salt rounds
- Implement password complexity requirements
- Track failed login attempts

### 3. Session Security

- Use secure HTTP-only cookies
- Implement JWT expiration
- Validate IP addresses and user agents
- Support session revocation

### 4. Rate Limiting

- Implement per-IP rate limiting
- Use Redis for distributed rate limiting
- Configure appropriate limits for different actions

### 5. Error Handling

- Don't leak sensitive information in error messages
- Log security events for monitoring
- Implement proper error codes for client handling

## Monitoring and Logging

### 1. Security Events

```typescript
// Log failed login attempts
await securityLogger.log('failed_login', {
  userId: user?.id || 'unknown',
  emailOrPhone,
  ipAddress: request.ip,
  userAgent: request.headers.get('user-agent'),
  timestamp: new Date().toISOString(),
});
```

### 2. Performance Metrics

```typescript
// Track login response times
const startTime = Date.now();
const result = await authService.login(emailOrPhone, password, rememberMe);
const responseTime = Date.now() - startTime;

await metricsLogger.log('login_response_time', {
  success: result.success,
  responseTime,
  timestamp: new Date().toISOString(),
});
```

## Next Steps

1. **Implement remaining endpoints:** signup, signout, session
2. **Add email verification:** Send verification emails
3. **Implement password reset:** Forgot password flow
4. **Add MFA support:** Two-factor authentication
5. **Implement SSO:** OAuth providers integration
6. **Add audit logging:** Track all authentication events
7. **Performance optimization:** Caching, connection pooling
8. **Testing:** Unit tests, integration tests, load tests
