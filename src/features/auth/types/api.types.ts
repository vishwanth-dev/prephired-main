export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  acceptTerms: boolean;
  acceptPrivacy?: boolean;
  marketingEmails?: boolean;
  tenantSlug?: string;
  invitationToken?: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  };
  token?: string;
  refreshToken?: string;
  error?: string;
  code?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: Record<string, any>;
}
