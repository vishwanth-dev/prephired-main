'use client';

import React from 'react';
import { useSidebar } from '../../hooks/useSidebar';
import UserProfile from './UserProfile';
import SidebarNavigationItem from './SidebarNavigationItem';
import { useGlobalStore } from '@/store';

interface DashboardSidebarProps {
  className?: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ className = '' }) => {
  const { navigationItems, bottomItems, handleItemClick } = useSidebar();
  const { isSidebarCollapsed } = useGlobalStore();
  return (
    <div className='xl:block hidden'>
      <div className='flex'>
        <aside
          className={`fixed menu-sidebar lg:h-[calc(100%_-_40px)]  overflow-y-hidden rounded-4xl py-6 ${className}`}
        >
          {/* User Profile Section */}
          {isSidebarCollapsed ? (
            <div className='flex flex-col gap-3'>
              <UserProfile userName='Vamsi Krishna' userRole='ui ux designer' userInitials='VK' />

              <div
                className='mx-[14px] h-px opacity-40'
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(to right, #9C9797 0px, #9C9797 4px, transparent 4px, transparent 8px)',
                }}
              />
            </div>
          ) : null}

          {/* Main Navigation Items */}
          <div className='flex flex-col gap-3'>
            <div className='px-5 flex flex-col gap-3'>
              {navigationItems.map(item => (
                <SidebarNavigationItem key={item.id} item={item} onClick={handleItemClick} />
              ))}
            </div>

            {/* Solid Divider */}
            <div className='w-full h-px bg-[#DDDDDD]' />
          </div>

          {/* Bottom Navigation Items */}
          <div className='px-5 flex flex-col gap-3'>
            {bottomItems.map(item => (
              <SidebarNavigationItem key={item.id} item={item} onClick={handleItemClick} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardSidebar;
