import { useQuery } from '@tanstack/react-query';
import { Slot, AvailabilityRule, Booking } from '@/types/domain';
import { generateSlotsForDay } from '@/utils/timezone';
import { format, parseISO, areIntervalsOverlapping } from 'date-fns';

const API_URL = 'http://localhost:3005';

/**
 * Hook responsável por orquestrar a disponibilidade de um profissional.
 * Ele cruza as "Regras de Horário" com os "Agendamentos Existentes" para 
 * calcular em tempo real quais slots estão livres ou ocupados.
 */
export function useAvailability(date: Date, professionalUuid: string, timezone: string) {
  return useQuery<Slot[]>({
    // A chave de cache inclui a data, o profissional e o timezone para garantir revalidação correta
    queryKey: ['availability', format(date, 'yyyy-MM-dd'), professionalUuid, timezone],
    enabled: !!professionalUuid,
    queryFn: async () => {
      const dayOfWeek = date.getDay();
      const dateStr = format(date, 'yyyy-MM-dd');

      // Busca paralela para otimizar a performance (Regras + Bookings)
      const [rulesRes, bookingsRes] = await Promise.all([
        fetch(`${API_URL}/availabilityRules?professionalUuid=${professionalUuid}&dayOfWeek=${dayOfWeek}`),
        fetch(`${API_URL}/bookings?professionalUuid=${professionalUuid}&date=${dateStr}`)
      ]);

      const rules: AvailabilityRule[] = await rulesRes.json();
      const bookings: Booking[] = await bookingsRes.json();

      const allSlots: Slot[] = [];

      rules.forEach(rule => {
        // Gera a grade de horários teórica baseada na regra (ex: 08:00 às 12:00 de 30 em 30min)
        const slots = generateSlotsForDay(
          date,
          rule.startTime,
          rule.endTime,
          rule.slotDurationMinutes,
          timezone
        );

        slots.forEach((s, index) => {
          const slotUuid = `${rule.uuid}-${index}`;

          // Verifica se este slot gerado colide com algum agendamento real do banco
          const isOccupied = bookings.some(booking => {
            return areIntervalsOverlapping(
              { start: s.startTime, end: s.endTime },
              { 
                start: parseISO(booking.startTime as unknown as string), 
                end: parseISO(booking.endTime as unknown as string) 
              },
              { inclusive: false }
            );
          });

          allSlots.push({
            uuid: slotUuid,
            startTime: s.startTime,
            endTime: s.endTime,
            status: isOccupied ? 'occupied' : 'available',
            professionalUuid,
          });
        });
      });

      return allSlots;
    },
  });
}
