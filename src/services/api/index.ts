// services/api/index.ts
// Export all API services

export { BaseApiService, apiService, ApiError } from './base.service';
export { AuthService, authService } from './auth.service';
export { UserService, userService } from './user.service';
export { RoleService, roleService } from './role.service';
export { GroupService, groupService } from './group.service';
export { TenantService, tenantService } from './tenant.service';
export { ResumeService, resumeService } from './resume.service';

// Import services for convenience exports
import { authService } from './auth.service';
import { userService } from './user.service';
import { roleService } from './role.service';
import { groupService } from './group.service';
import { tenantService } from './tenant.service';
import { resumeService } from './resume.service';
import { apiService } from './base.service';

// ============================================
// CONVENIENCE EXPORTS
// ============================================

/**
 * All API services in one object for easy access
 */
export const apiServices = {
  auth: authService,
  user: userService,
  role: roleService,
  group: groupService,
  tenant: tenantService,
  resume: resumeService,
};

/**
 * Base API service instance
 */
export const api = apiService;
