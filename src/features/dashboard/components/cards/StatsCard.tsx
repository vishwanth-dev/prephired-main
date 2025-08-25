import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  weekChange?: string;
  className?: string;
  showFormat?: boolean;
  formatText?: string;
  hasIncreased?: boolean;
  styles: {
    color: string;
    backgroundColor: string;
    strokeColor: string;
    strokeWidth: string;
    fillColor?: string;
    textColor?: string;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle = '',
  icon,
  weekChange = '',
  className = '',
  showFormat = false,
  formatText = '',
  hasIncreased,
  styles,
}) => {
  // Get background color based on main color
  // const getBackgroundColor = (mainColor: string) => {
  //   switch (mainColor) {
  //     case '#54B48F':
  //       return '#CDF2E4';
  //     case '#9372C1':
  //       return '#E1D1F9';
  //     case '#23CC23':
  //       return '#D9FFD9';
  //     case '#F0806C':
  //       return '#FFE4E1';
  //     default:
  //       return '#F0F0F0';
  //   }
  // };

  const { color, backgroundColor, strokeColor, strokeWidth, fillColor } = styles;

  // const backgroundColor = getBackgroundColor(color);

  return (
    <div
      className={cn(
        'border rounded-[39px] px-4 relative overflow-hidden shadow-sm h-[216px]',
        className,
        backgroundColor,
        strokeColor,
        strokeWidth ? `border-[${strokeWidth}px]` : 'border-[1px]'
      )}
    >
      {/* Background Icon Container */}
      {icon && (
        <div className='absolute -top-3 -left-3 w-[104px] h-[104px] rounded-[40px] flex items-center justify-center'>
          <div className='absolute top-0 left-0 w-full h-full'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='104'
              height='103'
              viewBox='0 0 104 103'
              fill='none'
            >
              <path
                d='M89.1025 0C98.3924 10.9084 104 25.0491 104 40.5C104 75.0178 76.0178 103 41.5 103C25.5727 103 11.0373 97.0419 0 87.2334V41C3.38281e-06 18.3563 18.3563 9.01965e-07 41 0H89.1025Z'
                fill={fillColor}
              />
            </svg>
          </div>
          <div className='w-12 h-12 bg-white rounded-xl flex items-center justify-center absolute'>
            <Image
              src={`/images/icons/${icon}.svg`}
              width={24}
              height={24}
              alt='Interview'
              className='w-6 h-6 object-contain'
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className='relative z-10 h-full flex flex-col'>
        <div className='text-right flex flex-col items-end'>
          <div className={cn('text-[52px] font-semibold font-poppins leading-[1.5]', color)}>
            {value}
          </div>
          <div className='flex items-center gap-2'>
            {weekChange && (
              <div className='flex items-center gap-1'>
                <span
                  className={cn(
                    'text-xs font-medium font-poppins leading-[1.5]',
                    hasIncreased ? 'text-green-strong' : 'text-red-strong'
                  )}
                >
                  {hasIncreased ? '+' : '-'}
                  {weekChange}
                </span>
                {weekChange && (
                  <Image
                    src={`/images/icons/${hasIncreased ? 'Growth' : 'Decline'}.svg`}
                    width={16}
                    height={16}
                    alt='Growth'
                    className='w-4 h-4 object-contain'
                  />
                )}
              </div>
            )}
            <span className='text-sm font-normal font-poppins leading-[1.5] text-[#626262]'>
              {subtitle || 'this week'}
            </span>
          </div>
        </div>

        {/* Format Text (if applicable) */}
        {showFormat && formatText && (
          <div className='text-right mr-6 mt-2'>
            <span className='text-[#626262] text-lg font-normal font-poppins leading-[1.5]'>
              {formatText}
            </span>
          </div>
        )}

        {/* Title (bottom left) */}
        <div className='absolute bottom-4 left-2'>
          <h3 className='text-base font-medium font-poppins leading-[1.5] text-[#363848]'>
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
