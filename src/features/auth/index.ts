/**
 * 🔐 Authentication Feature - Public API Exports
 *
 * This is the main entry point for the authentication feature.
 * All public APIs should be exported from here to maintain clean imports.
 *
 * Simplified for basic authentication functionality.
 */

// Components
export { LoginForm } from './components/forms/LoginForm';
export type { LoginFormProps } from './components/forms/LoginForm';

export { RegistrationForm } from './components/forms/RegistrationForm';
export type { RegistrationFormProps } from './components/forms/RegistrationForm';

export { VerifyAccountForm } from './components/forms/VerifyAccountForm';
export type { VerifyAccountFormProps } from './components/forms/VerifyAccountForm';

export { ForgotPasswordForm } from './components/forms/ForgotPasswordForm';
export type { ForgotPasswordFormProps } from './components/forms/ForgotPasswordForm';

export { EmailInput } from './components/inputs/EmailInput';
export type { EmailInputProps } from './components/inputs/EmailInput';

export { PasswordInput } from './components/inputs/PasswordInput';
export type { PasswordInputProps } from './components/inputs/PasswordInput';

// Containers
export { LoginFormContainer } from './containers/LoginFormContainer';
export { RegistrationFormContainer } from './containers/RegistrationFormContainer';
export { VerifyAccountContainer } from './containers/VerifyAccountContainer';
export { ForgotPasswordContainer } from './containers/ForgotPasswordContainer';

// Hooks
export { useLogin } from './hooks/useLogin';
export type { UseLoginReturn } from './hooks/useLogin';

export { useRegistration } from './hooks/useRegistration';
export type { UseRegistrationReturn } from './hooks/useRegistration';

export { useVerifyAccount } from './hooks/useVerifyAccount';
export { useForgotPassword } from './hooks/useForgotPassword';
