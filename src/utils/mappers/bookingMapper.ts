import { Slot, Professional, BookingCreateRequest } from '@/types/domain';
import { format } from 'date-fns';

interface CreateBookingParams {
  slot: Slot;
  professional: Professional;
  patientName: string;
  patientEmail: string;
  timezone: string;
}

/**
 * Mapper para centralizar a lógica de transformação dos dados do formulário
 * para o formato esperado pelo payload da API de agendamentos.
 * Garante escalabilidade caso as regras de normalização mudem.
 */
export const mapToBookingRequest = ({
  slot,
  professional,
  patientName,
  patientEmail,
  timezone,
}: CreateBookingParams): BookingCreateRequest => {
  return {
    uuid: crypto.randomUUID(),           // Chave pública única gerada no cliente/front
    professionalId: professional.id,      // Relacionamento interno (Integer) para o DB
    professionalUuid: professional.uuid,  // Relacionamento externo (UUID) para a API
    patientName,
    patientEmail,
    date: format(slot.startTime, 'yyyy-MM-dd'),
    startTime: slot.startTime.toISOString(), // Salvo sempre em UTC ISO String
    endTime: slot.endTime.toISOString(),
    timezone: timezone,
    slotUuid: slot.uuid,
  };
};
