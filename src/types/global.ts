export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface TenantEntity extends BaseEntity {
  tenantId: string
}

export interface User extends BaseEntity {
  email: string
  name: string
  avatar?: string
  role: string
  tenantId: string
  isActive: boolean
  lastLoginAt?: Date
  emailVerifiedAt?: Date
}

export interface Tenant extends BaseEntity {
  name: string
  slug: string
  domain?: string
  plan: string
  settings: Record<string, any>
  isActive: boolean
  ownerId: string
  limits: {
    maxUsers: number
    maxInterviews: number
    maxCandidates: number
    maxStorage: number
  }
  usage: {
    users: number
    interviews: number
    candidates: number
    storage: number
  }
}

export interface Interview extends TenantEntity {
  title: string
  description?: string
  candidateId: string
  interviewerId: string
  status: string
  scheduledAt?: Date
  startedAt?: Date
  completedAt?: Date
  duration?: number
  resumeId?: string
  questions: InterviewQuestion[]
  responses: InterviewResponse[]
  score?: number
  notes?: string
  voiceProvider: string
  voiceSettings: Record<string, any>
  sessionId?: string
}

export interface InterviewQuestion {
  id: string
  question: string
  category: string
  expectedDuration: number
  order: number
  isRequired: boolean
}

export interface InterviewResponse {
  questionId: string
  response: string
  audioUrl?: string
  transcript?: string
  duration: number
  score?: number
  analysis?: Record<string, any>
}

export interface Candidate extends TenantEntity {
  email: string
  name: string
  phone?: string
  position: string
  resumeId?: string
  status: string
  source?: string
  notes?: string
  tags: string[]
  interviewIds: string[]
}

export interface Resume extends TenantEntity {
  candidateId: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  content?: string
  extractedData?: {
    personalInfo: Record<string, any>
    experience: any[]
    education: any[]
    skills: string[]
    summary?: string
  }
  analysisResult?: {
    skillsMatch: number
    experienceLevel: string
    recommendedQuestions: string[]
    keyStrengths: string[]
    potentialConcerns: string[]
  }
}

export interface Session extends TenantEntity {
  interviewId: string
  candidateId: string
  token: string
  status: string
  startTime?: Date
  endTime?: Date
  metadata: Record<string, any>
  expiresAt: Date
}

export interface Analytics extends TenantEntity {
  type: string
  event: string
  entityId?: string
  entityType?: string
  userId?: string
  metadata: Record<string, any>
  timestamp: Date
}

export interface AuditLog extends TenantEntity {
  userId: string
  action: string
  entityType: string
  entityId: string
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  metadata: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

export interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  isSystem: boolean
}

export interface Integration extends TenantEntity {
  name: string
  type: string
  provider: string
  config: Record<string, any>
  credentials: Record<string, any>
  isActive: boolean
  lastSyncAt?: Date
  webhookUrl?: string
}

export interface Notification extends TenantEntity {
  userId: string
  title: string
  message: string
  type: string
  isRead: boolean
  readAt?: Date
  data?: Record<string, any>
}

export interface VoiceProvider {
  id: string
  name: string
  type: string
  isActive: boolean
  config: Record<string, any>
  limits: {
    charactersPerMonth: number
    requestsPerMinute: number
  }
  usage: {
    charactersUsed: number
    requestsUsed: number
  }
}

export interface WidgetConfig {
  tenantId: string
  isEnabled: boolean
  allowedDomains: string[]
  customization: {
    theme: Record<string, any>
    branding: Record<string, any>
    features: Record<string, boolean>
  }
  settings: Record<string, any>
}
