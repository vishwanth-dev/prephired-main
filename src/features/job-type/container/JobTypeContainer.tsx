'use client';

import React from 'react';
import { JobTypeFormData } from '../types';
import JobTypeForm from '../components/JobTypeForm';
import GuidelinesPanel from '../components/GuidelinesPanel';
import { JobTypeService } from '../services/jobTypeService';

export default function JobTypeContainer() {
  const handleSubmit = async (data: JobTypeFormData) => {
    try {
      const result = await JobTypeService.submitJobTypeConfiguration(data);
      if (result.success) {
        // Handle success - could redirect or show success message
        // Success handling will be implemented in future iteration
      } else {
        // Handle error
        // Error handling will be implemented in future iteration
      }
    } catch (error) {
      // Error handling will be implemented in future iteration
    }
  };

  const handleCancel = () => {
    // Handle cancel action - could redirect back or clear form
    // Cancel handling will be implemented in future iteration
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-white via-rose-50 to-pink-100'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Panel - Form */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-3xl p-8 shadow-sm border border-rose-100'>
              <JobTypeForm onSubmit={handleSubmit} onCancel={handleCancel} />
            </div>
          </div>

          {/* Right Panel - Guidelines */}
          <div className='lg:col-span-1'>
            <div className='sticky top-8'>
              <GuidelinesPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
