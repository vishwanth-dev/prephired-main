// src/features/resume-analysis/services/resumeAnalysisService.ts

import {
  ResumeEntity,
  JobDescriptionEntity,
  ResumeAnalysisEntity,
  ResumeTemplateEntity,
  ResumeAnalysisRequest,
  AIResumeGenerationRequest,
  ResumeListResponse,
  TemplateListResponse,
} from '../domain/entities';
import { RESUME_ANALYSIS_CONFIG } from '../constants';

/**
 * Service layer for Resume Analysis feature
 * Handles all API communications and business logic
 */
export class ResumeAnalysisService {
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

  // HTTP client with default configuration
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.BASE_URL}${endpoint}`;

    const defaultHeaders: Record<string, string> = {};

    // Only add Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('Content-Type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }

      // Handle non-JSON responses (like file downloads)
      return response as unknown as T;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error instanceof Error ? error : new Error('Network request failed');
    }
  }

  // Get authentication token (implement based on your auth system)
  private static getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;

    // Example implementations:
    // return localStorage.getItem('auth_token');
    // return Cookies.get('auth_token');
    // return useAuthStore.getState().token;

    return null; // Replace with actual auth implementation
  }

  // Build URL with path parameters
  private static buildUrl(template: string, params: Record<string, string>): string {
    let url = template;
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, encodeURIComponent(value));
    });
    return url;
  }

  // ==================== RESUME METHODS ====================

  /**
   * Get all resumes for the current user
   */
  static async getResumes(page = 1, limit = 10): Promise<ResumeEntity[]> {
    const endpoint = `${RESUME_ANALYSIS_CONFIG.API_ENDPOINTS.RESUMES}?page=${page}&limit=${limit}`;
    const response = await this.request<ResumeListResponse>(endpoint);
    return response.data;
  }

  /**
   * Get a specific resume by ID
   */
  static async getResume(resumeId: string): Promise<ResumeEntity> {
    const endpoint = this.buildUrl(RESUME_ANALYSIS_CONFIG.API_ENDPOINTS.RESUME_BY_ID, {
      id: resumeId,
    });
    return this.request<ResumeEntity>(endpoint);
  }

  /**
   * Upload a resume file
   */
  static async uploadResume(
    file: File,
    options: { replaceExisting?: boolean } = {},
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('options', JSON.stringify(options));

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Progress tracking
      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response.resumeId);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed: Network error'));
      });

      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload failed: Request timeout'));
      });

      // Add auth token to headers
      const token = this.getAuthToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.timeout = RESUME_ANALYSIS_CONFIG.UI.UPLOAD_TIMEOUT;
      xhr.open('POST', `${this.BASE_URL}${RESUME_ANALYSIS_CONFIG.API_ENDPOINTS.RESUME_UPLOAD}`);
      xhr.send(formData);
    });
  }

  /**
   * Delete a resume
   */
  static async deleteResume(resumeId: string): Promise<void> {
    const endpoint = this.buildUrl(RESUME_ANALYSIS_CONFIG.API_ENDPOINTS.RESUME_DELETE, {
      id: resumeId,
    });
    await this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * Download a resume file
   */
  static async downloadResume(resumeId: string): Promise<Blob> {
    const endpoint = this.buildUrl(RESUME_ANALYSIS_CONFIG.API_ENDPOINTS.RESUME_DOWNLOAD, {
      id: resumeId,
    });
    const response = await this.request<Response>(endpoint);
    return response.blob();
  }

  // ==================== JOB DESCRIPTION METHODS ====================

  /**
   * Get all job descriptions for the current user
   */
  static async getJobDescriptions(): Promise<JobDescriptionEntity[]> {
    return this.request<JobDescriptionEntity[]>(
      RESUME_ANALYSIS_CONFIG.API_ENDPOINTS.JOB_DESCRIPTIONS
    );
  }

  /**
   * Get a specific job description by ID
   */
  static async getJobDescription(jobDescriptionId: string): Promise<JobDescriptionEntity> {
    const endpoint = this.buildUrl(RESUME_ANALYSIS_CONFIG.API_ENDPOINTS.JOB_DESCRIPTION_BY_ID, {
      id: jobDescriptionId,
    });
    return this.request<JobDescriptionEntity>(endpoint);
  }

  /**
   * Create a job description from text
   */
  static async createJobDescription(data: {
    title?: string;
    description: string;
    source: 'manual' | 'file';
  }): Promise<string> {
    const response = await this.request<{ jobDescriptionId: string }>(
      RESUME_ANALYSIS_CONFIG.API_ENDPOINTS.JOB_DESCRIPTIONS,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return response.jobDescriptionId;
  }

  /**
   * Upload a job description file
   */
  static async uploadJobDescriptionFile(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source', 'file');

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response.jobDescriptionId);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed: Network error'));
      });

      const token = this.getAuthToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.open(
        'POST',
        `${this.BASE_URL}${RESUME_ANALYSIS_CONFIG.API_ENDPOINTS.JOB_DESCRIPTION_UPLOAD}`
      );
      xhr.send(formData);
    });
  }

  // ==================== ANALYSIS METHODS ====================

  /**
   * Analyze a resume against a job description
   */
  static async analyzeResume(request: ResumeAnalysisRequest): Promise<string> {
    const response = await this.request<{ analysisId: string }>(
      RESUME_ANALYSIS_CONFIG.API_ENDPOINTS.ANALYZE_RESUME,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
    return response.analysisId;
  }

  /**
   * Get analysis results by ID
   */
  static async getAnalysis(analysisId: string): Promise<ResumeAnalysisEntity> {
    const endpoint = this.buildUrl(RESUME_ANALYSIS_CONFIG.API_ENDPOINTS.ANALYSIS_BY_ID, {
      id: analysisId,
    });
    return this.request<ResumeAnalysisEntity>(endpoint);
  }

  /**
   * Get analysis history
   */
  static async getAnalysisHistory(resumeId?: string): Promise<ResumeAnalysisEntity[]> {
    const queryParams = resumeId ? `?resumeId=${resumeId}` : '';
    const endpoint = `${RESUME_ANALYSIS_CONFIG.API_ENDPOINTS.ANALYSIS_HISTORY}${queryParams}`;
    return this.request<ResumeAnalysisEntity[]>(endpoint);
  }

  /**
   * Generate an AI-improved resume
   */
  static async generateAiResume(request: AIResumeGenerationRequest): Promise<{
    generatedResume: any;
    downloadUrl: string;
  }> {
    return this.request<{ generatedResume: any; downloadUrl: string }>(
      RESUME_ANALYSIS_CONFIG.API_ENDPOINTS.GENERATE_AI_RESUME,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  // ==================== TEMPLATE METHODS ====================

  /**
   * Get resume templates
   */
  static async getTemplates(category?: string): Promise<ResumeTemplateEntity[]> {
    const queryParams = category ? `?category=${category}` : '';
    const endpoint = `${RESUME_ANALYSIS_CONFIG.API_ENDPOINTS.TEMPLATES}${queryParams}`;
    const response = await this.request<TemplateListResponse>(endpoint);
    return response.data;
  }

  /**
   * Get a specific template by ID
   */
  static async getTemplate(templateId: string): Promise<ResumeTemplateEntity> {
    const endpoint = this.buildUrl(RESUME_ANALYSIS_CONFIG.API_ENDPOINTS.TEMPLATE_BY_ID, {
      id: templateId,
    });
    return this.request<ResumeTemplateEntity>(endpoint);
  }

  /**
   * Get template preview
   */
  static async getTemplatePreview(templateId: string): Promise<Blob> {
    const endpoint = this.buildUrl(RESUME_ANALYSIS_CONFIG.API_ENDPOINTS.TEMPLATE_PREVIEW, {
      id: templateId,
    });
    const response = await this.request<Response>(endpoint);
    return response.blob();
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Validate file before upload
   */
  static validateResumeFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > RESUME_ANALYSIS_CONFIG.VALIDATION.FILE_SIZE.MAX) {
      return {
        valid: false,
        error: `File size exceeds ${RESUME_ANALYSIS_CONFIG.VALIDATION.FILE_SIZE.MAX / 1024 / 1024}MB limit`,
      };
    }

    if (file.size < RESUME_ANALYSIS_CONFIG.VALIDATION.FILE_SIZE.MIN) {
      return {
        valid: false,
        error: 'File is too small',
      };
    }

    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (
      !fileExtension ||
      !RESUME_ANALYSIS_CONFIG.VALIDATION.SUPPORTED_FORMATS.includes(fileExtension as any)
    ) {
      return {
        valid: false,
        error: `Unsupported file format. Please upload ${RESUME_ANALYSIS_CONFIG.VALIDATION.SUPPORTED_FORMATS.join(', ')} files`,
      };
    }

    // Check MIME type
    if (!RESUME_ANALYSIS_CONFIG.VALIDATION.SUPPORTED_MIME_TYPES.includes(file.type as any)) {
      return {
        valid: false,
        error: 'Invalid file type',
      };
    }

    return { valid: true };
  }

  /**
   * Validate job description text
   */
  static validateJobDescription(description: string): { valid: boolean; error?: string } {
    const trimmedDescription = description.trim();

    if (trimmedDescription.length < RESUME_ANALYSIS_CONFIG.VALIDATION.JOB_DESCRIPTION.MIN_LENGTH) {
      return {
        valid: false,
        error: `Job description must be at least ${RESUME_ANALYSIS_CONFIG.VALIDATION.JOB_DESCRIPTION.MIN_LENGTH} characters`,
      };
    }

    if (trimmedDescription.length > RESUME_ANALYSIS_CONFIG.VALIDATION.JOB_DESCRIPTION.MAX_LENGTH) {
      return {
        valid: false,
        error: `Job description must not exceed ${RESUME_ANALYSIS_CONFIG.VALIDATION.JOB_DESCRIPTION.MAX_LENGTH} characters`,
      };
    }

    return { valid: true };
  }

  /**
   * Get score color based on score value
   */
  static getScoreColor(score: number): string {
    if (score >= RESUME_ANALYSIS_CONFIG.SCORING.EXCELLENT) return '#10B981'; // green
    if (score >= RESUME_ANALYSIS_CONFIG.SCORING.GOOD) return '#3B82F6'; // blue
    if (score >= RESUME_ANALYSIS_CONFIG.SCORING.FAIR) return '#F59E0B'; // amber
    return '#EF4444'; // red
  }

  /**
   * Get score label based on score value
   */
  static getScoreLabel(score: number): string {
    if (score >= RESUME_ANALYSIS_CONFIG.SCORING.EXCELLENT) return 'Excellent';
    if (score >= RESUME_ANALYSIS_CONFIG.SCORING.GOOD) return 'Good';
    if (score >= RESUME_ANALYSIS_CONFIG.SCORING.FAIR) return 'Fair';
    return 'Needs Improvement';
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = (bytes / Math.pow(1024, i)).toFixed(2);

    return `${size} ${sizes[i]}`;
  }

  /**
   * Generate a unique file ID for tracking
   */
  static generateFileId(fileName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `${timestamp}-${random}-${fileName.replace(/[^a-zA-Z0-9]/g, '_')}`;
  }

  /**
   * Extract file extension from filename
   */
  static getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Check if a file is a supported resume format
   */
  static isSupportedResumeFormat(fileName: string): boolean {
    const extension = this.getFileExtension(fileName);
    return RESUME_ANALYSIS_CONFIG.VALIDATION.SUPPORTED_FORMATS.includes(extension as any);
  }

  /**
   * Create a download link for a blob
   */
  static createDownloadLink(blob: Blob, fileName: string): string {
    const url = URL.createObjectURL(blob);
    return url;
  }

  /**
   * Trigger file download
   */
  static downloadFile(blob: Blob, fileName: string): void {
    const url = this.createDownloadLink(blob, fileName);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
