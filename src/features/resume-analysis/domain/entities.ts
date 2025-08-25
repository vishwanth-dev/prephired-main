// src/features/resume-analysis/domain/entities.ts

/**
 * Core domain entities for the Resume Analysis feature
 * Based on the Figma design analysis and business requirements
 */

// Base types for common fields
export type FileStatus = 'uploading' | 'processing' | 'completed' | 'failed';
export type ResumeFormat = 'pdf' | 'doc' | 'docx';
export type JobDescriptionSource = 'manual' | 'file' | 'url' | 'ai-generated';

// Resume Entity
export interface ResumeEntity {
  readonly id: string;
  readonly userId: string;
  readonly fileName: string;
  readonly fileSize: number;
  readonly fileType: ResumeFormat;
  readonly fileUrl: string;
  readonly status: FileStatus;
  readonly uploadedAt: string;
  readonly processedAt?: string;

  // Parsed content from the resume
  readonly content?: ResumeContent;

  // AI analysis results
  readonly score?: number;
  readonly feedback?: ResumeFeedback[];
  readonly suggestions?: string[];

  // Metadata
  readonly metadata: {
    readonly pageCount?: number;
    readonly wordCount?: number;
    readonly hasPhoto?: boolean;
    readonly detectedSections?: string[];
  };

  readonly createdAt: string;
  readonly updatedAt: string;
}

// Structured resume content after parsing
export interface ResumeContent {
  readonly personalInfo: PersonalInfo;
  readonly workExperience: WorkExperience[];
  readonly education: Education[];
  readonly skills: string[];
  readonly certifications?: Certification[];
  readonly projects?: Project[];
  readonly languages?: Language[];
  readonly summary?: string;
}

export interface PersonalInfo {
  readonly name: string;
  readonly email?: string;
  readonly phone?: string;
  readonly location?: string;
  readonly linkedIn?: string;
  readonly website?: string;
  readonly profileImage?: string;
}

export interface WorkExperience {
  readonly id: string;
  readonly position: string;
  readonly company: string;
  readonly location?: string;
  readonly startDate: string;
  readonly endDate?: string; // null for current position
  readonly description: string[];
  readonly achievements?: string[];
}

export interface Education {
  readonly id: string;
  readonly degree: string;
  readonly institution: string;
  readonly location?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly gpa?: string;
  readonly honors?: string[];
}

export interface Certification {
  readonly id: string;
  readonly name: string;
  readonly issuer: string;
  readonly issueDate?: string;
  readonly expiryDate?: string;
  readonly credentialUrl?: string;
}

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly technologies: string[];
  readonly startDate?: string;
  readonly endDate?: string;
  readonly url?: string;
}

export interface Language {
  readonly name: string;
  readonly proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
}

// Job Description Entity
export interface JobDescriptionEntity {
  readonly id: string;
  readonly userId: string;
  readonly title?: string;
  readonly description: string;
  readonly source: JobDescriptionSource;
  readonly fileName?: string; // if uploaded as file
  readonly fileUrl?: string;

  // Parsed/structured job requirements
  readonly requirements?: JobRequirements;

  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface JobRequirements {
  readonly requiredSkills: string[];
  readonly preferredSkills: string[];
  readonly experience: {
    readonly min?: number;
    readonly max?: number;
    readonly level?: 'entry' | 'mid' | 'senior' | 'executive';
  };
  readonly education: {
    readonly level?: 'high-school' | 'bachelor' | 'master' | 'phd';
    readonly field?: string[];
  };
  readonly certifications?: string[];
  readonly languages?: Language[];
}

// Resume Analysis Entity (combines resume + job description analysis)
export interface ResumeAnalysisEntity {
  readonly id: string;
  readonly resumeId: string;
  readonly jobDescriptionId?: string; // Optional - can analyze without JD
  readonly userId: string;

  // Core analysis results
  readonly overallScore: number; // 0-100
  readonly sectionScores: SectionScores;
  readonly feedback: ResumeFeedback[];
  readonly suggestions: AnalysisSuggestion[];

  // Detailed analysis
  readonly keywordMatches: KeywordAnalysis;
  readonly missingKeywords: string[];
  readonly strengthsFound: string[];
  readonly improvementAreas: string[];

  // AI-generated improvements
  readonly aiGeneratedSections?: Partial<ResumeContent>;
  readonly rewrittenSummary?: string;
  readonly enhancedBulletPoints?: Record<string, string[]>;

  readonly analyzedAt: string;
  readonly status: 'analyzing' | 'completed' | 'failed';
}

export interface SectionScores {
  readonly personalInfo: number;
  readonly summary: number;
  readonly workExperience: number;
  readonly education: number;
  readonly skills: number;
  readonly formatting: number;
  readonly keywords: number;
  readonly ats_compatibility: number;
}

export interface ResumeFeedback {
  readonly id: string;
  readonly section: keyof SectionScores | 'overall';
  readonly type: 'strength' | 'improvement' | 'critical' | 'suggestion';
  readonly title: string;
  readonly description: string;
  readonly priority: 'high' | 'medium' | 'low';
  readonly actionable: boolean;
}

export interface AnalysisSuggestion {
  readonly id: string;
  readonly category: 'content' | 'formatting' | 'keywords' | 'structure';
  readonly title: string;
  readonly description: string;
  readonly before?: string;
  readonly after?: string;
  readonly impact: 'high' | 'medium' | 'low';
}

export interface KeywordAnalysis {
  readonly total: number;
  readonly found: number;
  readonly percentage: number;
  readonly matches: KeywordMatch[];
}

export interface KeywordMatch {
  readonly keyword: string;
  readonly category: 'skill' | 'tool' | 'certification' | 'experience';
  readonly found: boolean;
  readonly context?: string; // Where it was found in resume
  readonly importance: 'critical' | 'important' | 'nice-to-have';
}

// Resume Template Entity
export interface ResumeTemplateEntity {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: 'modern' | 'classic' | 'creative' | 'minimal' | 'ats-friendly';
  readonly previewImage: string;
  readonly templateData: TemplateStructure;
  readonly isPremium: boolean;
  readonly popularity: number;
  readonly tags: string[];
  readonly createdAt: string;
}

export interface TemplateStructure {
  readonly layout: 'single-column' | 'two-column' | 'multi-column';
  readonly colorScheme: {
    readonly primary: string;
    readonly secondary: string;
    readonly accent: string;
    readonly text: string;
  };
  readonly sections: TemplateSectionConfig[];
  readonly fonts: {
    readonly heading: string;
    readonly body: string;
  };
}

export interface TemplateSectionConfig {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly required: boolean;
  readonly visible: boolean;
  readonly style: Record<string, any>;
}

// Form interfaces for UI components
export interface ResumeUploadForm {
  file?: File;
  fileName?: string;
  replaceExisting?: boolean;
}

export interface JobDescriptionForm {
  title?: string;
  description: string;
  source: JobDescriptionSource;
  file?: File;
  url?: string;
}

export interface ResumeAnalysisRequest {
  resumeId: string;
  jobDescriptionId?: string;
  includeAiSuggestions: boolean;
  includeTemplateRecommendations: boolean;
}

export interface AIResumeGenerationRequest {
  resumeId?: string;
  jobDescriptionId: string;
  templateId?: string;
  personalInfo: PersonalInfo;
  preferences: {
    readonly tone: 'professional' | 'casual' | 'creative';
    readonly length: 'concise' | 'detailed';
    readonly focus: 'skills' | 'experience' | 'achievements';
  };
}

// Progress tracking for file uploads and processing
export interface UploadProgress {
  readonly fileName: string;
  readonly progress: number; // 0-100
  readonly status: FileStatus;
  readonly error?: string;
  readonly estimatedTimeRemaining?: number;
}

// Export helper types for API responses
export type ResumeResponse = ResumeEntity;
export type JobDescriptionResponse = JobDescriptionEntity;
export type AnalysisResponse = ResumeAnalysisEntity;
export type TemplateResponse = ResumeTemplateEntity;

// List responses with pagination
export interface PaginatedResponse<T> {
  readonly data: T[];
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
    readonly hasNext: boolean;
    readonly hasPrevious: boolean;
  };
}

export type ResumeListResponse = PaginatedResponse<ResumeEntity>;
export type TemplateListResponse = PaginatedResponse<ResumeTemplateEntity>;
