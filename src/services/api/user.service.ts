// services/api/user.service.ts
// User management API service

import { BaseApiService } from './base.service';
import { USER_ENDPOINTS, buildApiUrl } from '@/constants/api-endpoints';
import {
  IUser,
  IUserProfile,
  IUpdateUserFormData,
  IPaginatedResponse,
  ISearchParams,
  IUserSearchFilters,
} from '@/types/backend';

export class UserService extends BaseApiService {
  // ============================================
  // USER MANAGEMENT
  // ============================================

  /**
   * Get user by ID
   * GET /user/:userId
   */
  async getUserById(userId: string): Promise<IUser> {
    const response = await this.get<{ user: IUser }>(
      buildApiUrl(USER_ENDPOINTS.GET_USER, { userId })
    );
    return response.data.user;
  }

  /**
   * Update user profile
   * PUT /user/:userId
   */
  async updateUser(userId: string, data: IUpdateUserFormData): Promise<IUser> {
    const response = await this.put<{ user: IUser }>(
      buildApiUrl(USER_ENDPOINTS.UPDATE_USER, { userId }),
      data
    );
    return response.data.user;
  }

  /**
   * Update user profile information
   * PATCH /user/:userId/profile
   */
  async updateUserProfile(userId: string, profile: Partial<IUserProfile>): Promise<IUser> {
    const response = await this.patch<{ user: IUser }>(
      buildApiUrl(USER_ENDPOINTS.UPDATE_USER_PROFILE, { userId }),
      { profile }
    );
    return response.data.user;
  }

  /**
   * Change user password
   * PUT /user/:userId/password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await this.put(buildApiUrl(USER_ENDPOINTS.CHANGE_PASSWORD, { userId }), {
      currentPassword,
      newPassword,
    });
  }

  /**
   * Deactivate user account
   * PUT /user/:userId/deactivate
   */
  async deactivateUser(userId: string): Promise<void> {
    await this.put(buildApiUrl(USER_ENDPOINTS.DEACTIVATE_USER, { userId }), {});
  }

  /**
   * Reactivate user account
   * PUT /user/:userId/reactivate
   */
  async reactivateUser(userId: string): Promise<void> {
    await this.put(buildApiUrl(USER_ENDPOINTS.REACTIVATE_USER, { userId }), {});
  }

  // ============================================
  // USER LISTING AND SEARCH
  // ============================================

  /**
   * Get all users with pagination
   * GET /user/list
   */
  async getUsers(params?: ISearchParams): Promise<IPaginatedResponse<IUser>> {
    const queryParams = new URLSearchParams();

    if (params?.pagination) {
      queryParams.append('page', params.pagination.page?.toString() || '1');
      queryParams.append('limit', params.pagination.limit?.toString() || '10');
    }

    if (params?.query) {
      queryParams.append('search', params.query);
    }

    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${USER_ENDPOINTS.LIST_USERS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.get<IPaginatedResponse<IUser>['data']>(url);
  }

  /**
   * Search users with filters
   * GET /user/search
   */
  async searchUsers(
    filters: IUserSearchFilters,
    pagination?: any
  ): Promise<IPaginatedResponse<IUser>> {
    const params: ISearchParams = {
      filters,
      pagination,
    };
    return this.getUsers(params);
  }

  /**
   * Get users by status
   * GET /user/by-status/:status
   */
  async getUsersByStatus(status: string): Promise<IUser[]> {
    const response = await this.get<{ users: IUser[] }>(
      buildApiUrl(USER_ENDPOINTS.USERS_BY_STATUS, { status })
    );
    return response.data.users;
  }

  /**
   * Get users by role
   * GET /user/by-role/:role
   */
  async getUsersByRole(role: string): Promise<IUser[]> {
    const response = await this.get<{ users: IUser[] }>(
      buildApiUrl(USER_ENDPOINTS.USERS_BY_ROLE, { role })
    );
    return response.data.users;
  }

  // ============================================
  // USER STATISTICS
  // ============================================

  /**
   * Get user statistics
   * GET /user/stats
   */
  async getUserStats(): Promise<{
    total: number;
    active: number;
    pending: number;
    suspended: number;
    byCountry: Array<{ country: string; count: number }>;
    byRole: Array<{ role: string; count: number }>;
  }> {
    const response = await this.get<{
      total: number;
      active: number;
      pending: number;
      suspended: number;
      byCountry: Array<{ country: string; count: number }>;
      byRole: Array<{ role: string; count: number }>;
    }>(USER_ENDPOINTS.USER_STATS);
    return response.data;
  }

  /**
   * Get user registration analytics
   * GET /user/analytics/registrations
   */
  async getUserRegistrationAnalytics(
    startDate?: Date,
    endDate?: Date
  ): Promise<Array<{ date: string; count: number }>> {
    const queryParams = new URLSearchParams();

    if (startDate) {
      queryParams.append('startDate', startDate.toISOString());
    }

    if (endDate) {
      queryParams.append('endDate', endDate.toISOString());
    }

    const url = `${USER_ENDPOINTS.USER_ANALYTICS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.get<{ analytics: Array<{ date: string; count: number }> }>(url);
    return response.data.analytics;
  }

  // ============================================
  // BULK OPERATIONS
  // ============================================

  /**
   * Bulk update user status
   * PUT /user/bulk/status
   */
  async bulkUpdateUserStatus(userIds: string[], status: string): Promise<void> {
    await this.put(USER_ENDPOINTS.BULK_UPDATE_STATUS, {
      userIds,
      status,
    });
  }

  /**
   * Bulk assign role to users
   * PUT /user/bulk/role
   */
  async bulkAssignRole(userIds: string[], role: string): Promise<void> {
    await this.put(USER_ENDPOINTS.BULK_ASSIGN_ROLE, {
      userIds,
      role,
    });
  }

  /**
   * Export users data
   * GET /user/export
   */
  async exportUsers(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const response = await this.get<Blob>(`${USER_ENDPOINTS.EXPORT_USERS}?format=${format}`);
    return response.data;
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const userService = new UserService();
