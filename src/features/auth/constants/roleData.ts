/**
 * 🎯 Role Data Constants
 *
 * Centralized data for role options.
 * Separates data from UI components.
 */

import type { RoleOption } from '../domain/entities';

export const ROLE_OPTIONS: readonly RoleOption[] = [
  {
    id: 'student',
    title: 'Student',
    description: 'Access learning resources, courses, and student-focused tools.',
    icon: '/images/illustrations/Student.svg',
    category: 'individual',
  },
  {
    id: 'employee',
    title: 'Employee',
    description: 'Manage work tasks, collaborate with teams, and track progress.',
    icon: '/images/illustrations/Student.svg',
    category: 'individual',
  },
  {
    id: 'university',
    title: 'College/University',
    description: 'Institutional tools for managing students and curriculum.',
    icon: '/images/illustrations/Student.svg',
    category: 'institutional',
  },
  {
    id: 'company',
    title: 'Company',
    description: 'Enterprise solutions for business management and growth.',
    icon: '/images/illustrations/Student.svg',
    category: 'enterprise',
  },
] as const;

export const getRoleOptionById = (id: string): RoleOption | undefined => {
  return ROLE_OPTIONS.find(role => role.id === id);
};

export const getRolesByCategory = (category: RoleOption['category']): readonly RoleOption[] => {
  return ROLE_OPTIONS.filter(role => role.category === category);
};
