const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email format. Returns error message or null if valid.
 */
export function validateEmail(value) {
  if (!value || typeof value !== 'string') return 'Email is required';
  const trimmed = value.trim();
  if (!trimmed) return 'Email is required';
  if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address';
  return null;
}
