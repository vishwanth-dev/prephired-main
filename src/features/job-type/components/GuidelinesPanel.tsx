'use client';

import React from 'react';
import { GuidelinesPanelProps } from '../types';

export default function GuidelinesPanel({ className = '' }: GuidelinesPanelProps) {
  return (
    <div className={`bg-white rounded-3xl p-8 ${className}`}>
      <div className='text-center mb-8'>
        <h2 className='text-2xl font-medium text-gray-900 mb-6'>Guidelines</h2>

        {/* Illustration */}
        <div className='relative mb-8'>
          <div className='w-64 h-40 mx-auto bg-gradient-to-br from-rose-50 to-pink-100 rounded-full flex items-center justify-center'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-rose-200 rounded-full mx-auto mb-2 flex items-center justify-center'>
                <svg className='w-8 h-8 text-rose-600' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='w-12 h-8 bg-rose-200 rounded-lg mx-auto'></div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className='text-center'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>
          Ready to start interview? Here&apos;s how!
        </h3>
        <div className='text-sm text-gray-600 space-y-2 text-left'>
          <p>1. Type in any roles or choose from the dropdowns.</p>
          <p>2. Upload your resume</p>
          <p>3. Type in job description</p>
          <p>4. Choose question type.</p>
          <p>5. Choose mode.</p>
          <p>6. Add your questions (Customize question type)</p>
        </div>
      </div>
    </div>
  );
}
