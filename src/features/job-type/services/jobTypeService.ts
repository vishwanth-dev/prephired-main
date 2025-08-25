// =============================================================================
// JOB TYPE SERVICE
// =============================================================================

import { JobTypeFormData } from '../types';

export class JobTypeService {
  static async submitJobTypeConfiguration(
    data: JobTypeFormData
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validate data
      if (!data.jobRole || !data.questionType || !data.experienceLevel) {
        throw new Error('Required fields are missing');
      }

      if (!data.interviewTypes.some(type => type.selected)) {
        throw new Error('At least one interview type must be selected');
      }

      if (!data.selectedTime) {
        throw new Error('Interview time must be selected');
      }

      // Here you would typically make an API call to save the configuration
      // const response = await fetch('/api/job-type/configure', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });

      return {
        success: true,
        message: 'Job type configuration saved successfully!',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to save configuration',
      };
    }
  }

  static async getJobTypeSuggestions(query: string): Promise<string[]> {
    try {
      // Simulate API call for job role suggestions
      await new Promise(resolve => setTimeout(resolve, 300));

      const suggestions = [
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'UI/UX Designer',
        'Data Scientist',
        'DevOps Engineer',
        'Product Manager',
        'Business Analyst',
      ];

      return suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
    } catch {
      return [];
    }
  }

  static async validateConfiguration(
    data: JobTypeFormData
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!data.jobRole.trim()) {
      errors.push('Job role is required');
    }

    if (!data.questionType.trim()) {
      errors.push('Question type is required');
    }

    if (!data.experienceLevel.trim()) {
      errors.push('Experience level is required');
    }

    if (!data.interviewTypes.some(type => type.selected)) {
      errors.push('At least one interview type must be selected');
    }

    if (!data.selectedTime) {
      errors.push('Interview time must be selected');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
