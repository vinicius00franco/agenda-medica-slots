import { describe, it, expect } from 'vitest';
import { generateSlotsForDay, convertToTimezone } from '@/utils/timezone';
import { parseISO } from 'date-fns';

describe('Timezone Utilities', () => {
  it('should generate slots for a day correctly', () => {
    const date = new Date(2025, 0, 1); // Jan 1st, 2025
    const slots = generateSlotsForDay(date, '08:00', '10:00', 30, 'UTC');
    
    // 08:00 to 10:00 with 30min intervals = 4 slots (08:00, 08:30, 09:00, 09:30)
    expect(slots.length).toBe(4);
    expect(slots[0].startTime.getUTCHours()).toBe(8);
    expect(slots[3].startTime.getUTCHours()).toBe(9);
    expect(slots[3].startTime.getUTCMinutes()).toBe(30);
  });

  it('should handle timezone conversion correctly (UTC to Sao Paulo)', () => {
    // 12:00 UTC should be 09:00 in Sao Paulo (UTC-3)
    const utcDate = parseISO('2025-01-01T12:00:00Z');
    const spDate = convertToTimezone(utcDate, 'America/Sao_Paulo');
    
    expect(spDate.getHours()).toBe(9);
  });

  it('should handle timezone conversion correctly (UTC to New York)', () => {
    // 12:00 UTC should be 07:00 in New York (UTC-5 in Jan)
    const utcDate = parseISO('2025-01-01T12:00:00Z');
    const nyDate = convertToTimezone(utcDate, 'America/New_York');
    
    expect(nyDate.getHours()).toBe(7);
  });
});
