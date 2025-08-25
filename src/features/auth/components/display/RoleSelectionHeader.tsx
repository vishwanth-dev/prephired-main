'use client';
/**
 * 🎯 Role Selection Header Component
 *
 * Molecular component combining heading and description.
 * Follows atomic design principles.
 */

import React from 'react';
import { Heading } from '@/components/atoms';
import { Text } from '@/components/atoms';
interface RoleSelectionHeaderProps {
  className?: string;
}

export const RoleSelectionHeader: React.FC<RoleSelectionHeaderProps> = ({ className }) => {
  return (
    <div className={className}>
      <Heading level={2} variant='default' className='mb-2 text-primary'>
        Select Role
      </Heading>
      <Text variant='body' className='text-[#363848] max-w-xl'>
        Choose your role to customize your experience and get the most relevant content for your
        needs.
      </Text>
    </div>
  );
};
