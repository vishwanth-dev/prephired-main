/**
 * 📝 Form Validation Hook
 *
 * This hook provides form validation functionality following SOLID principles:
 * - Single Responsibility: Only handles form validation logic
 * - Open/Closed: Extensible through validation schemas
 * - Liskov Substitution: Can be replaced with other validation hooks
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Depends on abstractions (Zod schemas)
 *
 * 📋 Features:
 * - Real-time validation
 * - Field-level validation
 * - Form-level validation
 * - Error message handling
 * - Validation state management
 *
 * 🔧 Usage:
 * ```tsx
 * const { validateField, validateForm, errors, isValid } = useFormValidation(schema);
 * ```
 */

'use client';

import { useState, useCallback } from 'react';
import { z } from 'zod';

// ============================================
// 🎯 INTERFACE DEFINITIONS
// ============================================

interface ValidationState {
  errors: Record<string, string>;
  isValid: boolean;
  isDirty: boolean;
}

// ============================================
// 📝 FORM VALIDATION HOOK
// ============================================

export const useFormValidation = <T extends z.ZodType>(schema: T) => {
  // ============================================
  // 🎣 STATE
  // ============================================

  const [validationState, setValidationState] = useState<ValidationState>({
    errors: {},
    isValid: true,
    isDirty: false,
  });

  // ============================================
  // 🎯 VALIDATION METHODS
  // ============================================

  const validateField = useCallback(
    (fieldName: string, value: any) => {
      try {
        // Create a partial schema for the specific field
        const fieldSchema = (schema as any).pick({ [fieldName]: true });
        const result = fieldSchema.safeParse({ [fieldName]: value });

        if (!result.success) {
          const error = result.error.issues[0];
          setValidationState(prev => ({
            ...prev,
            errors: {
              ...prev.errors,
              [fieldName]: error.message,
            },
            isDirty: true,
          }));
          return false;
        } else {
          setValidationState(prev => ({
            ...prev,
            errors: {
              ...prev.errors,
              [fieldName]: '',
            },
            isDirty: true,
          }));
          return true;
        }
      } catch (error) {
        console.error('Validation error:', error);
        return false;
      }
    },
    [schema]
  );

  const validateForm = useCallback(
    (values: any) => {
      try {
        const result = schema.safeParse(values);

        if (!result.success) {
          const errors: Record<string, string> = {};
          result.error.issues.forEach((error: any) => {
            const fieldName = error.path.join('.');
            errors[fieldName] = error.message;
          });

          setValidationState(prev => ({
            ...prev,
            errors,
            isValid: false,
            isDirty: true,
          }));

          return { isValid: false, errors };
        } else {
          setValidationState(prev => ({
            ...prev,
            errors: {},
            isValid: true,
            isDirty: true,
          }));

          return { isValid: true, errors: {} };
        }
      } catch (error) {
        console.error('Form validation error:', error);
        return { isValid: false, errors: {} };
      }
    },
    [schema]
  );

  const clearErrors = useCallback(() => {
    setValidationState(prev => ({
      ...prev,
      errors: {},
      isValid: true,
    }));
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setValidationState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [fieldName]: '',
      },
    }));
  }, []);

  const setFieldError = useCallback((fieldName: string, message: string) => {
    setValidationState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [fieldName]: message,
      },
      isValid: false,
    }));
  }, []);

  // ============================================
  // 🎯 VALIDATION HELPERS
  // ============================================

  const getFieldError = useCallback(
    (fieldName: string) => {
      return validationState.errors[fieldName] || '';
    },
    [validationState.errors]
  );

  const hasFieldError = useCallback(
    (fieldName: string) => {
      return !!validationState.errors[fieldName];
    },
    [validationState.errors]
  );

  const hasErrors = useCallback(() => {
    return Object.values(validationState.errors).some(error => !!error);
  }, [validationState.errors]);

  // ============================================
  // 🎯 RETURN VALUE
  // ============================================

  return {
    // Validation methods
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
    setFieldError,

    // Validation helpers
    getFieldError,
    hasFieldError,
    hasErrors,

    // Validation state
    errors: validationState.errors,
    isValid: validationState.isValid,
    isDirty: validationState.isDirty,
  };
};

// ============================================
// 🎯 EXPORT
// ============================================

export default useFormValidation;
