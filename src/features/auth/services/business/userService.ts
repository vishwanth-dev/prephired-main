import { UserProfile, UserId } from '../../domain/entities';
import { userApiService } from '../api/userApi';

class UserService {
  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: UserId): Promise<UserProfile | null> {
    try {
      const response = await userApiService.getProfile(userId);
      return response.user || null;
    } catch (error) {
      // Error handling without console.log per coding standards
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: UserId,
    updates: Partial<UserProfile>
  ): Promise<UserProfile | null> {
    try {
      const response = await userApiService.updateProfile(userId, updates);
      return response.user || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: UserId,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      const response = await userApiService.changePassword(userId, {
        currentPassword,
        newPassword,
      });
      return response.success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Enable/disable MFA for user
   */
  async toggleMfa(userId: UserId, enabled: boolean, method?: string): Promise<boolean> {
    try {
      const mfaData: { enabled: boolean; method?: string } = { enabled };
      if (method) {
        mfaData.method = method;
      }

      const response = await userApiService.toggleMfa(userId, mfaData);
      return response.success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user sessions
   */
  async getUserSessions(userId: UserId): Promise<any[]> {
    try {
      const response = await userApiService.getSessions(userId);
      return response.sessions || [];
    } catch (error) {
      console.error('Failed to fetch user sessions:', error);
      return [];
    }
  }

  /**
   * Revoke user session
   */
  async revokeSession(userId: UserId, sessionId: string): Promise<boolean> {
    try {
      const response = await userApiService.revokeSession(userId, sessionId);
      return response.success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user activity log
   */
  async getUserActivity(
    userId: UserId,
    options?: {
      limit?: number;
      offset?: number;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<any[]> {
    try {
      const response = await userApiService.getActivity(userId, options);
      return response.activities || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}

export const userService = new UserService();
