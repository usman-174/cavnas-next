// Authentication and registration validation utilities
// Shared between client components and API routes




// Error codes for consistent error handling
export const AUTH_ERROR_CODES = {
  EMAIL_REQUIRED: 'EMAIL_REQUIRED',
  EMAIL_INVALID: 'EMAIL_INVALID',
  EMAIL_RESERVED: 'EMAIL_RESERVED',
  EMAIL_DISPOSABLE: 'EMAIL_DISPOSABLE',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  PASSWORD_REQUIRED: 'PASSWORD_REQUIRED',
  PASSWORD_TOO_SHORT: 'PASSWORD_TOO_SHORT',
  PASSWORD_WEAK: 'PASSWORD_WEAK',
  NAME_REQUIRED: 'NAME_REQUIRED',
  NAME_TOO_SHORT: 'NAME_TOO_SHORT',
  NAME_INVALID: 'NAME_INVALID',
  TIER_REQUIRED: 'TIER_REQUIRED',
  TIER_INVALID: 'TIER_INVALID',
  TIER_FULL: 'TIER_FULL',
  RATE_LIMITED: 'RATE_LIMITED',
  CREDENTIALS_INVALID: 'CREDENTIALS_INVALID',
} as const;

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

// User-facing error messages
export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  [AUTH_ERROR_CODES.EMAIL_REQUIRED]: 'Please enter your email address',
  [AUTH_ERROR_CODES.EMAIL_INVALID]: 'Please enter a valid email address',
  [AUTH_ERROR_CODES.EMAIL_RESERVED]: 'This email address is reserved and cannot be used',
  [AUTH_ERROR_CODES.EMAIL_DISPOSABLE]: 'Please use a permanent email address',
  [AUTH_ERROR_CODES.EMAIL_EXISTS]: 'An account with this email already exists. Try signing in instead.',
  [AUTH_ERROR_CODES.PASSWORD_REQUIRED]: 'Please enter a password',
  [AUTH_ERROR_CODES.PASSWORD_TOO_SHORT]: 'Password must be at least 8 characters long',
  [AUTH_ERROR_CODES.PASSWORD_WEAK]: 'Password must contain at least 2 of: uppercase, lowercase, numbers, or special characters',
  [AUTH_ERROR_CODES.NAME_REQUIRED]: 'Please enter your full name',
  [AUTH_ERROR_CODES.NAME_TOO_SHORT]: 'Name must be at least 2 characters long',
  [AUTH_ERROR_CODES.NAME_INVALID]: 'Name can only contain letters, spaces, hyphens, and periods',
  [AUTH_ERROR_CODES.TIER_REQUIRED]: 'Please select a tier',
  [AUTH_ERROR_CODES.TIER_INVALID]: 'Invalid tier selected',
  [AUTH_ERROR_CODES.TIER_FULL]: 'This tier is currently at full capacity',
  [AUTH_ERROR_CODES.RATE_LIMITED]: 'Too many attempts. Please wait a moment before trying again.',
  [AUTH_ERROR_CODES.CREDENTIALS_INVALID]: 'Invalid email or password',
};

// Validation result type
export interface ValidationResult {
  valid: boolean;
  error?: string;
  code?: AuthErrorCode;
}

/**
 * Validate email address format and restrictions
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return {
      valid: false,
      error: AUTH_ERROR_MESSAGES[AUTH_ERROR_CODES.EMAIL_REQUIRED],
      code: AUTH_ERROR_CODES.EMAIL_REQUIRED,
    };
  }

  const trimmed = email.trim().toLowerCase();

  // Basic format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return {
      valid: false,
      error: AUTH_ERROR_MESSAGES[AUTH_ERROR_CODES.EMAIL_INVALID],
      code: AUTH_ERROR_CODES.EMAIL_INVALID,
    };
  }





  return { valid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password === '') {
    return {
      valid: false,
      error: AUTH_ERROR_MESSAGES[AUTH_ERROR_CODES.PASSWORD_REQUIRED],
      code: AUTH_ERROR_CODES.PASSWORD_REQUIRED,
    };
  }

  if (password.length < 8) {
    return {
      valid: false,
      error: AUTH_ERROR_MESSAGES[AUTH_ERROR_CODES.PASSWORD_TOO_SHORT],
      code: AUTH_ERROR_CODES.PASSWORD_TOO_SHORT,
    };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password is too long' };
  }

  // Password strength check - require at least 2 of 4 criteria
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const strengthScore = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  if (strengthScore < 2) {
    return {
      valid: false,
      error: AUTH_ERROR_MESSAGES[AUTH_ERROR_CODES.PASSWORD_WEAK],
      code: AUTH_ERROR_CODES.PASSWORD_WEAK,
    };
  }



  return { valid: true };
}

/**
 * Validate full name
 */
export function validateName(name: string): ValidationResult {
  if (!name || name.trim() === '') {
    return {
      valid: false,
      error: AUTH_ERROR_MESSAGES[AUTH_ERROR_CODES.NAME_REQUIRED],
      code: AUTH_ERROR_CODES.NAME_REQUIRED,
    };
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return {
      valid: false,
      error: AUTH_ERROR_MESSAGES[AUTH_ERROR_CODES.NAME_TOO_SHORT],
      code: AUTH_ERROR_CODES.NAME_TOO_SHORT,
    };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Name is too long' };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes, periods)
  const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
  if (!nameRegex.test(trimmed)) {
    return {
      valid: false,
      error: AUTH_ERROR_MESSAGES[AUTH_ERROR_CODES.NAME_INVALID],
      code: AUTH_ERROR_CODES.NAME_INVALID,
    };
  }

  return { valid: true };
}

/**
 * Get user-friendly error message from error code or raw error
 */
export function getAuthErrorMessage(error?: string, code?: AuthErrorCode): string {
  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }
  return error || 'An error occurred. Please try again.';
}

/**
 * Validate login credentials
 */
export function validateLoginCredentials(email: string, password: string): ValidationResult {
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return emailValidation;
  }

  if (!password) {
    return {
      valid: false,
      error: 'Please enter your password',
      code: AUTH_ERROR_CODES.PASSWORD_REQUIRED,
    };
  }

  return { valid: true };
}

/**
 * Validate registration credentials
 */
export function validateRegistrationCredentials(
  email: string,
  password: string,
  name: string,
  tier?: string,
): ValidationResult {
  const nameValidation = validateName(name);
  if (!nameValidation.valid) {
    return nameValidation;
  }

  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return emailValidation;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }

  if (!tier) {
    return {
      valid: false,
      error: AUTH_ERROR_MESSAGES[AUTH_ERROR_CODES.TIER_REQUIRED],
      code: AUTH_ERROR_CODES.TIER_REQUIRED,
    };
  }

  return { valid: true };
}
