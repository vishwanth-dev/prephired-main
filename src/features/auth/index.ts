/**
 * 🔐 Authentication Feature - Public API Exports
 *
 * This is the main entry point for the authentication feature.
 * All public APIs should be exported from here to maintain clean imports.
 *
 * Simplified for basic authentication functionality.
 */

// =============================================================================
// COMPONENTS
// =============================================================================

// Forms
export { LoginForm } from './components/forms/LoginForm';
export { RegistrationForm } from './components/forms/RegistrationForm';

// Inputs
export { PasswordInput } from './components/inputs/PasswordInput';

// Display
export { PasswordStrengthMeter } from './components/display/PasswordStrengthMeter';

// Layout
export { AuthForm } from './components/layout/AuthForm';

// Containers
export { RegisterContainer } from './containers/RegisterContainer';

// =============================================================================
// HOOKS
// =============================================================================

// Form hooks
export { useLoginForm } from './hooks/forms/useLoginForm';
export { useRegisterForm } from './hooks/forms/useRegisterForm';

// State hooks
export { useAuthState } from './hooks/state/useAuthState';
export { useUserState } from './hooks/state/useUserState';

// =============================================================================
// STORES
// =============================================================================

export { useAuthStore } from './store/authStore';
export { useUserStore } from './store/userStore';
export { useTenantStore } from './store/tenantStore';

// =============================================================================
// SERVICES
// =============================================================================

export { authBusinessService as authService } from './services/business/authService';
export { userService } from './services/business/userService';
export { validationService } from './services/business/validationService';

// =============================================================================
// SCHEMAS
// =============================================================================

export * from './schema';

// =============================================================================
// TYPES
// =============================================================================

export * from './types';

// =============================================================================
// UTILITIES
// =============================================================================

export {
  formatPhoneForDisplay,
  formatPhoneForInput,
  formatUserDisplayName,
} from './utils/formatting';

// =============================================================================
// DOMAIN
// =============================================================================

// Core entities and types
export * from './domain/entities';
export * from './domain/errors';
export * from './domain/events';
export * from './domain/rules';
export * from './domain/selectors';
