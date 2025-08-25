/**
 * 🎯 Role Selection Layout Component
 *
 * Template component providing the two-column layout structure.
 * Follows atomic design principles.
 */

import React from 'react';

interface RoleSelectionLayoutProps {
  children: React.ReactNode;
}

export const RoleSelectionLayout: React.FC<RoleSelectionLayoutProps> = ({ children }) => {
  return (
    <div className=' w-full relative overflow-hidden'>
      {/* Background decorative elements */}
      <div className='absolute inset-0 pointer-events-none'>
        {/* Large circles */}
        <div className='absolute top-[380px] left-[105px] w-[290px] h-[290px] rounded-full bg-gradient-to-br from-[#FF6347] to-white opacity-10' />
        <div className='absolute top-[120px] right-[200px] w-[290px] h-[290px] rounded-full bg-gradient-to-br from-[#FF6347] to-white opacity-10' />
        <div className='absolute top-[187px] left-[-125px] w-[290px] h-[290px] rounded-full bg-[#FF6347] opacity-5' />

        {/* Dot patterns */}
        <div className='absolute top-[619px] left-[337px] grid grid-cols-5 gap-2'>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className='w-[3.46px] h-[3.89px] bg-white rounded-full' />
          ))}
        </div>
        <div className='absolute top-[470px] right-[291px] grid grid-rows-5 gap-2'>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className='w-[3.89px] h-[3.46px] bg-white rounded-full' />
          ))}
        </div>
      </div>

      <div className='flex flex-col lg:flex-row min-h-screen'>
        {/* Right Section - Select Role Content */}
        <div className='w-full bg-gradient-to-br from-white via-[#FFD3CB] to-[#FFD0BC] relative flex items-center justify-center min-h-[50vh] lg:min-h-screen mx-auto'>
          {children}
        </div>
      </div>
    </div>
  );
};
