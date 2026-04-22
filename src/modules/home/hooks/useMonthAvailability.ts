import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { Booking } from '@/types/domain';

const API_URL = 'http://localhost:3005';

export function useMonthAvailability(currentDate: Date, professionalUuid: string) {
  return useQuery({
    queryKey: ['month-availability', format(currentDate, 'yyyy-MM'), professionalUuid],
    enabled: !!professionalUuid,
    queryFn: async () => {
      // json-server permite filtrar por data usando operadores como _gte e _lte se os dados forem strings ISO
      // Mas para simplificar e garantir precisão com o nosso db.json, vamos buscar bookings do profissional
      // e filtrar no frontend para este MVP.
      const res = await fetch(`${API_URL}/bookings?professionalUuid=${professionalUuid}`);
      const bookings: Booking[] = await res.json();
      
      // Mapear dias que possuem agendamentos

      const occupiedDays = new Set(
        bookings.map(b => format(new Date(b.date), 'yyyy-MM-dd'))
      );
      
      return { occupiedDays };
    },
  });
}
