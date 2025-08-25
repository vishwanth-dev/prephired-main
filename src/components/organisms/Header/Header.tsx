'use client';

import Link from 'next/link';


export function Header() {
  return (
    <header className='border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        {/* Logo */}
        <div className='flex items-center space-x-4'>
          <Link href='/' className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-lg'>P</span>
            </div>
            <span className='text-xl font-bold text-gray-900'>prepAI</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className='hidden md:flex items-center space-x-8'>
          <Link
            href='/features'
            className='text-gray-600 hover:text-gray-900 transition-colors font-medium'
          >
            Features
          </Link>
          <Link
            href='/how-it-works'
            className='text-gray-600 hover:text-gray-900 transition-colors font-medium'
          >
            How It Works
          </Link>
          <Link
            href='/pricing'
            className='text-gray-600 hover:text-gray-900 transition-colors font-medium'
          >
            Pricing
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className='flex items-center space-x-4'>
          <Link
            href='/login'
            className='text-gray-600 hover:text-gray-900 transition-colors font-medium'
          >
            Log In
          </Link>
          {/* <Button
            asChild
            className='bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors'
          >
            <Link href='/register'>Get Started</Link>
          </Button> */}
        </div>
      </div>
    </header>
  );
}
