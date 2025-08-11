'use client';
/**
 * 🎯 Select Role Form Component
 *
 * Refactored following SOLID principles:
 * - Single Responsibility: Only handles role selection UI
 * - Open/Closed: Extensible through props and composition
 * - Liskov Substitution: Uses interfaces for dependencies
 * - Interface Segregation: Minimal, focused props
 * - Dependency Inversion: Depends on abstractions, not concretions
 */

import React from 'react';
import { RoleSelectionHeader } from '../display/RoleSelectionHeader';
import { useRoleSelection } from '../../hooks/state/useRoleSelection';
import { RoleSelectionLayout } from '../layout/RoleSelectionLayout';
import { RoleSelectionGrid } from '../display/RoleSelectionGrid';

export const SelectRoleForm: React.FC = () => {
  const { selectedRole, isSubmitting, error, selectRole, clearError, availableRoles } =
    useRoleSelection();

  return (
    <RoleSelectionLayout>
      <div className='w-full max-w-7xl p-4 lg:p-8'>
        {isSubmitting ? (
          <div className='text-center mt-6'>
            <p className='text-[#626262] font-poppins'>Setting up your account...</p>
          </div>
        ) : (
          <>
            <RoleSelectionHeader className='text-left mb-8 lg:mb-12' />

            <RoleSelectionGrid
              roles={availableRoles}
              selectedRole={selectedRole}
              isSubmitting={isSubmitting}
              onRoleSelect={selectRole}
            />

            {error && (
              <div className='text-center mt-6'>
                <p className='text-red-600 font-poppins'>{error}</p>
                <button
                  onClick={clearError}
                  className='text-[#F0806C] underline mt-2 hover:no-underline'
                >
                  Try again
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </RoleSelectionLayout>
  );
};
