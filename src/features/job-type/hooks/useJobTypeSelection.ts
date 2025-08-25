'use client';

import { useState, useCallback } from 'react';
import { JobTypeFormData, TimeOption } from '../types';
import { INTERVIEW_TYPES } from '../constants';

export const useJobTypeSelection = (initialData?: Partial<JobTypeFormData>) => {
  const [formData, setFormData] = useState<JobTypeFormData>({
    jobRole: initialData?.jobRole || '',
    questionType: initialData?.questionType || '',
    experienceLevel: initialData?.experienceLevel || '',
    interviewTypes: initialData?.interviewTypes || [...INTERVIEW_TYPES],
    selectedTime: initialData?.selectedTime || null,
    codingProficiency: initialData?.codingProficiency || '',
  });

  const updateJobRole = useCallback((jobRole: string) => {
    setFormData(prev => ({ ...prev, jobRole }));
  }, []);

  const updateQuestionType = useCallback((questionType: string) => {
    setFormData(prev => ({ ...prev, questionType }));
  }, []);

  const updateExperienceLevel = useCallback((experienceLevel: string) => {
    setFormData(prev => ({ ...prev, experienceLevel }));
  }, []);

  const toggleInterviewType = useCallback((typeId: string) => {
    setFormData(prev => ({
      ...prev,
      interviewTypes: prev.interviewTypes.map(type =>
        type.id === typeId ? { ...type, selected: !type.selected } : type
      ),
    }));
  }, []);

  const selectTime = useCallback((timeOption: TimeOption) => {
    setFormData(prev => ({
      ...prev,
      selectedTime: timeOption,
    }));
  }, []);

  const updateCodingProficiency = useCallback((codingProficiency: string) => {
    setFormData(prev => ({ ...prev, codingProficiency }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      jobRole: '',
      questionType: '',
      experienceLevel: '',
      interviewTypes: [...INTERVIEW_TYPES],
      selectedTime: null,
      codingProficiency: '',
    });
  }, []);

  const isFormValid = useCallback(() => {
    return (
      formData.jobRole.trim() !== '' &&
      formData.questionType.trim() !== '' &&
      formData.experienceLevel.trim() !== '' &&
      formData.interviewTypes.some(type => type.selected) &&
      formData.selectedTime !== null
    );
  }, [formData]);

  return {
    formData,
    updateJobRole,
    updateQuestionType,
    updateExperienceLevel,
    toggleInterviewType,
    selectTime,
    updateCodingProficiency,
    resetForm,
    isFormValid,
  };
};
