import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/atoms';

import { SKILL_LEVEL_COLORS } from '../constants';
import type { BaseMyInterviewCardProps } from './MyInterviewsCard';
import CategoryCard from '@/components/molecules/CategoryCard';
import Image from 'next/image';

const GridMyInterviewCard: React.FC<BaseMyInterviewCardProps> = ({
  interview,
  className = '',
  onViewReport,
  onRetake,
}) => {
  const skillLevelColors = SKILL_LEVEL_COLORS[interview.skillLevel];

  return (
    <div
      className={cn(
        'bg-interview-card border border-interview-card-primary rounded-3xl px-4 py-4 relative overflow-hidden shadow-sm w-full mb-0',
        className
      )}
    >
      <div className='flex items-center gap-5 mb-10'>
        <h3 className='text-xl font-medium font-poppins leading-[0.95] text-[#F0806C]'>
          {interview.skillCategory}
        </h3>
        <div className='flex gap-2'>
          {interview.categories.map((category, index) => (
            <CategoryCard
              key={index}
              index={index}
              category={category}
              length={interview.categories.length}
            />
          ))}
        </div>
      </div>
      <div className='flex flex-col gap-6'>
        <div className='grid grid-cols-3 gap-5 relative'>
          {interview.interviewSynopsis.slice(0, 2).map(({ id, label, value }) => (
            <div className='flex flex-col gap-2' key={id}>
              <p className='text-base font-normal font-poppins leading-[1.31] text-support-text-color'>
                {label}
              </p>
              <p className='text-base font-medium font-poppins leading-[1.31] text-side-heading-color'>
                {value}
              </p>
            </div>
          ))}
          <div /> {/* Empty 3rd column in first row */}
          {interview.interviewSynopsis.slice(2, 5).map(({ id, label, value }) => (
            <div className='flex flex-col gap-2' key={id}>
              <p className='text-base font-normal font-poppins leading-[1.31] text-support-text-color'>
                {label}
              </p>
              <p className='text-2xl font-medium font-poppins leading-[1.31] text-side-heading-color'>
                {value}
              </p>
            </div>
          ))}
          <div
            className={cn(
              'absolute -right-4 top-4 rounded-l-2xl px-3 py-1.5 text-sm',
              skillLevelColors.bg,
              skillLevelColors.text
            )}
          >
            {interview.skillLevel}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <p className='text-base font-normal font-poppins leading-[1.31] text-side-heading-color '>
            Focus Area
          </p>
          <div className='flex items-center gap-2 flex-wrap'>
            {interview.focusAreas.map((area, index) => {
              return (
                <div
                  className='flex items-center border border-support-text-color bg-peach-focus px-2 py-1 rounded-full text-sm whitespace-nowrap'
                  key={index}
                >
                  {area}
                </div>
              );
            })}
          </div>
        </div>
        <div className='flex gap-3 mx-auto'>
          <Button
            variant='outline'
            size='lg'
            onClick={() => onViewReport?.(interview.id)}
            icon={<Image src='/images/icons/Report.svg' alt='Report' width={16} height={16} />}
            iconPosition='prefix'
          >
            View Report
          </Button>
          <Button
            variant='outline'
            size='lg'
            onClick={() => onRetake?.(interview.id)}
            icon={
              <Image src='/images/icons/RotateArrow.svg' alt='RotateArrow' width={16} height={16} />
            }
            iconPosition='prefix'
          >
            Retake
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GridMyInterviewCard;
