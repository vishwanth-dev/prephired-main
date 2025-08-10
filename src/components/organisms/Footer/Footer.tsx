'use client';

import Link from 'next/link';
import { Icon } from '@/components/atoms/icon';

const footerLinks = {
  product: [
    { name: 'Mock Interviews', href: '/features/mock-interviews' },
    { name: 'Skill Assessment', href: '/features/skill-assessment' },
    { name: 'Career Coach', href: '/features/career-coach' },
    { name: 'Interview Analytics', href: '/features/analytics' },
    { name: 'Resume Builder', href: '/features/resume-builder' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Press', href: '/press' },
    { name: 'Contact', href: '/contact' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'Security', href: '/security' },
    { name: 'API', href: '/api' },
  ],
};

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/prepai', icon: 'twitter' },
  { name: 'Instagram', href: 'https://instagram.com/prepai', icon: 'instagram' },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/prepai', icon: 'linkedin' },
];

export function Footer() {
  return (
    <footer className='border-t bg-gray-50'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Brand Section */}
          <div className='space-y-4'>
            <Link href='/' className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-lg'>P</span>
              </div>
              <span className='text-xl font-bold text-gray-900'>prepAI</span>
            </Link>
            <p className='text-gray-600 text-sm leading-relaxed'>
              Transform your interview skills with AI-powered preparation. Your journey to career
              success starts here.
            </p>
            <div className='flex space-x-4'>
              {socialLinks.map(social => (
                <a
                  key={social.name}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-400 hover:text-orange-500 transition-colors'
                  title={social.name}
                >
                  <Icon size='lg' color='muted'>
                    {social.icon === 'twitter' && '🐦'}
                    {social.icon === 'instagram' && '📷'}
                    {social.icon === 'linkedin' && '💼'}
                  </Icon>
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className='font-semibold text-gray-900 mb-4'>Product</h3>
            <ul className='space-y-2'>
              {footerLinks.product.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className='font-semibold text-gray-900 mb-4'>Company</h3>
            <ul className='space-y-2'>
              {footerLinks.company.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className='font-semibold text-gray-900 mb-4'>Support</h3>
            <ul className='space-y-2'>
              {footerLinks.support.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-gray-600 text-sm'>© 2024 prepAI. All rights reserved.</p>
          <p className='text-gray-600 text-sm flex items-center mt-2 md:mt-0'>
            Made with <span className='text-red-500 mx-1'>❤️</span> for interview success
          </p>
        </div>
      </div>
    </footer>
  );
}
