/**
 * Input Validation Utilities
 * Functions for validating user input
 */

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns true if valid email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns true if password meets requirements
 * Requirements: Min 8 characters, contains letter and number
 */
export const validatePassword = (password: string): boolean => {
  if (password.length < 8) return false;
  
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return hasLetter && hasNumber;
};

/**
 * Validate required field
 * @param value - Value to check
 * @returns true if value is not empty
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validate name (alphabetic characters only)
 * @param name - Name to validate
 * @returns true if valid name
 */
export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  return nameRegex.test(name.trim()) && name.trim().length > 0;
};

/**
 * Get email validation error message
 * @param email - Email to validate
 * @returns Error message or null
 */
export const getEmailError = (email: string): string | null => {
  if (!validateRequired(email)) {
    return 'Email is required';
  }
  if (!validateEmail(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

/**
 * Get password validation error message
 * @param password - Password to validate
 * @returns Error message or null
 */
export const getPasswordError = (password: string): string | null => {
  if (!validateRequired(password)) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/[a-zA-Z]/.test(password)) {
    return 'Password must contain at least one letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
};

/**
 * Get name validation error message
 * @param name - Name to validate
 * @param fieldName - Field name for error message
 * @returns Error message or null
 */
export const getNameError = (name: string, fieldName: string = 'Name'): string | null => {
  if (!validateRequired(name)) {
    return `${fieldName} is required`;
  }
  if (!validateName(name)) {
    return `${fieldName} contains invalid characters`;
  }
  return null;
};

/**
 * Validate passwords match
 * @param password - First password
 * @param confirmPassword - Confirmation password
 * @returns true if passwords match
 */
export const validatePasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword && password.length > 0;
};

/**
 * Get password match error message
 * @param password - First password
 * @param confirmPassword - Confirmation password
 * @returns Error message or null
 */
export const getPasswordMatchError = (password: string, confirmPassword: string): string | null => {
  if (!validateRequired(confirmPassword)) {
    return 'Please confirm your password';
  }
  if (!validatePasswordsMatch(password, confirmPassword)) {
    return 'Passwords do not match';
  }
  return null;
};
