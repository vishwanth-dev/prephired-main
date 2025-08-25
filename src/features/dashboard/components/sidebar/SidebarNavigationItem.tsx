import React from 'react';
import Image from 'next/image';
import { SideBarItem } from '../../constants';
import Link from 'next/link';

interface SidebarNavigationItemProps {
  item: SideBarItem;
  onClick: (item: SideBarItem) => void;
  className?: string;
}

const SidebarNavigationItem: React.FC<SidebarNavigationItemProps> = ({
  item,
  onClick,
  className = '',
}) => {
  const isActive = item.isActive;

  return (
    <Link
      href={item.path}
      className={`group flex items-center gap-3 px-5 py-4 rounded-[20px] cursor-pointer transition-all duration-200 ${
        isActive ? 'bg-[#F0806C] shadow-lg' : 'bg-transparent hover:bg-[#F0806C]'
      } ${className}`}
      onClick={() => onClick(item)}
    >
      <div className='w-6 h-6 flex items-center justify-center'>
        {/* Show active icon when active or on group hover */}
        <div className={`${isActive ? 'block' : 'hidden group-hover:block'}`}>
          <Image
            src={`/images/icons/${item.activeIcon}.svg`}
            alt={item.label}
            width={24}
            height={24}
            className='transition-all duration-200'
          />
        </div>
        {/* Show inactive icon when not active and not hovering */}
        <div className={`${isActive ? 'hidden' : 'block group-hover:hidden'}`}>
          <Image
            src={`/images/icons/${item.inactiveIcon}.svg`}
            alt={item.label}
            width={24}
            height={24}
            className='transition-all duration-200'
          />
        </div>
      </div>
      <span
        className={`font-medium text-base transition-colors duration-200 ${
          isActive ? 'text-white font-semibold' : 'text-font-prime-color group-hover:text-white'
        }`}
      >
        {item.label}
      </span>
    </Link>
  );
};

export default SidebarNavigationItem;
