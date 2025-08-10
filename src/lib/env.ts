import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/**
 * Environment variable validation and type safety
 * This ensures all required environment variables are present and valid
 */
export const env = createEnv({
  /**
   * Server-side environment variables
   * These are only available on the server and never sent to the client
   */
  server: {
    // Database
    MONGODB_URI: z.string().url('Invalid MongoDB URI'),
    DATABASE_NAME: z.string().min(1).default('enterprise-saas'),

    // Authentication
    NEXTAUTH_SECRET: z.string().min(32, 'NextAuth secret must be at least 32 characters'),
    NEXTAUTH_URL: z.string().url().optional(),
    JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
    ENCRYPTION_KEY: z.string().length(32, 'Encryption key must be exactly 32 characters'),

    // Email Configuration
    EMAIL_PROVIDER: z.enum(['sendgrid', 'resend', 'ses', 'smtp']).default('sendgrid'),
    SENDGRID_API_KEY: z.string().optional(),
    SENDGRID_FROM_EMAIL: z.string().email().optional(),
    RESEND_API_KEY: z.string().optional(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.string().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),

    // File Storage
    STORAGE_PROVIDER: z.enum(['s3', 'cloudinary', 'local']).default('local'),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_REGION: z.string().default('us-east-1'),
    AWS_S3_BUCKET: z.string().optional(),
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),

    // Redis (Optional)
    REDIS_URL: z.string().url().optional(),
    REDIS_PASSWORD: z.string().optional(),

    // Monitoring
    SENTRY_DSN: z.string().url().optional(),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),

    // OAuth Providers
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    MICROSOFT_CLIENT_ID: z.string().optional(),
    MICROSOFT_CLIENT_SECRET: z.string().optional(),

    // Future: Payment Processing
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),

    // Future: External APIs
    OPENAI_API_KEY: z.string().optional(),
    PUSHER_APP_ID: z.string().optional(),
    PUSHER_SECRET: z.string().optional(),

    // Development & Testing
    DEBUG: z
      .string()
      .transform(val => val === 'true')
      .default(false),
    SKIP_EMAIL: z
      .string()
      .transform(val => val === 'true')
      .default(true),
    TEST_DATABASE_URL: z.string().url().optional(),

    // Rate Limiting
    RATE_LIMIT_REQUESTS: z.string().transform(Number).default(100),
    RATE_LIMIT_WINDOW: z.string().transform(Number).default(900000),

    // Multi-tenancy
    DEFAULT_TENANT_ID: z.string().default('default'),
    TENANT_STRATEGY: z.enum(['shared', 'separate', 'hybrid']).default('shared'),

    // Feature Flags
    FEATURE_ANALYTICS: z
      .string()
      .transform(val => val === 'true')
      .default(true),
    FEATURE_BILLING: z
      .string()
      .transform(val => val === 'true')
      .default(false),
    FEATURE_INTEGRATIONS: z
      .string()
      .transform(val => val === 'true')
      .default(false),
    FEATURE_WIDGET: z
      .string()
      .transform(val => val === 'true')
      .default(false),
    FEATURE_REAL_TIME: z
      .string()
      .transform(val => val === 'true')
      .default(false),
  },

  /**
   * Client-side environment variables
   * These are sent to the client and should not contain sensitive data
   */
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().default('Enterprise SaaS App'),
    NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
    NEXT_PUBLIC_APP_DOMAIN: z.string().default('localhost:3000'),

    // Analytics
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),

    // Future: Stripe Public Key
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

    // Future: Pusher Public Config
    NEXT_PUBLIC_PUSHER_KEY: z.string().optional(),
    NEXT_PUBLIC_PUSHER_CLUSTER: z.string().default('us2'),

    // Feature Flags (Public)
    NEXT_PUBLIC_ENABLE_ANALYTICS: z
      .string()
      .transform(val => val === 'true')
      .default(true),
    NEXT_PUBLIC_ENABLE_WIDGET: z
      .string()
      .transform(val => val === 'true')
      .default(false),
  },

  /**
   * Environment variables that are available on both server and client
   * Use this for variables that need to be accessible in both contexts
   */
  shared: {
    NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  },

  /**
   * Destructure all variables from process.env
   * This ensures the validation runs on both server and client
   */
  runtimeEnv: {
    // Server-side
    MONGODB_URI: process.env.MONGODB_URI,
    DATABASE_NAME: process.env.DATABASE_NAME,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    STORAGE_PROVIDER: process.env.STORAGE_PROVIDER,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID,
    MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    PUSHER_APP_ID: process.env.PUSHER_APP_ID,
    PUSHER_SECRET: process.env.PUSHER_SECRET,
    DEBUG: process.env.DEBUG,
    SKIP_EMAIL: process.env.SKIP_EMAIL,
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
    RATE_LIMIT_REQUESTS: process.env.RATE_LIMIT_REQUESTS,
    RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW,
    DEFAULT_TENANT_ID: process.env.DEFAULT_TENANT_ID,
    TENANT_STRATEGY: process.env.TENANT_STRATEGY,
    FEATURE_ANALYTICS: process.env.FEATURE_ANALYTICS,
    FEATURE_BILLING: process.env.FEATURE_BILLING,
    FEATURE_INTEGRATIONS: process.env.FEATURE_INTEGRATIONS,
    FEATURE_WIDGET: process.env.FEATURE_WIDGET,
    FEATURE_REAL_TIME: process.env.FEATURE_REAL_TIME,

    // Client-side
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
    NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    NEXT_PUBLIC_ENABLE_WIDGET: process.env.NEXT_PUBLIC_ENABLE_WIDGET,

    // Shared
    NODE_ENV: process.env.NODE_ENV,
  },

  /**
   * Skip validation in development for optional variables
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
