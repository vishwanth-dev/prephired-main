import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

interface MoodScoreCardProps {
  className?: string;
  moodScore?: number;
}

const MoodScoreCard: React.FC<MoodScoreCardProps> = ({ className = '', moodScore = 85 }) => {
  const currentMood = moodScore > 75 ? 'Happy' : moodScore > 50 ? 'Normal' : 'Angry';
  return (
    <div
      className={cn(
        'bg-mood-score border rounded-4xl p-4 relative overflow-hidden shadow-sm  border-blue-light flex flex-col justify-end',
        className
      )}
    >
      <div className='absolute top-2 right-2 w-20 h-20'>
        <div className='relative w-full h-full'>
          <div className='absolute inset-0 rounded-full'>
            <Image
              src={`/images/emotions/${currentMood}.svg`}
              alt={currentMood}
              width={82}
              height={82}
            />
          </div>
        </div>
      </div>

      <div className='flex flex-col justify-end gap-3'>
        <div className='flex gap-3'>
          {/* Happy Emoji (Left) */}
          <div className='w-8 h-8  rounded-full  flex items-center justify-center'>
            <div className='w-6 h-6 relative'>
              <Image src='/images/emotions/Happy.svg' alt='Happy' width={32} height={32} />
            </div>
          </div>

          {/* Sad Emoji (Middle) */}
          <div className='w-8 h-8  rounded-full  flex items-center justify-center'>
            <div className='w-6 h-6 relative'>
              <Image src='/images/emotions/Normal.svg' alt='Normal' width={32} height={32} />
            </div>
          </div>

          {/* Angry Emoji (Right) */}
          <div className='w-8 h-8 rounded-full  flex items-center justify-center'>
            <div className='w-6 h-6 relative'>
              <Image src='/images/emotions/Angry.svg' alt='Angry' width={32} height={32} />
            </div>
          </div>
        </div>

        <h3 className='text-base font-medium font-poppins leading-[1.5] text-side-heading-color'>
          Mood Score
        </h3>
      </div>
    </div>
  );
};

export default MoodScoreCard;
