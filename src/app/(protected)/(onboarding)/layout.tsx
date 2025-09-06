import React from 'react';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#FEEEEE] via-[#EBF6FF] to-[#FFD0BC]'>
      <div className='flex-1'>{children}</div>
    </div>
  );
}
