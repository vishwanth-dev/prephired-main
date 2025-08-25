// src/features/resume-analysis/constants/index.ts

/**
 * Configuration constants for the Resume Analysis feature
 * Centralized configuration following enterprise patterns
 */

// API Endpoints
export const RESUME_ANALYSIS_CONFIG = {
  API_ENDPOINTS: {
    // Resume endpoints
    RESUMES: '/api/resumes',
    RESUME_BY_ID: '/api/resumes/:id',
    RESUME_UPLOAD: '/api/resumes/upload',
    RESUME_DELETE: '/api/resumes/:id',
    RESUME_DOWNLOAD: '/api/resumes/:id/download',

    // Job Description endpoints
    JOB_DESCRIPTIONS: '/api/job-descriptions',
    JOB_DESCRIPTION_BY_ID: '/api/job-descriptions/:id',
    JOB_DESCRIPTION_UPLOAD: '/api/job-descriptions/upload',

    // Analysis endpoints
    ANALYZE_RESUME: '/api/analysis/score-resume',
    ANALYSIS_BY_ID: '/api/analysis/:id',
    GENERATE_AI_RESUME: '/api/analysis/generate-resume',
    ANALYSIS_HISTORY: '/api/analysis/history',

    // Template endpoints
    TEMPLATES: '/api/templates',
    TEMPLATE_BY_ID: '/api/templates/:id',
    TEMPLATE_PREVIEW: '/api/templates/:id/preview',

    // Real-time endpoints
    WEBSOCKET: '/api/ws/resume-processing',
  },

  // File upload validation
  VALIDATION: {
    FILE_SIZE: {
      MIN: 1024, // 1KB
      MAX: 10 * 1024 * 1024, // 10MB
    },
    SUPPORTED_FORMATS: ['pdf', 'doc', 'docx'] as const,
    SUPPORTED_MIME_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ] as const,

    // Text validation
    JOB_DESCRIPTION: {
      MIN_LENGTH: 50,
      MAX_LENGTH: 5000,
      MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB for JD files
    },

    // Resume content validation
    RESUME_CONTENT: {
      MIN_WORD_COUNT: 100,
      MAX_WORD_COUNT: 2000,
      REQUIRED_SECTIONS: ['personalInfo', 'workExperience'] as const,
    },
  },

  // Scoring thresholds
  SCORING: {
    EXCELLENT: 90,
    GOOD: 75,
    FAIR: 60,
    POOR: 40,

    // Section weight distributions
    SECTION_WEIGHTS: {
      personalInfo: 0.1,
      summary: 0.15,
      workExperience: 0.25,
      education: 0.15,
      skills: 0.2,
      formatting: 0.1,
      keywords: 0.05,
    } as const,
  },

  // Feature flags
  FEATURES: {
    AI_RESUME_GENERATION: true,
    REAL_TIME_ANALYSIS: true,
    TEMPLATE_RECOMMENDATIONS: true,
    BULK_UPLOAD: false,
    PREMIUM_TEMPLATES: true,
    EXPORT_FORMATS: ['pdf', 'docx'] as const,
  },

  // UI Configuration
  UI: {
    // Pagination
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50,

    // Progress indicators
    UPLOAD_PROGRESS_INTERVAL: 500, // ms
    ANALYSIS_POLLING_INTERVAL: 2000, // ms

    // Timeouts
    UPLOAD_TIMEOUT: 30000, // 30 seconds
    ANALYSIS_TIMEOUT: 120000, // 2 minutes

    // Animation durations
    TRANSITION_DURATION: 300, // ms

    // File preview
    MAX_PREVIEW_PAGES: 3,
    PREVIEW_IMAGE_QUALITY: 0.8,
  },
} as const;

// Status mappings for UI display
export const STATUS_LABELS = {
  uploading: 'Uploading...',
  processing: 'Processing...',
  completed: 'Completed',
  failed: 'Failed',
  analyzing: 'Analyzing...',
} as const;

export const STATUS_COLORS = {
  uploading: '#3B82F6', // blue
  processing: '#F59E0B', // amber
  completed: '#10B981', // emerald
  failed: '#EF4444', // red
  analyzing: '#8B5CF6', // violet
} as const;

// Score color mappings
export const SCORE_COLORS = {
  excellent: '#10B981', // emerald-500
  good: '#3B82F6', // blue-500
  fair: '#F59E0B', // amber-500
  poor: '#EF4444', // red-500
} as const;

// File type icons mapping
export const FILE_TYPE_ICONS = {
  pdf: '📄',
  doc: '📝',
  docx: '📝',
} as const;

// Template categories
export const TEMPLATE_CATEGORIES = {
  modern: {
    label: 'Modern',
    description: 'Clean, contemporary designs',
    icon: '✨',
  },
  classic: {
    label: 'Classic',
    description: 'Traditional, professional layouts',
    icon: '📋',
  },
  creative: {
    label: 'Creative',
    description: 'Unique designs for creative fields',
    icon: '🎨',
  },
  minimal: {
    label: 'Minimal',
    description: 'Simple, clean layouts',
    icon: '📄',
  },
  'ats-friendly': {
    label: 'ATS-Friendly',
    description: 'Optimized for applicant tracking systems',
    icon: '🤖',
  },
} as const;

// Feedback types with styling
export const FEEDBACK_TYPES = {
  strength: {
    label: 'Strength',
    icon: '✅',
    color: '#10B981',
    bgColor: '#D1FAE5',
  },
  improvement: {
    label: 'Improvement',
    icon: '💡',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
  },
  critical: {
    label: 'Critical',
    icon: '⚠️',
    color: '#EF4444',
    bgColor: '#FEE2E2',
  },
  suggestion: {
    label: 'Suggestion',
    icon: '💭',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
  },
} as const;

// Error messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds the maximum limit of 10MB',
  UNSUPPORTED_FORMAT: 'File format not supported. Please upload PDF, DOC, or DOCX files',
  UPLOAD_FAILED: 'Failed to upload file. Please try again',
  PROCESSING_FAILED: 'Failed to process resume. Please check file format and try again',
  ANALYSIS_FAILED: 'Failed to analyze resume. Please try again later',
  NETWORK_ERROR: 'Network error. Please check your connection and try again',
  INVALID_JOB_DESCRIPTION: 'Job description is too short. Please provide at least 50 characters',
  RESUME_NOT_FOUND: 'Resume not found',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait before trying again',
  AI_SERVICE_UNAVAILABLE: 'AI service is temporarily unavailable. Please try again later',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: 'Resume uploaded successfully',
  ANALYSIS_COMPLETE: 'Resume analysis completed',
  RESUME_GENERATED: 'AI resume generated successfully',
  DOWNLOAD_READY: 'Download ready',
  SETTINGS_SAVED: 'Settings saved successfully',
  FEEDBACK_SUBMITTED: 'Thank you for your feedback',
} as const;

// Default values for forms
export const DEFAULT_VALUES = {
  JOB_DESCRIPTION_FORM: {
    title: '',
    description: '',
    source: 'manual' as const,
  },

  AI_GENERATION_PREFERENCES: {
    tone: 'professional' as const,
    length: 'detailed' as const,
    focus: 'experience' as const,
  },

  ANALYSIS_REQUEST: {
    includeAiSuggestions: true,
    includeTemplateRecommendations: true,
  },
} as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  UPLOAD_RESUME: 'Ctrl+U',
  NEW_ANALYSIS: 'Ctrl+N',
  DOWNLOAD_RESUME: 'Ctrl+D',
  SAVE_CHANGES: 'Ctrl+S',
  CLOSE_MODAL: 'Escape',
} as const;

// Analytics events
export const ANALYTICS_EVENTS = {
  RESUME_UPLOADED: 'resume_uploaded',
  ANALYSIS_STARTED: 'analysis_started',
  ANALYSIS_COMPLETED: 'analysis_completed',
  AI_RESUME_GENERATED: 'ai_resume_generated',
  TEMPLATE_SELECTED: 'template_selected',
  FEEDBACK_SUBMITTED: 'feedback_submitted',
  DOWNLOAD_INITIATED: 'download_initiated',
  ERROR_OCCURRED: 'error_occurred',
} as const;

// Cache keys for data persistence
export const CACHE_KEYS = {
  RESUMES_LIST: 'resumes_list',
  RESUME_DETAIL: 'resume_detail_',
  JOB_DESCRIPTIONS: 'job_descriptions',
  ANALYSIS_RESULTS: 'analysis_results_',
  TEMPLATES_LIST: 'templates_list',
  USER_PREFERENCES: 'user_preferences',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  DRAFT_JOB_DESCRIPTION: 'draft_job_description',
  ANALYSIS_PREFERENCES: 'analysis_preferences',
  SELECTED_TEMPLATE: 'selected_template',
  RECENT_UPLOADS: 'recent_uploads',
  TOUR_COMPLETED: 'tour_completed',
} as const;

// Feature tour steps
export const TOUR_STEPS = [
  {
    target: '[data-tour="upload-resume"]',
    title: 'Upload Your Resume',
    content: 'Start by uploading your resume in PDF, DOC, or DOCX format',
    placement: 'bottom' as const,
  },
  {
    target: '[data-tour="job-description"]',
    title: 'Add Job Description',
    content: 'Paste the job description you want to tailor your resume for',
    placement: 'top' as const,
  },
  {
    target: '[data-tour="analyze-button"]',
    title: 'Analyze Resume',
    content: 'Get AI-powered insights and scoring for your resume',
    placement: 'top' as const,
  },
  {
    target: '[data-tour="score-display"]',
    title: 'Review Your Score',
    content: 'See how well your resume matches the job requirements',
    placement: 'left' as const,
  },
  {
    target: '[data-tour="feedback-section"]',
    title: 'Get Feedback',
    content: 'Review detailed feedback and improvement suggestions',
    placement: 'right' as const,
  },
] as const;

// Regex patterns for validation
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  URL: /^https?:\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-@?^=%&/~\+#])?$/,
  LINKEDIN: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w\-]+\/?$/,

  // Resume content patterns
  EXPERIENCE_YEARS: /(\d+)[\s\-]*(?:years?|yrs?)/i,
  DEGREE_KEYWORDS: /\b(bachelor|master|phd|doctorate|degree|diploma|certificate)\b/i,
  SKILL_SEPARATORS: /[,;|\n]/,
} as const;

// Internationalization keys (for future i18n support)
export const I18N_KEYS = {
  // Common
  LOADING: 'common.loading',
  ERROR: 'common.error',
  SUCCESS: 'common.success',
  CANCEL: 'common.cancel',
  CONTINUE: 'common.continue',
  SAVE: 'common.save',
  DELETE: 'common.delete',
  DOWNLOAD: 'common.download',

  // Resume Analysis
  UPLOAD_RESUME: 'resumeAnalysis.uploadResume',
  JOB_DESCRIPTION: 'resumeAnalysis.jobDescription',
  RESUME_SCORE: 'resumeAnalysis.resumeScore',
  FEEDBACK: 'resumeAnalysis.feedback',
  GENERATE_AI_RESUME: 'resumeAnalysis.generateAiResume',

  // Validation messages
  FIELD_REQUIRED: 'validation.fieldRequired',
  FILE_TOO_LARGE: 'validation.fileTooLarge',
  INVALID_FORMAT: 'validation.invalidFormat',
} as const;
