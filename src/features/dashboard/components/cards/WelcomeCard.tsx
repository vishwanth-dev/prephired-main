import Image from 'next/image';
import React from 'react';

interface WelcomeCardProps {
  userName: string;
  className?: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName, className = '' }) => {
  return (
    <div className={`bg-welcome mt-36 border  rounded-[39px] p-11 relative ${className}`}>
      <div className='max-w-md ml-80'>
        <h1 className='subheading-large text-primary'>Welcome {userName} !</h1>
        <p className='body-large text-heading'>
          Lorem ipsum is a dummy or placeholder text commonly used in graphic design and publishing.
        </p>
      </div>

      {/* Decorative Illustration - Placeholder */}
      <div className='absolute left-8 -bottom-0 w-80 h-80'>
        <Image
          src='/images/illustrations/DashboardWelcome.svg'
          fill
          alt='Dashboard Welcome'
          className=''
        />
      </div>
    </div>
  );
};

export default WelcomeCard;
