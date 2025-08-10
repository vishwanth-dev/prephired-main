export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly field?: string;
  public readonly errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]> = {}, field?: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors;
    if (field !== undefined) {
      this.field = field;
    }
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

export class TenantError extends AppError {
  constructor(message: string, code: string = 'TENANT_ERROR') {
    super(message, 400, code);
  }
}

export class InterviewError extends AppError {
  constructor(message: string, code: string = 'INTERVIEW_ERROR') {
    super(message, 400, code);
  }
}

export class VoiceProviderError extends AppError {
  constructor(message: string, code: string = 'VOICE_PROVIDER_ERROR') {
    super(message, 502, code);
  }
}

export class ResumeProcessingError extends AppError {
  constructor(message: string, code: string = 'RESUME_PROCESSING_ERROR') {
    super(message, 400, code);
  }
}

export class FileUploadError extends AppError {
  constructor(message: string, code: string = 'FILE_UPLOAD_ERROR') {
    super(message, 400, code);
  }
}

// Error handler utility
export const handleError = (error: Error) => {
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
      ...(error instanceof ValidationError && { errors: error.errors }),
    };
  }

  // Log unexpected errors
  console.error('Unexpected error:', error);

  return {
    success: false,
    error: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
  };
};

// Error response helper for API routes
export const errorResponse = (error: Error) => {
  const errorData = handleError(error);

  return Response.json(
    {
      success: false,
      error: errorData.error,
      code: errorData.code,
      ...(errorData.errors && { errors: errorData.errors }),
    },
    { status: errorData.statusCode }
  );
};
