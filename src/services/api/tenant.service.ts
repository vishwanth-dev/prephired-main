// services/api/tenant.service.ts
// Tenant management API service

import { BaseApiService } from './base.service';
import { TENANT_ENDPOINTS, buildApiUrl } from '@/constants/api-endpoints';
import {
  ITenant,
  ITenantRequestFormData,
  ITenantDecisionFormData,
  ICreateTenantFormData,
  IUpdateTenantFormData,
  IPaginatedResponse,
  ISearchParams,
  ITenantSearchFilters,
} from '@/types/backend';

export class TenantService extends BaseApiService {
  // ============================================
  // TENANT REQUESTS
  // ============================================

  /**
   * Create tenant request
   * POST /tenant/apply
   */
  async createTenantRequest(data: ITenantRequestFormData): Promise<{
    requestId: string;
    status: 'pending';
    message: string;
  }> {
    const response = await this.post<{
      requestId: string;
      status: 'pending';
      message: string;
    }>(TENANT_ENDPOINTS.APPLY, data);
    return response.data;
  }

  /**
   * Approve or reject tenant request
   * PUT /tenant/request/decision
   */
  async decideTenantRequest(data: ITenantDecisionFormData): Promise<{
    requestId: string;
    action: 'approve' | 'reject';
    status: string;
    message: string;
  }> {
    const response = await this.put<{
      requestId: string;
      action: 'approve' | 'reject';
      status: string;
      message: string;
    }>(TENANT_ENDPOINTS.REQUEST_DECISION, data);
    return response.data;
  }

  /**
   * Get tenant request by ID
   * GET /tenant/request/:requestId
   */
  async getTenantRequest(requestId: string): Promise<{
    requestId: string;
    tenantName: string;
    tenantEmail: string;
    webLink: string;
    subdomain: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    decidedAt?: Date;
    comments?: string;
  }> {
    const response = await this.get<{
      requestId: string;
      tenantName: string;
      tenantEmail: string;
      webLink: string;
      subdomain: string;
      status: 'pending' | 'approved' | 'rejected';
      createdAt: Date;
      decidedAt?: Date;
      comments?: string;
    }>(buildApiUrl(TENANT_ENDPOINTS.GET_TENANT_REQUEST, { requestId }));
    return response.data;
  }

  /**
   * List tenant requests
   * GET /tenant/requests
   */
  async getTenantRequests(params?: ISearchParams): Promise<
    IPaginatedResponse<{
      requestId: string;
      tenantName: string;
      tenantEmail: string;
      status: 'pending' | 'approved' | 'rejected';
      createdAt: Date;
    }>
  > {
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

    const url = `${TENANT_ENDPOINTS.LIST_TENANT_REQUESTS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.get<
      IPaginatedResponse<{
        requestId: string;
        tenantName: string;
        tenantEmail: string;
        status: 'pending' | 'approved' | 'rejected';
        createdAt: Date;
      }>
    >(url);
    return response.data;
  }

  // ============================================
  // TENANT MANAGEMENT
  // ============================================

  /**
   * Create tenant
   * POST /tenant/create-tenant
   */
  async createTenant(data: ICreateTenantFormData): Promise<ITenant> {
    const response = await this.post<{ tenant: ITenant }>(TENANT_ENDPOINTS.CREATE_TENANT, data);
    return response.data.tenant;
  }

  /**
   * Get tenant by ID
   * GET /tenant/get-tenant/:tenantId
   */
  async getTenant(tenantId: string): Promise<ITenant> {
    const response = await this.get<{ tenant: ITenant }>(
      buildApiUrl(TENANT_ENDPOINTS.GET_TENANT, { tenantId })
    );
    return response.data.tenant;
  }

  /**
   * Update tenant
   * PUT /tenant/update-tenant
   */
  async updateTenant(data: IUpdateTenantFormData): Promise<ITenant> {
    const response = await this.put<{ tenant: ITenant }>(TENANT_ENDPOINTS.UPDATE_TENANT, data);
    return response.data.tenant;
  }

  /**
   * Delete tenant
   * DELETE /tenant/:tenantId
   */
  async deleteTenant(tenantId: string): Promise<void> {
    await this.delete(buildApiUrl(TENANT_ENDPOINTS.DELETE_TENANT, { tenantId }));
  }

  // ============================================
  // TENANT LISTING
  // ============================================

  /**
   * List tenants
   * GET /tenant/list-tenants
   */
  async listTenants(params?: ISearchParams): Promise<IPaginatedResponse<ITenant>> {
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

    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${TENANT_ENDPOINTS.LIST_TENANTS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.get<IPaginatedResponse<ITenant>>(url);
    return response.data;
  }

  /**
   * Search tenants with filters
   * GET /tenant/search
   */
  async searchTenants(
    filters: ITenantSearchFilters,
    pagination?: { page?: number; limit?: number }
  ): Promise<IPaginatedResponse<ITenant>> {
    const params: ISearchParams = {
      filters,
      ...(pagination?.page !== undefined && { page: pagination.page }),
      ...(pagination?.limit !== undefined && { limit: pagination.limit }),
    };
    return this.listTenants(params);
  }

  /**
   * Get tenants by status
   * GET /tenant/by-status/:status
   */
  async getTenantsByStatus(status: string): Promise<ITenant[]> {
    const response = await this.get<{ tenants: ITenant[] }>(
      buildApiUrl(TENANT_ENDPOINTS.TENANTS_BY_STATUS, { status })
    );
    return response.data.tenants;
  }

  // ============================================
  // TENANT OPERATIONS
  // ============================================

  /**
   * Suspend tenant
   * PUT /tenant/:tenantId/suspend
   */
  async suspendTenant(tenantId: string, reason?: string): Promise<ITenant> {
    const response = await this.put<{ tenant: ITenant }>(
      buildApiUrl(TENANT_ENDPOINTS.SUSPEND_TENANT, { tenantId }),
      {
        reason,
      }
    );
    return response.data.tenant;
  }

  /**
   * Activate tenant
   * PUT /tenant/:tenantId/activate
   */
  async activateTenant(tenantId: string): Promise<ITenant> {
    const response = await this.put<{ tenant: ITenant }>(
      buildApiUrl(TENANT_ENDPOINTS.ACTIVATE_TENANT, { tenantId }),
      {}
    );
    return response.data.tenant;
  }

  /**
   * Update tenant subscription plan
   * PUT /tenant/:tenantId/subscription
   */
  async updateTenantSubscription(tenantId: string, plan: string): Promise<ITenant> {
    const response = await this.put<{ tenant: ITenant }>(
      buildApiUrl(TENANT_ENDPOINTS.UPDATE_TENANT_SUBSCRIPTION, { tenantId }),
      {
        subscriptionPlan: plan,
      }
    );
    return response.data.tenant;
  }

  // ============================================
  // TENANT STATISTICS
  // ============================================

  /**
   * Get tenant statistics
   * GET /tenant/stats
   */
  async getTenantStats(): Promise<{
    total: number;
    active: number;
    inActive: number;
    suspended: number;
    byPlan: Array<{ plan: string; count: number }>;
    requests: {
      pending: number;
      approved: number;
      rejected: number;
    };
  }> {
    const response = await this.get<{
      total: number;
      active: number;
      inActive: number;
      suspended: number;
      byPlan: Array<{ plan: string; count: number }>;
      requests: {
        pending: number;
        approved: number;
        rejected: number;
      };
    }>(TENANT_ENDPOINTS.TENANT_STATS);
    return response.data;
  }

  /**
   * Get tenant analytics
   * GET /tenant/analytics
   */
  async getTenantAnalytics(
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    registrationsByDate: Array<{ date: string; count: number }>;
    statusChanges: Array<{ date: string; status: string; count: number }>;
    topPlans: Array<{ plan: string; count: number }>;
  }> {
    const queryParams = new URLSearchParams();

    if (startDate) {
      queryParams.append('startDate', startDate.toISOString());
    }

    if (endDate) {
      queryParams.append('endDate', endDate.toISOString());
    }

    const url = `${TENANT_ENDPOINTS.TENANT_ANALYTICS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.get<{
      registrationsByDate: Array<{ date: string; count: number }>;
      statusChanges: Array<{ date: string; status: string; count: number }>;
      topPlans: Array<{ plan: string; count: number }>;
    }>(url);
    return response.data;
  }

  // ============================================
  // TENANT VALIDATION
  // ============================================

  /**
   * Check if subdomain is available
   * GET /tenant/check-subdomain/:subdomain
   */
  async checkSubdomainAvailability(subdomain: string): Promise<{ available: boolean }> {
    const response = await this.get<{ available: boolean }>(
      buildApiUrl(TENANT_ENDPOINTS.CHECK_SUBDOMAIN, { subdomain })
    );
    return response.data;
  }

  /**
   * Validate tenant configuration
   * POST /tenant/validate-config
   */
  async validateTenantConfig(data: Partial<ICreateTenantFormData>): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const response = await this.post<{
      valid: boolean;
      errors: string[];
    }>(TENANT_ENDPOINTS.VALIDATE_TENANT_CONFIG, data);
    return response.data;
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const tenantService = new TenantService();
