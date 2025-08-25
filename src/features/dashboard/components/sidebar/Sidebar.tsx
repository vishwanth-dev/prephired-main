'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/atoms/button';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/store';
import {
  Search,
  Bell,
  Menu,
  Sun,
  Moon,
  ChevronDown,
  Settings,
  User,
  LogOut,
  MessageSquare,
  Grid3X3,
  Home,
  Calendar,
  Zap,
  CreditCard,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/atoms';
import { Sheet, SheetContent } from '@/components/atoms';
import { Input } from '@/components/atoms';
import Badge from '@/components/atoms/badge';

// Sidebar Navigation Items
const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    badge: null,
  },

  {
    title: 'My Interviews',
    href: '/dashboard/my-interviews',
    icon: Calendar,
    badge: '3',
  },
  {
    title: 'Streaks',
    href: '/dashboard/streaks',
    icon: Zap,
    badge: null,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    badge: null,
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
    badge: null,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    badge: null,
  },
  {
    title: 'Subscription',
    href: '/dashboard/subscription',
    icon: CreditCard,
    badge: 'Pro',
  },
];

// Sidebar Component
const Sidebar = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useGlobalStore();

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300',
        isSidebarCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo Section */}
      <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
        <Link href='/dashboard' className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-gradient-to-r from-[#F0806C] to-[#E06B5A] rounded-lg flex items-center justify-center flex-shrink-0'>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9ZM19 9H14V4H5V21H19V9Z'
                fill='white'
              />
            </svg>
          </div>
          {!isSidebarCollapsed && (
            <span className='text-xl font-bold text-foreground'>PREPAIRED</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className='flex-1 p-4 space-y-2'>
        {navigationItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative group',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
                isSidebarCollapsed ? 'justify-center' : 'justify-start'
              )}
            >
              <Icon className='h-5 w-5 flex-shrink-0' />
              {!isSidebarCollapsed && (
                <>
                  <span className='flex-1'>{item.title}</span>
                  {item.badge && (
                    <Badge
                      variant={item.badge === 'Pro' ? 'default' : 'secondary'}
                      className='text-xs'
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}

              {/* Tooltip for collapsed state */}
              {isSidebarCollapsed && (
                <div className='absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50'>
                  {item.title}
                  {item.badge && ` (${item.badge})`}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle Button */}
      <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
        <Button
          variant='ghost'
          size='icon'
          onClick={toggleSidebar}
          className='w-full hover:bg-gray-100 dark:hover:bg-gray-800'
        >
          {isSidebarCollapsed ? (
            <ChevronRight className='h-4 w-4' />
          ) : (
            <ChevronLeft className='h-4 w-4' />
          )}
        </Button>
      </div>
    </div>
  );
};

// Header Component
const DashboardHeader = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
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

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 transition-all duration-200',
        isSticky
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
          : 'bg-white dark:bg-gray-900'
      )}
    >
      <div className='flex items-center justify-between px-4 py-3'>
        {/* Left Section */}
        <div className='flex items-center gap-3'>
          {/* Mobile Sidebar Toggle */}
          <Button
            variant='ghost'
            size='icon'
            className='lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800'
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Menu className='h-5 w-5' />
          </Button>

          {/* Mobile Logo */}
          <div className='lg:hidden'>
            <Link href='/dashboard' className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-gradient-to-r from-[#F0806C] to-[#E06B5A] rounded-lg flex items-center justify-center'>
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9ZM19 9H14V4H5V21H19V9Z'
                    fill='white'
                  />
                </svg>
              </div>
              <span className='text-lg font-bold'>PREPAIRED</span>
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className='flex items-center gap-2'>
          {/* Search - Desktop Only */}
          <div className='relative hidden xl:block'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
            <Input
              type='text'
              placeholder='Search...'
              className='pl-10 w-64 bg-gray-50 dark:bg-gray-800'
            />
          </div>

          {/* Theme Toggle */}
          <Button variant='ghost' size='icon' onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='relative'>
                <Bell className='h-4 w-4' />
                <Badge className='absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-[#F0806C]'>
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-80'>
              <div className='p-4'>
                <h3 className='font-semibold mb-3'>Notifications</h3>
                <div className='space-y-3'>
                  <div className='p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                    <p className='text-sm font-medium'>New interview scheduled</p>
                    <p className='text-xs text-gray-500'>Tomorrow at 2:00 PM</p>
                  </div>
                  <div className='p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'>
                    <p className='text-sm font-medium'>Practice session completed</p>
                    <p className='text-xs text-gray-500'>1 hour ago</p>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='flex items-center gap-2 bg-[#FDF2F2] border border-[#FFE9E9] rounded-full px-3 py-2 h-auto'
              >
                <div className='w-8 h-8 bg-gradient-to-br from-[#F0806C] to-[#E06B5A] rounded-full flex items-center justify-center'>
                  <span className='text-white font-semibold text-sm'>VK</span>
                </div>
                <ChevronDown className='h-4 w-4 hidden sm:block' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <div className='px-2 py-1.5'>
                <p className='text-sm font-medium'>Vivek Kumar</p>
                <p className='text-xs text-gray-500'>vivek@example.com</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className='mr-2 h-4 w-4' />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className='mr-2 h-4 w-4' />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className='mr-2 h-4 w-4' />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Button
            variant='ghost'
            size='icon'
            className='lg:hidden'
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <Grid3X3 className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className='lg:hidden border-t border-gray-200 dark:border-gray-700 p-4'>
          <div className='relative mb-4'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
            <Input type='text' placeholder='Search...' className='pl-10' />
          </div>
        </div>
      )}
    </header>
  );
};
