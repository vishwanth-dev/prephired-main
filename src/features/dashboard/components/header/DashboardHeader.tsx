'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/atoms/button';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/store';
import {
  Search,
  Bell,
  Menu,
  MenuIcon,
  Sun,
  Moon,
  Settings,
  User,
  LogOut,
  Languages,
  EllipsisVertical,
  ListCollapse,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/atoms';
import { Sheet, SheetContent, SheetTitle } from '@/components/atoms';
import { Input } from '@/components/atoms';
import { Logo } from '@/components/atoms';

interface DashboardHeaderProps {
  className?: string;
  layoutType?: 'vertical' | 'horizontal';
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  className = '',
  layoutType = 'vertical',
}) => {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const {
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isDarkMode,
    toggleDarkMode,
  } = useGlobalStore();

  console.log('isSidebarCollapsed', isSidebarCollapsed);

  const handleSidebarToggle = () => {
    if (window.innerWidth >= 1280) {
      toggleSidebar();
    } else {
      setIsMobileSidebarOpen(true);
    }
  };

  const handleClose = () => setIsMobileSidebarOpen(false);

  const toggleMode = () => {
    toggleDarkMode();
  };

  const handleMobileMenu = () => {
    if (mobileMenu === 'active') {
      setMobileMenu('');
    } else {
      setMobileMenu('active');
    }
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-[5]',
          layoutType === 'vertical' ? 'rounded-lg' : 'xl:rounded-none rounded-lg w-full',
          isSticky
            ? 'bg-white/95 dark:bg-dark/95 backdrop-blur-md shadow-lg fixed w-full'
            : 'bg-white dark:bg-dark shadow-md',
          className
        )}
      >
        <nav
          className={cn(
            'rounded-none bg-transparent dark:bg-transparent py-3 sm:px-0 flex items-center justify-between px-4',
            layoutType === 'horizontal' ? 'container mx-auto py-4 xl:px-0' : 'py-3 sm:px-0'
          )}
        >
          {/* Left Section */}
          <div className='flex items-center gap-3'>
            {/* Mobile Sidebar Toggle */}
            <Button
              variant='ghost'
              size='icon'
              className='xl:hidden h-11 w-11 hover:text-primary hover:bg-primary/10'
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu className='h-6 w-6' />
              <span className='sr-only'>Open sidebar</span>
            </Button>

            {/* Desktop Sidebar Toggle */}
            <Button
              variant='ghost'
              size='icon'
              className='hidden xl:flex h-11 w-11 hover:text-primary hover:bg-primary/10'
              onClick={handleSidebarToggle}
            >
              <ListCollapse className='h-6 w-6' />
              <span className='sr-only'>Toggle sidebar</span>
            </Button>

            {/* Horizontal Layout Logo */}
            {layoutType === 'horizontal' && (
              <div className='me-3 xl:block hidden'>
                <Logo size='medium' />
              </div>
            )}
          </div>

          {/* Mobile Logo - Center */}
          <div className='flex xl:hidden'>
            <Logo size='small' />
          </div>

          {/* Right Section - Desktop */}
          <div className='hidden lg:flex items-center gap-3'>
            {/* Search */}
            <div className='relative hidden xl:block'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input
                type='text'
                placeholder='Search...'
                className='pl-10 w-64 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary'
              />
            </div>

            {/* Theme Toggle */}
            <Button
              variant='ghost'
              size='icon'
              className='h-11 w-11 hover:text-primary hover:bg-primary/10'
              onClick={toggleMode}
            >
              {isDarkMode ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
              <span className='sr-only'>Toggle theme</span>
            </Button>

            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-11 w-11 hover:text-primary hover:bg-primary/10'
                >
                  <Languages className='h-5 w-5' />
                  <span className='sr-only'>Language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-40'>
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Spanish</DropdownMenuItem>
                <DropdownMenuItem>French</DropdownMenuItem>
                <DropdownMenuItem>German</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='relative h-11 w-11 hover:text-primary hover:bg-primary/10'
                >
                  <Bell className='h-5 w-5' />
                  <span className='absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#F0806C] border-2 border-background'></span>
                  <span className='sr-only'>Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-80'>
                <div className='p-4'>
                  <h3 className='font-semibold text-lg mb-2'>Notifications</h3>
                  <div className='space-y-2'>
                    <div className='p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'>
                      <p className='text-sm font-medium'>New interview scheduled</p>
                      <p className='text-xs text-gray-500'>2 minutes ago</p>
                    </div>
                    <div className='p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'>
                      <p className='text-sm font-medium'>Practice session completed</p>
                      <p className='text-xs text-gray-500'>1 hour ago</p>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className='flex items-center gap-3 bg-[#FDF2F2] border border-[#FFE9E9] rounded-full px-3 py-2'>
                  <div className='w-8 h-8 bg-gradient-to-br from-[#F0806C] to-[#E06B5A] rounded-full flex items-center justify-center'>
                    <span className='text-white font-semibold text-sm'>VK</span>
                  </div>
                  <button className='text-gray-600 hover:text-gray-800 transition-colors'>
                    <MenuIcon className='' />
                  </button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <div className='px-2 py-1.5'>
                  <p className='text-sm font-medium'>Vivek Kumar</p>
                  <p className='text-xs text-gray-500'>vivek@example.com</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className='mr-2 h-4 w-4' />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            variant='ghost'
            size='icon'
            className='lg:hidden h-11 w-11 hover:text-primary hover:bg-primary/10'
            onClick={handleMobileMenu}
          >
            <EllipsisVertical className='h-5 w-5' />
          </Button>
        </nav>
        <div
          className={cn(
            'w-full xl:hidden block overflow-hidden transition-all ease-in-out duration-300',
            mobileMenu ? 'min-h-auto overflow-visible' : 'min-h-0'
          )}
        >
          {mobileMenu && (
            <div className='flex items-center gap-2.5 pb-2 justify-center mx-auto'>
              {/* Get Started Button */}
              <Button variant='outline'>
                <span className='relative z-10'>Get Started</span>
              </Button>

              {/* Notifications */}
              <Button variant='ghost' size='icon' className='relative'>
                <span className='sr-only'>Notifications</span>
                <Bell className='h-5 w-5' />
                <span className='absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#F0806C] border-2 border-background'></span>
              </Button>

              {/* User Avatar */}
              <div className='flex items-center gap-3 bg-[#FDF2F2] border border-[#FFE9E9] rounded-full px-3 py-2'>
                <div className='w-8 h-8 bg-gradient-to-br from-[#F0806C] to-[#E06B5A] rounded-full flex items-center justify-center'>
                  <span className='text-white font-semibold text-sm'>VK</span>
                </div>
                <button className='text-gray-600 hover:text-gray-800 transition-colors'>
                  <MenuIcon className='' />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side='left' className='p-0 w-80'>
          <SheetTitle className='sr-only'>Mobile Navigation Menu</SheetTitle>
          <div className='p-4'>
            <div className='flex items-center justify-between mb-6'>
              <Logo size='small' />
            </div>
            <nav className='space-y-2'>
              <Link
                href='/dashboard'
                className='block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
                onClick={handleClose}
              >
                Dashboard
              </Link>

              <Link
                href='/dashboard/my-interviews'
                className='block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-100'
                onClick={handleClose}
              >
                My Interviews
              </Link>
              <Link
                href='/dashboard/streaks'
                className='block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
                onClick={handleClose}
              >
                Streaks
              </Link>
              <Link
                href='/dashboard/settings'
                className='block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
                onClick={handleClose}
              >
                Settings
              </Link>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default DashboardHeader;
