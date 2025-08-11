'use client';
/**
 * 🎯 Role Selection Hook
 *
 * Manages role selection state and business logic.
 * Separates UI concerns from business logic.
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '../../domain/entities';
import type { RoleSelectionCommand } from '../../domain/entities';
import { roleSelectionService } from '../../services/business/roleSelectionService';

export interface UseRoleSelectionReturn {
  selectedRole: UserRole | null;
  isSubmitting: boolean;
  error: string | null;
  selectRole: (role: UserRole) => Promise<void>;
  clearError: () => void;
  availableRoles: readonly UserRole[];
}

export const useRoleSelection = (): UseRoleSelectionReturn => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const selectRole = useCallback(
    async (role: UserRole) => {
      try {
        setIsSubmitting(true);
        setError(null);
        setSelectedRole(role);

        const command: RoleSelectionCommand = {
          selectedRole: role,
          // In a real app, you'd get these from auth context
          // userId: authContext.user?.id,
          // sessionId: authContext.session?.id,
        };

        const result = await roleSelectionService.selectRole(command);

        if (result.success && result.redirectTo) {
          router.push(result.redirectTo);
        } else if (result.error) {
          setError(result.error.message);
          setSelectedRole(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        setSelectedRole(null);
      } finally {
        setIsSubmitting(false);
      }
    },
    [router]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const availableRoles = roleSelectionService.getAvailableRoles();

  return {
    selectedRole,
    isSubmitting,
    error,
    selectRole,
    clearError,
    availableRoles,
  };
};
