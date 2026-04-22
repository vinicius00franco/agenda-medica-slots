'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { getMockSlots, MOCK_PROFESSIONALS } from '@/mocks/availability';
import { convertToTimezone } from '@/utils/timezone';
import { TimezonePreference } from '@/types/domain';

const TIMEZONES: TimezonePreference[] = [
  'UTC',
  'America/Sao_Paulo',
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo',
];

export default function HomeModule() {
  const [selectedTimezone, setSelectedTimezone] = useState<TimezonePreference>('America/Sao_Paulo');
  const [selectedProfessional, setSelectedProfessional] = useState(MOCK_PROFESSIONALS[0]);
  
  // Fixed date for demo: Next Monday
  const demoDate = useMemo(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = day <= 1 ? 1 - day : 8 - day;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + diff);
    return nextMonday;
  }, []);

  const slots = useMemo(() => {
    return getMockSlots(demoDate, selectedProfessional.id, selectedTimezone);
  }, [demoDate, selectedProfessional, selectedTimezone]);

  return (
    <main className="container mx-auto p-4 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Agenda Médica - Iteração 0</h1>
        <p className="text-muted-foreground">
          Demonstração de normalização de slots e troca de timezone.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-4 p-6 border rounded-xl bg-card text-card-foreground shadow-sm">
          <h2 className="text-xl font-semibold">Configurações</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Profissional</label>
            <select 
              className="w-full p-2 border rounded-md bg-background"
              value={selectedProfessional.id}
              onChange={(e) => {
                const p = MOCK_PROFESSIONALS.find(p => p.id === e.target.value);
                if (p) setSelectedProfessional(p);
              }}
            >
              {MOCK_PROFESSIONALS.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.specialty})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Timezone da Tela</label>
            <select 
              className="w-full p-2 border rounded-md bg-background"
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 p-4 bg-muted rounded-lg space-y-1">
            <p className="text-xs uppercase text-muted-foreground font-bold">Resumo da Visualização</p>
            <p className="text-sm">Data de referência: <span className="font-mono">{format(demoDate, 'dd/MM/yyyy')}</span></p>
            <p className="text-sm">Timezone: <span className="font-semibold">{selectedTimezone}</span></p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Slots Disponíveis ({format(demoDate, 'EEEE')})</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {slots.length > 0 ? (
              slots.map((slot) => {
                const zonedStart = convertToTimezone(slot.startTime, selectedTimezone);
                const isOccupied = slot.status === 'occupied';

                return (
                  <button
                    key={slot.id}
                    disabled={isOccupied}
                    className={`
                      p-3 text-center border rounded-lg transition-all
                      ${isOccupied 
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through' 
                        : 'hover:border-primary hover:bg-primary/5 active:scale-95 border-gray-300'}
                    `}
                  >
                    <span className="text-sm font-bold">
                      {format(zonedStart, 'HH:mm')}
                    </span>
                  </button>
                );
              })
            ) : (
              <p className="col-span-full text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                Nenhuma disponibilidade para este dia.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
