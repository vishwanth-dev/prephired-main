'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { RoleOption } from '../../domain/entities';

interface RoleCardProps {
  role: RoleOption;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role, isSelected, isDisabled, onSelect }) => {
  return (
    <div
      className={cn(
        'relative w-[275px] h-[321.89px] bg-white rounded-[64.41px] border cursor-pointer transition-all duration-300 group',
        'shadow-sm hover:shadow-lg',
        isSelected
          ? 'border-[#F0806C] shadow-lg transform scale-105'
          : 'border-[#E0E0E0] hover:border-[#F0806C] hover:transform hover:scale-102',
        isDisabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={isDisabled ? undefined : onSelect}
      role='button'
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={e => {
        if (isDisabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-label={`Select ${role.title} role`}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
    >
      {/* Icon area - positioned exactly as per Figma */}
      <div className='absolute top-[30.41px] left-[62.1px] w-[141.32px] h-[88.5px] bg-white rounded-lg flex items-center justify-center'>
        <div className='w-[136.28px] h-[69.4px] flex items-center justify-center'>
          <Image
            src={role.icon}
            alt={role.title}
            width={69.4}
            height={69.4}
            className='w-full h-full object-contain'
          />
        </div>
      </div>

      {/* Role title - positioned exactly as per Figma */}
      <div className='absolute top-[138.13px] left-[100.34px] w-[85px] h-[32px] flex items-center justify-center'>
        <h3
          className={cn(
            'text-[21.54px] font-medium font-poppins leading-[1.5em] text-center transition-colors duration-300',
            isSelected ? 'text-[#F0806C]' : 'text-[#F0806C] opacity-80 group-hover:opacity-100'
          )}
        >
          {role.title}
        </h3>
      </div>

      {/* Description - positioned exactly as per Figma */}
      <div className='absolute top-[172.35px] left-[34.85px] w-[215.47px] h-[38px] flex items-center justify-center'>
        <p className='text-[12.67px] font-normal font-poppins leading-[1.5em] text-center text-[#626262] px-2'>
          {role.description}
        </p>
      </div>

      {/* Arrow button - positioned exactly as per Figma */}
      <div className='absolute bottom-[11.63px] right-[85.63px] w-[94.6px] h-[94.6px]'>
        <div
          className={cn(
            'w-full h-full rounded-full flex items-center justify-center transition-all duration-300',
            isSelected ? 'transform scale-110' : 'group-hover:transform group-hover:scale-110'
          )}
        >
          <Image
            src={'/images/icons/ArrowRightCircle.svg'}
            alt='Arrow'
            width={78.84}
            height={78.84}
            className='w-full h-full'
          />
        </div>
      </div>
    </div>
  );
};
