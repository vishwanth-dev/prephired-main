'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MyInterviewsCard } from '../components';
import { MOCK_INTERVIEWS } from '../constants';
import { MyInterviewsContainerProps } from '../types';
import { Button } from '@/components/atoms';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';

const MyInterviewsContainer: React.FC<MyInterviewsContainerProps> = ({ className = '' }) => {
  //   const [selectedInterviewType, setSelectedInterviewType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleViewReport = (id: string) => {
    console.log('View report for interview:', id);
    // TODO: Implement view report functionality
  };

  const handleRetake = (id: string) => {
    console.log('Retake interview:', id);
    // TODO: Implement retake functionality
  };

  const interviewTypes = [
    { value: 'all', label: 'All Interviews' },
    { value: 'hr', label: 'HR & Behavioral' },
    { value: 'cognitive', label: 'Cognitive Abilities' },
    { value: 'technical', label: 'Technical Skills' },
    { value: 'psychometric', label: 'Psychometric & Personality' },
    { value: 'soft-skills', label: 'Soft Skills' },
  ];

  return (
    <div className={cn('w-full max-w-7xl mx-auto', className)}>
      {/* Header with Filter Controls */}
      <div className='flex items-start justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-bold font-poppins text-[#363848] mb-2'>My Interviews</h1>
          <p className='text-base font-normal font-poppins text-[#989898]'>
            Your recent interview sessions
          </p>
        </div>

        <div className='flex items-end gap-4'>
          <div className='flex flex-col gap-2'>
            <label className='text-xs font-normal font-poppins text-font-prime-color'>
              Choose Interview Type
            </label>
            <Select>
              <SelectTrigger className='w-3xs'>
                <SelectValue placeholder='Select Interview Type' />
              </SelectTrigger>
              <SelectContent>
                {interviewTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Toggle Buttons */}
          <div className='flex items-center gap-1 bg-secondary-bg rounded-full p-1 border border-peach-light-alt h-14'>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setViewMode('list')}
              className={cn(
                'px-3 py-2',
                viewMode === 'list'
                  ? 'bg-[#F0806C] text-white border-[#F0806C]'
                  : 'bg-white text-[#363848] border-[#E5E7EB]'
              )}
              icon={
                <Image
                  src={`/images/icons/${viewMode === 'list' ? 'ListPrimary' : 'List'}.svg`}
                  alt='List'
                  width={16}
                  height={16}
                />
              }
              iconPosition='only'
            />
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setViewMode('grid')}
              className={cn(
                'px-3 py-2',
                viewMode === 'grid'
                  ? 'bg-[#F0806C] text-white border-[#F0806C]'
                  : 'bg-white text-[#363848] border-[#E5E7EB]'
              )}
              icon={
                <Image
                  src={`/images/icons/${viewMode === 'grid' ? 'GridPrimary' : 'Grid'}.svg`}
                  alt='Grid'
                  width={16}
                  height={16}
                />
              }
              iconPosition='prefix'
            />
          </div>
        </div>
      </div>

      {/* Interviews List */}
      <div
        className={cn(
          'space-y-6',
          viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'flex flex-col space-y-6'
        )}
      >
        {MOCK_INTERVIEWS.map(interview => (
          <MyInterviewsCard
            key={interview.id}
            interview={interview}
            onViewReport={handleViewReport}
            onRetake={handleRetake}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Empty State (if no interviews) */}
      {MOCK_INTERVIEWS.length === 0 && (
        <div className='text-center py-12'>
          <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              width='48'
              height='48'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M8 12H16M12 8V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
                stroke='#9CA3AF'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          <h3 className='text-xl font-semibold font-poppins text-[#363848] mb-2'>
            No interviews yet
          </h3>
          <p className='text-base font-normal font-poppins text-[#989898] mb-6'>
            Start your first interview to see your performance here
          </p>
          <button className='px-6 py-3 bg-[#F0806C] text-white rounded-[50px] font-medium font-poppins hover:bg-[#E06B5A] transition-colors'>
            Start Interview
          </button>
        </div>
      )}
    </div>
  );
};

export default MyInterviewsContainer;
