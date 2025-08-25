import React from 'react';

interface FocusArea {
  id: string;
  title: string;
  score: number;
  date: string;
  duration: string;
  type: string;
  color: string;
}

interface FocusAreasCardProps {
  focusAreas: FocusArea[];
  className?: string;
}

const FocusAreasCard: React.FC<FocusAreasCardProps> = ({ focusAreas, className = '' }) => {
  return (
    <div className={`bg-white border border-[#ECECEC] rounded-[40px] p-6 ${className}`}>
      <h3 className='text-2xl font-medium text-[#363848] mb-6'>Type of Interviews</h3>

      <div className='space-y-4'>
        {focusAreas.map(area => (
          <div key={area.id} className='p-4 bg-[#FFF0F0] border border-[#FFE6E3] rounded-[20px]'>
            <div className='flex items-center justify-between mb-3'>
              <h4 className='text-lg font-medium text-[#363848]'>{area.title}</h4>
              <div className='text-right'>
                <div className='text-2xl font-bold text-[#F0806C]'>{area.score}%</div>
                <div className='text-sm text-[#989898]'>Overall Score</div>
              </div>
            </div>

            <div className='flex items-center justify-between text-sm text-[#989898] mb-3'>
              <span>
                {area.date} · {area.duration}
              </span>
            </div>

            <div className='flex items-center gap-2'>
              <div
                className='w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium'
                style={{ backgroundColor: area.color }}
              >
                {area.type.charAt(0)}
              </div>
              <span className='text-sm text-[#363848]'>{area.type}</span>
            </div>
          </div>
        ))}
      </div>

      {/* View Report Button */}
      <div className='mt-6 text-center'>
        <button className='px-5 py-2 bg-white border border-[#F0806C] rounded-[50px] text-[#F0806C] font-medium hover:bg-[#F0806C] hover:text-white transition-colors'>
          View Report
        </button>
      </div>
    </div>
  );
};

export default FocusAreasCard;
