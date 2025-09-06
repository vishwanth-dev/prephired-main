// services/api/group.service.ts
// Group management API service

import { BaseApiService } from './base.service';
import { GROUP_ENDPOINTS, buildApiUrl } from '@/constants/api-endpoints';
import {
  IGroup,
  ICreateGroupFormData,
  IModulePermission,
  IPaginatedResponse,
  ISearchParams,
} from '@/types/backend';

export class GroupService extends BaseApiService {
  // ============================================
  // GROUP MANAGEMENT
  // ============================================

  /**
   * Create a new group
   * POST /group/create-group
   */
  async createGroup(data: ICreateGroupFormData): Promise<IGroup> {
    const response = await this.post<{ group: IGroup }>(GROUP_ENDPOINTS.CREATE_GROUP, data);
    return response.data.group;
  }

  /**
   * Get group by ID
   * GET /group/:groupId
   */
  async getGroupById(groupId: string): Promise<IGroup> {
    const response = await this.get<{ group: IGroup }>(
      buildApiUrl(GROUP_ENDPOINTS.GET_GROUP, { groupId })
    );
    return response.data.group;
  }

  /**
   * Get group by groupId field
   * GET /group/by-group-id/:groupId
   */
  async getGroupByGroupId(groupId: string): Promise<IGroup> {
    const response = await this.get<{ group: IGroup }>(
      buildApiUrl(GROUP_ENDPOINTS.GET_GROUP_BY_ID, { groupId })
    );
    return response.data.group;
  }

  /**
   * Update group
   * PUT /group/:groupId
   */
  async updateGroup(groupId: string, data: Partial<ICreateGroupFormData>): Promise<IGroup> {
    const response = await this.put<{ group: IGroup }>(
      buildApiUrl(GROUP_ENDPOINTS.UPDATE_GROUP, { groupId }),
      data
    );
    return response.data.group;
  }

  /**
   * Delete group
   * DELETE /group/:groupId
   */
  async deleteGroup(groupId: string): Promise<void> {
    await this.delete(buildApiUrl(GROUP_ENDPOINTS.DELETE_GROUP, { groupId }));
  }

  // ============================================
  // GROUP LISTING
  // ============================================

  /**
   * Get all groups
   * GET /group/list
   */
  async getGroups(params?: ISearchParams): Promise<IPaginatedResponse<IGroup>> {
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

    const url = `${GROUP_ENDPOINTS.LIST_GROUPS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.get<IPaginatedResponse<IGroup>>(url);
    return response.data;
  }

  // ============================================
  // GROUP PERMISSIONS
  // ============================================

  /**
   * Add module permissions to group
   * POST /group/:groupId/modules
   */
  async addModulePermissions(groupId: string, modules: IModulePermission[]): Promise<IGroup> {
    const response = await this.post<{ group: IGroup }>(
      buildApiUrl(GROUP_ENDPOINTS.ADD_MODULE_PERMISSIONS, { groupId }),
      {
        modules,
      }
    );
    return response.data.group;
  }

  /**
   * Update module permissions for group
   * PUT /group/:groupId/modules
   */
  async updateModulePermissions(groupId: string, modules: IModulePermission[]): Promise<IGroup> {
    const response = await this.put<{ group: IGroup }>(
      buildApiUrl(GROUP_ENDPOINTS.UPDATE_MODULE_PERMISSIONS, { groupId }),
      {
        modules,
      }
    );
    return response.data.group;
  }

  /**
   * Remove module permissions from group
   * DELETE /group/:groupId/modules
   */
  async removeModulePermissions(groupId: string, _moduleNames: string[]): Promise<IGroup> {
    const response = await this.delete<{ group: IGroup }>(
      buildApiUrl(GROUP_ENDPOINTS.REMOVE_MODULE_PERMISSIONS, { groupId })
    );
    return response.data.group;
  }

  /**
   * Update specific module permissions
   * PATCH /group/:groupId/modules/:moduleName
   */
  async updateModulePermission(
    groupId: string,
    moduleName: string,
    permissions: Partial<IModulePermission['permissions']>
  ): Promise<IGroup> {
    const response = await this.patch<{ group: IGroup }>(
      buildApiUrl(GROUP_ENDPOINTS.UPDATE_MODULE_PERMISSION, { groupId, moduleName }),
      {
        permissions,
      }
    );
    return response.data.group;
  }

  // ============================================
  // PERMISSION CHECKING
  // ============================================

  /**
   * Check if group has permission for module and action
   * GET /group/:groupId/permissions/:module/:action
   */
  async checkGroupPermission(
    groupId: string,
    module: string,
    action: string
  ): Promise<{ hasPermission: boolean }> {
    const response = await this.get<{ hasPermission: boolean }>(
      buildApiUrl(GROUP_ENDPOINTS.CHECK_GROUP_PERMISSION, { groupId, module, action })
    );
    return response.data;
  }

  /**
   * Get all permissions for group
   * GET /group/:groupId/permissions
   */
  async getGroupPermissions(groupId: string): Promise<IModulePermission[]> {
    const response = await this.get<{ permissions: IModulePermission[] }>(
      buildApiUrl(GROUP_ENDPOINTS.GET_GROUP_PERMISSIONS, { groupId })
    );
    return response.data.permissions;
  }

  // ============================================
  // GROUP STATISTICS
  // ============================================

  /**
   * Get group statistics
   * GET /group/stats
   */
  async getGroupStats(): Promise<{
    total: number;
    byModule: Array<{ module: string; count: number }>;
    roleCount: Array<{ groupId: string; count: number }>;
  }> {
    const response = await this.get<{
      total: number;
      byModule: Array<{ module: string; count: number }>;
      roleCount: Array<{ groupId: string; count: number }>;
    }>(GROUP_ENDPOINTS.GROUP_STATS);
    return response.data;
  }

  // ============================================
  // TEMPLATE GROUPS
  // ============================================

  /**
   * Get predefined group templates
   * GET /group/templates
   */
  async getGroupTemplates(): Promise<
    Array<{
      name: string;
      description: string;
      modules: IModulePermission[];
    }>
  > {
    const response = await this.get<{
      templates: Array<{
        name: string;
        description: string;
        modules: IModulePermission[];
      }>;
    }>(GROUP_ENDPOINTS.GROUP_TEMPLATES);
    return response.data.templates;
  }

  /**
   * Create group from template
   * POST /group/from-template
   */
  async createGroupFromTemplate(templateName: string, customName?: string): Promise<IGroup> {
    const response = await this.post<{ group: IGroup }>(
      GROUP_ENDPOINTS.CREATE_GROUP_FROM_TEMPLATE,
      {
        templateName,
        customName,
      }
    );
    return response.data.group;
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const groupService = new GroupService();
