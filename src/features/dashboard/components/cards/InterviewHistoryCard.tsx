import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/atoms';
import CategoryCard from '@/components/molecules/CategoryCard';

interface InterviewHistoryCardProps {
  className?: string;
  title: string;
  date: string;
  duration: string;
  overallScore: number;
  resumeScore: number;
  categories: Array<{
    name: string;
    color: string;
    icon: string;
  }>;
  onViewReport?: () => void;
}

const InterviewHistoryCard: React.FC<InterviewHistoryCardProps> = ({
  className = '',
  title,
  date,
  duration,
  overallScore,
  resumeScore,
  categories,
  onViewReport,
}) => {
  return (
    <div
      className={cn(
        'bg-white border rounded-2xl px-8 py-6 relative overflow-hidden shadow-sm w-full  h-[131px] flex items-center justify-between bg-interview-history-card border-peach-border',
        className
      )}
    >
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <h3 className='text-lg font-medium font-poppins leading-[1.5] text-side-heading-color '>
            {title}
          </h3>
          <div className='flex gap-1'>
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                index={index}
                category={category}
                length={categories.length}
              />
            ))}
          </div>
        </div>

        <p className='text-[16px] font-normal font-poppins leading-[1.75] text-support-text-color'>
          {date} · {duration}
        </p>
      </div>

      <div className='flex items-center gap-6'>
        <div className='flex flex-col gap-2 items-center'>
          <div
            className={cn(
              'text-[21.85px] font-extrabold font-inter leading-[1.21] text-side-heading-color '
            )}
          >
            {overallScore}%
          </div>
          <div className='text-base font-medium font-poppins leading-[1.5] text-support-text-color'>
            Overall Score
          </div>
        </div>

        <div className='flex flex-col'>
          <div className='text-center'>
            <div
              className={cn(
                'text-[21.85px] font-extrabold font-inter leading-[1.21] text-side-heading-color mb-2'
              )}
            >
              {resumeScore}%
            </div>
            <div className='text-[16px] font-medium font-poppins leading-[1.5] text-support-text-color'>
              Resume Score
            </div>
          </div>
        </div>

        <Button variant='outline' size='lg' onClick={onViewReport}>
          View Report
        </Button>
      </div>
    </div>
  );
};

export default InterviewHistoryCard;
