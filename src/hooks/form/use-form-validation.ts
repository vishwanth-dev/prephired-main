/**
 * Form Validation Hook
 *
 * This hook provides form validation functionality following SOLID principles:
 * - Single Responsibility: Only handles form validation
 * - Open/Closed: Extensible through custom validators
 * - Liskov Substitution: Standard validation interface
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Works with validation abstractions
 *
 * Features:
 * - Field-level validation
 * - Form-level validation
 * - Async validation support
 * - Custom validators
 * - Error management
 *
 * Usage:
 * ```tsx
 * const { values, errors, handleChange, handleSubmit } = useFormValidation({
 *   initialValues: { email: '' },
 *   validationSchema,
 *   onSubmit: handleFormSubmit
 * });
 * ```
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// ============================================
// TYPE DEFINITIONS
// ============================================

type FieldValue = string | number | boolean | Date | null | undefined;
type FormValues = Record<string, FieldValue>;
type FormErrors<T extends FormValues> = Partial<Record<keyof T, string>>;
type TouchedFields<T extends FormValues> = Partial<Record<keyof T, boolean>>;

interface ValidationRule {
  required?: boolean | string;
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: (value: any) => string | boolean | Promise<string | boolean>;
  email?: boolean | string;
  url?: boolean | string;
  custom?: (value: any, formValues: FormValues) => string | boolean;
}

type ValidationSchema<T extends FormValues> = {
  [K in keyof T]?: ValidationRule;
};

interface UseFormValidationOptions<T extends FormValues> {
  initialValues: T;
  validationSchema?: ValidationSchema<T>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnMount?: boolean;
  onSubmit?: (values: T) => void | Promise<void>;
}

interface UseFormValidationReturn<T extends FormValues> {
  values: T;
  errors: FormErrors<T>;
  touched: TouchedFields<T>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  handleChange: (name: keyof T) => (value: FieldValue | React.ChangeEvent<any>) => void;
  handleBlur: (name: keyof T) => () => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  setFieldValue: (name: keyof T, value: FieldValue) => void;
  setFieldError: (name: keyof T, error: string) => void;
  setValues: (values: Partial<T>) => void;
  setErrors: (errors: FormErrors<T>) => void;
  reset: () => void;
  validateField: (name: keyof T) => Promise<string | undefined>;
  validateForm: () => Promise<FormErrors<T>>;
}

// ============================================
// VALIDATION HELPERS
// ============================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/.+/;

async function validateFieldValue(
  value: FieldValue,
  rules: ValidationRule,
  formValues: FormValues
): Promise<string | undefined> {
  // Required validation
  if (rules.required) {
    const isEmpty = value === null || value === undefined || value === '';
    if (isEmpty) {
      return typeof rules.required === 'string' ? rules.required : 'This field is required';
    }
  }

  // Skip other validations if value is empty and not required
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  // Email validation
  if (rules.email && typeof value === 'string') {
    if (!EMAIL_REGEX.test(value)) {
      return typeof rules.email === 'string' ? rules.email : 'Invalid email address';
    }
  }

  // URL validation
  if (rules.url && typeof value === 'string') {
    if (!URL_REGEX.test(value)) {
      return typeof rules.url === 'string' ? rules.url : 'Invalid URL';
    }
  }

  // Pattern validation
  if (rules.pattern && typeof value === 'string') {
    const pattern =
      typeof rules.pattern === 'object'
        ? (rules.pattern as { value: RegExp; message: string }).value
        : (rules.pattern as RegExp);
    const message =
      typeof rules.pattern === 'object'
        ? (rules.pattern as { value: RegExp; message: string }).message
        : 'Invalid format';
    if (!pattern.test(value)) {
      return message;
    }
  }

  // Min/Max validations
  if (typeof value === 'number') {
    if (rules.min !== undefined) {
      const min = typeof rules.min === 'object' ? rules.min.value : rules.min;
      const message = typeof rules.min === 'object' ? rules.min.message : `Must be at least ${min}`;
      if (value < min) return message;
    }

    if (rules.max !== undefined) {
      const max = typeof rules.max === 'object' ? rules.max.value : rules.max;
      const message = typeof rules.max === 'object' ? rules.max.message : `Must be at most ${max}`;
      if (value > max) return message;
    }
  }

  // MinLength/MaxLength validations
  if (typeof value === 'string') {
    if (rules.minLength !== undefined) {
      const minLength =
        typeof rules.minLength === 'object' ? rules.minLength.value : rules.minLength;
      const message =
        typeof rules.minLength === 'object'
          ? rules.minLength.message
          : `Must be at least ${minLength} characters`;
      if (value.length < minLength) return message;
    }

    if (rules.maxLength !== undefined) {
      const maxLength =
        typeof rules.maxLength === 'object' ? rules.maxLength.value : rules.maxLength;
      const message =
        typeof rules.maxLength === 'object'
          ? rules.maxLength.message
          : `Must be at most ${maxLength} characters`;
      if (value.length > maxLength) return message;
    }
  }

  // Custom validation
  if (rules.custom) {
    const result = rules.custom(value, formValues);
    if (typeof result === 'string') return result;
    if (!result) return 'Validation failed';
  }

  // Async validation
  if (rules.validate) {
    const result = await rules.validate(value);
    if (typeof result === 'string') return result;
    if (!result) return 'Validation failed';
  }

  return undefined;
}

// ============================================
// FORM VALIDATION HOOK
// ============================================

export function useFormValidation<T extends FormValues>(
  options: UseFormValidationOptions<T>
): UseFormValidationReturn<T> {
  const {
    initialValues,
    validationSchema,
    validateOnChange = true,
    validateOnBlur = true,
    validateOnMount = false,
    onSubmit,
  } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<TouchedFields<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValuesRef = useRef(initialValues);
  const mountedRef = useRef(true);

  // Track mounted state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Validate on mount if enabled
  useEffect(() => {
    if (validateOnMount) {
      validateForm();
    }
  }, []);

  // Check if form is dirty
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;

  // Validate single field
  const validateField = useCallback(
    async (name: keyof T): Promise<string | undefined> => {
      if (!validationSchema || !validationSchema[name]) {
        return undefined;
      }

      const error = await validateFieldValue(values[name], validationSchema[name]!, values);

      if (mountedRef.current) {
        setErrors(prev => {
          if (error) {
            return { ...prev, [name]: error };
          } else {
            const { [name]: _, ...rest } = prev;
            return rest as FormErrors<T>;
          }
        });
      }

      return error;
    },
    [values, validationSchema]
  );

  // Validate entire form
  const validateForm = useCallback(async (): Promise<FormErrors<T>> => {
    if (!validationSchema) return {};

    const newErrors: FormErrors<T> = {};

    await Promise.all(
      Object.keys(validationSchema).map(async key => {
        const fieldName = key as keyof T;
        const error = await validateFieldValue(
          values[fieldName],
          validationSchema[fieldName]!,
          values
        );
        if (error) {
          newErrors[fieldName] = error;
        }
      })
    );

    if (mountedRef.current) {
      setErrors(newErrors);
    }

    return newErrors;
  }, [values, validationSchema]);

  // Handle field change
  const handleChange = useCallback(
    (name: keyof T) => async (valueOrEvent: FieldValue | React.ChangeEvent<any>) => {
      const value =
        valueOrEvent && typeof valueOrEvent === 'object' && 'target' in valueOrEvent
          ? valueOrEvent.target.value
          : valueOrEvent;

      setValues(prev => ({ ...prev, [name]: value }));

      if (validateOnChange && touched[name]) {
        await validateField(name);
      }
    },
    [validateOnChange, touched, validateField]
  );

  // Handle field blur
  const handleBlur = useCallback(
    (name: keyof T) => async () => {
      setTouched(prev => ({ ...prev, [name]: true }));

      if (validateOnBlur) {
        await validateField(name);
      }
    },
    [validateOnBlur, validateField]
  );

  // Handle form submit
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      setIsSubmitting(true);
      setTouched(
        Object.keys(values).reduce(
          (acc, key) => ({
            ...acc,
            [key]: true,
          }),
          {} as TouchedFields<T>
        )
      );

      const formErrors = await validateForm();

      if (Object.keys(formErrors).length === 0 && onSubmit) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        }
      }

      if (mountedRef.current) {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, onSubmit]
  );

  // Set field value
  const setFieldValue = useCallback((name: keyof T, value: FieldValue) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  // Set field error
  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValuesRef.current);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, []);

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setValues: (newValues: Partial<T>) => setValues(prev => ({ ...prev, ...newValues })),
    setErrors,
    reset,
    validateField,
    validateForm,
  };
}

// ============================================
// EXPORT
// ============================================

export default useFormValidation;
