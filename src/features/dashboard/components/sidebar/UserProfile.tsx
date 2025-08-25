import React from 'react';

interface UserProfileProps {
  userName: string;
  userRole: string;
  userInitials: string;
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  userName,
  userRole,
  userInitials,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Avatar */}
      <div className='w-[128px] h-[128px] rounded-full border border-[#989898] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.23)] mb-6 overflow-hidden'>
        <div className='w-full h-full bg-gradient-to-br from-[#F0806C] to-[#E06B5A] flex items-center justify-center'>
          <span className='text-4xl font-bold text-white'>{userInitials}</span>
        </div>
      </div>

      {/* User Name */}
      <h3 className='text-xl font-medium text-side-heading-color text-center mb-2 tracking-[-0.96px] font-poppins leading-normal'>
        {userName}
      </h3>

      {/* User Role */}
      <p className='text-base text-font-prime-color text-center uppercase font-normal'>
        {userRole}
      </p>
    </div>
  );
};

export default UserProfile;
