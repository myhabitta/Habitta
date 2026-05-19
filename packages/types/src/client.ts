import type { ClientPayment } from './payment';

export type ClientStatus = 'pendiente' | 'en_proceso' | 'completado';

export type ConstructionPhase = 0 | 1 | 2 | 3 | 4 | 5;

export const PHASE_LABELS: Record<ConstructionPhase, string> = {
  0: 'Sin iniciar',
  1: 'Plomería, Revoque, Mortero',
  2: 'Estuco, Cielo, Electricidad, Enchape',
  3: 'Fondeo, Carpintería',
  4: 'Pintura, Detalles finales y Limpieza',
  5: 'Terminado',
};

export const PHASE_SHORT_LABELS: Record<ConstructionPhase, string> = {
  0: 'Sin iniciar',
  1: 'Fase 1',
  2: 'Fase 2',
  3: 'Fase 3',
  4: 'Fase 4',
  5: 'Terminado',
};

export const PHASE_COLORS: Record<ConstructionPhase, { bg: string; text: string; solid: string }> = {
  0: { bg: '#fde8e8', text: '#b91c1c', solid: '#dc2626' },
  1: { bg: '#fff3e0', text: '#c2410c', solid: '#ea580c' },
  2: { bg: '#fef9c3', text: '#a16207', solid: '#ca8a04' },
  3: { bg: '#dcfce7', text: '#15803d', solid: '#22c55e' },
  4: { bg: '#e0f2fe', text: '#0369a1', solid: '#0ea5e9' },
  5: { bg: '#d1fae5', text: '#065f46', solid: '#10b981' },
};

export type Client = {
  id: string;
  short_id: string;
  lead_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  project_id: string;
  package_id: string;
  total_amount: number;
  status: ClientStatus;
  notes: string | null;
  apartment_number: string | null;
  tower: string | null;
  work_start_date: string | null;
  cedula: string | null;
  construction_phase: ConstructionPhase;
  portal_slug: string;
  notified_at: string | null;
  delivered_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ClientWithRelations = Client & {
  project: { id: string; name: string; city: string };
  package: { id: string; name: string; price: number; delivery_days: number };
  lead?: { id: string; short_id: string; notes?: { text: string; created_at: string; created_by: string } | string | null } | null;
  payments: ClientPayment[];
};

export type ClientStats = {
  total: number;
  totalRevenue: number;
  averageTicket: number;
  thisMonth: number;
};

export type UpdateClientInput = {
  first_name?: string;
  last_name?: string;
  notes?: string;
  status?: ClientStatus;
  phone?: string;
  total_amount?: number;
  project_id?: string;
  package_id?: string;
  apartment_number?: string;
  tower?: string;
  work_start_date?: string | null;
  cedula?: string | null;
  construction_phase?: ConstructionPhase;
  notified_at?: string;
  delivered_at?: string | null;
};
