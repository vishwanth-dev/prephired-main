import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`bg-white border border-[#ECECEC] rounded-[40px] p-6 ${className}`}>
      <div className='mb-6'>
        <h2 className='text-2xl font-medium text-[#363848] mb-2'>{title}</h2>
        {subtitle && <p className='text-lg text-[#989898]'>{subtitle}</p>}
      </div>

      <div className='w-full h-64 flex items-center justify-center bg-[#F8F9FA] rounded-2xl border-2 border-dashed border-[#E9ECEF]'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-[#F0806C] rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M3 3V21H21'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M9 9L12 6L16 10L21 5'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          <div className='text-[#989898] font-medium'>Chart Placeholder</div>
          <div className='text-sm text-[#989898] mt-1'>
            Performance analytics will be displayed here
          </div>
        </div>
      </div>

      {children}
    </div>
  );
};

export default ChartCard;
