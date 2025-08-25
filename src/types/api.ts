import {
  User,
  Tenant,
  Interview,
  Candidate,
  Session,
  Analytics,
  Notification,
  Integration,
} from './global';

// Auth API Types
export interface LoginRequest {
  email: string;
  password: string;
  tenantSlug?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  tenantName?: string;
  tenantSlug?: string;
}

export interface AuthResponse {
  user: User;
  tenant: Tenant;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

// Interview API Types
export interface CreateInterviewRequest {
  title: string;
  description?: string;
  candidateId: string;
  scheduledAt?: string;
  questions?: string[];
  voiceProvider?: string;
  voiceSettings?: Record<string, any>;
}

export interface UpdateInterviewRequest {
  title?: string;
  description?: string;
  scheduledAt?: string;
  status?: string;
  notes?: string;
  score?: number;
}

export interface InterviewListResponse {
  interviews: Interview[];
  total: number;
  page: number;
  limit: number;
}

export interface StartInterviewRequest {
  sessionToken: string;
}

export interface EndInterviewRequest {
  sessionToken: string;
  responses: Array<{
    questionId: string;
    response: string;
    audioUrl?: string;
    duration: number;
  }>;
}

// Candidate API Types
export interface CreateCandidateRequest {
  name: string;
  email: string;
  phone?: string;
  position: string;
  resumeFile?: File;
  source?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateCandidateRequest {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  status?: string;
  notes?: string;
  tags?: string[];
}

export interface CandidateListResponse {
  candidates: Candidate[];
  total: number;
  page: number;
  limit: number;
}

// Resume API Types
export interface UploadResumeRequest {
  candidateId: string;
  file: File;
}

export interface ResumeAnalysisResponse {
  extractedData: {
    personalInfo: Record<string, any>;
    experience: any[];
    education: any[];
    skills: string[];
    summary?: string;
  };
  analysisResult: {
    skillsMatch: number;
    experienceLevel: string;
    recommendedQuestions: string[];
    keyStrengths: string[];
    potentialConcerns: string[];
  };
}

// User API Types
export interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
  password?: string;
  sendInvite?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

// Analytics API Types
export interface AnalyticsQuery {
  startDate?: string;
  endDate?: string;
  type?: string;
  entityType?: string;
  entityId?: string;
  groupBy?: string;
  limit?: number;
}

export interface AnalyticsResponse {
  data: Analytics[];
  summary: Record<string, any>;
  charts: Array<{
    type: string;
    data: any[];
    config: Record<string, any>;
  }>;
}

// Session API Types
export interface CreateSessionRequest {
  interviewId: string;
  candidateId: string;
  expiresIn?: number;
}

export interface SessionResponse {
  session: Session;
  interviewUrl: string;
  widgetUrl?: string;
}

// Notification API Types
export interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
}

export interface MarkNotificationReadRequest {
  notificationIds: string[];
}

// Integration API Types
export interface CreateIntegrationRequest {
  name: string;
  type: string;
  provider: string;
  config: Record<string, any>;
  credentials: Record<string, any>;
}

export interface UpdateIntegrationRequest {
  name?: string;
  config?: Record<string, any>;
  credentials?: Record<string, any>;
  isActive?: boolean;
}

export interface IntegrationListResponse {
  integrations: Integration[];
  total: number;
}

// File Upload Types
export interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Webhook Types
export interface WebhookPayload {
  event: string;
  data: Record<string, any>;
  timestamp: string;
  signature: string;
}

// Widget API Types
export interface WidgetConfigResponse {
  config: {
    tenantId: string;
    isEnabled: boolean;
    customization: Record<string, any>;
    features: Record<string, boolean>;
  };
  assets: {
    scriptUrl: string;
    styleUrl: string;
  };
}
