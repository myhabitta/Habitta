import type { ClientPayment } from './payment';

export type ClientStatus = 'pendiente' | 'en_proceso' | 'completado';

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
  notes?: string;
  status?: ClientStatus;
  phone?: string;
  total_amount?: number;
  project_id?: string;
  package_id?: string;
  apartment_number?: string;
  tower?: string;
  work_start_date?: string | null;
};
