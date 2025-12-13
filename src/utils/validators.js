/**
 * Validation utility functions
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate positive number
 * @param {any} value - Value to validate
 * @returns {boolean} True if valid positive number
 */
export const isPositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

/**
 * Validate cryptocurrency amount
 * @param {any} amount - Amount to validate
 * @returns {boolean} True if valid amount
 */
export const isValidCryptoAmount = (amount) => {
  const num = Number(amount);
  return !isNaN(num) && num > 0 && num <= 1000000000;
};

/**
 * Validate price value
 * @param {any} price - Price to validate
 * @returns {boolean} True if valid price
 */
export const isValidPrice = (price) => {
  const num = Number(price);
  return !isNaN(num) && num >= 0;
};

/**
 * Validate date
 * @param {any} date - Date to validate
 * @returns {boolean} True if valid date
 */
export const isValidDate = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

/**
 * Validate date is not in future
 * @param {any} date - Date to validate
 * @returns {boolean} True if date is not in future
 */
export const isNotFutureDate = (date) => {
  if (!isValidDate(date)) return false;
  return new Date(date) <= new Date();
};

/**
 * Sanitize input string
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

/**
 * Validate coin ID format
 * @param {string} coinId - Coin ID to validate
 * @returns {boolean} True if valid format
 */
export const isValidCoinId = (coinId) => {
  if (!coinId || typeof coinId !== 'string') return false;
  // Coin IDs are typically lowercase alphanumeric with hyphens
  return /^[a-z0-9-]+$/.test(coinId);
};

/**
 * Validate percentage value
 * @param {any} value - Value to validate
 * @returns {boolean} True if valid percentage
 */
export const isValidPercentage = (value) => {
  const num = Number(value);
  return !isNaN(num) && num >= -100 && num <= 100;
};

export default {
  isValidEmail,
  isPositiveNumber,
  isValidCryptoAmount,
  isValidPrice,
  isValidDate,
  isNotFutureDate,
  sanitizeInput,
  isValidCoinId,
  isValidPercentage,
};
