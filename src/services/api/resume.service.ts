// services/api/resume.service.ts
// Resume management API service

import { BaseApiService } from './base.service';
import { RESUME_ENDPOINTS, buildApiUrl } from '@/constants/api-endpoints';
import {
  IResume,
  IFileUploadResponse,
  IResumeProcessingStatus,
  IPaginatedResponse,
  ISearchParams,
} from '@/types/backend';

export class ResumeService extends BaseApiService {
  // ============================================
  // RESUME UPLOAD
  // ============================================

  /**
   * Upload resume file
   * POST /resume/upload
   */
  async uploadResume(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<IFileUploadResponse> {
    const response = await this.uploadFile<IFileUploadResponse>(
      RESUME_ENDPOINTS.UPLOAD,
      file,
      onProgress
    );
    return response.data;
  }

  /**
   * Upload multiple resume files
   * POST /resume/upload-multiple
   */
  async uploadMultipleResumes(
    files: File[],
    onProgress?: (progress: number) => void
  ): Promise<IFileUploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadResume(file, onProgress));
    return Promise.all(uploadPromises);
  }

  // ============================================
  // RESUME MANAGEMENT
  // ============================================

  /**
   * Get resume by ID
   * GET /resume/:resumeId
   */
  async getResume(resumeId: string): Promise<IResume> {
    const response = await this.get<{ resume: IResume }>(
      buildApiUrl(RESUME_ENDPOINTS.GET_RESUME, { resumeId })
    );
    return response.data.resume;
  }

  /**
   * Get resumes by user ID
   * GET /resume/user/:userId
   */
  async getResumesByUser(userId: string): Promise<IResume[]> {
    const response = await this.get<{ resumes: IResume[] }>(
      buildApiUrl(RESUME_ENDPOINTS.GET_RESUMES_BY_USER, { userId })
    );
    return response.data.resumes;
  }

  /**
   * Delete resume
   * DELETE /resume/:resumeId
   */
  async deleteResume(resumeId: string): Promise<void> {
    await this.delete(buildApiUrl(RESUME_ENDPOINTS.DELETE_RESUME, { resumeId }));
  }

  /**
   * Update resume metadata
   * PUT /resume/:resumeId
   */
  async updateResume(resumeId: string, data: Partial<IResume>): Promise<IResume> {
    const response = await this.put<{ resume: IResume }>(
      buildApiUrl(RESUME_ENDPOINTS.UPDATE_RESUME, { resumeId }),
      data
    );
    return response.data.resume;
  }

  // ============================================
  // RESUME PROCESSING
  // ============================================

  /**
   * Stream resume processing status
   * GET /resume/:resumeId/stream
   */
  async streamResumeStatus(resumeId: string): Promise<IResumeProcessingStatus> {
    const response = await this.get<IResumeProcessingStatus>(
      buildApiUrl(RESUME_ENDPOINTS.STREAM_STATUS, { resumeId })
    );
    return response.data;
  }

  /**
   * Start resume processing
   * POST /resume/:resumeId/process
   */
  async startResumeProcessing(resumeId: string): Promise<{
    resumeId: string;
    status: 'processing';
    message: string;
  }> {
    const response = await this.post<{
      resumeId: string;
      status: 'processing';
      message: string;
    }>(buildApiUrl(RESUME_ENDPOINTS.START_PROCESSING, { resumeId }), {});
    return response.data;
  }

  /**
   * Retry resume processing
   * POST /resume/:resumeId/retry
   */
  async retryResumeProcessing(resumeId: string): Promise<{
    resumeId: string;
    status: 'processing';
    message: string;
  }> {
    const response = await this.post<{
      resumeId: string;
      status: 'processing';
      message: string;
    }>(buildApiUrl(RESUME_ENDPOINTS.RETRY_PROCESSING, { resumeId }), {});
    return response.data;
  }

  /**
   * Get resume processing history
   * GET /resume/:resumeId/history
   */
  async getResumeProcessingHistory(resumeId: string): Promise<
    Array<{
      timestamp: Date;
      status: string;
      message: string;
      progress?: number;
    }>
  > {
    const response = await this.get<{
      history: Array<{
        timestamp: Date;
        status: string;
        message: string;
        progress?: number;
      }>;
    }>(buildApiUrl(RESUME_ENDPOINTS.GET_PROCESSING_HISTORY, { resumeId }));
    return response.data.history;
  }

  // ============================================
  // RESUME ANALYSIS
  // ============================================

  /**
   * Get resume scores
   * GET /resume/:resumeId/scores
   */
  async getResumeScores(resumeId: string): Promise<Record<string, any>> {
    const response = await this.get<{ scores: Record<string, any> }>(
      buildApiUrl(RESUME_ENDPOINTS.GET_RESUME_SCORES, { resumeId })
    );
    return response.data.scores;
  }

  /**
   * Get parsed resume text
   * GET /resume/:resumeId/text
   */
  async getResumeText(resumeId: string): Promise<string> {
    const response = await this.get<{ text: string }>(
      buildApiUrl(RESUME_ENDPOINTS.GET_RESUME_TEXT, { resumeId })
    );
    return response.data.text;
  }

  /**
   * Get resume analysis report
   * GET /resume/:resumeId/analysis
   */
  async getResumeAnalysis(resumeId: string): Promise<{
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    score: number;
    sections: Array<{
      name: string;
      score: number;
      feedback: string;
    }>;
  }> {
    const response = await this.get<{
      summary: string;
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
      score: number;
      sections: Array<{
        name: string;
        score: number;
        feedback: string;
      }>;
    }>(buildApiUrl(RESUME_ENDPOINTS.GET_RESUME_ANALYSIS, { resumeId }));
    return response.data;
  }

  // ============================================
  // RESUME LISTING
  // ============================================

  /**
   * Get all resumes with pagination
   * GET /resume/list
   */
  async getResumes(params?: ISearchParams): Promise<IPaginatedResponse<IResume>> {
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

    const url = `${RESUME_ENDPOINTS.LIST_RESUMES}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.get<IPaginatedResponse<IResume>>(url);
    return response.data;
  }

  /**
   * Get resumes by status
   * GET /resume/by-status/:status
   */
  async getResumesByStatus(status: string): Promise<IResume[]> {
    const response = await this.get<{ resumes: IResume[] }>(
      buildApiUrl(RESUME_ENDPOINTS.RESUMES_BY_STATUS, { status })
    );
    return response.data.resumes;
  }

  // ============================================
  // RESUME STATISTICS
  // ============================================

  /**
   * Get resume statistics
   * GET /resume/stats
   */
  async getResumeStats(): Promise<{
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
  }> {
    const response = await this.get<{
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
    }>(RESUME_ENDPOINTS.RESUME_STATS);
    return response.data;
  }

  /**
   * Get resume analytics
   * GET /resume/analytics
   */
  async getResumeAnalytics(
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    uploadsByDate: Array<{ date: string; count: number }>;
    scoresDistribution: Array<{ range: string; count: number }>;
    processingTimeTrend: Array<{ date: string; averageTime: number }>;
    topIssues: Array<{ issue: string; count: number }>;
  }> {
    const queryParams = new URLSearchParams();

    if (startDate) {
      queryParams.append('startDate', startDate.toISOString());
    }

    if (endDate) {
      queryParams.append('endDate', endDate.toISOString());
    }

    const url = `${RESUME_ENDPOINTS.RESUME_ANALYTICS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.get<{
      uploadsByDate: Array<{ date: string; count: number }>;
      scoresDistribution: Array<{ range: string; count: number }>;
      processingTimeTrend: Array<{ date: string; averageTime: number }>;
      topIssues: Array<{ issue: string; count: number }>;
    }>(url);
    return response.data;
  }

  // ============================================
  // RESUME EXPORT
  // ============================================

  /**
   * Export resume as PDF
   * GET /resume/:resumeId/export/pdf
   */
  async exportResumeAsPDF(resumeId: string): Promise<Blob> {
    const response = await this.get<Blob>(buildApiUrl(RESUME_ENDPOINTS.EXPORT_PDF, { resumeId }));
    return response.data;
  }

  /**
   * Export resume as Word document
   * GET /resume/:resumeId/export/docx
   */
  async exportResumeAsWord(resumeId: string): Promise<Blob> {
    const response = await this.get<Blob>(buildApiUrl(RESUME_ENDPOINTS.EXPORT_DOCX, { resumeId }));
    return response.data;
  }

  /**
   * Export resume analysis report
   * GET /resume/:resumeId/export/analysis
   */
  async exportResumeAnalysis(resumeId: string, format: 'pdf' | 'docx' = 'pdf'): Promise<Blob> {
    const response = await this.get<Blob>(
      `${buildApiUrl(RESUME_ENDPOINTS.EXPORT_ANALYSIS, { resumeId })}?format=${format}`
    );
    return response.data;
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const resumeService = new ResumeService();
