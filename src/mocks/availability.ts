import { Professional, AvailabilityRule, Slot } from '@/types/domain';
import { generateSlotsForDay } from '@/utils/timezone';

export const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: '1',
    name: 'Dr. João Silva',
    specialty: 'Cardiologia',
  },
  {
    id: '2',
    name: 'Dra. Maria Oliveira',
    specialty: 'Dermatologia',
  },
];

export const MOCK_RULES: AvailabilityRule[] = [
  // Dr. João Silva - seg a sex
  ...[1, 2, 3, 4, 5].flatMap((day, i) => [
    { id: `r${i * 2 + 1}`, professionalId: '1', dayOfWeek: day, startTime: '08:00', endTime: '12:00' },
    { id: `r${i * 2 + 2}`, professionalId: '1', dayOfWeek: day, startTime: '14:00', endTime: '18:00' },
  ]),
  // Dra. Maria Oliveira - seg, qua, sex
  ...[1, 3, 5].flatMap((day, i) => [
    { id: `rm${i * 2 + 1}`, professionalId: '2', dayOfWeek: day, startTime: '09:00', endTime: '13:00' },
    { id: `rm${i * 2 + 2}`, professionalId: '2', dayOfWeek: day, startTime: '15:00', endTime: '17:00' },
  ]),
];

export const getMockSlots = (date: Date, professionalId: string, timezone: string): Slot[] => {
  // Simple mock: if it's Monday, return slots for Dr. João
  const dayOfWeek = date.getDay();
  const rules = MOCK_RULES.filter(r => r.professionalId === professionalId && r.dayOfWeek === dayOfWeek);
  
  const allSlots: Slot[] = [];
  
  rules.forEach(rule => {
    const slots = generateSlotsForDay(date, rule.startTime, rule.endTime, 30, timezone);
    slots.forEach((s, index) => {
      allSlots.push({
        id: `${rule.id}-${index}`,
        startTime: s.startTime,
        endTime: s.endTime,
        status: index % 5 === 0 ? 'occupied' : 'available', // Mock some occupied slots
        professionalId,
      });
    });
  });
  
  return allSlots;
};
