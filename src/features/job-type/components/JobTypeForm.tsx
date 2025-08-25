'use client';

import React from 'react';
import { JobTypeFormProps, InterviewType } from '../types';
import { Input } from '@/components/atoms/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';
import { Label } from '@/components/atoms/label';
import { Button } from '@/components/atoms/button';
import InterviewTypeSelector from './InterviewTypeSelector';
import TimeSelector from './TimeSelector';
import { useJobTypeSelection } from '../hooks/useJobTypeSelection';
import { EXPERIENCE_LEVELS, QUESTION_TYPES, TIME_OPTIONS } from '../constants';

export default function JobTypeForm({ onSubmit, onCancel, initialData }: JobTypeFormProps) {
  const {
    formData,
    updateJobRole,
    updateQuestionType,
    updateExperienceLevel,
    toggleInterviewType,
    selectTime,
    isFormValid,
  } = useJobTypeSelection(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit(formData);
    }
  };

  const handleInterviewTypeChange = (types: InterviewType[]) => {
    // Update the form data with new interview types
    types.forEach(type => {
      if (type.selected !== formData.interviewTypes.find(t => t.id === type.id)?.selected) {
        toggleInterviewType(type.id);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      {/* Header Section */}
      <div className='space-y-4'>
        <h1 className='text-2xl font-medium text-gray-900'>Job Type</h1>
        <p className='text-base text-gray-600'>
          Your answers demonstrated creativity and a willingness to think outside the box. However,
          for a more effective interview response, it&apos;s crucial to focus on practicality,
          professionalism, and ethical considerations.
        </p>
      </div>

      {/* Job Role and Question Type Row */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='job-role'>Job Role</Label>
          <Input
            id='job-role'
            placeholder='Enter job role'
            value={formData.jobRole}
            onChange={e => updateJobRole(e.target.value)}
            className='h-12 rounded-full border-gray-300'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='question-type'>Question Type</Label>
          <Select value={formData.questionType} onValueChange={updateQuestionType}>
            <SelectTrigger className='h-12 rounded-full border-gray-300'>
              <SelectValue placeholder='Select question type' />
            </SelectTrigger>
            <SelectContent>
              {QUESTION_TYPES.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Experience Level */}
      <div className='space-y-2'>
        <Label htmlFor='experience-level'>Experience Level</Label>
        <Select value={formData.experienceLevel} onValueChange={updateExperienceLevel}>
          <SelectTrigger className='h-12 rounded-full border-gray-300 w-full lg:w-1/2'>
            <SelectValue placeholder='Select experience level' />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCE_LEVELS.map(level => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Interview Type Selection */}
      <div className='space-y-4'>
        <div>
          <Label className='text-base font-semibold text-gray-900'>Select Interview Type *</Label>
          <p className='text-sm text-gray-500 mt-1'>
            Select the type of interview for this campaign
          </p>
        </div>
        <div className='bg-gray-50 rounded-2xl p-6'>
          <InterviewTypeSelector
            interviewTypes={formData.interviewTypes}
            onSelectionChange={handleInterviewTypeChange}
          />
        </div>
      </div>

      {/* Time Selection */}
      <div className='space-y-4'>
        <div>
          <Label className='text-base font-semibold text-gray-900'>Select Time *</Label>
          <p className='text-sm text-gray-500 mt-1'>
            Select the type of interview for this campaign
          </p>
        </div>
        <TimeSelector
          timeOptions={TIME_OPTIONS}
          selectedTime={formData.selectedTime}
          onTimeSelect={selectTime}
        />
      </div>

      {/* Action Buttons */}
      <div className='flex flex-col sm:flex-row gap-4 pt-6'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          className='flex-1 h-12 rounded-full border-rose-300 text-rose-600 hover:bg-rose-50'
        >
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={!isFormValid()}
          className='flex-1 h-12 rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50'
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
