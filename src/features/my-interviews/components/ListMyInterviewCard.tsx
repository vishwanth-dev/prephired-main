import { cn } from '@/lib/utils';
import { SKILL_LEVEL_COLORS } from '../constants';

import type { BaseMyInterviewCardProps } from './MyInterviewsCard';
import { Button } from '@/components/atoms';
import Image from 'next/image';
import CategoryCard from '@/components/molecules/CategoryCard';

const ListMyInterviewCard: React.FC<BaseMyInterviewCardProps> = ({
  interview,
  className = '',
  onViewReport,
  onRetake,
}) => {
  const skillLevelColors = SKILL_LEVEL_COLORS[interview.skillLevel];

  return (
    <div
      className={cn(
        'bg-interview-card border border-interview-card-primary rounded-3xl px-4 py-4 relative overflow-hidden shadow-sm w-full',
        className
      )}
    >
      <div className='flex flex-col gap-5'>
        {/* Title */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-5'>
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
          {/* Action Buttons */}
          <div className='flex gap-4'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onViewReport?.(interview.id)}
              icon={<Image src='/images/icons/Report.svg' alt='Report' width={16} height={16} />}
              iconPosition='prefix'
            >
              View Report
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onRetake?.(interview.id)}
              icon={
                <Image
                  src='/images/icons/RotateArrow.svg'
                  alt='RotateArrow'
                  width={16}
                  height={16}
                />
              }
              iconPosition='prefix'
            >
              Retake
            </Button>
          </div>
        </div>
        <div className='flex gap-3'>
          {interview.interviewSynopsis.map(({ id, label, value }) => {
            return (
              <div className='flex flex-col gap-3' key={id}>
                <p className='text-xs font-normal font-poppins leading-[1.31] text-support-text-color '>
                  {label}
                </p>
                <p className='text-xs font-medium font-poppins leading-[1.31] text-side-heading-color'>
                  {value}
                </p>
              </div>
            );
          })}

          <div className='flex flex-col gap-2'>
            <p className='text-xs font-normal font-poppins leading-[1.31] text-[#989898] '>
              Focus Area
            </p>
            <div className='flex items-center gap-2'>
              {interview.focusAreas.map((area, index) => {
                return (
                  <div
                    className='flex items-center border border-support-text-color bg-peach-focus px-2 py-1 rounded-full text-[10px]'
                    key={index}
                  >
                    {area}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div
        className={cn(
          'absolute right-0 bottom-4 rounded-l-2xl px-2 py-1 text-xs',
          skillLevelColors.bg,
          skillLevelColors.text
        )}
      >
        {interview.skillLevel}
      </div>
    </div>
  );
};

export default ListMyInterviewCard;
