// services/api/role.service.ts
// Role management API service

import { BaseApiService } from './base.service';
import { ROLE_ENDPOINTS, buildApiUrl } from '@/constants/api-endpoints';
import { IRole, ICreateRoleFormData, IPaginatedResponse, ISearchParams } from '@/types/backend';

export class RoleService extends BaseApiService {
  // ============================================
  // ROLE MANAGEMENT
  // ============================================

  /**
   * Create a new role
   * POST /role/create-role
   */
  async createRole(data: ICreateRoleFormData): Promise<IRole> {
    const response = await this.post<{ role: IRole }>(ROLE_ENDPOINTS.CREATE_ROLE, data);
    return response.data.role;
  }

  /**
   * Get role by ID
   * GET /role/:roleId
   */
  async getRoleById(roleId: string): Promise<IRole> {
    const response = await this.get<{ role: IRole }>(
      buildApiUrl(ROLE_ENDPOINTS.GET_ROLE, { roleId })
    );
    return response.data.role;
  }

  /**
   * Get role by roleId field
   * GET /role/by-role-id/:roleId
   */
  async getRoleByRoleId(roleId: string): Promise<IRole> {
    const response = await this.get<{ role: IRole }>(
      buildApiUrl(ROLE_ENDPOINTS.GET_ROLE_BY_ID, { roleId })
    );
    return response.data.role;
  }

  /**
   * Update role
   * PUT /role/:roleId
   */
  async updateRole(roleId: string, data: Partial<ICreateRoleFormData>): Promise<IRole> {
    const response = await this.put<{ role: IRole }>(
      buildApiUrl(ROLE_ENDPOINTS.UPDATE_ROLE, { roleId }),
      data
    );
    return response.data.role;
  }

  /**
   * Delete role
   * DELETE /role/:roleId
   */
  async deleteRole(roleId: string): Promise<void> {
    await this.delete(buildApiUrl(ROLE_ENDPOINTS.DELETE_ROLE, { roleId }));
  }

  // ============================================
  // ROLE LISTING
  // ============================================

  /**
   * Get all roles
   * GET /role/list
   */
  async getRoles(params?: ISearchParams): Promise<IPaginatedResponse<IRole>> {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    if (params?.search) {
      queryParams.append('search', params.search);
    }

    const url = `${ROLE_ENDPOINTS.LIST_ROLES}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.get<IPaginatedResponse<IRole>>(url);
    return response.data;
  }

  /**
   * Get roles by group
   * GET /role/by-group/:groupId
   */
  async getRolesByGroup(groupId: string): Promise<IRole[]> {
    const response = await this.get<{ roles: IRole[] }>(
      buildApiUrl(ROLE_ENDPOINTS.ROLES_BY_GROUP, { groupId })
    );
    return response.data.roles;
  }

  // ============================================
  // ROLE PERMISSIONS
  // ============================================

  /**
   * Assign groups to role
   * PUT /role/:roleId/groups
   */
  async assignGroupsToRole(roleId: string, groupIds: string[]): Promise<IRole> {
    const response = await this.put<{ role: IRole }>(
      buildApiUrl(ROLE_ENDPOINTS.ASSIGN_GROUPS_TO_ROLE, { roleId }),
      {
        groupIds,
      }
    );
    return response.data.role;
  }

  /**
   * Remove groups from role
   * DELETE /role/:roleId/groups
   */
  async removeGroupsFromRole(roleId: string, _groupIds: string[]): Promise<IRole> {
    const response = await this.delete<{ role: IRole }>(
      buildApiUrl(ROLE_ENDPOINTS.REMOVE_GROUPS_FROM_ROLE, { roleId })
    );
    return response.data.role;
  }

  // ============================================
  // ROLE STATISTICS
  // ============================================

  /**
   * Get role statistics
   * GET /role/stats
   */
  async getRoleStats(): Promise<{
    total: number;
    byGroup: Array<{ groupId: string; count: number }>;
    userCount: Array<{ roleId: string; count: number }>;
  }> {
    const response = await this.get<{
      total: number;
      byGroup: Array<{ groupId: string; count: number }>;
      userCount: Array<{ roleId: string; count: number }>;
    }>(ROLE_ENDPOINTS.ROLE_STATS);
    return response.data;
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const roleService = new RoleService();
