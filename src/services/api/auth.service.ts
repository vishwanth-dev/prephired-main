// services/api/auth.service.ts
// Authentication API service

import { BaseApiService } from './base.service';
import { USER_ENDPOINTS } from '@/constants/api-endpoints';
import {
  IUser,
  IAuthResponse,
  IApiResponse,
  IRegisterFormData,
  ILoginFormData,
  IVerifyOTPFormData,
  ISelectRoleFormData,
} from '@/types/backend';

export class AuthService extends BaseApiService {
  // ============================================
  // USER REGISTRATION
  // ============================================

  /**
   * Register a new user
   * POST /user/register
   */
  async register(data: IRegisterFormData): Promise<IAuthResponse> {
    return this.post<IAuthResponse['data']>(USER_ENDPOINTS.REGISTER, data);
  }

  /**
   * Login user
   * POST /user/login
   */
  async login(data: ILoginFormData): Promise<IAuthResponse> {
    return this.post<IAuthResponse['data']>(USER_ENDPOINTS.LOGIN, data);
  }

  /**
   * Verify OTP
   * POST /user/verify-otp
   */
  async verifyOTP(data: IVerifyOTPFormData): Promise<IAuthResponse> {
    return this.post<IAuthResponse['data']>(USER_ENDPOINTS.VERIFY_OTP, data);
  }

  /**
   * Select user role
   * PUT /user/select-role
   */
  async selectRole(data: ISelectRoleFormData): Promise<IAuthResponse> {
    return this.put<IAuthResponse['data']>(USER_ENDPOINTS.SELECT_ROLE, data);
  }

  /**
   * Get user authentication details
   * GET /user/auth-details
   */
  async getAuthDetails(): Promise<IAuthResponse> {
    return this.get<IAuthResponse['data']>(USER_ENDPOINTS.AUTH_DETAILS);
  }

  /**
   * Resend OTP
   * POST /user/resend-otp
   */
  async resendOTP(userId: string): Promise<IApiResponse> {
    return this.post<IApiResponse['data']>('/user/resend-otp', { userId });
  }

  /**
   * Forgot password
   * POST /user/forgot-password
   */
  async forgotPassword(email: string): Promise<IApiResponse> {
    return this.post<IApiResponse['data']>('/user/forgot-password', { email });
  }

  /**
   * Reset password
   * POST /user/reset-password
   */
  async resetPassword(token: string, password: string, confirmPass: string): Promise<IApiResponse> {
    return this.post<IApiResponse['data']>('/user/reset-password', {
      token,
      password,
      confirmPass,
    });
  }

  /**
   * Refresh token
   * POST /user/refresh-token
   */
  async refreshToken(refreshToken: string): Promise<IAuthResponse> {
    return this.post<IAuthResponse['data']>('/user/refresh-token', { refreshToken });
  }

  /**
   * Check if current token is valid
   * GET /user/validate-token
   */
  async checkTokenValidity(): Promise<boolean> {
    try {
      const response = await this.get<IApiResponse>('/user/validate-token');
      return response.statusCode === 200;
    } catch {
      return false;
    }
  }

  // ============================================
  // TOKEN MANAGEMENT
  // ============================================

  /**
   * Store authentication tokens
   */
  storeTokens(token: string, refreshToken?: string, persistent: boolean = true): void {
    this.setAuthToken(token, persistent);

    if (refreshToken && typeof window !== 'undefined') {
      if (persistent) {
        localStorage.setItem('refresh_token', refreshToken);
      } else {
        sessionStorage.setItem('refresh_token', refreshToken);
      }
    }
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
  }

  /**
   * Clear all authentication data
   */
  clearAuth(): void {
    this.removeAuthToken();

    if (typeof window !== 'undefined') {
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      sessionStorage.removeItem('user_data');
    }
  }

  /**
   * Store user data
   */
  storeUserData(user: IUser, persistent: boolean = true): void {
    if (typeof window === 'undefined') return;

    const storage = persistent ? localStorage : sessionStorage;
    storage.setItem('user_data', JSON.stringify(user));
  }

  /**
   * Get stored user data
   */
  getStoredUserData(): IUser | null {
    if (typeof window === 'undefined') return null;

    const userData = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  // ============================================
  // AUTHENTICATION STATUS
  // ============================================

  /**
   * Check if user is authenticated
   */
  override isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  /**
   * Get current user from stored data
   */
  getCurrentUser(): IUser | null {
    return this.getStoredUserData();
  }

  /**
   * Validate token and get fresh user data
   */
  async validateToken(): Promise<IUser | null> {
    if (!this.isAuthenticated()) return null;

    try {
      const response = await this.getAuthDetails();
      if (response.data && response.data.user) {
        this.storeUserData(response.data.user);
        return response.data.user;
      }
      return null;
    } catch {
      this.clearAuth();
      return null;
    }
  }

  // ============================================
  // LOGOUT
  // ============================================

  /**
   * Logout user
   * POST /user/logout
   */
  async logout(): Promise<void> {
    try {
      await this.post('/user/logout');
    } finally {
      // Clear local data regardless of API response
      this.clearAuth();
    }
  }

  /**
   * Initialize auth on app start
   */
  async initialize(): Promise<IUser | null> {
    const token = this.getAuthToken();

    if (!token) {
      return null;
    }

    try {
      // Validate token and get user details
      const response = await this.getAuthDetails();
      if (response.data && response.data.user) {
        this.storeUserData(response.data.user);
        return response.data.user;
      }
      return null;
    } catch {
      // Token invalid, clear auth
      this.clearAuth();
      return null;
    }
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const authService = new AuthService();
