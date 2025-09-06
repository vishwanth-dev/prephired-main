// lib/env.ts

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Server-side environment variables
   */
  server: {
    // App
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Database
    MONGODB_URI: z.string().url(),
    MONGODB_DB_NAME: z.string().min(1),

    // Authentication
    NEXTAUTH_SECRET: z.string().min(32),
    NEXTAUTH_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),

    // AI Services
    OPENAI_API_KEY: z.string().min(1),
    OPENAI_MODEL: z.string().default('gpt-4'),

    // Voice Providers
    MURF_API_KEY: z.string().optional(),
    ELEVENLABS_API_KEY: z.string().optional(),
    PLAYHT_API_KEY: z.string().optional(),
    AZURE_SPEECH_KEY: z.string().optional(),
    AZURE_SPEECH_REGION: z.string().optional(),

    // File Storage
    UPLOAD_DIR: z.string().default('./uploads'),
    MAX_FILE_SIZE: z.string().transform(Number).default(10485760),
    ALLOWED_FILE_TYPES: z
      .string()
      .default(
        'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ),

    // Email Service
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.string().transform(Number).optional(),
    SMTP_USER: z.string().email().optional(),
    SMTP_PASS: z.string().optional(),
    FROM_EMAIL: z.string().email().default('noreply@prepai.com'),
    FROM_NAME: z.string().default('prepAI'),

    // Pusher (server-side)
    PUSHER_APP_ID: z.string().optional(),
    PUSHER_SECRET: z.string().optional(),
    PUSHER_CLUSTER: z.string().default('us2'),

    // Security
    BCRYPT_ROUNDS: z.string().transform(Number).default(12),
    RATE_LIMIT_MAX: z.string().transform(Number).default(100),
    RATE_LIMIT_WINDOW: z.string().transform(Number).default(900000),

    // Multi-tenancy
    DEFAULT_TENANT_PLAN: z.enum(['free', 'pro', 'enterprise']).default('free'),
    MAX_INTERVIEWS_FREE: z.string().transform(Number).default(5),
    MAX_CANDIDATES_FREE: z.string().transform(Number).default(10),

    // Widget
    WIDGET_ALLOWED_ORIGINS: z.string().default('*'),
  },

  /**
   * Client-side environment variables (NEXT_PUBLIC_*)
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_APP_NAME: z.string().min(1),
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_PUSHER_KEY: z.string().optional(),
    NEXT_PUBLIC_WIDGET_CDN_URL: z.string().url().optional(),
  },

  /**
   * Runtime environment variables
   */
  runtimeEnv: {
    // Server
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    MURF_API_KEY: process.env.MURF_API_KEY,
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
    PLAYHT_API_KEY: process.env.PLAYHT_API_KEY,
    AZURE_SPEECH_KEY: process.env.AZURE_SPEECH_KEY,
    AZURE_SPEECH_REGION: process.env.AZURE_SPEECH_REGION,
    UPLOAD_DIR: process.env.UPLOAD_DIR,
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
    ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    FROM_EMAIL: process.env.FROM_EMAIL,
    FROM_NAME: process.env.FROM_NAME,
    PUSHER_APP_ID: process.env.PUSHER_APP_ID,
    PUSHER_SECRET: process.env.PUSHER_SECRET,
    PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
    BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS,
    RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW,
    DEFAULT_TENANT_PLAN: process.env.DEFAULT_TENANT_PLAN,
    MAX_INTERVIEWS_FREE: process.env.MAX_INTERVIEWS_FREE,
    MAX_CANDIDATES_FREE: process.env.MAX_CANDIDATES_FREE,
    WIDGET_ALLOWED_ORIGINS: process.env.WIDGET_ALLOWED_ORIGINS,

    // Client
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
    NEXT_PUBLIC_WIDGET_CDN_URL: process.env.NEXT_PUBLIC_WIDGET_CDN_URL,
  },

  /**
   * Skip validation when needed
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Empty strings as undefined
   */
  emptyStringAsUndefined: true,
});
