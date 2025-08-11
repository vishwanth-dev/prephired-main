/**
 * UI Types for Authentication Feature
 *
 * Client-side UI-specific interfaces that are NOT domain entities.
 * Domain entities are imported from ../domain/entities
 */

import type { UserRole } from '../domain/entities';

// =============================================================================
// UI-SPECIFIC TYPES (NOT DOMAIN ENTITIES)
// =============================================================================

/**
 * UI-specific props for components
 */
export interface AuthGuardProps {
  readonly children: React.ReactNode;
  readonly requireAuth?: boolean;
  readonly requireRoles?: UserRole[];
  readonly requireTenant?: boolean;
  readonly requireVerification?: boolean;
  readonly fallback?: React.ReactNode;
  readonly redirectTo?: string;
}

/**
 * Form field configuration for dynamic forms
 */
export interface FormFieldConfig {
  readonly name: string;
  readonly label: string;
  readonly type: 'text' | 'email' | 'password' | 'tel' | 'checkbox' | 'select';
  readonly required?: boolean;
  readonly placeholder?: string;
  readonly options?: Array<{ value: string; label: string }>;
  readonly validation?: {
    readonly minLength?: number;
    readonly maxLength?: number;
    readonly pattern?: string;
    readonly message?: string;
  };
}

/**
 * Form configuration for dynamic form generation
 */
export interface FormConfig {
  readonly fields: FormFieldConfig[];
  readonly submitText: string;
  readonly cancelText?: string;
  readonly layout?: 'vertical' | 'horizontal' | 'grid';
}
