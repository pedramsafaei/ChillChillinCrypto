import {
  formatCurrency,
  formatCompactNumber,
  formatPercentage,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  truncateText,
  formatRank,
} from '../../utils/formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format a number as currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('should handle null values', () => {
      expect(formatCurrency(null)).toBe('-');
      expect(formatCurrency(undefined)).toBe('-');
    });

    it('should support different currencies', () => {
      expect(formatCurrency(1234.56, 'EUR')).toContain('1,234.56');
    });
  });

  describe('formatCompactNumber', () => {
    it('should format large numbers compactly', () => {
      const result = formatCompactNumber(1234567);
      expect(result).toMatch(/1\.*\d*M/);
    });

    it('should handle null values', () => {
      expect(formatCompactNumber(null)).toBe('-');
      expect(formatCompactNumber(undefined)).toBe('-');
    });
  });

  describe('formatPercentage', () => {
    it('should format positive percentages', () => {
      expect(formatPercentage(5.5)).toBe('+5.50%');
    });

    it('should format negative percentages', () => {
      expect(formatPercentage(-3.2)).toBe('-3.20%');
    });

    it('should handle null values', () => {
      expect(formatPercentage(null)).toBe('-');
    });

    it('should respect decimal places', () => {
      expect(formatPercentage(5.555, 1)).toBe('+5.6%');
    });
  });

  describe('formatDate', () => {
    it('should format a date', () => {
      const date = new Date('2023-01-15');
      const result = formatDate(date);
      expect(result).toContain('2023');
      expect(result).toContain('Jan');
    });

    it('should handle null values', () => {
      expect(formatDate(null)).toBe('-');
    });
  });

  describe('formatDateTime', () => {
    it('should format a date with time', () => {
      const date = new Date('2023-01-15T14:30:00');
      const result = formatDateTime(date);
      expect(result).toContain('2023');
    });

    it('should handle null values', () => {
      expect(formatDateTime(null)).toBe('-');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2023-01-15T12:00:00'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should format recent time as "just now"', () => {
      const date = new Date('2023-01-15T11:59:30');
      expect(formatRelativeTime(date)).toBe('just now');
    });

    it('should format minutes ago', () => {
      const date = new Date('2023-01-15T11:50:00');
      expect(formatRelativeTime(date)).toBe('10 minutes ago');
    });

    it('should format hours ago', () => {
      const date = new Date('2023-01-15T10:00:00');
      expect(formatRelativeTime(date)).toBe('2 hours ago');
    });

    it('should handle null values', () => {
      expect(formatRelativeTime(null)).toBe('-');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated';
      const result = truncateText(longText, 20);
      expect(result).toBe('This is a very long ...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 20)).toBe('Short text');
    });

    it('should handle null text', () => {
      expect(truncateText(null)).toBeNull();
    });
  });

  describe('formatRank', () => {
    it('should format a rank', () => {
      expect(formatRank(1)).toBe('#1');
      expect(formatRank(42)).toBe('#42');
    });

    it('should handle null values', () => {
      expect(formatRank(null)).toBe('-');
      expect(formatRank(0)).toBe('-');
    });
  });
});
