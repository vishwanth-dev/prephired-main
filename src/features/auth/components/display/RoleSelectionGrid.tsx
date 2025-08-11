/**
 * 🎯 Role Selection Grid Component
 *
 * Molecular component for displaying role cards in a grid.
 * Follows atomic design principles.
 */

import React from 'react';
import { RoleCard } from '../cards/RoleCard';
import { ROLE_OPTIONS } from '../../constants/roleData';
import type { UserRole } from '../../domain/entities';

interface RoleSelectionGridProps {
  roles: readonly UserRole[];
  selectedRole: UserRole | null;
  isSubmitting: boolean;
  onRoleSelect: (role: UserRole) => void;
}

export const RoleSelectionGrid: React.FC<RoleSelectionGridProps> = ({
  roles,
  selectedRole,
  isSubmitting,
  onRoleSelect,
}) => {
  const roleOptions = ROLE_OPTIONS.filter(role => roles.includes(role.id));

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 '>
      {roleOptions.map(role => (
        <RoleCard
          key={role.id}
          role={role}
          isSelected={selectedRole === role.id}
          isDisabled={isSubmitting}
          onSelect={() => onRoleSelect(role.id)}
        />
      ))}
    </div>
  );
};
