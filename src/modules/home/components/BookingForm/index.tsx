'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Slot, Professional } from '@/types/domain';
import { format } from 'date-fns';
import { convertToTimezone } from '@/utils/timezone';
import { useState } from 'react';

interface BookingFormProps {
  slot: Slot;
  professional: Professional;
  timezone: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  patientName: string;
  patientEmail: string;
}

/**
 * Componente de Formulário de Reserva.
 * Responsável por coletar os dados do paciente e persistir o agendamento no banco.
 * Realiza a conversão final do horário para UTC antes do envio.
 */
export default function BookingForm({ slot, professional, timezone, onSuccess, onCancel }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicialização do React Hook Form para validação simples e eficiente
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  /**
   * Processa a submissão do formulário.
   * Cria o objeto de agendamento seguindo o padrão UUID para chaves externas.
   */
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Objeto de agendamento normalizado para o banco
      const bookingData = {
        uuid: crypto.randomUUID(),           // Chave pública única
        professionalId: professional.id,      // Relacionamento interno (Integer)
        professionalUuid: professional.uuid,  // Relacionamento externo (UUID)
        patientName: data.patientName,
        patientEmail: data.patientEmail,
        date: format(slot.startTime, 'yyyy-MM-dd'),
        startTime: slot.startTime.toISOString(), // Salvo sempre em UTC ISO String
        endTime: slot.endTime.toISOString(),
        timezone: timezone,
        slotUuid: slot.uuid,
      };

      const res = await fetch('http://localhost:3005/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) throw new Error('Erro ao salvar agendamento no servidor.');

      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao confirmar reserva.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Converte o horário UTC do slot para o fuso escolhido apenas para exibição no resumo
  const zonedStart = convertToTimezone(slot.startTime, timezone);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Resumo visual do que está sendo agendado */}
      <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 text-xs space-y-1">
        <p><strong>Resumo da Reserva:</strong></p>
        <p>{professional.name}</p>
        <p>{format(zonedStart, 'dd/MM/yyyy')} às {format(zonedStart, 'HH:mm')}</p>
      </div>

      {/* Campos de Input com validação em tempo real */}
      <div className="space-y-2">
        <label className="text-xs font-medium">Nome Completo</label>
        <input
          {...register('patientName', { required: 'Nome é obrigatório' })}
          className="w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-primary outline-none"
          placeholder="Ex: João Silva"
        />
        {errors.patientName && <span className="text-[10px] text-red-500">{errors.patientName.message}</span>}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium">E-mail</label>
        <input
          {...register('patientEmail', { 
            required: 'E-mail é obrigatório',
            pattern: { value: /^\S+@\S+$/i, message: 'E-mail inválido' }
          })}
          className="w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-primary outline-none"
          placeholder="exemplo@email.com"
        />
        {errors.patientEmail && <span className="text-[10px] text-red-500">{errors.patientEmail.message}</span>}
      </div>

      {error && (
        <div className="p-2 bg-red-50 border border-red-100 rounded text-[10px] text-red-600">
          {error}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel} disabled={isSubmitting}>
          Voltar
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Processando...' : 'Finalizar'}
        </Button>
      </div>
    </form>
  );
}
