// constants/config.ts

/**
 * 🚀 Application Configuration Constants
 *
 * Centralized configuration hub for the PrepAI application.
 * Provides environment-aware settings, validation rules, and feature toggles.
 */

// ============================================
// 🏷️ APPLICATION METADATA
// ============================================

export const APP_CONFIG = {
  NAME: 'PrepAI',
  VERSION: '1.0.0',
  DESCRIPTION: 'AI-powered resume preparation and analysis platform',
  AUTHOR: 'PrepAI Team',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const;

// ============================================
// 🎨 UI/UX CONFIGURATION
// ============================================

export const UI_CONFIG = {
  // Animation durations (in milliseconds)
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },

  // Debounce delays (in milliseconds)
  DEBOUNCE_DELAY: {
    SEARCH: 300,
    INPUT: 500,
    RESIZE: 250,
  },

  // Toast notification durations (in milliseconds)
  TOAST_DURATION: {
    SUCCESS: 3000,
    ERROR: 5000,
    INFO: 4000,
    WARNING: 4000,
  },

  // Loading states
  LOADING_STATES: {
    SKELETON_DURATION: 2000,
    SPINNER_SIZE: 24,
  },

  // Breakpoints (matching Tailwind CSS)
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
} as const;

// ============================================
// 🔐 AUTHENTICATION CONFIGURATION
// ============================================

export const AUTH_CONFIG = {
  // Token storage keys
  TOKEN_STORAGE: {
    KEY: 'auth_token',
    REFRESH_KEY: 'refresh_token',
    USER_DATA_KEY: 'user_data',
  },

  // Session management (in milliseconds)
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry

  // Password requirements
  PASSWORD_REQUIREMENTS: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: true,
  },

  // OTP configuration
  OTP_CONFIG: {
    LENGTH: 6,
    EXPIRY_TIME: 5 * 60 * 1000, // 5 minutes
    EXPIRY_MINUTES: 5,
    MAX_ATTEMPTS: 3,
    RESEND_COOLDOWN_SECONDS: 60,
    MAX_RESEND_ATTEMPTS: 5,
  },

  // Account security
  ACCOUNT_SECURITY: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION_MINUTES: 30,
    PASSWORD_HISTORY_COUNT: 3,
  },

  // Authentication routes
  AUTH_ROUTES: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_OTP: '/verify-otp',
    VERIFY_EMAIL: '/verify-email',
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SETTINGS: '/settings',
  },

  // Authentication error messages
  AUTH_ERRORS: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_NOT_FOUND: 'User not found',
    EMAIL_NOT_VERIFIED: 'Please verify your email address',
    ACCOUNT_LOCKED: 'Account is locked due to too many failed attempts',
    OTP_INVALID: 'Invalid OTP code',
    OTP_EXPIRED: 'OTP code has expired',
    TOKEN_EXPIRED: 'Your session has expired. Please login again',
    NETWORK_ERROR: 'Network error. Please check your connection',
    SERVER_ERROR: 'Server error. Please try again later',
    WEAK_PASSWORD: 'Password does not meet security requirements',
    PASSWORD_MISMATCH: 'Passwords do not match',
    TERMS_NOT_ACCEPTED: 'You must accept the terms and conditions',
  },
} as const;

// ============================================
// 🌐 API CONFIGURATION
// ============================================

export const API_CONFIG = {
  // Base URL configuration
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',

  // Request timeouts (in milliseconds)
  TIMEOUT: {
    DEFAULT: 30000, // 30 seconds
    UPLOAD: 300000, // 5 minutes
    DOWNLOAD: 60000, // 1 minute
  },

  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 1 second initial delay
    BACKOFF_MULTIPLIER: 2, // Exponential backoff
  },

  // Rate limiting
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000,
  },

  // Request headers
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const;

// ============================================
// 🔑 LOCAL STORAGE KEYS
// ============================================

export const STORAGE_KEYS = {
  // Authentication
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  REMEMBER_ME: 'remember_me',

  // Preferences
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_STATE: 'sidebar_state',

  // Cache
  FORM_DRAFT: 'form_draft',
  LAST_ACTIVITY: 'last_activity',
} as const;

// ============================================
// 🚩 FEATURE FLAGS
// ============================================

export const FEATURE_FLAGS = {
  // Development features
  ENABLE_DEV_TOOLS: process.env.NODE_ENV === 'development',
  ENABLE_QUERY_DEVTOOLS: process.env.NODE_ENV === 'development',

  // Application features
  ENABLE_ANALYTICS: true,
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_REAL_TIME_UPDATES: false,

  // User features
  ENABLE_SOCIAL_LOGIN: false,
  ENABLE_TWO_FACTOR_AUTH: false,
  ENABLE_PASSWORD_RESET: true,
  ENABLE_REMEMBER_ME: true,
} as const;

// ============================================
// ✅ VALIDATION CONFIGURATION
// ============================================

export const VALIDATION_CONFIG = {
  // Email validation
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Phone number validation
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,

  // URL validation
  URL_REGEX: /^https?:\/\/.+/,

  // Name validation (letters, spaces, hyphens, apostrophes, periods)
  NAME_REGEX: /^[a-zA-Z\s\-'\.]+$/,

  // Subdomain validation
  SUBDOMAIN_REGEX: /^[a-z0-9]([a-z0-9\-]*[a-z0-9])?$/,

  // Input limits
  INPUT_LIMITS: {
    NAME_MIN: 2,
    NAME_MAX: 50,
    EMAIL_MAX: 255,
    PHONE_MIN: 10,
    PHONE_MAX: 15,
    PASSWORD_MIN: 8,
    PASSWORD_MAX: 128,
  },
} as const;

// ============================================
// 🎨 THEME CONFIGURATION
// ============================================

export const THEME_CONFIG = {
  // Colors
  COLORS: {
    PRIMARY: '#F0806C',
    PRIMARY_DARK: '#F35427',
    SECONDARY: '#363848',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#3B82F6',
  },

  // Font sizes
  FONT_SIZES: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.75rem',
    '4xl': '2rem',
  },

  // Border radius
  BORDER_RADIUS: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
} as const;

// ============================================
// 📊 PAGINATION CONFIGURATION
// ============================================

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// ============================================
// 📅 DATE/TIME CONFIGURATION
// ============================================

export const DATE_CONFIG = {
  DEFAULT_FORMAT: 'MMM dd, yyyy',
  TIME_FORMAT: 'HH:mm',
  DATETIME_FORMAT: 'MMM dd, yyyy HH:mm',
  LOCALE: 'en-US',
  TIMEZONE: 'UTC',
} as const;

// ============================================
// 📦 EXPORT ALL CONFIGURATIONS
// ============================================

export const CONFIG = {
  APP: APP_CONFIG,
  UI: UI_CONFIG,
  AUTH: AUTH_CONFIG,
  API: API_CONFIG,
  STORAGE: STORAGE_KEYS,
  FEATURES: FEATURE_FLAGS,
  VALIDATION: VALIDATION_CONFIG,
  THEME: THEME_CONFIG,
  PAGINATION: PAGINATION_CONFIG,
  DATE: DATE_CONFIG,
} as const;

// Default export
export default CONFIG;

// Type exports for TypeScript
export type AppConfig = typeof APP_CONFIG;
export type UIConfig = typeof UI_CONFIG;
export type AuthConfig = typeof AUTH_CONFIG;
export type ApiConfig = typeof API_CONFIG;
export type StorageKeys = typeof STORAGE_KEYS;
export type FeatureFlags = typeof FEATURE_FLAGS;
export type ValidationConfig = typeof VALIDATION_CONFIG;
export type ThemeConfig = typeof THEME_CONFIG;
