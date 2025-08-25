import React from 'react';
import { SentimentData } from '../../types';

interface SentimentCardProps {
  sentimentData: SentimentData[];
  className?: string;
}

const SentimentCard: React.FC<SentimentCardProps> = ({ sentimentData, className = '' }) => {
  return (
    <div className={`bg-white border border-[#ECECEC] rounded-[40px] p-6 ${className}`}>
      <h3 className='text-2xl font-medium text-[#363848] mb-6'>Sentiment Summary</h3>

      <div className='space-y-6'>
        {sentimentData.map((sentiment, index) => (
          <div key={index} className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div
                className='w-8 h-8 rounded-full flex items-center justify-center'
                style={{ backgroundColor: sentiment.color }}
              >
                <span className='text-lg'>{sentiment.icon}</span>
              </div>
              <span className='text-sm text-[#626262]'>{sentiment.label}</span>
            </div>
            <span className='text-sm font-medium text-[#363848]'>{sentiment.percentage}%</span>
          </div>
        ))}
      </div>

      {/* Chart Visualization Placeholder */}
      <div className='mt-8 flex justify-center'>
        <div className='w-48 h-32 bg-gradient-to-br from-[#F6F6F6] to-[#FBF8F8] rounded-lg flex items-center justify-center'>
          <div className='text-center text-[#626262]'>
            <div className='text-2xl mb-2'>📊</div>
            <div className='text-sm'>Sentiment Chart</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentCard;
