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
  0: { bg: 'hsl(0 80% 95%)', text: 'hsl(0 70% 45%)', solid: 'hsl(0 70% 50%)' },
  1: { bg: 'hsl(25 90% 94%)', text: 'hsl(25 80% 45%)', solid: 'hsl(25 80% 50%)' },
  2: { bg: 'hsl(45 90% 93%)', text: 'hsl(45 80% 40%)', solid: 'hsl(45 80% 45%)' },
  3: { bg: 'hsl(150 40% 92%)', text: 'hsl(150 45% 35%)', solid: 'hsl(150 45% 40%)' },
  4: { bg: 'hsl(200 60% 93%)', text: 'hsl(200 60% 40%)', solid: 'hsl(200 60% 45%)' },
  5: { bg: 'hsl(130 50% 92%)', text: 'hsl(130 50% 32%)', solid: 'hsl(130 50% 38%)' },
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
};
