import {
  validateRegistrationForm,
  validateLoginForm,
  validatePassword,
  assessPasswordStrength,
  isValidEmail,
  isValidPhoneNumber,
  normalizePhoneToE164,
  PasswordPolicy,
  DEFAULT_PASSWORD_POLICY,
} from '../../domain/rules';

class ValidationService {
  /**
   * Validates registration form data
   */
  validateRegistration(data: any, passwordPolicy?: PasswordPolicy) {
    return validateRegistrationForm(data, passwordPolicy || DEFAULT_PASSWORD_POLICY);
  }

  /**
   * Validates login form data
   */
  validateLogin(data: any) {
    return validateLoginForm(data);
  }

  /**
   * Validates password strength
   */
  validatePassword(password: string, policy?: PasswordPolicy) {
    return validatePassword(password, policy || DEFAULT_PASSWORD_POLICY);
  }

  /**
   * Assesses password strength with detailed feedback
   */
  assessPasswordStrength(password: string) {
    return assessPasswordStrength(password);
  }

  /**
   * Validates email format
   */
  validateEmail(email: string) {
    return isValidEmail(email);
  }

  /**
   * Validates phone number format
   */
  validatePhone(phone: string, countryCode: string = '+1') {
    // Normalize the phone number first using the country code
    const normalizedPhone = normalizePhoneToE164(phone, countryCode);

    if (!isValidPhoneNumber(normalizedPhone)) {
      return false;
    }
    return true;
  }

  /**
   * Normalizes phone number to E.164 format
   */
  normalizePhone(phone: string, countryCode: string = '+1') {
    return normalizePhoneToE164(phone, countryCode);
  }

  /**
   * Batch validation for multiple fields
   */
  validateBatch(validations: Array<() => boolean>) {
    const results = validations.map(validate => validate());
    return {
      isValid: results.every(result => result),
      results,
    };
  }
}

export const validationService = new ValidationService();
