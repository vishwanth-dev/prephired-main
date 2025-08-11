/**
 * 🎯 Role Selection Business Service
 *
 * Handles business logic for role selection functionality.
 * Separates business rules from UI components.
 */

import type { RoleSelectionCommand, RoleSelectionResult, UserRole } from '../../domain/entities';
import { validateRoleSelection, getRoleRedirectPath } from '../../domain/rules';

export interface RoleSelectionService {
  selectRole(command: RoleSelectionCommand): Promise<RoleSelectionResult>;
  getAvailableRoles(): readonly UserRole[];
}

export class RoleSelectionBusinessService implements RoleSelectionService {
  private readonly availableRoles: readonly UserRole[] = [
    'student',
    'employee',
    'university',
    'company',
  ];

  async selectRole(command: RoleSelectionCommand): Promise<RoleSelectionResult> {
    try {
      // Validate the role selection command
      const validation = validateRoleSelection(command);
      if (!validation.isValid) {
        return {
          success: false,
          selectedRole: command.selectedRole,
          error: {
            code: 'VALIDATION_ERROR',
            message: validation.errors?.[0]?.message || 'Invalid role selection',
          },
        };
      }

      // Here you would typically:
      // 1. Update user profile with selected role
      // 2. Create/update user session
      // 3. Log the role selection
      // 4. Trigger any onboarding workflows

      // For now, we'll simulate the process
      await this.simulateRoleSelectionProcess(command);

      return {
        success: true,
        selectedRole: command.selectedRole,
        redirectTo: getRoleRedirectPath(command.selectedRole),
      };
    } catch (error) {
      return {
        success: false,
        selectedRole: command.selectedRole,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  }

  getAvailableRoles(): readonly UserRole[] {
    return this.availableRoles;
  }

  private async simulateRoleSelectionProcess(command: RoleSelectionCommand): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real implementation, you would:
    // - Call API to update user role using command.selectedRole
    // - Update local state/storage
    // - Handle any role-specific setup
    // - Log the role selection for analytics
    console.log(`Simulating role selection for: ${command.selectedRole}`);
  }
}

export const roleSelectionService = new RoleSelectionBusinessService();
