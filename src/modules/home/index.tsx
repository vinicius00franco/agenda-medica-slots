'use client';

import { useState } from 'react';
import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, startOfToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import WeekView from './components/WeekView';
import MonthView from './components/MonthView';
import BookingForm from './components/BookingForm';
import { useAvailability } from './hooks/useAvailability';
import { useProfessionals } from './hooks/useProfessionals';
import { convertToTimezone } from '@/utils/timezone';
import { TimezonePreference, Slot, Professional } from '@/types/domain';

const TIMEZONES: TimezonePreference[] = [
  'UTC',
  'America/Sao_Paulo',
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo',
];

type ViewMode = 'day' | 'week' | 'month';

export default function HomeModule() {
  // --- ESTADOS DE CONTROLE ---
  const [currentDate, setCurrentDate] = useState(startOfToday()); // Data de referência da agenda
  const [viewMode, setViewMode] = useState<ViewMode>('day');      // Modo de visualização (Dia/Semana/Mês)
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState<TimezonePreference>('America/Sao_Paulo');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null); // Slot clicado pelo usuário
  const [isConfirming, setIsConfirming] = useState(false);            // Controle do fluxo de formulário
  const [bookingSuccess, setBookingSuccess] = useState(false);        // Feedback de sucesso

  // --- BUSCA DE DADOS ---
  const { data: professionals, isLoading: isLoadingPros } = useProfessionals();
  
  // Seleção automática do primeiro profissional disponível no carregamento inicial
  if (!selectedProfessional && professionals && professionals.length > 0) {
    setSelectedProfessional(professionals[0]);
  }

  // Hook central de disponibilidade (Grade de Horários)
  const { data: slots, isLoading, isError } = useAvailability(
    currentDate, 
    selectedProfessional?.uuid || '', 
    selectedTimezone
  );

  /**
   * Gerencia a navegação temporal baseada na visão atual.
   * Se estiver no mês, pula de mês em mês. Se no dia, dia a dia.
   */
  const navigateDate = (direction: 'prev' | 'next' | 'today') => {
    resetSelection();
    if (direction === 'today') {
      setCurrentDate(startOfToday());
      return;
    }

    switch (viewMode) {
      case 'day':
        setCurrentDate(d => direction === 'next' ? addDays(d, 1) : subDays(d, 1));
        break;
      case 'week':
        setCurrentDate(d => direction === 'next' ? addWeeks(d, 1) : subWeeks(d, 1));
        break;
      case 'month':
        setCurrentDate(d => direction === 'next' ? addMonths(d, 1) : subMonths(d, 1));
        break;
    }
  };

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
    setViewMode('day');
    resetSelection();
  };

  const resetSelection = () => {
    setSelectedSlot(null);
    setIsConfirming(false);
    setBookingSuccess(false);
  };

  return (
    <main className="container mx-auto p-4 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Agenda Médica</h1>
          <p className="text-sm text-muted-foreground">Escolha o melhor horário para seu atendimento.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select 
            value={selectedProfessional?.uuid || ''}
            onChange={(e) => {
              const p = professionals?.find(p => p.uuid === e.target.value);
              if (p) setSelectedProfessional(p);
              resetSelection();
            }}
            disabled={isLoadingPros}
          >
            {isLoadingPros ? (
              <option>Carregando...</option>
            ) : (
              professionals?.map(p => <option key={p.uuid} value={p.uuid}>{p.name}</option>)
            )}
          </Select>

          <Select 
            value={selectedTimezone}
            onChange={(e) => {
              setSelectedTimezone(e.target.value);
              resetSelection();
            }}
          >
            {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
          </Select>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateDate('prev')} aria-label="Dia Anterior">←</Button>
          <Button variant="outline" onClick={() => navigateDate('today')} aria-label="Ir para Hoje">Hoje</Button>
          <Button variant="outline" size="icon" onClick={() => navigateDate('next')} aria-label="Próximo Dia">→</Button>
          <h2 className="ml-4 text-lg font-semibold capitalize">{format(currentDate, viewMode === 'month' ? 'MMMM yyyy' : 'PPPP', { locale: ptBR })}</h2>
        </div>

        <div className="flex bg-muted p-1 rounded-lg border">
          {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
            <button key={mode} onClick={() => setViewMode(mode)} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === mode ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {mode === 'day' ? 'Dia' : mode === 'week' ? 'Semana' : 'Mês'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="lg:col-span-3">
          {viewMode === 'day' && (
            <div className="space-y-4">
               <h3 className="text-lg font-semibold">Horários Disponíveis</h3>
               {isLoading ? (
                 <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                   {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />)}
                 </div>
               ) : isError ? (
                 <div className="py-12 text-center border border-red-200 rounded-xl bg-red-50 text-red-800">
                   <p>Erro ao carregar disponibilidade.</p>
                   <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>Tentar novamente</Button>
                 </div>
               ) : slots && slots.length > 0 ? (
                 <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                   {slots.map(slot => {
                     const zonedStart = convertToTimezone(slot.startTime, selectedTimezone);
                     const isOccupied = slot.status === 'occupied';
                     const isSelected = selectedSlot?.uuid === slot.uuid;
                     const isDisabled = isOccupied || slot.status === 'blocked' || slot.status === 'out-of-window' || bookingSuccess;

                     return (
                       <Button
                         key={slot.uuid}
                         variant={isSelected ? 'primary' : 'outline'}
                         disabled={isDisabled}
                         onClick={() => {
                           setSelectedSlot(slot);
                           setIsConfirming(false);
                         }}
                         className={`h-auto py-3 ${isOccupied ? 'opacity-30 line-through' : ''} ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                       >
                         {format(zonedStart, 'HH:mm')}
                       </Button>
                     );
                   })}
                 </div>
               ) : (
                 <div className="py-12 text-center border border-dashed rounded-xl bg-muted/20 text-muted-foreground">Nenhuma disponibilidade encontrada.</div>
               )}
            </div>
          )}
          {viewMode === 'week' && (
            <WeekView 
              currentDate={currentDate} 
              professionalUuid={selectedProfessional?.uuid || ''} 
              onDateSelect={handleDateSelect} 
            />
          )}
          {viewMode === 'month' && (
            <MonthView 
              currentDate={currentDate} 
              professionalUuid={selectedProfessional?.uuid || ''} 
              onDateSelect={handleDateSelect} 
            />
          )}
        </section>

        <aside className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader><CardTitle className="text-base">{bookingSuccess ? 'Reserva Realizada!' : 'Resumo do Agendamento'}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {bookingSuccess ? (
                <div className="text-center space-y-4 py-4">
                   <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-xl">✓</div>
                   <p className="text-sm text-muted-foreground font-medium">Sua reserva foi confirmada com sucesso. Você receberá os detalhes por e-mail.</p>
                   <Button variant="outline" className="w-full" onClick={resetSelection}>Nova Reserva</Button>
                </div>
              ) : isConfirming && selectedSlot ? (
                <BookingForm 
                  slot={selectedSlot} 
                  professional={selectedProfessional} 
                  timezone={selectedTimezone}
                  onSuccess={() => setBookingSuccess(true)}
                  onCancel={() => setIsConfirming(false)}
                />
              ) : (
                <>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Profissional:</span><br/><strong>{selectedProfessional?.name || 'Selecione um profissional'}</strong></p>
                    <p><span className="text-muted-foreground">Data:</span><br/><strong>{format(currentDate, 'dd/MM/yyyy')}</strong></p>
                    {selectedSlot ? (
                      <p><span className="text-muted-foreground">Horário:</span><br/><strong>{format(convertToTimezone(selectedSlot.startTime, selectedTimezone), 'HH:mm')} ({selectedTimezone})</strong></p>
                    ) : (
                      <p className="text-orange-600 italic">Selecione um horário na grade.</p>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    disabled={!selectedSlot} 
                    onClick={() => setIsConfirming(true)}
                  >
                    Confirmar Seleção
                  </Button>
                  <p className="text-[10px] text-muted-foreground text-center">Ao confirmar, você concorda com nossos termos.</p>
                </>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
