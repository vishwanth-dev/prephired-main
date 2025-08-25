// src/features/resume-analysis/store/resumeAnalysisStore.ts

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
  ResumeEntity,
  JobDescriptionEntity,
  ResumeAnalysisEntity,
  ResumeTemplateEntity,
  UploadProgress,
  ResumeAnalysisRequest,
  AIResumeGenerationRequest,
} from '../domain/entities';
import { ResumeAnalysisService } from '../services/resumeAnalysisService';

// Store state interface
interface ResumeAnalysisState {
  // Resume management
  resumes: ResumeEntity[];
  currentResume: ResumeEntity | null;
  resumesLoading: boolean;
  resumeError: string | null;

  // Job descriptions
  jobDescriptions: JobDescriptionEntity[];
  currentJobDescription: JobDescriptionEntity | null;
  jobDescriptionLoading: boolean;
  jobDescriptionError: string | null;

  // Analysis results
  analyses: ResumeAnalysisEntity[];
  currentAnalysis: ResumeAnalysisEntity | null;
  analysisLoading: boolean;
  analysisError: string | null;

  // Templates
  templates: ResumeTemplateEntity[];
  selectedTemplate: ResumeTemplateEntity | null;
  templatesLoading: boolean;
  templatesError: string | null;

  // File upload tracking
  uploadProgress: Record<string, UploadProgress>;

  // UI state
  ui: {
    selectedResumeId: string | null;
    selectedJobDescriptionId: string | null;
    showUploadModal: boolean;
    showAnalysisModal: boolean;
    showTemplateModal: boolean;
    showFeedbackDetails: boolean;
    currentStep: 'upload' | 'job-description' | 'analysis' | 'results';
    sidebarCollapsed: boolean;
  };

  // Preferences
  preferences: {
    autoAnalyze: boolean;
    includeAiSuggestions: boolean;
    defaultTemplateCategory: string;
    notificationsEnabled: boolean;
  };
}

// Store actions interface
interface ResumeAnalysisActions {
  // Resume actions
  fetchResumes: () => Promise<void>;
  uploadResume: (file: File, options?: { replaceExisting?: boolean }) => Promise<string>;
  deleteResume: (resumeId: string) => Promise<void>;
  selectResume: (resumeId: string | null) => void;
  setCurrentResume: (resume: ResumeEntity | null) => void;

  // Job description actions
  fetchJobDescriptions: () => Promise<void>;
  createJobDescription: (data: {
    title?: string;
    description: string;
    source: 'manual' | 'file';
  }) => Promise<string>;
  uploadJobDescriptionFile: (file: File) => Promise<string>;
  selectJobDescription: (jobDescriptionId: string | null) => void;
  setCurrentJobDescription: (jobDescription: JobDescriptionEntity | null) => void;

  // Analysis actions
  analyzeResume: (resumeId: string, jobDescriptionId?: string) => Promise<string>;
  fetchAnalysisHistory: (resumeId?: string) => Promise<void>;
  generateAiResume: (
    resumeId: string,
    jobDescriptionId: string,
    templateId?: string
  ) => Promise<string>;
  setCurrentAnalysis: (analysis: ResumeAnalysisEntity | null) => void;

  // Template actions
  fetchTemplates: (category?: string) => Promise<void>;
  selectTemplate: (template: ResumeTemplateEntity | null) => void;

  // Upload progress tracking
  updateUploadProgress: (fileId: string, progress: Partial<UploadProgress>) => void;
  clearUploadProgress: (fileId: string) => void;

  // UI actions
  setShowUploadModal: (show: boolean) => void;
  setShowAnalysisModal: (show: boolean) => void;
  setShowTemplateModal: (show: boolean) => void;
  setShowFeedbackDetails: (show: boolean) => void;
  setCurrentStep: (step: ResumeAnalysisState['ui']['currentStep']) => void;
  toggleSidebar: () => void;

  // Preferences
  updatePreferences: (preferences: Partial<ResumeAnalysisState['preferences']>) => void;

  // Utility actions
  clearErrors: () => void;
  resetStore: () => void;
}

// Combined store interface
interface ResumeAnalysisStore extends ResumeAnalysisState, ResumeAnalysisActions {}

// Initial state
const initialState: ResumeAnalysisState = {
  // Resume management
  resumes: [],
  currentResume: null,
  resumesLoading: false,
  resumeError: null,

  // Job descriptions
  jobDescriptions: [],
  currentJobDescription: null,
  jobDescriptionLoading: false,
  jobDescriptionError: null,

  // Analysis results
  analyses: [],
  currentAnalysis: null,
  analysisLoading: false,
  analysisError: null,

  // Templates
  templates: [],
  selectedTemplate: null,
  templatesLoading: false,
  templatesError: null,

  // File upload tracking
  uploadProgress: {},

  // UI state
  ui: {
    selectedResumeId: null,
    selectedJobDescriptionId: null,
    showUploadModal: false,
    showAnalysisModal: false,
    showTemplateModal: false,
    showFeedbackDetails: false,
    currentStep: 'upload',
    sidebarCollapsed: false,
  },

  // Preferences
  preferences: {
    autoAnalyze: true,
    includeAiSuggestions: true,
    defaultTemplateCategory: 'ats-friendly',
    notificationsEnabled: true,
  },
};

// Create the store
export const useResumeAnalysisStore = create<ResumeAnalysisStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      ...initialState,

        // Resume actions
        fetchResumes: async () => {
          set(state => {
            state.resumesLoading = true;
            state.resumeError = null;
          });

          try {
            const resumes = await ResumeAnalysisService.getResumes();
            set(state => {
              state.resumes = resumes;
              state.resumesLoading = false;
            });
          } catch (error) {
            set(state => {
              state.resumeError =
                error instanceof Error ? error.message : 'Failed to fetch resumes';
              state.resumesLoading = false;
            });
          }
        },

        uploadResume: async (file: File, options = {}) => {
          const fileId = `${Date.now()}-${file.name}`;

          // Initialize progress tracking
          set(state => {
            state.uploadProgress[fileId] = {
              fileName: file.name,
              progress: 0,
              status: 'uploading',
            };
          });

          try {
            const resumeId = await ResumeAnalysisService.uploadResume(file, options, progress => {
              // Update progress callback
              set(state => {
                if (state.uploadProgress[fileId]) {
                  state.uploadProgress[fileId].progress = progress;
                }
              });
            });

            // Update progress to completed
            set(state => {
              state.uploadProgress[fileId] = {
                fileName: file.name,
                progress: 100,
                status: 'completed',
              };
            });

            // Refresh resumes list
            await get().fetchResumes();

            // Auto-select the uploaded resume
            const uploadedResume = get().resumes.find(r => r.id === resumeId);
            if (uploadedResume) {
              get().setCurrentResume(uploadedResume);
            }

            return resumeId;
          } catch (error) {
            set(state => {
              state.uploadProgress[fileId] = {
                fileName: file.name,
                progress: 0,
                status: 'failed',
                error: error instanceof Error ? error.message : 'Upload failed',
              };
            });
            throw error;
          }
        },

        deleteResume: async (resumeId: string) => {
          try {
            await ResumeAnalysisService.deleteResume(resumeId);

            set(state => {
              state.resumes = state.resumes.filter(r => r.id !== resumeId);

              // Clear current resume if it was deleted
              if (state.currentResume?.id === resumeId) {
                state.currentResume = null;
                state.ui.selectedResumeId = null;
              }

              // Clear related analyses
              state.analyses = state.analyses.filter(a => a.resumeId !== resumeId);
              if (state.currentAnalysis?.resumeId === resumeId) {
                state.currentAnalysis = null;
              }
            });
          } catch (error) {
            set(state => {
              state.resumeError =
                error instanceof Error ? error.message : 'Failed to delete resume';
            });
            throw error;
          }
        },

        selectResume: (resumeId: string | null) => {
          set(state => {
            state.ui.selectedResumeId = resumeId;
            state.currentResume = resumeId
              ? state.resumes.find(r => r.id === resumeId) || null
              : null;
          });
        },

        setCurrentResume: (resume: ResumeEntity | null) => {
          set(state => {
            state.currentResume = resume;
            state.ui.selectedResumeId = resume?.id || null;
          });
        },

        // Job description actions
        fetchJobDescriptions: async () => {
          set(state => {
            state.jobDescriptionLoading = true;
            state.jobDescriptionError = null;
          });

          try {
            const jobDescriptions = await ResumeAnalysisService.getJobDescriptions();
            set(state => {
              state.jobDescriptions = jobDescriptions;
              state.jobDescriptionLoading = false;
            });
          } catch (error) {
            set(state => {
              state.jobDescriptionError =
                error instanceof Error ? error.message : 'Failed to fetch job descriptions';
              state.jobDescriptionLoading = false;
            });
          }
        },

        createJobDescription: async data => {
          try {
            const jobDescriptionId = await ResumeAnalysisService.createJobDescription(data);

            // Refresh job descriptions list
            await get().fetchJobDescriptions();

            // Auto-select the created job description
            const createdJobDescription = get().jobDescriptions.find(
              jd => jd.id === jobDescriptionId
            );
            if (createdJobDescription) {
              get().setCurrentJobDescription(createdJobDescription);
            }

            return jobDescriptionId;
          } catch (error) {
            set(state => {
              state.jobDescriptionError =
                error instanceof Error ? error.message : 'Failed to create job description';
            });
            throw error;
          }
        },

        uploadJobDescriptionFile: async (file: File) => {
          const fileId = `jd-${Date.now()}-${file.name}`;

          set(state => {
            state.uploadProgress[fileId] = {
              fileName: file.name,
              progress: 0,
              status: 'uploading',
            };
          });

          try {
            const jobDescriptionId = await ResumeAnalysisService.uploadJobDescriptionFile(
              file,
              progress => {
                set(state => {
                  if (state.uploadProgress[fileId]) {
                    state.uploadProgress[fileId].progress = progress;
                  }
                });
              }
            );

            set(state => {
              state.uploadProgress[fileId] = {
                fileName: file.name,
                progress: 100,
                status: 'completed',
              };
            });

            await get().fetchJobDescriptions();

            return jobDescriptionId;
          } catch (error) {
            set(state => {
              state.uploadProgress[fileId] = {
                fileName: file.name,
                progress: 0,
                status: 'failed',
                error: error instanceof Error ? error.message : 'Upload failed',
              };
            });
            throw error;
          }
        },

        selectJobDescription: (jobDescriptionId: string | null) => {
          set(state => {
            state.ui.selectedJobDescriptionId = jobDescriptionId;
            state.currentJobDescription = jobDescriptionId
              ? state.jobDescriptions.find(jd => jd.id === jobDescriptionId) || null
              : null;
          });
        },

        setCurrentJobDescription: (jobDescription: JobDescriptionEntity | null) => {
          set(state => {
            state.currentJobDescription = jobDescription;
            state.ui.selectedJobDescriptionId = jobDescription?.id || null;
          });
        },

        // Analysis actions
        analyzeResume: async (resumeId: string, jobDescriptionId?: string) => {
          set(state => {
            state.analysisLoading = true;
            state.analysisError = null;
          });

          try {
            const request: ResumeAnalysisRequest = {
              resumeId,
              includeAiSuggestions: get().preferences.includeAiSuggestions,
              includeTemplateRecommendations: true,
            };
            
            if (jobDescriptionId) {
              request.jobDescriptionId = jobDescriptionId;
            }
            
            const analysisId = await ResumeAnalysisService.analyzeResume(request);

            // Poll for analysis completion
            const pollAnalysis = async () => {
              try {
                const analysis = await ResumeAnalysisService.getAnalysis(analysisId);

                set(state => {
                  // Update or add analysis to list
                  const existingIndex = state.analyses.findIndex(a => a.id === analysisId);
                  if (existingIndex >= 0) {
                    state.analyses[existingIndex] = analysis;
                  } else {
                    state.analyses.unshift(analysis);
                  }

                  state.currentAnalysis = analysis;

                  if (analysis.status === 'completed' || analysis.status === 'failed') {
                    state.analysisLoading = false;
                    if (analysis.status === 'failed') {
                      state.analysisError = 'Analysis failed. Please try again.';
                    }
                  }
                });

                // Continue polling if still analyzing
                if (analysis.status === 'analyzing') {
                  setTimeout(pollAnalysis, 2000);
                }
              } catch (error) {
                set(state => {
                  state.analysisError = error instanceof Error ? error.message : 'Analysis failed';
                  state.analysisLoading = false;
                });
              }
            };

            // Start polling
            setTimeout(pollAnalysis, 1000);

            return analysisId;
          } catch (error) {
            set(state => {
              state.analysisError =
                error instanceof Error ? error.message : 'Failed to start analysis';
              state.analysisLoading = false;
            });
            throw error;
          }
        },

        fetchAnalysisHistory: async (resumeId?: string) => {
          try {
            const analyses = await ResumeAnalysisService.getAnalysisHistory(resumeId);
            set(state => {
              state.analyses = analyses;
            });
          } catch (error) {
            set(state => {
              state.analysisError =
                error instanceof Error ? error.message : 'Failed to fetch analysis history';
            });
          }
        },

        generateAiResume: async (
          resumeId: string,
          jobDescriptionId: string,
          templateId?: string
        ) => {
          set(state => {
            state.analysisLoading = true;
            state.analysisError = null;
          });

          try {
            const request: AIResumeGenerationRequest = {
              resumeId,
              jobDescriptionId,
              personalInfo: get().currentResume?.content?.personalInfo || ({} as any),
              preferences: {
                tone: 'professional',
                length: 'detailed',
                focus: 'experience',
              },
            };
            
            if (templateId) {
              request.templateId = templateId;
            }
            
            const result = await ResumeAnalysisService.generateAiResume(request);

            set(state => {
              state.analysisLoading = false;
            });

            return result.downloadUrl;
          } catch (error) {
            set(state => {
              state.analysisError =
                error instanceof Error ? error.message : 'Failed to generate AI resume';
              state.analysisLoading = false;
            });
            throw error;
          }
        },

        setCurrentAnalysis: (analysis: ResumeAnalysisEntity | null) => {
          set(state => {
            state.currentAnalysis = analysis;
          });
        },

        // Template actions
        fetchTemplates: async (category?: string) => {
          set(state => {
            state.templatesLoading = true;
            state.templatesError = null;
          });

          try {
            const templates = await ResumeAnalysisService.getTemplates(category);
            set(state => {
              state.templates = templates;
              state.templatesLoading = false;
            });
          } catch (error) {
            set(state => {
              state.templatesError =
                error instanceof Error ? error.message : 'Failed to fetch templates';
              state.templatesLoading = false;
            });
          }
        },

        selectTemplate: (template: ResumeTemplateEntity | null) => {
          set(state => {
            state.selectedTemplate = template;
          });
        },

        // Upload progress tracking
        updateUploadProgress: (fileId: string, progress: Partial<UploadProgress>) => {
          set(state => {
            if (state.uploadProgress[fileId]) {
              Object.assign(state.uploadProgress[fileId], progress);
            }
          });
        },

        clearUploadProgress: (fileId: string) => {
          set(state => {
            delete state.uploadProgress[fileId];
          });
        },

        // UI actions
        setShowUploadModal: (show: boolean) => {
          set(state => {
            state.ui.showUploadModal = show;
          });
        },

        setShowAnalysisModal: (show: boolean) => {
          set(state => {
            state.ui.showAnalysisModal = show;
          });
        },

        setShowTemplateModal: (show: boolean) => {
          set(state => {
            state.ui.showTemplateModal = show;
          });
        },

        setShowFeedbackDetails: (show: boolean) => {
          set(state => {
            state.ui.showFeedbackDetails = show;
          });
        },

        setCurrentStep: (step: ResumeAnalysisState['ui']['currentStep']) => {
          set(state => {
            state.ui.currentStep = step;
          });
        },

        toggleSidebar: () => {
          set(state => {
            state.ui.sidebarCollapsed = !state.ui.sidebarCollapsed;
          });
        },

        // Preferences
        updatePreferences: (preferences: Partial<ResumeAnalysisState['preferences']>) => {
          set(state => {
            Object.assign(state.preferences, preferences);
          });
        },

        // Utility actions
        clearErrors: () => {
          set(state => {
            state.resumeError = null;
            state.jobDescriptionError = null;
            state.analysisError = null;
            state.templatesError = null;
          });
        },

        resetStore: () => {
          set(initialState);
        },
      }))
    )
  );

// Selectors for commonly used derived state
export const useResumeAnalysisSelectors = () => {
  const store = useResumeAnalysisStore();

  return {
    // Current state selectors
    hasCurrentResume: !!store.currentResume,
    hasCurrentJobDescription: !!store.currentJobDescription,
    hasCurrentAnalysis: !!store.currentAnalysis,

    // Progress selectors
    isUploading: Object.values(store.uploadProgress).some(p => p.status === 'uploading'),
    isProcessing: store.resumesLoading || store.analysisLoading,
    hasErrors: !!(store.resumeError || store.jobDescriptionError || store.analysisError),

    // Data selectors
    recentResumes: store.resumes.slice(0, 5),
    recentAnalyses: store.analyses.slice(0, 5),
    completedAnalyses: store.analyses.filter(a => a.status === 'completed'),

    // Template selectors
    atsTemplates: store.templates.filter(t => t.category === 'ats-friendly'),
    premiumTemplates: store.templates.filter(t => t.isPremium),

    // UI state
    canProceedToAnalysis: !!store.currentResume && !!store.currentJobDescription,
    showProgressIndicator:
      store.resumesLoading || store.analysisLoading || Object.keys(store.uploadProgress).length > 0,
  };
};
