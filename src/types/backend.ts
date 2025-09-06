/**
 * 🏗️ Backend API Types
 *
 * This file contains all TypeScript interfaces and types that correspond
 * to the backend API models and endpoints. It serves as the single source
 * of truth for backend data structures.
 *
 * 📋 Based on: BACKEND_API_REFERENCE.md and BACKEND_ANALYSIS.md
 *
 * 🔧 Usage:
 * ```typescript
 * import { IUser, IAuthResponse, IRegisterFormData } from '@/types/backend';
 * ```
 */

// ============================================
// 🗄️ DATABASE MODELS
// ============================================

/**
 * User Model Interface
 * Based on backend users collection
 */
export interface IUser {
  _id: string; // MongoDB ObjectId
  firstName: string; // Required, 3-50 chars, alpha only
  lastName: string; // Default: ""
  userId: string; // Unique, auto-generated
  password: string; // Required, min 8 chars, complex
  confirmPass: string; // Required, must match password
  phoneNumber: string; // Required, numeric
  email: string; // Required, unique, indexed
  code: string; // Required, country code
  profilePicture: string; // Default: ""
  profile: {
    bio?: string; // Default: ""
    skills?: string[]; // Default: []
    education?: string; // Default: ""
    experience?: string; // Default: ""
  };
  country: string; // Default: ""
  role: string; // Default: ""
  status: 'pending' | 'active' | 'suspended'; // Default: "pending"
  consent: boolean; // Required, default: true
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Role Model Interface
 * Based on backend roles collection
 */
export interface IRole {
  _id: string; // MongoDB ObjectId
  name: string; // Required, unique, indexed
  description?: string;
  roleId: string; // Required, unique, indexed
  groups: string[]; // Array of group IDs
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Group Model Interface
 * Based on backend groups collection
 */
export interface IGroup {
  _id: string; // MongoDB ObjectId
  name: string; // Required
  description?: string;
  groupId: string; // Required, unique, indexed
  modules: IModulePermission[]; // Array of module permissions
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Module Permission Interface
 * Part of Group model
 */
export interface IModulePermission {
  module: string; // e.g., "Interview", "Dashboard"
  permissions: IPermissions;
}

/**
 * Permissions Interface
 * Part of ModulePermission
 */
export interface IPermissions {
  create: boolean; // Default: false
  read: boolean; // Default: false
  update: boolean; // Default: false
  delete: boolean; // Default: false
}

/**
 * Tenant Model Interface
 * Based on backend tenants collection
 */
export interface ITenant {
  _id: string; // MongoDB ObjectId
  tenantId: string; // Required, unique, indexed
  tenantName: string; // Required, indexed
  tenantEmail: string; // Required
  tenantPass: string; // Required
  webLink: string; // Required
  subdomain: string; // Required, unique, indexed
  accountStatus: 'active' | 'in-active' | 'suspended'; // Default: "active"
  tenantLogo?: string;
  comments?: string;
  subscriptionPlan?: string;
  createdBy: string; // Required
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Resume Model Interface
 * Based on backend resumes collection
 */
export interface IResume {
  _id: string; // MongoDB ObjectId
  userId: string; // Required
  resumeUrl: string; // Required
  resumeId: string; // Required, unique
  parsedText?: string; // Optional
  scores: Record<string, any>; // Default: {}
  status: 'uploaded' | 'processing' | 'scored'; // Default: "uploaded"
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Email Model Interface
 * Based on backend emails collection
 */
export interface IEmail {
  _id: string; // MongoDB ObjectId
  to: string; // Required
  subject: string; // Required
  html: string; // Required
  userId?: string; // Optional, indexed
  emailType?: string; // Optional
  otp?: number; // Optional
  tenantId?: string; // Optional, indexed
  active: boolean; // Default: true
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// 🔐 AUTHENTICATION TYPES
// ============================================

/**
 * Authentication Response Interface
 * Standard API response for auth endpoints
 */
export interface IAuthResponse {
  data: {
    user: IUser;
    token: string;
    refreshToken?: string;
    expiresIn?: number;
  };
  message: string;
  statusCode: number;
  error?: string;
}

/**
 * Registration Form Data Interface
 * Based on /user/register endpoint
 */
export interface IRegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  code: string;
  country: string;
  password: string;
  confirmPass: string;
  consent: boolean;
}

/**
 * Login Form Data Interface
 * Based on /user/login endpoint
 */
export interface ILoginFormData {
  email: string;
  password: string;
}

/**
 * OTP Verification Form Data Interface
 * Based on /user/verify-otp endpoint
 */
export interface IVerifyOTPFormData {
  userId: string;
  otp: string;
}

/**
 * Role Selection Form Data Interface
 * Based on /user/select-role endpoint
 */
export interface ISelectRoleFormData {
  userId: string;
  role: string;
}

// ============================================
// 📝 FORM DATA TYPES
// ============================================

/**
 * Create Role Form Data Interface
 * Based on /role/create-role endpoint
 */
export interface ICreateRoleFormData {
  name: string;
  description?: string;
  groups?: string[];
}

/**
 * Create Group Form Data Interface
 * Based on /group/create-group endpoint
 */
export interface ICreateGroupFormData {
  name: string;
  description?: string;
  modules?: IModulePermission[];
}

/**
 * Tenant Request Form Data Interface
 * Based on /tenant/apply endpoint
 */
export interface ITenantRequestFormData {
  tenantName: string;
  tenantEmail: string;
  tenantPass: string;
  webLink: string;
  subdomain: string;
  createdBy: string;
}

/**
 * Tenant Decision Form Data Interface
 * Based on /tenant/request/decision endpoint
 */
export interface ITenantDecisionFormData {
  requestId: string;
  action: 'approve' | 'reject';
  comments?: string;
}

/**
 * Create Tenant Form Data Interface
 * Based on /tenant/create-tenant endpoint
 */
export interface ICreateTenantFormData {
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  tenantPass: string;
  webLink: string;
  subdomain: string;
}

/**
 * Update Tenant Form Data Interface
 * Based on /tenant/update-tenant endpoint
 */
export interface IUpdateTenantFormData {
  tenantId: string;
  tenantName?: string;
  tenantEmail?: string;
  webLink?: string;
  subdomain?: string;
  accountStatus?: 'active' | 'in-active' | 'suspended';
  tenantLogo?: string;
  comments?: string;
  subscriptionPlan?: string;
}

/**
 * Update User Form Data Interface
 * For user profile updates
 */
export interface IUpdateUserFormData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  country?: string;
  code?: string;
  profile?: Partial<IUser['profile']>;
}

/**
 * User Profile Interface
 * Extracted from IUser for easier handling
 */
export interface IUserProfile {
  bio?: string;
  skills?: string[];
  education?: string;
  experience?: string;
}

// ============================================
// 🌐 API RESPONSE TYPES
// ============================================

/**
 * Standard API Response Interface
 * Based on backend response format
 */
export interface IApiResponse<T = any> {
  data: T;
  message: string;
  error?: string;
  statusCode: number;
  count?: number;
  percentage?: number;
}

/**
 * Paginated Response Interface
 * For list endpoints with pagination
 */
export interface IPaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  message: string;
  statusCode: number;
}

/**
 * Search Parameters Interface
 * For filtered and paginated requests
 */
export interface ISearchParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

/**
 * File Upload Response Interface
 * For file upload endpoints
 */
export interface IFileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

/**
 * Resume Processing Status Interface
 * For resume processing endpoints
 */
export interface IResumeProcessingStatus {
  resumeId: string;
  status: 'uploaded' | 'processing' | 'scored' | 'error';
  progress: number;
  message: string;
  error?: string;
  scores?: Record<string, any>;
  parsedText?: string;
}

// ============================================
// 🔍 SEARCH FILTER TYPES
// ============================================

/**
 * User Search Filters Interface
 * For advanced user search
 */
export interface IUserSearchFilters {
  status?: string[];
  role?: string[];
  country?: string[];
  createdAfter?: Date;
  createdBefore?: Date;
  search?: string;
}

/**
 * Tenant Search Filters Interface
 * For advanced tenant search
 */
export interface ITenantSearchFilters {
  status?: string[];
  subscriptionPlan?: string[];
  createdAfter?: Date;
  createdBefore?: Date;
  search?: string;
}

// ============================================
// 🎯 PERMISSION TYPES
// ============================================

/**
 * Module Type Enumeration
 * Available modules for permissions
 */
export type ModuleType =
  | 'Dashboard'
  | 'Users'
  | 'Roles'
  | 'Groups'
  | 'Tenants'
  | 'Resumes'
  | 'Interviews'
  | 'Analytics'
  | 'Settings';

/**
 * Permission Action Enumeration
 * Available actions for permissions
 */
export type PermissionAction = 'create' | 'read' | 'update' | 'delete';

/**
 * User Status Type
 * Based on backend user status field
 */
export type UserStatus = 'pending' | 'active' | 'suspended';

/**
 * Tenant Status Type
 * Based on backend tenant accountStatus field
 */
export type TenantStatus = 'active' | 'in-active' | 'suspended';

// ============================================
// 📊 STATISTICS TYPES
// ============================================

/**
 * User Statistics Interface
 * For user analytics endpoints
 */
export interface IUserStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  byCountry: Array<{ country: string; count: number }>;
  byRole: Array<{ role: string; count: number }>;
}

/**
 * Tenant Statistics Interface
 * For tenant analytics endpoints
 */
export interface ITenantStats {
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
}

/**
 * Resume Statistics Interface
 * For resume analytics endpoints
 */
export interface IResumeStats {
  total: number;
  uploaded: number;
  processing: number;
  scored: number;
  averageScore: number;
  byStatus: Array<{ status: string; count: number }>;
  processingTime: {
    average: number;
    min: number;
    max: number;
  };
}

// ============================================
// 🎯 EXPORT ALL TYPES
// ============================================

/**
 * Complete types object for easy access
 * Note: Types are exported individually above, this is just for documentation
 */
export const BACKEND_TYPES_INFO = {
  // Database models
  models: ['IUser', 'IRole', 'IGroup', 'ITenant', 'IResume', 'IEmail'],

  // Authentication
  auth: [
    'IAuthResponse',
    'IRegisterFormData',
    'ILoginFormData',
    'IVerifyOTPFormData',
    'ISelectRoleFormData',
  ],

  // Forms
  forms: [
    'ICreateRoleFormData',
    'ICreateGroupFormData',
    'ITenantRequestFormData',
    'ITenantDecisionFormData',
    'ICreateTenantFormData',
    'IUpdateTenantFormData',
    'IUpdateUserFormData',
  ],

  // API responses
  api: [
    'IApiResponse',
    'IPaginatedResponse',
    'ISearchParams',
    'IFileUploadResponse',
    'IResumeProcessingStatus',
  ],

  // Search filters
  filters: ['IUserSearchFilters', 'ITenantSearchFilters'],

  // Permissions
  permissions: ['ModuleType', 'PermissionAction', 'UserStatus', 'TenantStatus'],

  // Statistics
  stats: ['IUserStats', 'ITenantStats', 'IResumeStats'],
} as const;

// Default export for convenience
export default BACKEND_TYPES_INFO;
