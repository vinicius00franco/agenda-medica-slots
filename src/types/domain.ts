export type TimezonePreference = string;

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
}

export interface AvailabilityRule {
  id: string;
  professionalId: string;
  dayOfWeek: number; // 0 (Sunday) to 6 (Saturday)
  startTime: string; // "HH:mm" in UTC
  endTime: string;   // "HH:mm" in UTC
}

export type SlotStatus = 'available' | 'occupied' | 'blocked' | 'out-of-window';

export interface Slot {
  id: string;
  startTime: Date; // Canonical reference (UTC)
  endTime: Date;   // Canonical reference (UTC)
  status: SlotStatus;
  professionalId: string;
}

export interface Booking {
  id: string;
  slotId: string;
  professionalId: string;
  patientName: string;
  patientEmail: string;
  startTime: Date;
  endTime: Date;
  timezone: TimezonePreference;
}
