'use client';

import React from 'react';
import { TimeOption } from '../types';

interface TimeSelectorProps {
  timeOptions: TimeOption[];
  selectedTime: TimeOption | null;
  onTimeSelect: (time: TimeOption) => void;
}

export default function TimeSelector({
  timeOptions,
  selectedTime,
  onTimeSelect,
}: TimeSelectorProps) {
  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap gap-6'>
        {timeOptions.map(time => (
          <div key={time.id} className='flex items-center space-x-3'>
            <input
              type='radio'
              id={time.id}
              name='interview-time'
              value={time.value}
              checked={selectedTime?.id === time.id}
              onChange={() => onTimeSelect(time)}
              className='w-4 h-4 text-rose-500 bg-gray-100 border-gray-300 focus:ring-rose-500 focus:ring-2'
            />
            <label htmlFor={time.id} className='text-base font-medium text-gray-900 cursor-pointer'>
              {time.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
