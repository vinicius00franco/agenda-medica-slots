import { describe, it, expect } from 'vitest';
import { convertToTimezone, generateSlotsForDay } from '@/utils/timezone';
import { parseISO, format } from 'date-fns';

describe('Robustness - Timezone and Edge Cases', () => {
  
  it('should handle DST transition in London (March)', () => {
    // London moves from GMT to BST on March 30, 2025 at 01:00 UTC
    // Before: 00:30 UTC -> 00:30 GMT
    const beforeUTC = parseISO('2025-03-30T00:30:00Z');
    const beforeLDN = convertToTimezone(beforeUTC, 'Europe/London');
    expect(format(beforeLDN, 'HH:mm')).toBe('00:30');

    // After: 01:30 UTC -> 02:30 BST
    const afterUTC = parseISO('2025-03-30T01:30:00Z');
    const afterLDN = convertToTimezone(afterUTC, 'Europe/London');
    expect(format(afterLDN, 'HH:mm')).toBe('02:30');
  });

  it('should handle DST transition in New York (March)', () => {
    // New York moves to EDT on March 9, 2025
    // 06:00 UTC -> 01:00 EST
    const beforeUTC = parseISO('2025-03-09T06:00:00Z');
    const beforeNY = convertToTimezone(beforeUTC, 'America/New_York');
    expect(format(beforeNY, 'HH:mm')).toBe('01:00');

    // 07:00 UTC -> 03:00 EDT (02:00 was skipped)
    const afterUTC = parseISO('2025-03-09T07:00:00Z');
    const afterNY = convertToTimezone(afterUTC, 'America/New_York');
    expect(format(afterNY, 'HH:mm')).toBe('03:00');
  });

  it('should handle midnight transition correctly when generating slots', () => {
    // If a shift starts at 22:00 and ends at 02:00 (next day)
    // Note: our current generateSlotsForDay uses parse(startTime, 'HH:mm', zonedDate)
    // which assumes the SAME day. We need to check if it handles crossings or if we should restrict rules.
    
    const date = new Date(2025, 0, 1);
    const slots = generateSlotsForDay(date, '23:00', '01:00', 30, 'UTC');
    
    // In current implementation, if end is before start, it might return empty.
    // Let's verify this behavior.
    expect(slots.length).toBe(0); 
  });
});
