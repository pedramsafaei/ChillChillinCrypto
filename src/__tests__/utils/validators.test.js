import {
  isValidEmail,
  isPositiveNumber,
  isValidCryptoAmount,
  isValidPrice,
  isValidDate,
  isNotFutureDate,
  sanitizeInput,
  isValidCoinId,
  isValidPercentage,
} from '../../utils/validators';

describe('validators', () => {
  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test @example.com')).toBe(false);
    });
  });

  describe('isPositiveNumber', () => {
    it('should validate positive numbers', () => {
      expect(isPositiveNumber(5)).toBe(true);
      expect(isPositiveNumber(0.1)).toBe(true);
      expect(isPositiveNumber('10')).toBe(true);
    });

    it('should reject non-positive numbers', () => {
      expect(isPositiveNumber(0)).toBe(false);
      expect(isPositiveNumber(-5)).toBe(false);
      expect(isPositiveNumber('not a number')).toBe(false);
    });
  });

  describe('isValidCryptoAmount', () => {
    it('should validate valid crypto amounts', () => {
      expect(isValidCryptoAmount(1)).toBe(true);
      expect(isValidCryptoAmount(0.001)).toBe(true);
      expect(isValidCryptoAmount(1000)).toBe(true);
    });

    it('should reject invalid crypto amounts', () => {
      expect(isValidCryptoAmount(0)).toBe(false);
      expect(isValidCryptoAmount(-1)).toBe(false);
      expect(isValidCryptoAmount(2000000000)).toBe(false);
    });
  });

  describe('isValidPrice', () => {
    it('should validate valid prices', () => {
      expect(isValidPrice(0)).toBe(true);
      expect(isValidPrice(100.5)).toBe(true);
      expect(isValidPrice('50')).toBe(true);
    });

    it('should reject invalid prices', () => {
      expect(isValidPrice(-1)).toBe(false);
      expect(isValidPrice('not a price')).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('should validate valid dates', () => {
      expect(isValidDate('2023-01-15')).toBe(true);
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate('2023-01-15T10:00:00')).toBe(true);
    });

    it('should reject invalid dates', () => {
      expect(isValidDate('not a date')).toBe(false);
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate('')).toBe(false);
    });
  });

  describe('isNotFutureDate', () => {
    it('should validate past and present dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isNotFutureDate(yesterday)).toBe(true);
      expect(isNotFutureDate(new Date())).toBe(true);
    });

    it('should reject future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isNotFutureDate(tomorrow)).toBe(false);
    });

    it('should reject invalid dates', () => {
      expect(isNotFutureDate('invalid')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  test  ')).toBe('test');
    });

    it('should remove script tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>hello')).toBe('hello');
    });

    it('should handle non-string inputs', () => {
      expect(sanitizeInput(123)).toBe('');
      expect(sanitizeInput(null)).toBe('');
    });
  });

  describe('isValidCoinId', () => {
    it('should validate valid coin IDs', () => {
      expect(isValidCoinId('bitcoin')).toBe(true);
      expect(isValidCoinId('ethereum')).toBe(true);
      expect(isValidCoinId('binance-coin')).toBe(true);
    });

    it('should reject invalid coin IDs', () => {
      expect(isValidCoinId('Bitcoin')).toBe(false);
      expect(isValidCoinId('coin_id')).toBe(false);
      expect(isValidCoinId('')).toBe(false);
      expect(isValidCoinId(null)).toBe(false);
    });
  });

  describe('isValidPercentage', () => {
    it('should validate valid percentages', () => {
      expect(isValidPercentage(0)).toBe(true);
      expect(isValidPercentage(50)).toBe(true);
      expect(isValidPercentage(-50)).toBe(true);
      expect(isValidPercentage(100)).toBe(true);
      expect(isValidPercentage(-100)).toBe(true);
    });

    it('should reject invalid percentages', () => {
      expect(isValidPercentage(101)).toBe(false);
      expect(isValidPercentage(-101)).toBe(false);
      expect(isValidPercentage('not a number')).toBe(false);
    });
  });
});
