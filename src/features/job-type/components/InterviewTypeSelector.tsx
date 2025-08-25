'use client';

import React from 'react';
import { InterviewType } from '../types';
import { Checkbox } from '@/components/atoms/checkbox';

interface InterviewTypeSelectorProps {
  interviewTypes: InterviewType[];
  onSelectionChange: (types: InterviewType[]) => void;
}

export default function InterviewTypeSelector({
  interviewTypes,
  onSelectionChange,
}: InterviewTypeSelectorProps) {
  const handleToggle = (typeId: string) => {
    const updatedTypes = interviewTypes.map(type =>
      type.id === typeId ? { ...type, selected: !type.selected } : type
    );
    onSelectionChange(updatedTypes);
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {interviewTypes.map(type => (
          <div key={type.id} className='flex items-start space-x-3'>
            <Checkbox
              id={type.id}
              checked={type.selected}
              onCheckedChange={() => handleToggle(type.id)}
              className='mt-1'
            />
            <div className='flex-1'>
              <label
                htmlFor={type.id}
                className='text-base font-medium text-gray-900 cursor-pointer'
              >
                {type.name}
              </label>
              <p className='text-sm text-gray-600 mt-1'>{type.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
