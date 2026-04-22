import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';
import { addMinutes, isBefore, parse } from 'date-fns';

/**
 * Converts a UTC date to a specific timezone.
 */
export const convertToTimezone = (date: Date, timezone: string): Date => {
  return toZonedTime(date, timezone);
};

/**
 * Converts a zoned time back to UTC.
 */
export const convertToUTC = (date: Date, timezone: string): Date => {
  return fromZonedTime(date, timezone);
};

/**
 * Formats a date in a specific timezone.
 */
export const formatZoned = (date: Date, timezone: string, formatStr: string): string => {
  return formatInTimeZone(date, timezone, formatStr);
};

/**
 * Generates slots for a given day based on start and end hours in a specific timezone.
 */
export const generateSlotsForDay = (
  date: Date,
  startTimeStr: string, // "HH:mm"
  endTimeStr: string,   // "HH:mm"
  intervalMinutes: number,
  timezone: string
): { startTime: Date; endTime: Date }[] => {
  const zonedDate = toZonedTime(date, timezone);
  const start = parse(startTimeStr, 'HH:mm', zonedDate);
  const end = parse(endTimeStr, 'HH:mm', zonedDate);

  const slots: { startTime: Date; endTime: Date }[] = [];
  let current = start;

  while (isBefore(current, end)) {
    const next = addMinutes(current, intervalMinutes);
    if (isBefore(end, next)) break;

    // Convert back to UTC for canonical storage/comparison
    slots.push({
      startTime: fromZonedTime(current, timezone),
      endTime: fromZonedTime(next, timezone),
    });
    current = next;
  }

  return slots;
};
