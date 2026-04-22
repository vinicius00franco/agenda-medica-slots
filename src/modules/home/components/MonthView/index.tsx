'use client';

import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  isToday
} from 'date-fns';
import { useMonthAvailability } from '../../hooks/useMonthAvailability';

interface MonthViewProps {
  currentDate: Date;
  professionalUuid: string;
  onDateSelect: (date: Date) => void;
}

/**
 * Componente de Visualização Mensal.
 * Renderiza um calendário completo do mês selecionado.
 * Indica visualmente quais dias possuem agendamentos no banco.
 */
export default function MonthView({ currentDate, professionalUuid, onDateSelect }: MonthViewProps) {
  // Hook para buscar a ocupação agregada do mês para o profissional
  const { data: availability } = useMonthAvailability(currentDate, professionalUuid);
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Domingo como início
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  // Gera a lista de todos os dias que aparecerão na grade (incluindo bordas do mês anterior/próximo)
  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-px bg-muted border rounded-xl overflow-hidden">
        {/* Cabeçalho dos dias da semana */}
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div key={day} className="bg-background text-center text-xs font-semibold text-muted-foreground py-3">
            {day}
          </div>
        ))}

        {/* Células do calendário */}
        {calendarDays.map((day) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isSelected = isSameDay(day, currentDate);
          const isDayToday = isToday(day);
          const isOccupied = availability?.occupiedDays.has(dayKey);

          return (
            <button
              key={day.toString()}
              onClick={() => onDateSelect(day)}
              className={`
                relative h-24 sm:h-32 bg-background p-2 text-left transition-colors hover:bg-muted/50 border-r border-b border-input
                ${!isCurrentMonth ? 'text-muted-foreground/30' : ''}
                ${isSelected ? 'bg-primary/5 ring-2 ring-inset ring-primary z-10' : ''}
              `}
            >
              <time 
                dateTime={dayKey}
                className={`
                  inline-flex items-center justify-center w-7 h-7 text-sm font-medium rounded-full
                  ${isDayToday ? 'bg-primary text-primary-foreground' : ''}
                  ${isSelected && !isDayToday ? 'text-primary font-bold' : ''}
                `}
              >
                {format(day, 'd')}
              </time>
              
              {/* Indicadores de status do dia */}
              {isCurrentMonth && (
                <div className="mt-2 space-y-1">
                  {isOccupied ? (
                    <div className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-sm truncate">
                      Possui Agendamento
                    </div>
                  ) : day.getDay() !== 0 && day.getDay() !== 6 ? (
                    <div className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-sm truncate">
                      Disponível
                    </div>
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
