export const APP_CONFIG = {
  name: 'prepAI',
  description: 'AI-powered voice interview platform',
  version: '1.0.0',
  author: 'prepAI Team',
} as const

export const DATABASE_CONFIG = {
  collections: {
    users: 'users',
    tenants: 'tenants',
    interviews: 'interviews',
    candidates: 'candidates',
    sessions: 'sessions',
    resumes: 'resumes',
    analytics: 'analytics',
    audit_logs: 'audit_logs',
  },
} as const

export const VOICE_PROVIDERS = {
  MURF: 'murf',
  ELEVENLABS: 'elevenlabs',
  PLAYHT: 'playht',
  AZURE_SPEECH: 'azure_speech',
  BROWSER_SPEECH: 'browser_speech',
} as const

export const INTERVIEW_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
} as const

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  TENANT_ADMIN: 'tenant_admin',
  RECRUITER: 'recruiter',
  INTERVIEWER: 'interviewer',
  CANDIDATE: 'candidate',
} as const

export const TENANT_PLANS = {
  FREE: 'free',
  STARTER: 'starter',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
} as const

export const FILE_TYPES = {
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  TXT: 'text/plain',
} as const

export const PERMISSIONS = {
  // Interview permissions
  CREATE_INTERVIEW: 'create_interview',
  READ_INTERVIEW: 'read_interview',
  UPDATE_INTERVIEW: 'update_interview',
  DELETE_INTERVIEW: 'delete_interview',
  
  // Candidate permissions
  CREATE_CANDIDATE: 'create_candidate',
  READ_CANDIDATE: 'read_candidate',
  UPDATE_CANDIDATE: 'update_candidate',
  DELETE_CANDIDATE: 'delete_candidate',
  
  // User management
  CREATE_USER: 'create_user',
  READ_USER: 'read_user',
  UPDATE_USER: 'update_user',
  DELETE_USER: 'delete_user',
  
  // Analytics
  READ_ANALYTICS: 'read_analytics',
  EXPORT_DATA: 'export_data',
  
  // Admin permissions
  MANAGE_TENANT: 'manage_tenant',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_INTEGRATIONS: 'manage_integrations',
} as const

export const API_ROUTES = {
  AUTH: '/api/auth',
  INTERVIEWS: '/api/interviews',
  CANDIDATES: '/api/candidates',
  USERS: '/api/users',
  ANALYTICS: '/api/analytics',
  UPLOAD: '/api/upload',
  HEALTH: '/api/health',
} as const

export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  INTERVIEWS: '/interviews',
  CANDIDATES: '/candidates',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const;
