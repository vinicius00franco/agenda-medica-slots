export type TimezonePreference = string;

export interface Professional {
  id: number;
  uuid: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
}

export interface AvailabilityRule {
  id: number;
  uuid: string;
  professionalId: number;
  professionalUuid: string;
  dayOfWeek: number; // 0 (Sunday) to 6 (Saturday)
  startTime: string; // "HH:mm" in UTC
  endTime: string;   // "HH:mm" in UTC
  slotDurationMinutes: number;
}

export type SlotStatus = 'available' | 'occupied' | 'blocked' | 'out-of-window';

export interface Slot {
  uuid: string;
  startTime: Date; // Canonical reference (UTC)
  endTime: Date;   // Canonical reference (UTC)
  status: SlotStatus;
  professionalUuid: string;
}

export interface Booking {
  id: number;
  uuid: string;
  slotUuid: string;
  professionalId: number;
  professionalUuid: string;
  patientName: string;
  patientEmail: string;
  date: string; // ISO date "YYYY-MM-DD" for easier filtering
  startTime: Date;
  endTime: Date;
  timezone: TimezonePreference;
}

export interface BookingCreateRequest {
  uuid: string;
  professionalId: number;
  professionalUuid: string;
  patientName: string;
  patientEmail: string;
  date: string;
  startTime: string; // ISO String (UTC)
  endTime: string;   // ISO String (UTC)
  timezone: string;
  slotUuid: string;
}
