'use client';

import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from '@/components/ui/Button';
import { useMonthAvailability } from '../../hooks/useMonthAvailability';

interface WeekViewProps {
  currentDate: Date;
  professionalUuid: string;
  onDateSelect: (date: Date) => void;
}


export default function WeekView({ currentDate, professionalUuid, onDateSelect }: WeekViewProps) {
  const { data: availability } = useMonthAvailability(currentDate, professionalUuid);
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const isSelected = isSameDay(day, currentDate);
          const isToday = isSameDay(day, new Date());
          const isOccupied = availability?.occupiedDays.has(dayKey);
          
          return (
            <Button
              key={day.toString()}
              variant={isSelected ? 'primary' : 'outline'}
              onClick={() => onDateSelect(day)}
              className={`
                flex flex-col items-center justify-center h-auto p-4 rounded-xl transition-all min-h-[100px]
                ${isSelected ? 'scale-105 z-10' : 'bg-card'}
              `}
            >
              <span className={`text-xs ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {format(day, 'EEE', { locale: ptBR })}
              </span>
              <span className="text-lg font-bold">
                {format(day, 'd')}
              </span>
              
              {isOccupied ? (
                <span className={`mt-2 text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-primary-foreground text-primary' : 'bg-amber-100 text-amber-700'}`}>
                  Ocupado
                </span>
              ) : day.getDay() !== 0 && day.getDay() !== 6 ? (
                <span className={`mt-2 text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-primary-foreground text-primary' : 'bg-green-100 text-green-700'}`}>
                  Disponível
                </span>
              ) : null}

              {isToday && !isSelected && (
                <div className="w-1 h-1 bg-primary rounded-full mt-1" />
              )}
            </Button>
          );
        })}
      </div>
      
      <div className="p-8 text-center border border-dashed rounded-xl bg-muted/10">
        <p className="text-sm text-muted-foreground">
          Selecione um dia acima para ver os horários disponíveis.
        </p>
      </div>
    </div>
  );
}
