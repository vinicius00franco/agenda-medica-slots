import { Professional, AvailabilityRule, Slot } from '@/types/domain';
import { generateSlotsForDay } from '@/utils/timezone';

/**
 * MOCK LEGADO: Estes dados eram usados antes da implementação do json-server.
 * Atualizados para cumprir o novo contrato de tipos (ID numérico e UUID).
 */

export const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: 1,
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Dr. João Silva',
    specialty: 'Cardiologia',
  },
  {
    id: 2,
    uuid: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    name: 'Dra. Maria Oliveira',
    specialty: 'Dermatologia',
  },
];

export const MOCK_RULES: AvailabilityRule[] = [
  // Dr. João Silva - seg a sex
  ...[1, 2, 3, 4, 5].flatMap((day, i) => [
    { 
      id: i * 2 + 1, 
      uuid: `r${i * 2 + 1}`, 
      professionalId: 1, 
      professionalUuid: '550e8400-e29b-41d4-a716-446655440000',
      dayOfWeek: day, 
      startTime: '08:00', 
      endTime: '12:00',
      slotDurationMinutes: 30
    },
    { 
      id: i * 2 + 2, 
      uuid: `r${i * 2 + 2}`, 
      professionalId: 1, 
      professionalUuid: '550e8400-e29b-41d4-a716-446655440000',
      dayOfWeek: day, 
      startTime: '14:00', 
      endTime: '18:00',
      slotDurationMinutes: 30
    },
  ]),
];

export const getMockSlots = (date: Date, professionalUuid: string, timezone: string): Slot[] => {
  const dayOfWeek = date.getDay();
  const rules = MOCK_RULES.filter(r => r.professionalUuid === professionalUuid && r.dayOfWeek === dayOfWeek);
  
  const allSlots: Slot[] = [];
  
  rules.forEach(rule => {
    const slots = generateSlotsForDay(date, rule.startTime, rule.endTime, rule.slotDurationMinutes, timezone);
    slots.forEach((s, index) => {
      allSlots.push({
        uuid: `${rule.uuid}-${index}`,
        startTime: s.startTime,
        endTime: s.endTime,
        status: index % 5 === 0 ? 'occupied' : 'available',
        professionalUuid,
      });
    });
  });
  
  return allSlots;
};
