import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';
import { addMinutes, isBefore, parse } from 'date-fns';

/**
 * Converte uma data UTC para um timezone específico.
 * Útil para exibir o horário na tela do usuário.
 */
export const convertToTimezone = (date: Date, timezone: string): Date => {
  return toZonedTime(date, timezone);
};

/**
 * Converte um horário de um timezone específico de volta para UTC.
 * Usado antes de enviar dados para o banco (Canonical Reference).
 */
export const convertToUTC = (date: Date, timezone: string): Date => {
  return fromZonedTime(date, timezone);
};

/**
 * Formata uma data respeitando o fuso horário escolhido.
 */
export const formatZoned = (date: Date, timezone: string, formatStr: string): string => {
  return formatInTimeZone(date, timezone, formatStr);
};

/**
 * Gera os slots (fatias) de tempo para um dia específico.
 * 
 * @param date A data do dia desejado
 * @param startTimeStr Hora de início (ex: "08:00")
 * @param endTimeStr Hora de término (ex: "18:00")
 * @param intervalMinutes Duração de cada slot (ex: 30)
 * @param timezone O timezone em que essas horas devem ser interpretadas
 * 
 * @returns Array de objetos com startTime e endTime em UTC (Canonical)
 */
export const generateSlotsForDay = (
  date: Date,
  startTimeStr: string,
  endTimeStr: string,
  intervalMinutes: number,
  timezone: string
): { startTime: Date; endTime: Date }[] => {
  // 1. Interpreta a data no fuso desejado
  const zonedDate = toZonedTime(date, timezone);
  
  // 2. Cria objetos de data para o início e fim baseados na string HH:mm
  const start = parse(startTimeStr, 'HH:mm', zonedDate);
  const end = parse(endTimeStr, 'HH:mm', zonedDate);

  const slots: { startTime: Date; endTime: Date }[] = [];
  let current = start;

  // 3. Itera gerando os intervalos
  while (isBefore(current, end)) {
    const next = addMinutes(current, intervalMinutes);
    if (isBefore(end, next)) break;

    // IMPORTANTE: Converte cada slot gerado para UTC antes de retornar.
    // Isso garante que a UI e o Banco falem a mesma língua (Canonical UTC).
    slots.push({
      startTime: fromZonedTime(current, timezone),
      endTime: fromZonedTime(next, timezone),
    });
    current = next;
  }

  return slots;
};
