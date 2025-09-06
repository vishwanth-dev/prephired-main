// lib/errors.ts

/**
 * Error Handling Utilities
 */

// ============================================
// CUSTOM ERROR CLASSES
// ============================================

/**
 * Base application error
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Validation error - 400
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Authentication error - 401
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization error - 403
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

/**
 * Not found error - 404
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Conflict error - 409
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
    this.name = 'ConflictError';
  }
}

// ============================================
// ERROR UTILITIES
// ============================================

/**
 * Check if error is an AppError
 */
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

/**
 * Get error message from any error type
 */
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;

  if (isAppError(error)) return error.message;

  if (error instanceof Error) return error.message;

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  return 'An unexpected error occurred';
};

/**
 * Get error status code
 */
export const getErrorStatusCode = (error: unknown): number => {
  if (isAppError(error)) return error.statusCode;
  return 500;
};

/**
 * Handle API errors from axios
 */
export const handleApiError = (error: any): never => {
  // Handle axios errors
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.message;

    switch (status) {
      case 400:
        throw new ValidationError(message, error.response.data);
      case 401:
        throw new AuthenticationError(message);
      case 403:
        throw new AuthorizationError(message);
      case 404:
        throw new NotFoundError(message);
      case 409:
        throw new ConflictError(message);
      default:
        throw new AppError(message, 'API_ERROR', status);
    }
  }

  // Network error
  if (error.request) {
    throw new AppError('Network error occurred', 'NETWORK_ERROR', 0);
  }

  // Other errors
  throw new AppError(error.message || 'An error occurred', 'UNKNOWN_ERROR');
};
